import Container from '@/app/components/Container';
import Link from 'next/link';
import { Tag, Home } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Tag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Categoría no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La categoría que buscas no existe o fue eliminada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </Container>
  );
}