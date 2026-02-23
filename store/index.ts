import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Productos } from '@/lib/firebase/products';
import { addFavoriteForUser, removeFavoriteForUser, getFavoritesForUser } from '@/lib/firebase/userFavorites';
import { 
  addToCartForUser, 
  removeFromCartForUser, 
  updateCartItemQuantity, 
  clearCartForUser, 
  getCartForUser 
} from '@/lib/firebase/userCart';

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
  addToCart: (product: Productos, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
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
      // User State
      currentUserId: null,
      setUserId: (userId) => {
        set({ currentUserId: userId });
      },
      
      // Cart State (NUEVO - Sincronizado con Firebase)
      cartItems: [],
      cartLoaded: false,
      
      // Cargar carrito desde Firebase
      loadCart: async (userId: string) => {
        try {
          const cartData = await getCartForUser(userId);
          const cartItems = cartData.map(item => ({
            ...item.product,
            quantity: item.quantity,
          }));
          set({ 
            cartItems,
            cartLoaded: true 
          });
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      },
      
      // Agregar al carrito (sincronizado con Firebase)
      addToCart: async (product: Productos, userId?: string) => {
        const items = get().cartItems;
        const existingItem = items.find((item) => item.id === product.id);
        
        if (existingItem) {
          // Si existe, incrementar cantidad
          const newQuantity = existingItem.quantity + 1;
          set({
            cartItems: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          
          // Sincronizar con Firebase si hay userId
          if (userId) {
            await updateCartItemQuantity(userId, product.id, newQuantity);
          }
        } else {
          // Si no existe, agregar nuevo
          set({
            cartItems: [...items, { ...product, quantity: 1 }],
          });
          
          // Sincronizar con Firebase si hay userId
          if (userId) {
            await addToCartForUser(userId, product.id, 1);
          }
        }
      },
      
      // Eliminar del carrito (sincronizado con Firebase)
      removeFromCart: async (productId: string, userId?: string) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== productId),
        });
        
        // Sincronizar con Firebase si hay userId
        if (userId) {
          await removeFromCartForUser(userId, productId);
        }
      },
      
      // Actualizar cantidad (sincronizado con Firebase)
      updateQuantity: async (productId: string, quantity: number, userId?: string) => {
        if (quantity <= 0) {
          await get().removeFromCart(productId, userId);
          return;
        }
        
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
        
        // Sincronizar con Firebase si hay userId
        if (userId) {
          await updateCartItemQuantity(userId, productId, quantity);
        }
      },
      
      // Limpiar carrito (sincronizado con Firebase)
      clearCart: async (userId?: string) => {
        set({ 
          cartItems: [],
          cartLoaded: false 
        });
        
        // Sincronizar con Firebase si hay userId
        if (userId) {
          await clearCartForUser(userId);
        }
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
      
      // Favorites State (sin cambios)
      favoriteItems: [],
      favoritesLoaded: false,
      
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
      
      addToFavorite: async (product: Productos, userId?: string) => {
        const items = get().favoriteItems;
        const exists = items.find((item) => item.id === product.id);
        
        if (exists) {
          set({
            favoriteItems: items.filter((item) => item.id !== product.id),
          });
          
          if (userId) {
            await removeFavoriteForUser(userId, product.id);
          }
        } else {
          set({
            favoriteItems: [...items, product],
          });
          
          if (userId) {
            await addFavoriteForUser(userId, product.id);
          }
        }
      },
      
      removeFromFavorite: async (productId: string, userId?: string) => {
        set({
          favoriteItems: get().favoriteItems.filter((item) => item.id !== productId),
        });
        
        if (userId) {
          await removeFavoriteForUser(userId, productId);
        }
      },
      
      isFavorite: (productId) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
      
      clearFavorites: () => {
        set({ 
          favoriteItems: [],
          favoritesLoaded: false 
        });
      },
    }),
    {
      name: 'gaboshop-storage',
      partialize: (state) => ({
        // Solo persistir en localStorage para invitados
        cartItems: state.currentUserId ? [] : state.cartItems,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

export default useStore;