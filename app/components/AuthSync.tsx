"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import useStore from '@/store';

export default function AuthSync() {
  const { isSignedIn, user } = useUser();
  const loadFavorites = useStore((state) => state.loadFavorites);
  const clearFavorites = useStore((state) => state.clearFavorites);
  const favoritesLoaded = useStore((state) => state.favoritesLoaded);

  React.useEffect(() => {
    if (isSignedIn && user && !favoritesLoaded) {
      loadFavorites(user.id);
    } else if (!isSignedIn) {
      clearFavorites();
    }
  }, [isSignedIn, user?.id, favoritesLoaded, loadFavorites, clearFavorites]);

  return null;
}