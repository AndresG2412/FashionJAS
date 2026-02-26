import ProductForm from '@/app/components/admin/ProductForm';
import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/app/components/Container';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <Container>
      <div className="py-6">
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
    </Container>
  );
}