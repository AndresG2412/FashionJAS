import CategoryForm from '@/app/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getCategoryByIdAction } from '@/app/actions/adminPageActions';
import Container from '@/app/components/Container';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  const category = await getCategoryByIdAction(id); // ✅ Admin SDK

  if (!category) notFound();

  return (
    <Container>
      <div className="py-6 flex flex-col max-w-2xl mx-auto">
        <div className='flex justify-end'>
          <button type='button' className='mb-4'>
            <Link
              href="/studio/categories"
              className="flex items-center gap-2 text-eshop-textError hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a categorías
            </Link>
          </button>
        </div>

        <div className='bg-eshop-formsBackground/30 rounded-lg mb-10 border border-eshop-textSecondary'>
          <h1 className="text-3xl py-5 text-center font-bold text-eshop-textPrimary tracking-wide">
            Editar Categoría: {category.titulo}
          </h1>

          <CategoryForm category={category} isEditing />
        </div>
      </div>
    </Container>
  );
}