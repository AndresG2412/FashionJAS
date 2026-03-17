import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import Container from '@/app/components/Container';
import Link from 'next/link';
import { Tag, ArrowRight, Package, ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Categorías - Tiendanna',
  description: 'Explora todas nuestras categorías de productos',
};

const CATEGORIES_PER_PAGE = 8;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriasPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const categories = await getAllCategoriesAdmin();

  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + CATEGORIES_PER_PAGE);

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
    <Container className="bg-eshop-bgMain min-h-screen">
      {/* Header */}
      <div className="mt-8 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-eshop-bgWhite border border-eshop-borderEmphasis rounded-2xl flex items-center justify-center shadow-sm">
            <Tag className="w-7 h-7 text-eshop-accent" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-eshop-textPrimary tracking-tight">
              Todas las Categorías
            </h1>
            <p className="text-eshop-textSecondary font-medium mt-1">
              {categories.length} {categories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
            </p>
          </div>
        </div>
        <p className="text-lg text-eshop-textSecondary max-w-2xl leading-relaxed">
          Explora nuestro catálogo organizado por categorías. Encuentra piezas exclusivas seleccionadas para ti.
        </p>
      </div>

      {/* Grid de categorías */}
      {categories.length > 0 ? (
        <>
          <p className="text-sm text-eshop-textSecondary mb-6 font-medium">
            Mostrando {startIndex + 1}–{Math.min(startIndex + CATEGORIES_PER_PAGE, categories.length)} de {categories.length} categorías
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="group border border-eshop-borderSubtle bg-eshop-bgWhite rounded-2xl shadow-sm hover:shadow-md hover:border-eshop-borderEmphasis transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                {/* Header de la Card */}
                <div className="bg-eshop-bgCard flex gap-x-3 items-center px-5 py-4 border-b border-eshop-borderSubtle min-h-[80px]">
                  <div className="w-10 h-10 bg-eshop-bgWhite rounded-lg flex shadow-sm items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-eshop-borderSubtle">
                    <Tag className="w-5 h-5 text-eshop-accent" />
                  </div>
                  <div className="text-lg font-bold text-eshop-textPrimary group-hover:text-eshop-textHover transition-colors leading-tight">
                    {category.titulo}
                  </div>
                </div>
                
                {/* Cuerpo de la Card */}
                <div className="p-5 flex flex-col gap-y-4 flex-1 bg-eshop-bgWhite">
                  <p className="text-eshop-textSecondary text-sm line-clamp-2 min-h-[40px] leading-relaxed">
                    {category.descripcion || 'Explora nuestra selección de productos exclusivos en esta categoría.'}
                  </p>
                  <div className="flex items-center justify-between text-eshop-accent font-bold text-sm mt-auto pt-2">
                    <span className="group-hover:mr-2 transition-all">Ver productos</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Línea decorativa inferior */}
                <div className="h-1 bg-eshop-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <Link
                href={`/categoria?page=${currentPage - 1}`}
                aria-disabled={currentPage === 1}
                className={`p-2.5 rounded-xl border border-eshop-borderSubtle bg-eshop-bgWhite hover:bg-eshop-bgCard hover:border-eshop-borderEmphasis transition-all ${currentPage === 1 ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronLeft className="w-5 h-5 text-eshop-textPrimary" />
              </Link>

              {getPageNumbers().map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-eshop-textDisabled font-bold">...</span>
                ) : (
                  <Link
                    key={item}
                    href={`/categoria?page=${item}`}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center border ${
                      currentPage === item
                        ? 'bg-eshop-buttonBase border-eshop-buttonBase text-eshop-textDark shadow-md scale-105'
                        : 'bg-eshop-bgWhite border-eshop-borderSubtle text-eshop-textSecondary hover:border-eshop-accent hover:text-eshop-accent'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}

              <Link
                href={`/categoria?page=${currentPage + 1}`}
                aria-disabled={currentPage === totalPages}
                className={`p-2.5 rounded-xl border border-eshop-borderSubtle bg-eshop-bgWhite hover:bg-eshop-bgCard hover:border-eshop-borderEmphasis transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronRight className="w-5 h-5 text-eshop-textPrimary" />
              </Link>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-eshop-bgCard rounded-3xl border border-eshop-borderSubtle p-16 text-center shadow-inner">
          <Package className="w-20 h-20 text-eshop-textDisabled mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-eshop-textPrimary mb-3">No hay categorías todavía</h2>
          <p className="text-eshop-textSecondary mb-8 max-w-md mx-auto">Estamos preparando una selección especial para ti. Vuelve pronto para descubrir nuestras novedades.</p>
          <Link href="/tienda" className="inline-block px-8 py-3.5 bg-eshop-buttonBase text-eshop-textDark font-bold rounded-xl hover:bg-eshop-buttonHover transition-all shadow-md">
            Ir a la tienda principal
          </Link>
        </div>
      )}

      {/* CTA de Ayuda Personalizada */}
      <div className="my-10 bg-eshop-bgCard border border-eshop-borderEmphasis rounded-3xl p-8 text-center relative overflow-hidden">
        {/* Adorno decorativo de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-eshop-accent opacity-5 rounded-full -mr-16 -mt-16" />
        
        <h2 className="text-2xl font-bold text-eshop-textPrimary mb-4">¿Buscas algo específico?</h2>
        <p className="text-eshop-textSecondary mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
          Si no encuentras lo que necesitas, nuestro equipo puede ayudarte a localizar el producto ideal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tienda" className="px-6 py-3 bg-eshop-buttonBase text-eshop-textDark font-bold rounded-xl hover:bg-eshop-buttonHover transition-all shadow-lg active:scale-95">
            Explorar Catálogo Completo
          </Link>
        </div>
      </div>
    </Container>
  );
}