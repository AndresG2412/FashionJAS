"use client";

import { Store } from 'lucide-react';
import Link from 'next/link';

const ShopButton = () => {
  
  return (
    <Link href="/" className="group relative">
      <Store className="w-7 text-danashop-textPrimary h-7 hover:text-danashop-brandHover transition-colors" />
    </Link>
  );
};

export default ShopButton;