import { getAllCategoriesAdmin } from '@/lib/firebase/admin';
import Container from '@/app/components/Container';
import Link from 'next/link';
import { Tag, ArrowRight, Package } from 'lucide-react';

export const metadata = {
  title: 'Categorías - GaboShop',
  description: 'Explora todas nuestras categorías de productos',
};

export default async function CategoriasPage() {
  const categories = await getAllCategoriesAdmin();

  return (
      <Container>
        {/* Header */}
        <div className="mt-5 mb-10">
          <div className="flex items-center gap-3 mb-4">
            {/* Cambiado a brandSoft con opacidad y borde violeta */}
            <div className="w-12 h-12 bg-danashop-brandSoft/10 border-2 border-danashop-brandMain/30 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-danashop-brandMain" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-danashop-textPrimary">
                Todas las Categorías
              </h1>
              <p className="text-danashop-textSecondary mt-1">
                {categories.length} {categories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
              </p>
            </div>
          </div>
          <p className="text-lg text-danashop-textSecondary max-w-2xl">
            Explora nuestro catálogo organizado por categorías. Encuentra exactamente lo que buscas.
          </p>
        </div>

        {/* Grid de categorías */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="group border-2 border-danashop-brandSoft bg-danashop-bgColorCard rounded-2xl shadow-sm hover:shadow-xl hover:shadow-danashop-brandMain/10 hover:border-danashop-brandSoft/50 hoverEffect overflow-hidden h-full flex flex-col"
              >
                {/* Header */}
                <div className="bg-linear-to-br flex gap-x-2 items-center from-danashop-hover to-danashop-bgColorCard px-4 py-3 border-b border-danashop-borderColor min-h-[80px]">
                  
                  {/* Icono más compacto */}
                  <div className="w-10 h-10 bg-danashop-colorMain rounded-lg flex shadow-sm items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-danashop-borderColor">
                    <Tag className="w-5 h-5 text-danashop-brandMain" />
                  </div>

                  {/* Título más pequeño y controlado */}
                  <div className="text-lg font-semibold text-danashop-textPrimary group-hover:text-danashop-brandSoft hoverEffect leading-tight">
                    {category.titulo}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col gap-y-3  flex-1">
                  <p className="text-danashop-textPrimary/60 text-sm line-clamp-2 min-h-[40px]">
                    {category.descripcion || 'Explora nuestra selección de productos'}
                  </p>

                  {/* Footer empujado abajo */}
                  <div className="flex items-center justify-between text-danashop-brandSoft font-medium text-sm mt-auto">
                    <span className="group-hover:translate-x-1 transition-transform">
                      Ver productos
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Barra SIEMPRE pegada abajo */}
                <div className="h-1 bg-linear-to-r from-danashop-brandMain to-danashop-focus transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        ) : (
          /* Estado vacío - Adaptado a oscuro */
          <div className="bg-danashop-bgColorCard rounded-2xl border border-danashop-borderColor p-12 text-center">
            <Package className="w-16 h-16 text-danashop-textMuted mx-auto mb-4" />
            <h2 className="text-xl font-bold text-danashop-textPrimary mb-2">
              No hay categorías disponibles
            </h2>
            <p className="text-danashop-textSecondary mb-6">
              Pronto agregaremos categorías para organizar mejor nuestros productos
            </p>
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-danashop-brandMain text-white font-medium rounded-lg hover:bg-danashop-brandHover transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        )}

        {/* Call to action - Gradiente temático GaboShop (Violeta/Indigo) */}
        <div className="my-12 bg-linear-to-r from-danashop-brandMain to-danashop-brandHover rounded-2xl p-4 pb-6 text-center text-white shadow-lg shadow-danashop-brandMain/20">
          <h2 className="text-2xl font-bold mb-3">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-white/80 mb-6 max-w-3xl mx-auto">
            Explora todos nuestros productos o contáctanos para ayudarte a encontrar exactamente lo que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-white text-danashop-brandMain font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </Container>
  );
}