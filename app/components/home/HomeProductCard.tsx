"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Productos } from "@/lib/firebase/products";
import AddToFav from "../AddToFav";
import AddToCar from "../AddToCar";
import { cn } from "@/lib/utils";

export type HomeProduct = Productos & { tag?: "Nuevo" | "Más vendido" | "Últimas unidades" };

const tagStyles: Record<string, string> = {
  "Nuevo": "bg-fashion-fuchsia text-white",
  "Más vendido": "bg-fashion-gold text-fashion-ink",
  "Últimas unidades": "bg-fashion-wine text-white",
};

const HomeProductCard = ({ product }: { product: HomeProduct }) => {
  const requiereSeleccion =
    (product.tallas && product.tallas.length > 0) ||
    (product.colores && product.colores.length > 0);

  const formatPrice = (value: number) =>
    "$" + value.toLocaleString("es-CO");

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-fashion-beige/50 transition-all duration-300 flex flex-col h-full">
      {/* etiqueta */}
      {product.tag && (
        <span
          className={cn(
            "absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase",
            tagStyles[product.tag]
          )}
        >
          {product.tag}
        </span>
      )}

      {/* favorito */}
      <div className="z-20">
        <AddToFav product={product} iconOnly />
      </div>

      {/* imagen */}
      <Link href={`/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-fashion-beige">
        {product?.imagenes?.[0] && (
          <Image
            src={product.imagenes[0]}
            alt={product?.nombre || "Producto FashionJAS"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        )}
        {/* vista rápida en hover */}
        <div className="absolute inset-0 bg-fashion-ink/0 group-hover:bg-fashion-ink/25 transition-colors duration-300 flex items-end justify-center pb-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-fashion-cream bg-fashion-ink/80 backdrop-blur px-5 py-2.5 rounded-full translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Eye className="w-4 h-4" />
            Vista rápida
          </span>
        </div>
      </Link>

      {/* info */}
      <div className="p-4 flex flex-col grow">
        <Link href={`/${product.slug}`}>
          <h3 className="text-sm font-semibold text-fashion-ink line-clamp-2 min-h-10 hover:text-fashion-fuchsia transition-colors">
            {product.nombre}
          </h3>
        </Link>

        <div className="grow" />

        <p className="mt-2 font-display text-lg font-bold text-fashion-ink">
          {formatPrice(product.precio)}
        </p>

        <div className="mt-3">
          {requiereSeleccion ? (
            <Link
              href={`/${product.slug}`}
              className="w-full py-2.5 px-3 bg-fashion-ink hover:bg-fashion-fuchsia text-fashion-cream rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              Observar
            </Link>
          ) : (
            <AddToCar product={product} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
