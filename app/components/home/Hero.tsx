"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Truck, ShieldCheck, MessageCircle } from "lucide-react";

const heroMain = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80";
const heroSecondary = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80";
const heroTertiary = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80";

const floatingCards = [
  { icon: Truck, title: "Envíos nacionales", sub: "A toda Colombia" },
  { icon: ShieldCheck, title: "Pago seguro", sub: "100% protegido" },
  { icon: MessageCircle, title: "Atención por WhatsApp", sub: "Te asesoramos" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-fashion-ink text-fashion-cream">
      {/* decoración de fondo */}
      <div className="absolute inset-0 grain-dark" />
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-fashion-fuchsia/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-fashion-gold/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
        {/* ── Columna de texto ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fashion-gold/40 bg-fashion-gold/10 text-fashion-goldsoft text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-fashion-fuchsia animate-pulse" />
            Nueva colección 2026
          </span>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
            Tu estilo
            <br />
            <span className="italic text-gradient-gold">empieza aquí.</span>
          </h1>

          <p className="mt-6 text-fashion-mist text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Prendas que resaltan tu esencia, pensadas para cada momento de tu vida.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/tienda"
              className="group inline-flex items-center gap-2 bg-fashion-fuchsia hover:bg-fashion-rose text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-fashion-fuchsia/30 hover:shadow-fashion-rose/40 hover:-translate-y-0.5"
            >
              Comprar colección
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/categoria"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-fashion-cream/25 text-fashion-cream hover:bg-fashion-cream/10 font-semibold transition-all"
            >
              Explorar categorías
            </Link>
          </div>

          {/* tarjetas flotantes */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                className="flex items-center gap-3 bg-fashion-coal/80 backdrop-blur border border-fashion-cream/10 rounded-2xl px-4 py-3.5"
              >
                <card.icon className="w-5 h-5 text-fashion-gold shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{card.title}</p>
                  <p className="text-xs text-fashion-mist">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Columna visual (collage) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block h-[640px]"
        >
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-4">
            {/* imagen principal */}
            <div className="col-span-8 row-span-6 rounded-[2rem] overflow-hidden border border-fashion-cream/10 relative group">
              <Image
                src={heroMain}
                alt="Modelo FashionJAS luciendo la nueva colección"
                fill
                sizes="(max-width: 1024px) 0vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fashion-ink/50 to-transparent" />
            </div>
            {/* imagen secundaria */}
            <div className="col-span-4 row-span-3 rounded-3xl overflow-hidden border border-fashion-cream/10 relative group mt-6">
              <Image
                src={heroSecondary}
                alt="Look FashionJAS"
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
              />
            </div>
            {/* imagen terciaria */}
            <div className="col-span-4 row-span-3 rounded-3xl overflow-hidden border border-fashion-cream/10 relative group -mt-4">
              <Image
                src={heroTertiary}
                alt="Outfit FashionJAS"
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative hidden lg:flex justify-center pb-6"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-1 text-fashion-mist"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
