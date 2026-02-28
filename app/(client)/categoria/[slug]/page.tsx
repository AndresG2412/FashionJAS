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
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-blue-600 transition-colors">
            Tienda
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.titulo}</span>
        </nav>

        {/* Header de categoría */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <Tag className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex w-full justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {category.titulo}
                </h1>
                {category.descripcion && (
                  <p className="text-gray-600 text-lg">
                    {category.descripcion}
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-center gap-y-4">
                <div className='justify-end flex items-center gap-1'>
                  <ArrowLeft className="w-5 h-5 text-red-500" />
                  <Link href="/categoria" className='font-semibold text-red-500'>Volver Atras</Link>
                </div>
                <div className='flex justify-end items-center gap-2'>
                  <Package className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-600 font-medium">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No hay productos en esta categoría
            </h2>
            <p className="text-gray-600 mb-6">
              Pronto agregaremos productos de {category.titulo}
            </p>
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </Container>
    </div>
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
    title: `${category.titulo} - GaboShop`,
    description: category.descripcion || `Explora nuestra selección de ${category.titulo}`,
  };
}