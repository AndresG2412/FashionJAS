import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Productos } from '@/lib/firebase/products';

import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
  clearCart as clearCartAction,
  getCart as getCartAction,
} from '@/app/actions/cartActions';

import {
  addFavorite as addFavoriteAction,
  removeFavorite as removeFavoriteAction,
  getFavorites as getFavoritesAction,
} from '@/app/actions/favoriteActions';

// ── CartItem ahora incluye talla y color seleccionados ───────────────────────
interface CartItem extends Productos {
  quantity: number;
  tallaSeleccionada?: string | null;
  colorSeleccionado?: string | null;
}

interface StoreState {
  // User
  currentUserId: string | null;
  setUserId: (userId: string | null) => void;

  // Cart
  cartItems: CartItem[];
  cartLoaded: boolean;
  loadCart: (userId: string) => Promise<void>;
  addToCart: (
    product: Productos,
    tallaSeleccionada?: string | null,
    colorSeleccionado?: string | null
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: (productId: string) => number;

  // Favorites
  favoriteItems: Productos[];
  favoritesLoaded: boolean;
  loadFavorites: (userId: string) => Promise<void>;
  addToFavorite: (product: Productos) => Promise<void>;
  removeFromFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ─── User ──────────────────────────────────────────────────────────────
      currentUserId: null,
      setUserId: (userId) => set({ currentUserId: userId }),

      // ─── Cart ───────────────────────────────────────────────────────────────
      cartItems: [],
      cartLoaded: false,

      loadCart: async (_userId: string) => {
        try {
          const cartData = await getCartAction();
          const cartItems = cartData.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            tallaSeleccionada: item.tallaSeleccionada ?? null,
            colorSeleccionado: item.colorSeleccionado ?? null,
          }));
          set({ cartItems, cartLoaded: true });
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      },

      // addToCart ahora acepta talla y color opcionales
      addToCart: async (
        product: Productos,
        tallaSeleccionada?: string | null,
        colorSeleccionado?: string | null
      ) => {
        const items = get().cartItems;
        const existing = items.find((item) => item.id === product.id);

        if (existing) {
          // Si el mismo producto ya existe, solo incrementa cantidad
          // (talla y color no cambian para el item existente)
          set({
            cartItems: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [
              ...items,
              {
                ...product,
                quantity: 1,
                tallaSeleccionada: tallaSeleccionada ?? null,
                colorSeleccionado: colorSeleccionado ?? null,
              },
            ],
          });
        }

        try {
          await addToCartAction(product.id, 1, tallaSeleccionada, colorSeleccionado);
        } catch (error) {
          console.error('Error syncing addToCart:', error);
          set({ cartItems: items });
        }
      },

      removeFromCart: async (productId: string) => {
        const items = get().cartItems;
        set({ cartItems: items.filter((item) => item.id !== productId) });

        try {
          await removeFromCartAction(productId);
        } catch (error) {
          console.error('Error syncing removeFromCart:', error);
          set({ cartItems: items });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeFromCart(productId);
          return;
        }

        const items = get().cartItems;
        set({
          cartItems: items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });

        try {
          await updateCartItemAction(productId, quantity);
        } catch (error) {
          console.error('Error syncing updateQuantity:', error);
          set({ cartItems: items });
        }
      },

      clearCart: async () => {
        const items = get().cartItems;
        set({ cartItems: [], cartLoaded: false });

        try {
          await clearCartAction();
        } catch (error) {
          console.error('Error syncing clearCart:', error);
          set({ cartItems: items });
        }
      },

      getCartTotal: () =>
        get().cartItems.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        ),

      getItemCount: (productId) =>
        get().cartItems.find((item) => item.id === productId)?.quantity || 0,

      // ─── Favorites ─────────────────────────────────────────────────────────
      favoriteItems: [],
      favoritesLoaded: false,

      loadFavorites: async (_userId: string) => {
        try {
          const favorites = await getFavoritesAction();
          set({ favoriteItems: favorites, favoritesLoaded: true });
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      },

      addToFavorite: async (product: Productos) => {
        const items = get().favoriteItems;
        const exists = items.some((item) => item.id === product.id);

        set({
          favoriteItems: exists
            ? items.filter((item) => item.id !== product.id)
            : [...items, product],
        });

        try {
          if (exists) {
            await removeFavoriteAction(product.id);
          } else {
            await addFavoriteAction(product.id);
          }
        } catch (error) {
          console.error('Error syncing favorite:', error);
          set({ favoriteItems: items });
        }
      },

      removeFromFavorite: async (productId: string) => {
        const items = get().favoriteItems;
        set({ favoriteItems: items.filter((item) => item.id !== productId) });

        try {
          await removeFavoriteAction(productId);
        } catch (error) {
          console.error('Error syncing removeFromFavorite:', error);
          set({ favoriteItems: items });
        }
      },

      isFavorite: (productId) =>
        get().favoriteItems.some((item) => item.id === productId),

      clearFavorites: () =>
        set({ favoriteItems: [], favoritesLoaded: false }),
    }),
    {
      name: 'gaboshop-storage',
      partialize: (state) => ({
        cartItems: state.currentUserId ? [] : state.cartItems,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

export default useStore;