import Container from '@/app/components/Container';
import Link from 'next/link';
import { Tag, Home, Store } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <Container className="flex flex-col justify-center mt-24">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Tag className="w-10 h-10 text-danashop-brandHover" />
        </div>
        <h1 className="text-3xl font-bold text-danashop-textPrimary mb-3">
          Categoría no encontrada
        </h1>
        <p className="text-danashop-textPrimary/70 mb-8">
          La categoría que buscas no existe o fue eliminada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex group items-center justify-center gap-2 px-6 py-3 bg-danashop-brandHover text-danashop-textPrimary font-medium rounded-lg hover:bg-danashop-brandHover/50 hoverEffect"
          >
            <div className='flex gap-x-2 group-hover:scale-105 group-hover:hovverEffect items-center justify-center transition-transform duration-300'>
              <Home className="w-5 h-5" />
              <p className=''>
                Ir al inicio
              </p>
            </div>
          </Link>
          <Link
            href="/tienda"
            className="inline-flex group items-center justify-center gap-2 px-6 py-3 text-danashop-textPrimary font-medium rounded-lg border-2 border-white hoverEffect"
          >
            <div className='flex gap-x-2 group-hover:scale-105 group-hover:hovverEffect items-center justify-center transition-transform duration-300'>
              <Store className="w-5 h-5" />
              <p className=''>
                Ver Tienda
              </p>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
}