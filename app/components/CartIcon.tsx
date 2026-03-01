"use client";

import useStore from '@/store';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const CartIcon = () => {
  const { cartItems } = useStore();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Link href="/cart" className="group relative">
      <ShoppingBag className="w-5 h-5 hover:text-danashop-brandSoft transition-colors" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-danashop-brandMain text-danashop-textPrimary h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;