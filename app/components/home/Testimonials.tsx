"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Quote, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { testimonials, trustBadges } from "../../constants/homeData";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <section className="py-16 lg:py-24 bg-fashion-cream text-fashion-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-fashion-fuchsia font-semibold tracking-[0.25em] uppercase text-sm">
            Testimonios
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
            Ellas ya viven su estilo <span className="italic">FashionJAS</span>
          </h2>
        </Reveal>

        {/* Carrusel */}
        <Reveal delay={0.1}>
          <div className="relative max-w-3xl mx-auto">
            <div className="relative rounded-3xl bg-white border border-fashion-beige/60 shadow-xl shadow-fashion-wine/5 p-8 md:p-12 text-center overflow-hidden">
              <Quote className="w-10 h-10 text-fashion-gold mx-auto mb-4" />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-lg md:text-2xl leading-relaxed text-fashion-ink font-medium">
                    “{current.text}”
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < current.rating
                            ? "fill-fashion-gold text-fashion-gold"
                            : "text-fashion-beige"
                        )}
                      />
                    ))}
                  </div>
                  <footer className="mt-4">
                    <p className="font-bold text-fashion-ink">{current.name}</p>
                    <p className="text-sm text-fashion-mist">{current.city}</p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* controles */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                aria-label="Testimonio anterior"
                className="p-2.5 rounded-full border border-fashion-beige bg-white text-fashion-ink hover:bg-fashion-ink hover:text-fashion-cream transition-colors"
              >
                <span className="block w-3 h-3 border-l-2 border-b-2 -rotate-45 translate-y-0.5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Testimonio ${i + 1}`}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index ? "w-7 bg-fashion-fuchsia" : "w-2 bg-fashion-beige"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
                aria-label="Siguiente testimonio"
                className="p-2.5 rounded-full border border-fashion-beige bg-white text-fashion-ink hover:bg-fashion-ink hover:text-fashion-cream transition-colors"
              >
                <span className="block w-3 h-3 border-r-2 border-t-2 rotate-45 -translate-y-0.5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* sellos de confianza */}
        <Reveal delay={0.2} className="mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-fashion-ink text-fashion-cream px-5 py-4">
              <MessageCircle className="w-6 h-6 text-fashion-gold" />
              <span className="font-semibold">Atendemos por WhatsApp</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-fashion-ink text-fashion-cream px-5 py-4">
              <ShieldCheck className="w-6 h-6 text-fashion-gold" />
              <span className="font-semibold">Compra protegida</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-fashion-ink text-fashion-cream px-5 py-4">
              <Truck className="w-6 h-6 text-fashion-gold" />
              <span className="font-semibold">Envíos nacionales</span>
            </div>
          </div>
          <p className="text-center text-fashion-mist text-sm mt-6">{trustBadges.join(" · ")}</p>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;
