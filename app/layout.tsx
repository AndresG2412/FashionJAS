// app/layout.tsx — limpio, sin AuthSync
import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "FashionJAS - Tienda Virtual",
  description: "Tu mejor opcion de tienda virtual en Mocoa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className="dark" style={{ colorScheme: 'dark' }}>
        <body className="antialiased">
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}