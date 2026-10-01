"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { looks } from "../../constants/homeData";
import Reveal from "./Reveal";

const LooksSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-fashion-cream text-fashion-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-fashion-fuchsia font-semibold tracking-[0.25em] uppercase text-sm">
            Inspírate
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
            Arma tu <span className="italic">outfit</span>
          </h2>
          <p className="mt-4 text-fashion-mist text-lg">
            Tres estilos pensados para tu día a día.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {looks.map((look, i) => (
            <Reveal key={look.title} delay={i * 0.1}>
              <Link
                href={`/categoria/${look.categorySlug}`}
                className="group block relative overflow-hidden rounded-3xl aspect-[3/4]"
                aria-label={`Armar outfit ${look.title}`}
              >
                <Image
                  src={look.image}
                  alt={`Look ${look.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fashion-ink/85 via-fashion-ink/20 to-transparent" />

                {/* índice decorativo */}
                <span className="absolute top-5 right-5 font-display italic text-5xl text-fashion-gold/60">
                  0{i + 1}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs tracking-widest uppercase text-fashion-goldsoft mb-1">
                    {look.mood}
                  </p>
                  <h3 className="font-display text-3xl font-bold text-fashion-cream">
                    {look.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fashion-cream opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Ver piezas
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LooksSection;
