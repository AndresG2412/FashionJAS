"use client";

import React from "react";
import { Truck, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { benefits } from "../../constants/homeData";
import Reveal from "./Reveal";

const iconMap: Record<string, React.ElementType> = {
  Truck,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
};

const Benefits = () => {
  return (
    <section className="py-16 lg:py-24 bg-fashion-ink text-fashion-cream relative overflow-hidden">
      <div className="absolute inset-0 grain-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-fashion-gold/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-fashion-goldsoft font-semibold tracking-[0.25em] uppercase text-sm">
            Por qué FashionJAS
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
            Una experiencia <span className="italic text-gradient-gold">pensada para ti</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon] ?? Sparkles;
            return (
              <Reveal key={benefit.title} delay={i * 0.1}>
                <div className="group h-full rounded-3xl border border-fashion-cream/10 bg-fashion-coal/60 backdrop-blur p-8 transition-all duration-300 hover:border-fashion-gold/40 hover:-translate-y-1.5">
                  <div className="w-14 h-14 rounded-2xl bg-fashion-gold/10 border border-fashion-gold/30 flex items-center justify-center mb-6 group-hover:bg-fashion-fuchsia/20 group-hover:border-fashion-fuchsia/40 transition-colors">
                    <Icon className="w-7 h-7 text-fashion-gold group-hover:text-fashion-fuchsia transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-fashion-mist leading-relaxed">{benefit.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
