import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/firebase/products';
import AddToFav from './AddToFav';
import AddToCar from './AddToCar';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      {/* Botón de favorito (ícono flotante) */}
      <AddToFav product={product} iconOnly />
      
      {/* Link a la página del producto (solo en imagen y nombre) */}
      <Link href={`/product/${product.slug}`}>
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
      </Link>

      {/* Información del producto */}
      <div className="p-4 flex flex-col grow">
        {/* Nombre con altura fija de 2 líneas */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-10 hover:text-shop_light_green transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Espaciador */}
        <div className="grow"></div>
        
        {/* Precio y Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className='flex gap-1 items-baseline'>
            <p className="text-lg font-bold text-blue-600">
              ${product.price}
            </p>
            <p className='text-sm font-semibold text-gray-500'>COL</p>
          </div>
          
          {/* Badge de stock */}
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              En Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
              Agotado
            </span>
          )}
        </div>

        {/* Botón de Agregar al Carrito */}
        <AddToCar product={product} />
      </div>
    </div>
  );
};

export default ProductCard;