"use client";

import useStore from '@/store';
import { Send } from 'lucide-react';
import Link from 'next/link';

const OrdersButton = () => {
  const { cartItems } = useStore();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Link href="/pedidos" className="group relative">
      <Send className="w-5 h-5 hover:text-eshop-textHover hoverEffect" />
    </Link>
  );
};

export default OrdersButton;