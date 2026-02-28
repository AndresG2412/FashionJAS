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
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Todas las Categorías
              </h1>
              <p className="text-gray-600 mt-1">
                {categories.length} {categories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
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
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden"
              >
                {/* Header con ícono */}
                <div className="bg-linear-to-br from-green-50 to-cyan-50 p-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Tag className="w-7 h-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.titulo}
                  </h2>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 min-h-10">
                    {category.descripcion || 'Explora nuestra selección de productos'}
                  </p>

                  {/* Footer con botón */}
                  <div className="flex items-center justify-between text-green-600 font-medium text-sm">
                    <span className="group-hover:translate-x-1 transition-transform">
                      Ver productos
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Barra de acento en hover */}
                <div className="h-1 bg-linear-to-r from-green-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        ) : (
          // Estado vacío
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No hay categorías disponibles
            </h2>
            <p className="text-gray-600 mb-6">
              Pronto agregaremos categorías para organizar mejor nuestros productos
            </p>
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        )}

        {/* Call to action */}
        <div className="my-12 bg-linear-to-r from-green-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Explora todos nuestros productos o contáctanos para ayudarte a encontrar exactamente lo que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
            >
              Ver todos los productos
            </Link>
            {/* <a
              href="https://wa.me/573157870130"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors border-2 border-green-500"
            >
              Contactar por WhatsApp
            </a> */}
          </div>
        </div>
      </Container>
  );
}