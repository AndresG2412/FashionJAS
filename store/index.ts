import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Productos } from '@/lib/firebase/products';
import { addFavoriteForUser, removeFavoriteForUser, getFavoritesForUser } from '@/lib/firebase/userFavorites';

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
  favoritesLoaded: boolean;
  loadFavorites: (userId: string) => Promise<void>;
  addToFavorite: (product: Productos, userId?: string) => Promise<void>;
  removeFromFavorite: (productId: string, userId?: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State (igual que antes)
      cartItems: [],
      
      addToCart: (product) => {
        const items = get().cartItems;
        const existingItem = items.find((item) => item.id === product.id);
        
        if (existingItem) {
          set({
            cartItems: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
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
      
      // Favorites State (MEJORADO)
      favoriteItems: [],
      favoritesLoaded: false,
      
      // Cargar favoritos desde Firebase
      loadFavorites: async (userId: string) => {
        try {
          const favorites = await getFavoritesForUser(userId);
          set({ 
            favoriteItems: favorites,
            favoritesLoaded: true 
          });
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      },
      
      // Agregar a favoritos (sincronizado con Firebase)
      addToFavorite: async (product: Productos, userId?: string) => {
        const items = get().favoriteItems;
        const exists = items.find((item) => item.id === product.id);
        
        if (exists) {
          // Quitar de favoritos
          set({
            favoriteItems: items.filter((item) => item.id !== product.id),
          });
          
          // Sincronizar con Firebase
          if (userId) {
            await removeFavoriteForUser(userId, product.id);
          }
        } else {
          // Agregar a favoritos
          set({
            favoriteItems: [...items, product],
          });
          
          // Sincronizar con Firebase
          if (userId) {
            await addFavoriteForUser(userId, product.id);
          }
        }
      },
      
      // Remover de favoritos (sincronizado con Firebase)
      removeFromFavorite: async (productId: string, userId?: string) => {
        set({
          favoriteItems: get().favoriteItems.filter((item) => item.id !== productId),
        });
        
        // Sincronizar con Firebase
        if (userId) {
          await removeFavoriteForUser(userId, productId);
        }
      },
      
      isFavorite: (productId) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
      
      clearFavorites: () => {
        set({ favoriteItems: [] });
      },
    }),
    {
      name: 'gaboshop-storage',
      partialize: (state) => ({
        cartItems: state.cartItems,
        // NO persistimos favoriteItems porque vienen de Firebase
      }),
    }
  )
);

export default useStore;