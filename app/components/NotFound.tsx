"use client";

import React from "react";
import Link from "next/link";
import Container from "@/app/components/Container";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-eshop-bgMain">
      <Container>
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* El Número 404 con estilo Eshop */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[120px] md:text-[180px] font-black leading-none text-eshop-textPrimary italic tracking-tighter opacity-10">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-6xl font-black text-eshop-textPrimary uppercase tracking-tighter">
                Página <span className="text-eshop-goldDeep italic">No Encontrada</span>
              </h2>
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-6 mb-12">
            <p className="text-lg md:text-xl text-eshop-textSecondary font-medium leading-relaxed">
              Lo sentimos, pero el contenido que buscas ha sido movido, eliminado o nunca existió. 
              <span className="block mt-2 text-eshop-textPrimary font-bold uppercase text-sm tracking-widest">
                ¿Deseas volver al inicio y empezar de nuevo?
              </span>
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-eshop-buttonBase text-white rounded-xl font-bold uppercase text-sm tracking-[0.2em] hover:bg-eshop-buttonHover transition-all shadow-xl hoverEffect"
            >
              <Home size={18} />
              Volver al Inicio
            </Link>
          </div>

          {/* Línea decorativa inferior */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 bg-eshop-goldDeep/30"></div>
            <Search size={20} className="text-eshop-goldDeep" />
            <div className="h-[2px] w-12 bg-eshop-goldDeep/30"></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;