'use server'

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/adminConfig';
import type { Order } from '@/lib/firebase/order';

export async function getOrders(): Promise<Order[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const snap = await adminDb
    .collection('orders')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
}