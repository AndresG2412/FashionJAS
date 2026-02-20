"use client";

import { Product } from '@/lib/firebase/products';
import { ShoppingBag, Plus, X } from 'lucide-react';
import useStore from '@/store';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

interface Props {
  product: Product;
  className?: string;
}

const AddToCar = ({ product, className }: Props) => {
  const { addToCart, removeFromCart, getItemCount } = useStore();
  const itemCount = getItemCount(product.id);
  const isOutOfStock = product.stock === 0;
  const isInCart = itemCount > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    addToCart(product);
    toast.success('¡Agregado al carrito!', {
      duration: 2000,
    });
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    removeFromCart(product.id);
    toast.success('Eliminado del carrito', {
      duration: 2000,
    });
  };

  // Si está agotado
  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`w-full py-2 px-3 bg-gray-300 text-gray-500 rounded-lg font-semibold text-sm cursor-not-allowed ${className}`}
      >
        Agotado
      </button>
    );
  }

  // Si no está en el carrito
  if (!isInCart) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        className={`w-full py-2 px-3 bg-shop_dark_green text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-shop_light_green transition-all duration-300 shadow-sm ${className}`}
      >
        <ShoppingBag className="w-4 h-4" />
        Agregar
      </motion.button>
    );
  }

  // Si está en el carrito - Mostrar dos botones
  return (
    <div className="w-full flex gap-2">
      {/* Botón Agregar más */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        className="flex-1 py-2 px-2 bg-green-600 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 hover:bg-green-700 transition-all duration-300 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Agregar</span>
        {/* <span className="sm:hidden">+1</span> */}
        {itemCount > 0 && (
          <span className="ml-1 bg-green-700 text-white text-xs px-1.5 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Botón Quitar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleRemoveFromCart}
        className="flex-1 py-2 px-2 bg-red-500 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 hover:bg-red-600 transition-all duration-300 shadow-sm"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Quitar</span>
        {/* <span className="sm:hidden">✕</span> */}
      </motion.button>
    </div>
  );
};

export default AddToCar;