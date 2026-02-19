import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/firebase/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Imagen del producto */}
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          {product?.images && product.images[0] && (
            <Image 
              src={product.images[0]}
              alt={product?.name || "Product"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
        </div>

        {/* Información del producto - flex-grow para que ocupe espacio restante */}
        <div className="p-4 flex flex-col grow">
          {/* Nombre con altura fija de 2 líneas */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-10">
            {product.name}
          </h3>
          
          {/* Espaciador que empuja el contenido inferior hacia abajo */}
          <div className="grow"></div>
          
          <div className="flex items-center justify-between mt-2">
            <div className='flex gap-1'>
                <p className="text-lg font-bold text-blue-600">
                    ${product.price}
                </p>
                <p className='text-lg font-semibold'>COL</p>
            </div>
            
            {/* Badge de stock */}
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-medium">
                En Venta
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                Agotado
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;