"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { loadFavorites, favoritesLoaded } = useStore();

  useEffect(() => {
    // Cargar favoritos cuando el usuario inicie sesión
    if (isLoaded && user && !favoritesLoaded) {
      loadFavorites(user.id);
    }
  }, [user, isLoaded, favoritesLoaded, loadFavorites]);

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