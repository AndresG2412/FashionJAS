"use client";

import { Store } from 'lucide-react';
import Link from 'next/link';

const ShopButton = () => {
  
  return (
    <Link href="/" className="group relative">
      <Store className="w-7 h-7 hover:text-shop_light_green transition-colors" />
    </Link>
  );
};

export default ShopButton;