import CategoryForm from '@/app/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/app/components/Container';

export default function NewCategoryPage() {
  return (
    <Container>
      <div className="py-6 flex flex-col max-w-2xl mx-auto">
        <div className='flex justify-end'>
          <button type='button' className='mb-4'>
            <Link
              href="/studio/categories"
              className="flex items-center gap-2 text-red-500 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a categorías
            </Link>
          </button>
        </div>

        <div className='bg-eshop-formsBackground/30 rounded-lg mb-10 border border-eshop-textSecondary'>
          <h1 className="text-3xl py-5 text-center font-bold text-eshop-textPrimary tracking-wide">
            Nueva Categoría
          </h1>

          <CategoryForm />
        </div>
      </div>
    </Container>
  );
}