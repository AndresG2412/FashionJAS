import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import CategoriesTable from '@/app/components/admin/CategoriesTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Container from '@/app/components/Container';

export default async function CategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <Container className='md:mx-auto md:px-4 px-0 mx-0'>
      <div className="flex justify-between items-center mb-6">

        <div className='md:block hidden'>
            <h1 className="text-3xl font-bold text-eshop-textPrimary">Categorías</h1>
            <p className="text-eshop-textSecondary mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>

        <Link
          href="/studio/categories/new"
            className="md:flex hidden font-serif font-bold tracking-wider items-center gap-2 px-4 py-2 bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark rounded-lg hoverEffect"
        >
          <Plus className="w-5 h-5" />
          <p className='font-bold tracking-wider'>Nueva Categoría</p>
        </Link>

        <div className='block md:hidden mx-auto px-4'>
            <h1 className="text-3xl font-bold text-eshop-textPrimary">Categorías</h1>
            <p className="text-eshop-textSecondary mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>

        <Link
          href="/studio/categories/new"
            className="flex md:hidden mr-3 font-serif font-bold tracking-wider items-center gap-2 px-4 py-2 bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark rounded-lg hoverEffect"
        >
          <Plus className="w-5 h-5" />
          <p className='font-bold tracking-wider'>Nueva Categoría</p>
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </Container>
  );
}