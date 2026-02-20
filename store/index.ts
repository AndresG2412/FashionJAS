import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/firebase/products';

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: (productId: string) => number;
  
  // Favorites
  favoriteItems: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
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
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getItemCount: (productId) => {
        const item = get().cartItems.find((item) => item.id === productId);
        return item?.quantity || 0;
      },
      
      // Favorites State
      favoriteItems: [],
      
      addToFavorite: async (product) => {
        const items = get().favoriteItems;
        const exists = items.find((item) => item.id === product.id);
        
        if (exists) {
          // Si ya existe, quitarlo
          set({
            favoriteItems: items.filter((item) => item.id !== product.id),
          });
        } else {
          // Si no existe, agregarlo
          set({
            favoriteItems: [...items, product],
          });
        }
      },
      
      removeFromFavorite: (productId) => {
        set({
          favoriteItems: get().favoriteItems.filter((item) => item.id !== productId),
        });
      },
      
      isFavorite: (productId) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
    }),
    {
      name: 'gaboshop-storage', // nombre en localStorage
    }
  )
);

export default useStore;