'use server'

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/adminConfig';
import { FieldValue } from 'firebase-admin/firestore';
import type { Productos } from '@/lib/firebase/products';
import type { Category } from '@/lib/firebase/categories';

// ── Crear producto ───────────────────────────────────────────────────────────
export async function createProductAction(
  productData: Omit<Productos, 'id' | 'subido'>
): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const docId = productData.nombre;
  const ref = adminDb.collection('productos').doc(docId);

  await ref.set({
    ...productData,
    nombreLower: productData.nombre.toLowerCase(),
    subido: FieldValue.serverTimestamp(),
  });

  return docId;
}

// ── Actualizar producto ──────────────────────────────────────────────────────
export async function updateProductAction(
  productId: string,
  productData: Partial<Productos>
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const ref = adminDb.collection('productos').doc(productId);
  const updatedData: any = { ...productData };

  if (productData.nombre) {
    updatedData.nombreLower = productData.nombre.toLowerCase();
  }

  await ref.update(updatedData);
}

// ── Eliminar producto ────────────────────────────────────────────────────────
export async function deleteProductAction(productId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  await adminDb.collection('productos').doc(productId).delete();
}

// ── Obtener todos los productos ──────────────────────────────────────────────
export async function getAllProductsAction(): Promise<Productos[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const snap = await adminDb
    .collection('productos')
    .orderBy('subido', 'desc')
    .limit(50)
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    subido: doc.data().subido?.toDate() || new Date(),
  })) as Productos[];
}

// ── Productos con poco stock ─────────────────────────────────────────────────
export async function getLowStockProductsAction(): Promise<Productos[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const snap = await adminDb
    .collection('productos')
    .where('stock', '<=', 5)
    .orderBy('stock', 'asc')
    .limit(20)
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    subido: doc.data().subido?.toDate() || new Date(),
  })) as Productos[];
}

// ── Buscar productos ─────────────────────────────────────────────────────────
export async function searchProductsAction(
  mode: 'nombre' | 'categoria',
  text: string
): Promise<Productos[]> {
  const { userId } = await auth();
  if (!userId) return [];

  if (mode === 'nombre') {
    const searchLower = text.toLowerCase();
    const snap = await adminDb
      .collection('productos')
      .where('nombreLower', '>=', searchLower)
      .where('nombreLower', '<=', searchLower + '\uf8ff')
      .orderBy('nombreLower')
      .limit(20)
      .get();

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      subido: doc.data().subido?.toDate() || new Date(),
    })) as Productos[];
  } else {
    // Búsqueda por categoría — filtra en memoria
    const snap = await adminDb
      .collection('productos')
      .limit(100)
      .get();

    const searchLower = text.toLowerCase();
    return snap.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        subido: doc.data().subido?.toDate() || new Date(),
      }))
      .filter((p: any) =>
        p.categorias?.some((cat: string) => cat.toLowerCase() === searchLower)
      ) as Productos[];
  }
}

// ── Obtener todas las categorías (para el formulario de productos) ────────────
export async function getAllCategoriesAction(): Promise<Category[]> {
  const snap = await adminDb
    .collection('categorias')
    .orderBy('titulo', 'asc')
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    titulo: doc.data().titulo,
    slug: doc.data().slug,
    descripcion: doc.data().descripcion || '',
  })) as Category[];
}