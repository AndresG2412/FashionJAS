"use client";

import { useEffect, useState } from "react";
import { Productos } from "@/lib/firebase/products";
import { ShoppingBag, X } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import { motion } from "motion/react";

interface Props {
  product: Productos;
  className?: string;
  tallaSeleccionada?: string | null;
  colorSeleccionado?: string | null;
  disabled?: boolean;
}

const AddToCar = ({
  product,
  className,
  tallaSeleccionada,
  colorSeleccionado,
  disabled = false,
}: Props) => {
  const { addToCart, removeFromCart, getItemCount } = useStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const itemCount   = getItemCount(product.id);
  const isOutOfStock = product.stock === 0;
  const isInCart    = itemCount > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || disabled) return;

    await addToCart(product, tallaSeleccionada, colorSeleccionado);
    toast.success("¡Agregado al carrito!", { duration: 2000 });
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeFromCart(product.id);
    toast.success("Eliminado del carrito", { duration: 2000 });
  };

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

  if (!isInCart) {
    return (
      <motion.button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full py-2 px-3 bg-eshop-cart hover:bg-eshop-cartHover tracking-wider text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hoverEffect shadow-sm transition-opacity ${
          disabled ? "opacity-40 cursor-not-allowed hover:bg-eshop-cart" : ""
        } ${className}`}
      >
        <ShoppingBag className="w-4 h-4" />
        Comprar
      </motion.button>
    );
  }

  return (
    <div className="w-full flex gap-2">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleRemoveFromCart}
        className="flex-1 py-2 px-2 bg-eshop-cancelCart text-white rounded-lg font-semibold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1 hover:bg-eshop-cancelCartHover transition-all duration-300 shadow-sm"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Quitar</span>
      </motion.button>
    </div>
  );
};

export default AddToCar;  