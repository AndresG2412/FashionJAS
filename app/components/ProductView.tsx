"use client";

import Image from "next/image";
import { useState } from "react";
import type { Productos } from "@/lib/firebase/products";
import AddToCar from "./AddToCar";
import AddToFav from "./AddToFav";
import ProductTags from './ProductTags';
import SimilarProducts from './SimilarProducts';

interface Props {
  product: Productos;
}

// ─── Helpers de tallas ───────────────────────────────────────────────────────
const TALLAS_CALZADO = ["35","36","37","38","39","40","41","42","43","44","45","46"];

type TipoTalla = "ropa" | "calzado" | "unica" | "ninguna";

const detectarTipo = (tallas?: string[]): TipoTalla => {
  if (!tallas || tallas.length === 0) return "ninguna";
  if (tallas.includes("única")) return "unica";
  if (tallas.some(t => TALLAS_CALZADO.includes(t))) return "calzado";
  return "ropa";
};

// ─── Sub-componente de tallas ────────────────────────────────────────────────
function TallasSection({ tallas }: { tallas?: string[] }) {
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const tipo = detectarTipo(tallas);

  if (tipo === "ninguna") return null;

  if (tipo === "unica") {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-danashop-textSecondary uppercase tracking-widest">
          Talla
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-danashop-brandSoft bg-danashop-brandHover/20 text-danashop-textPrimary text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-danashop-brandSoft inline-block" />
          Talla única
        </div>
      </div>
    );
  }

  const label = tipo === "calzado" ? "Número" : "Talla";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-danashop-textSecondary uppercase tracking-widest">
          {label}
        </p>
        {seleccionada && (
          <span className="text-sm font-bold text-danashop-brandSoft">
            Seleccionado: {seleccionada}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tallas!.map((talla) => {
          const activa = seleccionada === talla;
          return (
            <button
              key={talla}
              onClick={() => setSeleccionada(activa ? null : talla)}
              className={`
                ${tipo === "calzado" ? "w-12 md:w-10 h-12 md:h-10" : "px-4 py-2"}
                rounded-lg border-2 font-bold text-sm transition-all duration-150
                ${activa
                  ? "border-danashop-brandSoft bg-danashop-brandHover text-danashop-textPrimary shadow-md shadow-danashop-brandHover/30 scale-105"
                  : "border-danashop-borderColor bg-danashop-bgColorCard text-danashop-textSecondary hover:border-danashop-brandSoft hover:text-danashop-textPrimary hover:bg-danashop-hover"
                }
              `}
            >
              {talla}
            </button>
          );
        })}
      </div>

      {!seleccionada && (
        <p className="text-xs text-danashop-textMuted">
          Selecciona una {label.toLowerCase()} para continuar
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function ProductView({ product }: Props) {
    const [mainImage, setMainImage] = useState(product.imagenes?.[0]);

    const getStockInfo = (stock: number) => {
        if (stock <= 0) return { label: "Sin stock",          color: "text-danashop-textDisabled" };
        if (stock <= 2) return { label: "¡Últimas unidades!", color: "text-danashop-error font-bold"   };
        if (stock < 10) return { label: "¡Pocas unidades!",   color: "text-danashop-warning font-bold" };
        return              { label: "En stock",              color: "text-danashop-success font-bold" };
    };

    const stockInfo = getStockInfo(product.stock);

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                {/* ── GALERÍA ─────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="aspect-square relative bg-danashop-disabled rounded-xl overflow-hidden shadow-sm">
                        {mainImage && (
                            <Image src={mainImage} alt={product.nombre} fill className="object-cover" priority />
                        )}
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.imagenes?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 shrink-0 relative rounded-lg border-2 overflow-hidden transition-all ${
                                    mainImage === img
                                        ? 'border-danashop-brandSoft scale-95'
                                        : 'border-danashop-borderColor hover:border-danashop-brandSoft/50'
                                }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── INFO ────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-danashop-textPrimary">
                        {product.nombre}
                    </h1>

                    <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-danashop-brandSoft">
                            ${product.precio.toLocaleString("es-CO")}
                        </p>
                    </div>

                    {/* Stock */}
                    <p className={`text-sm ${stockInfo.color}`}>
                        {stockInfo.label}
                    </p>

                    {/* Descripción desktop */}
                    <p className="text-danashop-textSecondary pb-2  border-danashop-borderColor hidden md:block">
                        Descripción: {product.descripcion}
                    </p>

                    {/* ── TALLAS ──────────────────────────────────────── */}
                    {product.tallas && product.tallas.length > 0 && (
                        <div className="py-3 border-y border-danashop-borderColor">
                            <TallasSection tallas={product.tallas} />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <AddToCar product={product} />
                        <AddToFav product={product} />
                    </div>

                    <ProductTags />

                    {/* Descripción mobile */}
                    <p className="text-danashop-textSecondary mt-4 pb-2 border-b-2 border-danashop-borderColor block md:hidden">
                        Descripción: {product.descripcion}
                    </p>

                    <SimilarProducts currentProduct={product} maxProducts={4} />
                </div>
            </div>
        </>
    );
}