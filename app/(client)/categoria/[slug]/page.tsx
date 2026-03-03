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
  
  // 1. Obtenemos la categoría
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // 2. Obtenemos los productos
  const productsData = await getProductsByCategory(slug, category.titulo);

  // 3. ORDENAMIENTO: De menor a mayor precio
  const products = productsData.sort((a, b) => (a.price || 0) - (b.price || 0));

  return (
    <Container className="py-6 md:py-8">
      {/* Breadcrumb - Oculto en móviles muy pequeños para limpieza visual */}
      <nav className="hidden sm:flex items-center gap-2 text-sm text-danashop-textSecondary mb-6">
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

      {/* Header de categoría - Layout Horizontal en todos los dispositivos */}
      <div className="bg-danashop-colorMain rounded-2xl border border-danashop-borderColor p-5 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-row items-start gap-4 md:gap-8">
          
          {/* Icono de categoría: Tamaño dinámico */}
          <div className="w-14 h-14 md:w-20 md:h-20 bg-danashop-brandMain/10 border border-danashop-brandMain/30 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Tag className="w-7 h-7 md:w-10 md:h-10 text-danashop-brandMain" />
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-1 md:space-y-2">
                {/* Título: text-xl en móvil, 5xl en desktop */}
                <h1 className="text-xl md:text-5xl font-black text-danashop-textPrimary tracking-tight">
                  {category.titulo}
                </h1>
                {category.descripcion && (
                  <p className="text-danashop-textSecondary text-xs md:text-lg max-w-xl line-clamp-2 md:line-clamp-none">
                    {category.descripcion}
                  </p>
                )}
              </div>

              {/* Acciones y Contador: Layout horizontal en móvil */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 border-t border-danashop-borderColor/50 md:border-none md:pt-0">
                <Link 
                  href="/categoria" 
                  className="flex items-center gap-1.5 font-bold text-danashop-favorite text-xs md:text-base hover:text-danashop-error transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Regresar</span>
                </Link>
                
                <div className="flex items-center gap-2 bg-danashop-bgColorCard px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-danashop-borderColor shadow-sm">
                  <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-danashop-brandSoft" />
                  <p className="text-danashop-textPrimary text-[10px] md:text-sm font-bold">
                    {products.length} {products.length === 1 ? 'Producto' : 'Productos'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="bg-danashop-bgColorCard rounded-3xl border border-dashed border-danashop-borderColor p-12 md:p-16 text-center shadow-inner">
          <div className="bg-danashop-colorMain w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 md:w-10 md:h-10 text-danashop-textDisabled" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-danashop-textPrimary mb-2">
            No hay productos aquí
          </h2>
          <p className="text-danashop-textSecondary text-sm md:text-base mb-8 max-w-md mx-auto">
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