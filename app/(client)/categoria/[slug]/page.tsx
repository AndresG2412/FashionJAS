import { getProductsByCategory, getCategoryBySlug } from '@/lib/firebase/admin';
import Container from '@/app/components/Container';
import ProductCard from '@/app/components/client/welcome/ProductCard';
import { notFound } from 'next/navigation';
import { Tag, Package, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 20;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug, category.titulo);

  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
        acc.push(p);
        return acc;
      }, []);
  };

  return (
    <Container className="py-8 bg-eshop-bgMain">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-eshop-textSecondary mb-6 font-medium">
        <Link href="/" className="hover:text-eshop-textHover transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/tienda" className="hover:text-eshop-textHover transition-colors">Tienda</Link>
        <span>/</span>
        <span className="text-eshop-textPrimary font-bold">{category.titulo}</span>
      </nav>

      {/* Header de categoría */}
      <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderSubtle p-5 mb-8 shadow-sm">
        <div className="flex flex-row items-start gap-4">
          {/* Icono decorativo */}
          <div className="w-10 h-10 hidden md:flex md:w-16 md:h-16 bg-eshop-bgCard border border-eshop-borderEmphasis rounded-xl md:rounded-2xl items-center justify-center shrink-0 shadow-inner">
            <Tag className="w-5 h-5 md:w-8 md:h-8 text-eshop-accent" />
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-4xl font-black text-eshop-textPrimary tracking-tight leading-tight">
                  {category.titulo}
                </h1>
                <div className="w-10 h-10 flex md:hidden bg-eshop-bgCard border border-eshop-borderEmphasis rounded-xl items-center justify-center shrink-0 shadow-inner">
                  <Tag className="w-5 h-5 text-eshop-accent" />
                </div>
              </div>
              {category.descripcion && (
                <p className="text-eshop-textSecondary text-sm md:text-lg leading-relaxed wrap-break-word max-w-xl">
                  {category.descripcion}
                </p>
              )}
            </div>

            <div className="flex flex-row-reverse md:flex-col w-full md:w-auto justify-between md:justify-center md:items-end gap-3 md:gap-y-3">
              <Link
                href="/categoria"
                className="flex items-center gap-1.5 font-bold text-eshop-textError hover:text-eshop-textHover transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base">Regresar Atrás</span>
              </Link>
              <div className="flex items-center gap-2 bg-eshop-bgCard px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-eshop-borderSubtle shadow-sm">
                <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-eshop-goldDeep" />
                <p className="text-eshop-textPrimary text-xs md:text-sm font-bold whitespace-nowrap">
                  {products.length} {products.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      {products.length > 0 ? (
        <>
          <p className="text-sm text-eshop-textSecondary mb-4 font-medium">
            Mostrando {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} de {products.length} productos
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Link
                href={`/categoria/${slug}?page=${currentPage - 1}`}
                aria-disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-eshop-borderSubtle bg-eshop-bgWhite hover:bg-eshop-bgCard hover:border-eshop-borderEmphasis transition-all ${currentPage === 1 ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronLeft className="w-4 h-4 text-eshop-textPrimary" />
              </Link>

              {getPageNumbers().map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-eshop-textDisabled font-bold">...</span>
                ) : (
                  <Link
                    key={item}
                    href={`/categoria/${slug}?page=${item}`}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all flex items-center justify-center border ${
                      currentPage === item
                        ? 'bg-eshop-buttonBase border-eshop-buttonBase text-eshop-textDark shadow-sm'
                        : 'bg-eshop-bgWhite border-eshop-borderSubtle text-eshop-textSecondary hover:border-eshop-accent hover:text-eshop-accent'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}

              <Link
                href={`/categoria/${slug}?page=${currentPage + 1}`}
                aria-disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-eshop-borderSubtle bg-eshop-bgWhite hover:bg-eshop-bgCard hover:border-eshop-borderEmphasis transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronRight className="w-4 h-4 text-eshop-textPrimary" />
              </Link>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-eshop-bgWhite rounded-3xl border border-dashed border-eshop-borderEmphasis p-16 text-center shadow-inner">
          <div className="bg-eshop-bgCard w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-eshop-textDisabled" />
          </div>
          <h2 className="text-2xl font-bold text-eshop-textPrimary mb-2">No hay productos aquí</h2>
          <p className="text-eshop-textSecondary mb-8 max-w-md mx-auto">
            Estamos trabajando para traer los mejores productos a nuestra categoría de {category.titulo}.
          </p>
          <Link href="/tienda" className="inline-block px-8 py-3 bg-eshop-buttonBase text-eshop-textDark font-bold rounded-xl hover:bg-eshop-buttonHover transition-all shadow-md">
            Explorar Tienda
          </Link>
        </div>
      )}
    </Container>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Categoría no encontrada' };
  return {
    title: `${category.titulo} - FashionJAS`,
    description: category.descripcion || `Explora nuestra selección de ${category.titulo}`,
  };
}