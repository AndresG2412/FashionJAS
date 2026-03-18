'use server'

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/adminConfig';

// ── Obtener carrito ──────────────────────────────
export async function getCart() {
  const { userId } = await auth();
  if (!userId) return [];

  const snap = await adminDb.collection('userCart').doc(userId).get();
  if (!snap.exists) return [];
  return snap.data()?.items || [];
}

// ── Agregar al carrito ───────────────────────────
export async function addToCart(productId: string, quantity: number = 1) {
  const { userId } = await auth();
  if (!userId) return;

  const ref = adminDb.collection('userCart').doc(userId);
  const snap = await ref.get();
  const items = snap.exists ? (snap.data()?.items || []) : [];

  const existing = items.find((i: any) => i.productId === productId);
  const updatedItems = existing
    ? items.map((i: any) => i.productId === productId
        ? { ...i, quantity: i.quantity + quantity }
        : i)
    : [...items, { productId, quantity, addedAt: new Date() }];

  await ref.set({ items: updatedItems });
}

// ── Actualizar cantidad ──────────────────────────
export async function updateCartItem(productId: string, quantity: number) {
  const { userId } = await auth();
  if (!userId) return;

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const ref = adminDb.collection('userCart').doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return;

  const items = snap.data()?.items || [];
  const updatedItems = items.map((i: any) =>
    i.productId === productId ? { ...i, quantity } : i
  );
  await ref.set({ items: updatedItems });
}

// ── Eliminar producto ────────────────────────────
export async function removeFromCart(productId: string) {
  const { userId } = await auth();
  if (!userId) return;

  const ref = adminDb.collection('userCart').doc(userId);
  const snap = await ref.get();
  if (!snap.exists) return;

  const items = snap.data()?.items || [];
  const updatedItems = items.filter((i: any) => i.productId !== productId);

  updatedItems.length === 0
    ? await ref.delete()
    : await ref.set({ items: updatedItems });
}

// ── Vaciar carrito ───────────────────────────────
export async function clearCart() {
  const { userId } = await auth();
  if (!userId) return;

  await adminDb.collection('userCart').doc(userId).delete();
}