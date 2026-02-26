import CategoryForm from '@/app/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Container from '@/app/components/Container';

export default function NewCategoryPage() {
  return (
    <Container>
        
        <div className='max-w-2xl mx-auto w-full px-4 shadow-2xl rounded-lg py-6 border-2'>
            <Link
                href="/studio/categories"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a categorías
            </Link>

            <h1 className="text-3xl font-bold mb-6 text-center">Nueva Categoría</h1>

            <CategoryForm />
        </div>
    </Container>
  );
}