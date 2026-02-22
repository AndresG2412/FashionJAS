"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import useStore from '@/store';

export default function AuthSync() {
  const { isSignedIn, user } = useUser();
  const setUserId = useStore((state) => state.setUserId);
  const loadFavorites = useStore((state) => state.loadFavorites);
  const clearFavorites = useStore((state) => state.clearFavorites);

  React.useEffect(() => {
    if (isSignedIn && user) {
      setUserId(user.id);
      loadFavorites(user.id);
    } else {
      setUserId(null);
      clearFavorites();
    }
  }, [isSignedIn, user?.id]);

  return null;
}
