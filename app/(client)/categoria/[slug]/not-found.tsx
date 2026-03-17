import Container from '@/app/components/Container';
import Link from 'next/link';
import { Tag, Home, Store } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <Container className="flex flex-col justify-center mt-24 bg-eshop-bgMain">
      <div className="max-w-md mx-auto text-center">
        {/* Círculo del icono en beige suave con icono dorado */}
        <div className="w-20 h-20 bg-eshop-bgCard border border-eshop-borderSubtle rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Tag className="w-10 h-10 text-eshop-accent" />
        </div>

        <h1 className="text-3xl font-bold text-eshop-textPrimary mb-3">
          Categoría no encontrada
        </h1>
        
        <p className="text-eshop-textSecondary mb-8 font-medium">
          La categoría que buscas no existe o fue eliminada de nuestro catálogo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Botón Principal: Dorado con texto claro */}
          <Link
            href="/"
            className="inline-flex group items-center justify-center gap-2 px-6 py-3 bg-eshop-buttonBase text-eshop-textDark font-bold rounded-xl hover:bg-eshop-buttonHover shadow-md transition-all active:scale-95"
          >
            <div className='flex gap-x-2 group-hover:scale-105 items-center justify-center transition-transform duration-300'>
              <Home className="w-5 h-5" />
              <p>Ir al inicio</p>
            </div>
          </Link>

          {/* Botón Secundario: Blanco con borde dorado */}
          <Link
            href="/tienda"
            className="inline-flex group items-center justify-center gap-2 px-6 py-3 bg-eshop-bgWhite border-2 border-eshop-borderEmphasis text-eshop-textPrimary font-bold rounded-xl hover:bg-eshop-bgCard transition-all active:scale-95"
          >
            <div className='flex gap-x-2 group-hover:scale-105 items-center justify-center transition-transform duration-300'>
              <Store className="w-5 h-5 text-eshop-accent" />
              <p>Ver Tienda</p>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
}