"use client";

import { Productos } from '@/lib/firebase/products';
import { ShoppingBag, Plus, X } from 'lucide-react';
import useStore from '@/store';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { useUser } from '@clerk/nextjs';

interface Props {
  product: Productos;
  className?: string;
}

const AddToCar = ({ product, className }: Props) => {
  const { addToCart, removeFromCart, getItemCount } = useStore();
  const { user } = useUser();
  const itemCount = getItemCount(product.id);
  const isOutOfStock = product.stock === 0;
  const isInCart = itemCount > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    await addToCart(product, user?.id);
    toast.success('¡Agregado al carrito!', {
      duration: 2000,
    });
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await removeFromCart(product.id, user?.id);
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
        className={`w-full py-2 px-3 bg-danashop-brandHover hover:bg-danashop-brandHover/50 tracking-wider text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-shop_light_green transition-all duration-300 shadow-sm ${className}`}
      >
        <ShoppingBag className="w-4 h-4" />
        Agregar
      </motion.button>
    );
  }

  // Si está en el carrito - Mostrar dos botones
  return (
    <div className="w-full flex gap-2">

      {/* Botón Quitar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleRemoveFromCart}
        className="flex-1 py-2 px-2 bg-red-500 text-danashop-textPrimary rounded-lg font-semibold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1 hover:bg-red-600 transition-all duration-300 shadow-sm"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="inline">Quitar</span>
      </motion.button>
    </div>
  );
};

export default AddToCar;