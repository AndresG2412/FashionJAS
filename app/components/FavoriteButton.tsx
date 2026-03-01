"use client";

import useStore from '@/store';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const FavoriteButton = () => {
  const { favoriteItems } = useStore();
  
  return (
    <Link href="/favoritos" className="group relative">
      <Heart className="w-5 h-5 hover:text-danashop-brandSoft transition-colors" />
      {favoriteItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-danashop-brandMain text-danashop-textPrimary h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center">
          {favoriteItems.length}
        </span>
      )}
    </Link>
  );
};

export default FavoriteButton;