"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import useStore from '@/store';

export default function AuthSync() {
  const { isSignedIn, user } = useUser();
  const loadFavorites = useStore((state) => state.loadFavorites);
  const loadCart = useStore((state) => state.loadCart);
  const clearFavorites = useStore((state) => state.clearFavorites);
  const clearCart = useStore((state) => state.clearCart);
  const favoritesLoaded = useStore((state) => state.favoritesLoaded);
  const cartLoaded = useStore((state) => state.cartLoaded);

  React.useEffect(() => {
    if (isSignedIn && user) {
      // Cargar favoritos y carrito cuando inicie sesión
      if (!favoritesLoaded) {
        loadFavorites(user.id);
      }
      if (!cartLoaded) {
        loadCart(user.id);
      }
    } else if (!isSignedIn) {
      // Limpiar cuando cierre sesión
      clearFavorites();
      clearCart();
    }
  }, [isSignedIn, user?.id, favoritesLoaded, cartLoaded, loadFavorites, loadCart, clearFavorites, clearCart]);

  return null;
}