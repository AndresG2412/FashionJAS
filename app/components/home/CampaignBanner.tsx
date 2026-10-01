"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { campaign } from "../../constants/homeData";
import Reveal from "./Reveal";

const CampaignBanner = () => {
  return (
    <section className="py-16 lg:py-24 bg-fashion-beige text-fashion-ink relative overflow-hidden">
      <div className="absolute inset-0 pattern-editorial opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Columna visual */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative rounded-[2rem] overflow-hidden border border-fashion-gold/30 shadow-2xl shadow-fashion-wine/10 aspect-[4/5]">
            <Image
              src={campaign.image}
              alt="Campaña FashionJAS Nueva Colección"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* número decorativo tipo revista */}
          <span className="absolute -bottom-6 -right-2 font-display italic text-[120px] leading-none text-fashion-gold/30 select-none">
            26
          </span>
          {/* texto vertical */}
          <span className="absolute -left-8 top-1/2 -translate-y-1/2 vertical-rl text-xs tracking-[0.5em] uppercase text-fashion-wine/70 font-semibold">
            Nueva colección · 2026
          </span>
        </Reveal>

        {/* Columna de contenido */}
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-3 text-fashion-fuchsia font-semibold tracking-[0.25em] uppercase text-sm">
            <span className="h-px w-10 bg-fashion-fuchsia" />
            {campaign.kicker}
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold leading-[1.05]">
            {campaign.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic text-fashion-wine">
              {campaign.title.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="mt-6 text-fashion-mist text-lg leading-relaxed max-w-lg">
            {campaign.description}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {campaign.stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-fashion-gold pl-4">
                <p className="font-display text-3xl font-bold text-fashion-ink">{stat.value}</p>
                <p className="text-xs text-fashion-mist mt-1 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/tienda"
              className="group inline-flex items-center gap-2 bg-fashion-ink hover:bg-fashion-wine text-fashion-cream font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:-translate-y-0.5"
            >
              Ver novedades
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CampaignBanner;
