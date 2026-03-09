"use client";

import { Store } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ShopButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link href="/" className="group relative">
      <Store className="w-7 text-danashop-textPrimary h-7 hover:text-danashop-brandHover transition-colors" />
    </Link>
  );
};

export default ShopButton;