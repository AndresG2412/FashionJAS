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
        <div className='max-w-2xl mx-auto w-full px-4 shadow-2xl rounded-lg py-6 border-2 bg-danashop-borderColor'>
            <button className='mb-6' type='button'>
                <Link
                    href="/studio/categories"
                    className="flex items-center gap-2 text-danashop-error "
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a categorías
                </Link>
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center text-danashop-textPrimary">Editar Categoría: {category.titulo}</h1>

            <CategoryForm category={category} isEditing />
        </div>
    </Container>
  );
}