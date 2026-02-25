import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductForm from '@/app/components/admin/ProductForm';
import type { Productos } from '@/lib/firebase/products';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const categories = await getAllCategoriesAdmin();
  
  // Obtener producto por ID
  const productDoc = await getDoc(doc(db, 'productos', params.id));
  
  if (!productDoc.exists()) {
    notFound();
  }

  const productData = productDoc.data();
  
  const product: Productos & { id: string } = {
    id: productDoc.id,
    nombre: productData.nombre,
    slug: productData.slug,
    precio: productData.precio,
    imagenes: productData.imagenes,
    descripcion: productData.descripcion,
    variante: productData.variante,
    categorias: productData.categorias,
    stock: productData.stock,
    subido: productData.subido?.toDate() || new Date(),
  };

  return (
    <div>
      <Link
        href="/studio/products"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>

      <ProductForm categories={categories} product={product} isEditing />
    </div>
  );
}