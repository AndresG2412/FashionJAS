"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProducts } from "@/lib/firebase/products";
import type { Productos } from "@/lib/firebase/products";
import { featuredProducts } from "../../constants/homeData";
import HomeProductCard, { type HomeProduct } from "./HomeProductCard";
import Reveal from "./Reveal";

const fallbackTags = ["Nuevo", "Más vendido", "Últimas unidades", "Nuevo"] as const;

const FeaturedProducts = () => {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getAllProducts();
        if (!active) return;
        if (data && data.length > 0) {
          setProducts(
            data.slice(0, 4).map((p: Productos, i: number) => ({
              ...p,
              tag: fallbackTags[i % fallbackTags.length],
            }))
          );
        } else {
          setProducts(featuredProducts as unknown as HomeProduct[]);
        }
      } catch {
        if (active) setProducts(featuredProducts as unknown as HomeProduct[]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white text-fashion-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-fashion-fuchsia font-semibold tracking-[0.25em] uppercase text-sm">
              Destacados
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Los favoritos de <span className="italic">FashionJAS</span>
            </h2>
          </div>
          <Link
            href="/tienda"
            className="group inline-flex items-center gap-2 font-semibold text-fashion-ink hover:text-fashion-fuchsia transition-colors"
          >
            Ver todos los productos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] skeleton-shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                  <div className="h-5 w-1/3 skeleton-shimmer rounded" />
                  <div className="h-9 w-full skeleton-shimmer rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <Reveal key={product.id}>
                <HomeProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
