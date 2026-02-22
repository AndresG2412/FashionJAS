import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Productos } from '@/lib/firebase/products';

// functions for syncing favorites with Firestore
import {
  getFavoritesForUser,
  addFavoriteForUser,
  removeFavoriteForUser,
} from '@/lib/firebase/userFavorites';

interface CartItem extends Productos {
  quantity: number;
}

interface StoreState {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Productos) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: (productId: string) => number;
  
  // Favorites
  favoriteItems: Productos[];
  // Current authenticated user id (null for guest)
  userId: string | null;

  // Actions
  addToFavorite: (product: Productos, userId?: string) => Promise<void>;
  removeFromFavorite: (productId: string, userId?: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;

  // helper actions to handle user change
  setUserId: (id: string | null) => void;
  loadFavorites: (userId: string) => Promise<void>;
  clearFavorites: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      cartItems: [],
      
      addToCart: (product) => {
        const items = get().cartItems;
        const existingItem = items.find((item) => item.id === product.id);
        
        if (existingItem) {
          // Si ya existe, aumentar cantidad
          set({
            cartItems: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Si no existe, agregarlo
          set({
            cartItems: [...items, { ...product, quantity: 1 }],
          });
        }
      },
      
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== productId),
        });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ cartItems: [] });
      },
      
      getCartTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },
      
      getItemCount: (productId) => {
        const item = get().cartItems.find((item) => item.id === productId);
        return item?.quantity || 0;
      },
      
      // Favorites State
      favoriteItems: [],
      userId: null,
      
      // helpers
      setUserId: (id) => set({ userId: id }),
      loadFavorites: async (userId) => {
        const favs = await getFavoritesForUser(userId);
        set({ favoriteItems: favs });
      },
      clearFavorites: () => set({ favoriteItems: [] }),
      
      addToFavorite: async (product, userId) => {
        const items = get().favoriteItems;
        const exists = items.find((item) => item.id === product.id);
        const targetUserId = userId || get().userId;

        if (exists) {
          set({
            favoriteItems: items.filter((item) => item.id !== product.id),
          });
          if (targetUserId) {
            await removeFavoriteForUser(targetUserId, product.id);
          }
        } else {
          set({
            favoriteItems: [...items, product],
          });
          if (targetUserId) {
            await addFavoriteForUser(targetUserId, product.id);
          }
        }
      },
      
      removeFromFavorite: async (productId, userId) => {
        set({
          favoriteItems: get().favoriteItems.filter((item) => item.id !== productId),
        });
        const targetUserId = userId || get().userId;
        if (targetUserId) {
          await removeFavoriteForUser(targetUserId, productId);
        }
      },
      
      isFavorite: (productId) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
    }),
    {
      name: 'gaboshop-storage', // nombre en localStorage
      // Only persist the cart so that favorites are always fetched per user
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

export default useStore;