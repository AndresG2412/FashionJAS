import Container from '@/app/components/Container';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductsTable from '@/app/components/admin/ProducTable';

export default function ProductsPage() {
  return (
    <Container className="md:mx-auto md:px-4 px-0 mx-0">
      <div className="flex justify-between items-center mb-6">
        
        {/* Versión Escritorio: Título y Subtítulo */}
        <div className="md:block hidden">
          <h1 className="text-3xl font-bold text-eshop-textPrimary">Gestión de Productos</h1>
          <p className="text-eshop-textSecondary mt-1">
            Busca por nombre o filtra por categoría
          </p>
        </div>

        {/* Versión Escritorio: Botón */}
        <Link
          href="/studio/products/new"
          className="md:flex hidden font-serif font-bold tracking-wider items-center gap-2 px-4 py-2 bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark rounded-lg hoverEffect transition-all"
        >
          <Plus className="w-5 h-5" />
          <p className="font-bold tracking-wider">Nuevo Producto</p>
        </Link>

        {/* Versión Móvil: Título y Subtítulo */}
        <div className="block md:hidden mx-auto px-4">
          <h1 className="text-3xl font-bold text-eshop-textPrimary">Productos</h1>
          <p className="text-eshop-textSecondary mt-1 text-sm">
            Gestiona el inventario de tu tienda
          </p>
        </div>

        {/* Versión Móvil: Botón */}
        <Link
          href="/studio/products/new"
          className="flex md:hidden mr-3 font-serif font-bold tracking-wider items-center gap-2 px-4 py-2 bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark rounded-lg hoverEffect transition-all"
        >
          <Plus className="w-5 h-5" />
          <p className="font-bold tracking-wider text-xs">Nuevo</p>
        </Link>
      </div>

      <div className="mb-6">
        <ProductsTable />
      </div>
    </Container>
  );
}