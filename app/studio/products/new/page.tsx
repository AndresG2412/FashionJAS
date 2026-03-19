import ProductForm from '@/app/components/admin/ProductForm';
import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/app/components/Container';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <Container>
      <div className="py-6 flex flex-col">
        <div className='flex justify-end'>
          <button type='button' className='mb-4'>
            <Link
              href="/studio/products"
              className="flex items-center gap-2 text-red-500 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a productos
            </Link>
          </button>
        </div>

        <div className='bg-eshop-formsBackground/30 rounded-lg mb-10 border border-eshop-textSecondary'>
          <h1 className="text-3xl py-5 text-center font-bold text-eshop-textPrimary tracking-wide">
            Nuevo Producto
          </h1>

          <ProductForm categories={categories} />
        </div>
      </div>
    </Container>
  );
}