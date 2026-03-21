'use server'

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/adminConfig';

export async function createCategoryAction(data: {
  titulo: string;
  slug: string;
  descripcion: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const tituloFinal =
    data.titulo.trim().charAt(0).toUpperCase() +
    data.titulo.trim().slice(1).toLowerCase();

  const ref = adminDb.collection('categorias').doc(tituloFinal);
  const existing = await ref.get();
  if (existing.exists) throw new Error(`La categoría "${tituloFinal}" ya existe`);

  await ref.set({
    id: tituloFinal,
    titulo: tituloFinal,
    slug: data.slug,
    descripcion: data.descripcion || '',
  });

  return tituloFinal;
}

export async function updateCategoryAction(
  categoryId: string,
  data: { slug: string; descripcion: string }
) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  const ref = adminDb.collection('categorias').doc(categoryId);
  await ref.update({
    slug: data.slug,
    descripcion: data.descripcion || '',
  });
}

export async function deleteCategoryAction(categoryId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('No autenticado');

  await adminDb.collection('categorias').doc(categoryId).delete();
}