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

// ─── Sub-componente de tallas (controlado) ───────────────────────────────────
interface TallasSectionProps {
  tallas?: string[];
  seleccionada: string | null;
  onChange: (talla: string | null) => void;
}

function TallasSection({ tallas, seleccionada, onChange }: TallasSectionProps) {
  const tipo = detectarTipo(tallas);

  if (tipo === "ninguna") return null;

  if (tipo === "unica") {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-eshop-textSecondary uppercase tracking-widest">
          Talla
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-eshop-accent bg-eshop-goldLight/20 text-eshop-textPrimary text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-eshop-accent inline-block" />
          Talla única
        </div>
      </div>
    );
  }

  const label = tipo === "calzado" ? "Número" : "Talla";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-eshop-textSecondary uppercase tracking-widest">
          {label}
        </p>
        {seleccionada && (
          <span className="text-sm font-bold text-eshop-accent">
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
              onClick={() => onChange(activa ? null : talla)}
              className={`
                ${tipo === "calzado" ? "w-12 md:w-10 h-12 md:h-10" : "px-4 py-2"}
                rounded-lg border-2 font-bold text-sm hoverEffect
                ${activa
                  ? "border-eshop-accent bg-eshop-goldLight/20 text-eshop-textPrimary shadow-md shadow-eshop-goldLight/30 scale-105"
                  : "border-eshop-goldDeep bg-eshop-formsBackground text-eshop-textSecondary"
                }
              `}
            >
              {talla}
            </button>
          );
        })}
      </div>

      {!seleccionada && (
        <p className="text-xs text-eshop-textDisabled">
          Selecciona una {label.toLowerCase()} para continuar
        </p>
      )}
    </div>
  );
}

// ─── Sub-componente de colores (controlado) ──────────────────────────────────
interface ColoresSectionProps {
  colores?: string[];
  seleccionado: string | null;
  onChange: (color: string | null) => void;
}

function ColoresSection({ colores, seleccionado, onChange }: ColoresSectionProps) {
  if (!colores || colores.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-eshop-textSecondary uppercase tracking-widest">
          Color
        </p>
        {seleccionado && (
          <span className="text-sm font-bold text-eshop-accent">
            Seleccionado: {seleccionado}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {colores.map((color) => {
          const activo = seleccionado === color;
          return (
            <button
              key={color}
              onClick={() => onChange(activo ? null : color)}
              className={`
                px-4 py-2 rounded-lg border-2 font-semibold text-sm hoverEffect
                ${activo
                  ? "border-eshop-accent bg-eshop-goldLight/20 text-eshop-textPrimary shadow-md shadow-eshop-goldLight/30 scale-105"
                  : "border-eshop-goldDeep bg-eshop-formsBackground text-eshop-textSecondary"
                }
              `}
            >
              {color}
            </button>
          );
        })}
      </div>

      {!seleccionado && (
        <p className="text-xs text-eshop-textDisabled">
          Selecciona un color para continuar
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function ProductView({ product }: Props) {
    const [mainImage, setMainImage] = useState(product.imagenes?.[0]);

    // ── Estado elevado de talla y color ──────────────────────────────────────
    const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
    const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);

    const tipoTalla    = detectarTipo(product.tallas);
    const tieneTallas  = tipoTalla !== "ninguna";
    const tieneColores = (product.colores?.length ?? 0) > 0;

    // Talla única: se auto-selecciona sin interacción del usuario
    const tallaEfectiva = tipoTalla === "unica" ? "única" : tallaSeleccionada;

    // Solo bloquear si hay opciones que requieren selección explícita
    const tallaPendiente     = tieneTallas  && tipoTalla !== "unica" && !tallaSeleccionada;
    const colorPendiente     = tieneColores && !colorSeleccionado;
    const seleccionPendiente = tallaPendiente || colorPendiente;

    const getStockInfo = (stock: number) => {
        if (stock <= 0) return { label: "Sin stock",          color: "text-eshop-textDisabled" };
        if (stock <= 2) return { label: "¡Últimas unidades!", color: "text-eshop-textError font-bold"   };
        if (stock < 10) return { label: "¡Pocas unidades!",   color: "text-eshop-textWarning font-bold" };
        return              { label: "En stock",              color: "text-eshop-cart font-bold" };
    };

    const stockInfo = getStockInfo(product.stock);

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                {/* ── GALERÍA ─────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="aspect-square relative bg-eshop-textDisabled rounded-xl overflow-hidden shadow-sm">
                        {mainImage && (
                            <Image src={mainImage} alt={product.nombre} fill className="object-cover" priority />
                        )}
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.imagenes?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 shrink-0 relative rounded-lg border-2 overflow-hidden hoverEffect ${
                                    mainImage === img
                                        ? 'border-eshop-accent scale-95'
                                        : 'border-eshop-goldDeep'
                                }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── INFO ────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-eshop-textPrimary">
                        {product.nombre}
                    </h1>

                    <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-eshop-accent">
                            ${product.precio.toLocaleString("es-CO")}
                        </p>
                    </div>

                    {/* Stock */}
                    <p className={`text-sm ${stockInfo.color}`}>
                        {stockInfo.label}
                    </p>

                    {/* Descripción desktop */}
                    <p className="text-eshop-textSecondary pb-2 border-eshop-goldDeep hidden md:block">
                        Descripción: {product.descripcion}
                    </p>

                    {/* ── TALLAS + COLORES ─────────────────────────────── */}
                    {(tieneTallas || tieneColores) && (
                        <div className="flex flex-col gap-4 py-3 border-y border-eshop-goldDeep">
                            <TallasSection
                                tallas={product.tallas}
                                seleccionada={tallaSeleccionada}
                                onChange={setTallaSeleccionada}
                            />
                            <ColoresSection
                                colores={product.colores}
                                seleccionado={colorSeleccionado}
                                onChange={setColorSeleccionado}
                            />
                        </div>
                    )}

                    {/* Aviso si falta seleccionar algo */}
                    {seleccionPendiente && (
                        <p className="text-xs text-eshop-textError font-semibold -mt-1">
                            👆{" "}
                            {tallaPendiente && colorPendiente
                                ? "Selecciona una talla y un color"
                                : tallaPendiente
                                ? "Selecciona una talla"
                                : "Selecciona un color"}{" "}
                            antes de agregar al carrito
                        </p>
                    )}

                    <div className="flex gap-3">
                        <AddToCar
                            product={product}
                            tallaSeleccionada={tallaEfectiva}
                            colorSeleccionado={colorSeleccionado}
                            disabled={seleccionPendiente}
                        />
                        <AddToFav product={product} />
                    </div>

                    <ProductTags />

                    {/* Descripción mobile */}
                    <p className="text-eshop-textSecondary mt-4 pb-2 border-b-2 border-eshop-goldDeep block md:hidden">
                        Descripción: {product.descripcion}
                    </p>

                    <SimilarProducts currentProduct={product} maxProducts={4} />
                </div>
            </div>
        </>
    );
}