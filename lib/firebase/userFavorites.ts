import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './config';
import type { Productos } from './products';
import { getProductsByIds } from './products';

// Path: /userFavorites/{userId} - stores an array of product ids
const userFavoritesDoc = (userId: string) => doc(db, 'userFavorites', userId);

/**
 * Retrieves the full product objects that a user has marked as favorite.
 * If the user document doesn't exist or contains no favorites, returns an empty array.
 */
export async function getFavoritesForUser(userId: string): Promise<Productos[]> {
  try {
    const ref = userFavoritesDoc(userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];

    const data = snap.data();
    const ids: string[] = data?.favorites || [];
    if (ids.length === 0) return [];

    return await getProductsByIds(ids);
  } catch (err) {
    console.error('Error loading favorites for user', userId, err);
    return [];
  }
}

/**
 * Adds a product ID to the user's favorites list in Firestore.
 * Uses arrayUnion so that duplicates are prevented by the database.
 */
export async function addFavoriteForUser(userId: string, productId: string): Promise<void> {
  try {
    const ref = userFavoritesDoc(userId);
    await setDoc(ref, { favorites: arrayUnion(productId) }, { merge: true });
  } catch (err) {
    console.error('Error adding favorite for user', userId, productId, err);
  }
}

/**
 * Removes a product ID from the user's favorites list.
 * If the document doesn't exist the call is silently ignored.
 */
export async function removeFavoriteForUser(userId: string, productId: string): Promise<void> {
  try {
    const ref = userFavoritesDoc(userId);
    // updateDoc would error if the doc doesn't exist, so we use setDoc with merge
    await setDoc(ref, { favorites: arrayRemove(productId) }, { merge: true });
  } catch (err) {
    console.error('Error removing favorite for user', userId, productId, err);
  }
}
