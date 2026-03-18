// app/(client)/layout.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";
import Header from "../components/client/header/Header";
import Footer from "../components/client/footer/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { 
    loadFavorites, loadCart, 
    clearFavorites, clearCart,
    favoritesLoaded, cartLoaded,
    setUserId
  } = useStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      setUserId(user.id);
      if (!favoritesLoaded) loadFavorites(user.id);
      if (!cartLoaded) loadCart(user.id);
    } else {
      // Cerró sesión — limpiar todo
      setUserId(null);
      clearFavorites();
      clearCart();
    }
  }, [user?.id, isLoaded]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}