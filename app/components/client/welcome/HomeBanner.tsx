// HomeBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Title } from "../../ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1, banner_2, banner_3 } from "../../../images";
import { cn } from "@/lib/utils";

const banners = [
  {
    image: banner_1,
    tag: "Nueva colección",
    title: <>Conoce nuestros <br /> productos exclusivos</>,
    subtitle: "Y enamórate de ellos",
  },
  {
    image: banner_2,
    tag: "Mejores precios",
    title: <>Elige todo lo <br /> que necesites</>,
    subtitle: "Encuentra las mejores ofertas",
  },
  {
    image: banner_3,
    tag: "Envíos a todo Colombia",
    title: <>Envíos rápidos <br /> desde Mocoa</>,
    subtitle: "Con envío gratuito incluido",
  },
];

const HomeBanner = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
        setFading(false);
      }, 400);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const { image, tag, title, subtitle } = banners[current];

  const fadeClass = fading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0";

  return (
    <div className="mt-6 md:mt-0 bg-eshop-bannerHome border border-eshop-borderSubtle rounded-2xl overflow-hidden">

      {/* ── Desktop ── */}
      <div className="hidden md:flex items-center justify-between px-14 py-10 gap-8">

        {/* Texto */}
        <div className="flex flex-col gap-5 max-w-sm">

          {/* Tag */}
          <span className={cn(
            "self-start text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-eshop-borderEmphasis text-eshop-textSecondary transition-all duration-400",
            fadeClass
          )}>
            {tag}
          </span>

          {/* Título */}
          <Title className={cn(
            "text-eshop-textPrimary leading-tight transition-all duration-400",
            fadeClass
          )}>
            {title}
          </Title>

          {/* Subtítulo */}
          <p className={cn(
            "text-eshop-textSecondary text-sm tracking-wide transition-all duration-400",
            fadeClass
          )}>
            {subtitle}
          </p>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <Link
              href="/tienda"
              className="bg-eshop-buttonBase text-eshop-textDark px-6 py-2.5 rounded-full text-sm font-bold tracking-wider hover:bg-eshop-buttonHover hoverEffect"
            >
              Comprar Ahora
            </Link>
            <Link
              href="/tienda"
              className="text-eshop-textSecondary text-sm font-semibold hover:text-eshop-accent hoverEffect tracking-wide"
            >
              Ver colección →
            </Link>
          </div>

          {/* Indicadores */}
          <div className="flex gap-2 mt-1">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "bg-eshop-accent w-6"
                    : "bg-eshop-borderEmphasis w-2 hover:bg-eshop-textDisabled"
                )}
              />
            ))}
          </div>

        </div>

        {/* Imagen */}
        <div className={cn(
          "transition-all duration-400 flex justify-center items-end",
          fadeClass
        )}>
          <Image
            src={image}
            alt={`banner_${current + 1}`}
            className="w-64 md:w-80 object-contain drop-shadow-sm"
            priority
          />
        </div>

      </div>

      {/* ── Móvil ── */}
      <div className="md:hidden flex flex-col">

        {/* Franja superior: imagen + texto */}
        <div className="flex items-center gap-4 px-5 pt-6 pb-4">

          <div className={cn(
            "transition-all duration-400 shrink-0",
            fadeClass
          )}>
            <Image
              src={image}
              alt={`banner_${current + 1}`}
              className="h-28 w-auto object-contain"
              priority
            />
          </div>

          <div className={cn(
            "flex flex-col gap-1.5 transition-all duration-400",
            fadeClass
          )}>
            <span className="text-xs font-semibold tracking-widest uppercase text-eshop-accent">
              {tag}
            </span>
            <Title className="text-eshop-textPrimary text-lg leading-snug">
              {title}
            </Title>
            <p className="text-eshop-textSecondary text-xs tracking-wide">
              {subtitle}
            </p>
          </div>

        </div>

        {/* Franja inferior: botón + indicadores */}
        <div className="flex items-center justify-between px-5 pb-5 gap-4">
          <Link
            href="/tienda"
            className="bg-eshop-buttonBase text-eshop-textDark px-5 py-2 rounded-full text-sm font-bold tracking-wider hover:bg-eshop-buttonHover hoverEffect"
          >
            Comprar Ahora
          </Link>

          <div className="flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "bg-eshop-accent w-6" : "bg-eshop-borderEmphasis w-2"
                )}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default HomeBanner;