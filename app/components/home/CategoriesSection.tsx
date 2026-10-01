"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeCategories } from "../../constants/homeData";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

const CategoryCard = ({
  title,
  tagline,
  image,
  slug,
  className,
  spanFull = false,
}: {
  title: string;
  tagline: string;
  image: string;
  slug: string;
  className?: string;
  spanFull?: boolean;
}) => {
  return (
    <Link
      href={`/categoria/${slug}`}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-fashion-beige/60 bg-fashion-beige block",
        spanFull ? "h-full min-h-72" : "h-56",
        className
      )}
      aria-label={`Ver colección ${title}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-fashion-ink/80 via-fashion-ink/20 to-transparent transition-colors duration-500 group-hover:from-fashion-ink/90" />

      <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
        <div className="text-fashion-cream">
          <p className="text-xs tracking-widest uppercase text-fashion-goldsoft mb-1">{tagline}</p>
          <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-fashion-cream opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
          Ver colección
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};

const CategoriesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-fashion-cream text-fashion-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-fashion-fuchsia font-semibold tracking-[0.25em] uppercase text-sm">
            Categorías
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
            Encuentra tu próximo <span className="italic">look</span>
          </h2>
          <p className="mt-4 text-fashion-mist text-lg">
            Piezas seleccionadas para cada estilo y ocasión.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-fr">
            {homeCategories.map((cat) => {
              if (cat.featured) {
                return (
                  <div key={cat.slug} className="col-span-2 lg:col-span-6 lg:row-span-2 min-h-72">
                    <CategoryCard
                      title={cat.title}
                      tagline={cat.tagline}
                      image={cat.image}
                      slug={cat.slug}
                      spanFull
                    />
                  </div>
                );
              }
              return (
                <div key={cat.slug} className="col-span-1 lg:col-span-3">
                  <CategoryCard
                    title={cat.title}
                    tagline={cat.tagline}
                    image={cat.image}
                    slug={cat.slug}
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CategoriesSection;
