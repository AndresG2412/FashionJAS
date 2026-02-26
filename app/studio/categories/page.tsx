import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import CategoriesTable from '@/app/components/admin/CategoriesTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Container from '@/app/components/Container';

export default async function CategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>
        <Link
          href="/studio/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </Container>
  );
}