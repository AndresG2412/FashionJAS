import { getProductsByCategory, getCategoryBySlug } from '@/lib/firebase/admin';
import Container from '@/app/components/Container';
import ProductCard from '@/app/components/ProductCard';
import { notFound } from 'next/navigation';
import { Tag, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  // 1. Obtenemos primero la categoría
  const category = await getCategoryBySlug(slug);

  // Si la categoría no existe, mostrar 404
  if (!category) {
    notFound();
  }

  // 2. Ahora obtenemos los productos usando el slug Y el título
  const products = await getProductsByCategory(slug, category.titulo);

  return (
      <Container className="py-8">
        {/* Breadcrumb - Adaptado a textSecondary */}
        <nav className="flex items-center gap-2 text-sm text-danashop-textSecondary mb-6">
          <Link href="/" className="hover:text-danashop-brandMain transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-danashop-brandMain transition-colors">
            Tienda
          </Link>
          <span>/</span>
          <span className="text-danashop-textPrimary font-medium">{category.titulo}</span>
        </nav>

        {/* Header de categoría */}
<div className="bg-danashop-colorMain rounded-2xl border border-danashop-borderColor p-4 mb-8 shadow-xl">
  <div className="flex flex-row items-start gap-4">
    
    {/* Icono reducido en móvil */}
    <div className="w-10 h-10 hidden md:flex md:w-16 md:h-16 bg-danashop-brandMain/10 border border-danashop-brandMain/30 rounded-xl md:rounded-2xl items-center justify-center shrink-0 shadow-inner">
      <Tag className="w-5 h-5 md:w-8 md:h-8 text-danashop-brandMain" />
    </div>

    {/* Contenido principal */}
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-0">

      {/* Título + Descripción */}
      <div className="space-y-2">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl md:text-4xl font-black text-danashop-textPrimary tracking-tight leading-tight">
            {category.titulo}
          </h1>
          <div className="w-10 h-10 flex md:hidden md:w-16 md:h-16 bg-danashop-brandMain/10 border border-danashop-brandMain/30 rounded-xl md:rounded-2xl items-center justify-center shrink-0 shadow-inner">
            <Tag className="w-5 h-5 md:w-8 md:h-8 text-danashop-brandMain" />
          </div>
        </div>
        {category.descripcion && (
          <p className="text-danashop-textSecondary text-sm md:text-lg leading-relaxed wrap-break-word max-w-xl">
            {category.descripcion}
          </p>
        )}
      </div>

      {/* Acciones: en móvil → fila full-width con justify-between, regresar a la derecha */}
      {/* En MD+ → columna alineada a la derecha (como estaba original) */}
      <div className="flex flex-row-reverse md:flex-col w-full md:w-auto justify-between md:justify-center md:items-end gap-3 md:gap-y-3">
        <Link
          href="/categoria"
          className="flex items-center gap-1.5 font-bold text-danashop-favorite hover:text-danashop-error transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-base">Regresar Atrás</span>
        </Link>

        <div className="flex items-center gap-2 bg-danashop-bgColorCard px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-danashop-borderColor shadow-sm">
          <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-danashop-brandSoft" />
          <p className="text-danashop-textPrimary text-xs md:text-sm font-medium whitespace-nowrap">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

    </div>
  </div>
</div>

        {/* Grid de productos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="bg-danashop-bgColorCard rounded-3xl border border-dashed border-danashop-borderColor p-16 text-center shadow-inner">
            <div className="bg-danashop-colorMain w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-danashop-textDisabled" />
            </div>
            <h2 className="text-2xl font-bold text-danashop-textPrimary mb-2">
              No hay productos aquí
            </h2>
            <p className="text-danashop-textSecondary mb-8 max-w-md mx-auto">
              Estamos trabajando para traer los mejores productos de {category.titulo} a DanaShop.
            </p>
            <Link
              href="/tienda"
              className="inline-block px-8 py-3 bg-danashop-brandMain text-white font-bold rounded-xl hover:bg-danashop-brandHover hover:scale-105 transition-all shadow-lg shadow-danashop-brandMain/20"
            >
              Explorar Tienda
            </Link>
          </div>
        )}
      </Container>
  );
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `${category.titulo} - DanaShop`,
    description: category.descripcion || `Explora nuestra selección de ${category.titulo}`,
  };
}