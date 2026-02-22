import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';
import useStore from '@/store';

export const metadata: Metadata = {
  title: "GaboShop - E-commerce",
  description: "Your favorite online shop",
};

import AuthSync from './components/AuthSync';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <AuthSync />
          {children}
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}