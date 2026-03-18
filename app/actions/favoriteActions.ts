'use server'

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/adminConfig';
import { getProductsByIds } from '@/lib/firebase/products';

export async function getFavorites() {
  const { userId } = await auth();
  if (!userId) return [];

  const snap = await adminDb.collection('userFavorites').doc(userId).get();
  if (!snap.exists) return [];

  const ids: string[] = snap.data()?.favorites || [];
  if (ids.length === 0) return [];
  return await getProductsByIds(ids);
}

export async function addFavorite(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const ref = adminDb.collection('userFavorites').doc(userId);
  const snap = await ref.get();
  const favorites: string[] = snap.exists ? (snap.data()?.favorites || []) : [];

  if (!favorites.includes(productId)) {
    await ref.set({ favorites: [...favorites, productId] }, { merge: true });
  }
}

export async function removeFavorite(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const ref = adminDb.collection('userFavorites').doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return;

  const favorites: string[] = snap.data()?.favorites || [];
  await ref.set({ favorites: favorites.filter(id => id !== productId) }, { merge: true });
}