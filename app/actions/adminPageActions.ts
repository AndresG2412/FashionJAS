'use server'

import { adminDb } from '@/lib/firebase/adminConfig';
import type { Category } from '@/lib/firebase/categories';
import type { Productos } from '@/lib/firebase/products';

// ── Obtener categoría por ID (para página de edición) ────────────────────────
export async function getCategoryByIdAction(id: string): Promise<Category | null> {
  const doc = await adminDb.collection('categorias').doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    titulo: doc.data()!.titulo,
    slug: doc.data()!.slug,
    descripcion: doc.data()!.descripcion || '',
  };
}

// ── Obtener producto por slug (para página de edición) ───────────────────────
export async function getProductBySlugAction(slug: string): Promise<(Productos & { id: string }) | null> {
  const snap = await adminDb
    .collection('productos')
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    nombre: data.nombre,
    slug: data.slug,
    precio: data.precio,
    imagenes: data.imagenes,
    descripcion: data.descripcion,
    categorias: data.categorias,
    stock: data.stock,
    tallas: data.tallas || [],
    colores: data.colores || [],
    subido: data.subido?.toDate() || new Date(),
  };
}