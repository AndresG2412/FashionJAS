import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { Productos } from './products';
import { getProductsByIds } from './products';

// Path: /userCart/{userId} - stores an array of cart items
const userCartDoc = (userId: string) => doc(db, 'userCart', userId);

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Productos;
}

/**
 * Obtiene los productos del carrito de un usuario con sus cantidades
 */
export async function getCartForUser(userId: string): Promise<CartItemWithProduct[]> {
  try {
    const ref = userCartDoc(userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];

    const data = snap.data();
    const items: CartItem[] = data?.items || [];
    if (items.length === 0) return [];

    // Obtener los IDs de productos
    const productIds = items.map(item => item.productId);
    const products = await getProductsByIds(productIds);

    // Combinar productos con sus cantidades
    return items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product!,
      };
    }).filter(item => item.product); // Filtrar productos que ya no existen
  } catch (err) {
    console.error('Error loading cart for user', userId, err);
    return [];
  }
}

/**
 * Agrega un producto al carrito o incrementa su cantidad
 */
export async function addToCartForUser(userId: string, productId: string, quantity: number = 1): Promise<void> {
  try {
    const ref = userCartDoc(userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const items: CartItem[] = data?.items || [];
      const existingItem = items.find(item => item.productId === productId);

      if (existingItem) {
        // Si existe, actualizar cantidad
        const updatedItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        await setDoc(ref, { items: updatedItems });
      } else {
        // Si no existe, agregar nuevo
        await setDoc(ref, {
          items: [...items, { productId, quantity, addedAt: new Date() }]
        });
      }
    } else {
      // Crear documento nuevo
      await setDoc(ref, {
        items: [{ productId, quantity, addedAt: new Date() }]
      });
    }
  } catch (err) {
    console.error('Error adding to cart for user', userId, productId, err);
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export async function updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<void> {
  try {
    if (quantity <= 0) {
      await removeFromCartForUser(userId, productId);
      return;
    }

    const ref = userCartDoc(userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const items: CartItem[] = data?.items || [];
      const updatedItems = items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      await setDoc(ref, { items: updatedItems });
    }
  } catch (err) {
    console.error('Error updating cart quantity for user', userId, productId, err);
  }
}

/**
 * Elimina un producto del carrito
 */
export async function removeFromCartForUser(userId: string, productId: string): Promise<void> {
  try {
    const ref = userCartDoc(userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const items: CartItem[] = data?.items || [];
      const updatedItems = items.filter(item => item.productId !== productId);
      
      if (updatedItems.length === 0) {
        // Si no quedan items, eliminar el documento
        await deleteDoc(ref);
      } else {
        await setDoc(ref, { items: updatedItems });
      }
    }
  } catch (err) {
    console.error('Error removing from cart for user', userId, productId, err);
  }
}

/**
 * Limpia todo el carrito de un usuario
 */
export async function clearCartForUser(userId: string): Promise<void> {
  try {
    const ref = userCartDoc(userId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Error clearing cart for user', userId, err);
  }
}