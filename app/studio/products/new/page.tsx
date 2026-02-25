import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/app/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div>
      <Link
        href="/studio/products"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-3xl font-bold mb-6">Nuevo Producto</h1>

      <ProductForm categories={categories} />
    </div>
  );
}