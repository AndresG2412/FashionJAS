"use client";

import { Productos } from '@/lib/firebase/products';
import { Heart } from 'lucide-react';
import useStore from '@/store';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

interface Props {
  product: Productos;
  iconOnly?: boolean;
}

const AddToFav = ({ product, iconOnly = false }: Props) => {
  const { addToFavorite, isFavorite } = useStore();
  const isInFavorites = isFavorite(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToFavorite(product).then(() => {
      if (isInFavorites) {
        // Caso: El producto ya estaba y se quitó
        toast.success('Eliminado', {
          position: "top-center",
          duration: 1200,
        });
      } else {
        // Caso: El producto no estaba y se añadió
        toast.success('¡Añadido!', {
          position: "top-center",
          duration: 1200,
        });
      }
    });
  };

  if (iconOnly) {
    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-10"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isInFavorites ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </motion.button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`w-full py-2 px-4 border-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
        isInFavorites
          ? 'border-red-500 text-red-500 bg-red-50'
          : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
      }`}
    >
      <Heart
        className={`w-5 h-5 ${isInFavorites ? 'fill-red-500' : ''}`}
      />
      {isInFavorites ? 'En Favoritos' : 'Agregar a Favoritos'}
    </button>
  );
};

export default AddToFav;