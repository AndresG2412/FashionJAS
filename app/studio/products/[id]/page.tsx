import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import ProductForm from '@/app/components/admin/ProductForm';
import { getAllCategoriesAdmin } from '@/lib/firebase/admin';

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // ← Definimos params como Promesa
}) {
  // 1. Esperamos a que los params se resuelvan
  const { id } = await params;

  // 2. Traemos datos necesarios en paralelo
  const [productDoc, categories] = await Promise.all([
    getDoc(doc(db, 'productos', id)),
    getAllCategoriesAdmin()
  ]);

  if (!productDoc.exists()) {
    notFound();
  }

  const productData = {
    id: productDoc.id,
    ...productDoc.data()
  } as any;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductForm 
        categories={categories} 
        product={productData} 
        isEditing={true} 
      />
    </div>
  );
}