import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Productos } from '@/lib/firebase/products';

// ✅ Server Actions — reemplazan las funciones de userCart.ts y userFavorites.ts
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
} from '@/app/actions/favoriteActions'

interface CartItem extends Productos {
  quantity: number;
}

interface StoreState {
  // User
  currentUserId: string | null;
  setUserId: (userId: string | null) => void;

  // Cart
  cartItems: CartItem[];
  cartLoaded: boolean;
  loadCart: (userId: string) => Promise<void>;
  addToCart: (product: Productos) => Promise<void>;
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
      // ─── User ───────────────────────────────────────────────────────────────
      currentUserId: null,
      setUserId: (userId) => set({ currentUserId: userId }),

      // ─── Cart ────────────────────────────────────────────────────────────────
      cartItems: [],
      cartLoaded: false,

      // Carga el carrito desde Firebase vía Server Action
      loadCart: async (_userId: string) => {
        // _userId ya no se usa — el Server Action obtiene el userId desde Clerk
        try {
          const cartData = await getCartAction();
          const cartItems = cartData.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }));
          set({ cartItems, cartLoaded: true });
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      },

      // Agrega al carrito — optimista en local + sincroniza con Firebase
      addToCart: async (product: Productos) => {
        const items = get().cartItems;
        const existing = items.find((item) => item.id === product.id);

        // Actualización optimista en el estado local
        if (existing) {
          set({
            cartItems: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cartItems: [...items, { ...product, quantity: 1 }] });
        }

        // Sincroniza con Firebase (el Server Action verifica auth internamente)
        try {
          await addToCartAction(product.id, 1);
        } catch (error) {
          console.error('Error syncing addToCart:', error);
          // Revertir si falla
          set({ cartItems: items });
        }
      },

      // Elimina del carrito
      removeFromCart: async (productId: string) => {
        const items = get().cartItems;
        set({ cartItems: items.filter((item) => item.id !== productId) });

        try {
          await removeFromCartAction(productId);
        } catch (error) {
          console.error('Error syncing removeFromCart:', error);
          set({ cartItems: items }); // Revertir
        }
      },

      // Actualiza cantidad
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
          set({ cartItems: items }); // Revertir
        }
      },

      // Vacía el carrito
      clearCart: async () => {
        const items = get().cartItems;
        set({ cartItems: [], cartLoaded: false });

        try {
          await clearCartAction();
        } catch (error) {
          console.error('Error syncing clearCart:', error);
          set({ cartItems: items }); // Revertir
        }
      },

      getCartTotal: () =>
        get().cartItems.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        ),

      getItemCount: (productId) =>
        get().cartItems.find((item) => item.id === productId)?.quantity || 0,

      // ─── Favorites ───────────────────────────────────────────────────────────
      favoriteItems: [],
      favoritesLoaded: false,

      // Carga favoritos desde Firebase vía Server Action
      loadFavorites: async (_userId: string) => {
        // _userId ya no se usa — el Server Action obtiene el userId desde Clerk
        try {
          const favorites = await getFavoritesAction();
          set({ favoriteItems: favorites, favoritesLoaded: true });
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      },

      // Toggle favorito (agrega si no existe, elimina si existe)
      addToFavorite: async (product: Productos) => {
        const items = get().favoriteItems;
        const exists = items.some((item) => item.id === product.id);

        // Actualización optimista
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
          set({ favoriteItems: items }); // Revertir
        }
      },

      // Elimina favorito directamente
      removeFromFavorite: async (productId: string) => {
        const items = get().favoriteItems;
        set({ favoriteItems: items.filter((item) => item.id !== productId) });

        try {
          await removeFavoriteAction(productId);
        } catch (error) {
          console.error('Error syncing removeFromFavorite:', error);
          set({ favoriteItems: items }); // Revertir
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
        // Solo persiste en localStorage si no hay usuario logueado
        cartItems: state.currentUserId ? [] : state.cartItems,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

export default useStore;