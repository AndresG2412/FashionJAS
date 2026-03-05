import Container from '@/app/components/Container';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductsTable from '@/app/components/admin/ProducTable';

export default function ProductsPage() {
  return (
    <Container>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-danashop-textPrimary">Gestión de Productos</h1>
            <p className="text-danashop-textSecondary mt-1">
              Busca por nombre o filtra por categoría
            </p>
          </div>
          
          <Link
            href="/studio/products/new"
            className="font-bold tracking-wider flex items-center gap-2 px-4 py-2 bg-danashop-brandMain hover:bg-danashop-brandHover text-danashop-textPrimary rounded-lg hoverEffect"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>

        <ProductsTable />
      </div>
    </Container>
  );
}