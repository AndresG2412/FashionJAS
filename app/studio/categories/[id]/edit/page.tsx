import CategoryForm from '@/app/components/admin/CategoryForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Category } from '@/lib/firebase/categories';
import Container from '@/app/components/Container';

interface Props {
  params: Promise<{ id: string }>; // ← params es una Promise
}

export default async function EditCategoryPage({ params }: Props) {
  // ← Await params primero
  const { id } = await params;
  
  const categoryDoc = await getDoc(doc(db, 'categorias', id));
  
  if (!categoryDoc.exists()) {
    notFound();
  }

  const category: Category = {
    id: categoryDoc.id,
    titulo: categoryDoc.data().titulo,
    slug: categoryDoc.data().slug,
    descripcion: categoryDoc.data().descripcion || '',
  };

  return (
    <Container>
      <div className="py-6 flex flex-col max-w-2xl mx-auto">
        <div className='flex justify-end'>
          <button type='button' className='mb-4'>
            <Link
              href="/studio/categories"
              className="flex items-center gap-2 text-danashop-error "
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a categorías
            </Link>
          </button>
        </div>

        <div className='bg-bgForms/30 rounded-lg mb-10 border'>
          <h1 className="text-3xl py-5 text-center font-bold text-danashop-textPrimary tracking-wide">Editar Categoría: {category.titulo}</h1>

          <CategoryForm category={category} isEditing />
        </div>
      </div>
    </Container>
  );
}