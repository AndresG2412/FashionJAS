"use client"

import React, { useState, useEffect } from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1, banner_2, banner_3 } from "../images";

const banners = [
  {
    image: banner_1,
    title: <>Conoce nuestros productos  <br /><p className="hidden md:block mt-3">Y enamorate de ellos!</p></>,
  },
  {
    image: banner_2,
    title: <>Elige todo lo que necesites <br /><p className="hidden md:block mt-3">encuentra los mejores precios!</p></>,
  },
  {
    image: banner_3,
    title: <>Envíos rápidos en Cali! <br /><p className="hidden md:block mt-3">y con evio gratuito!</p></>,
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

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const { image, title } = banners[current];

  return (
    <div className="mt-6 pb-6 md:mt-0 bg-danashop-focus rounded-lg px-4 md:px-24 flex flex-col md:flex-row items-center justify-between overflow-hidden gap-6">

      {/* TEXTO */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">

        <Title
          className={`text-danashop-textDark transition-opacity duration-400 hidden md:block ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {title}
        </Title>

        {/* BOTON */}
        <Link
          href={"/shop"}
          className="hidden md:in-line bg-danashop-textDark text-danashop-textPrimary/90 px-6 py-2 rounded-md text-sm font-bold tracking-wider hover:bg-danashop-brandHover hover:text-white hover:bg-shop_dark_green transition"
        >
          Comprar Ahora
        </Link>

        {/* INDICADORES */}
        <div className="gap-2 hidden md:flex">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-danashop-textDark w-5"
                  : "bg-danashop-textDark/30 w-2"
              }`}
            />
          ))}
        </div>

      </div>

      {/* IMAGEN */}
      <div
        className={`transition-opacity duration-400 justify-center hidden md:flex ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={image}
          alt={`banner_${current + 1}`}
          className="w-40 sm:w-56 md:w-72 object-contain"
          priority
        />
      </div>

      <div className="md:hidden flex gap-x-6 items-center justify-center w-full h-36 sm:h-40">

        {/* texto */}
        <Title
          className={`text-danashop-textDark transition-opacity duration-400 max-w-35 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {title}
        </Title>

        {/* imagen */}
        <div
          className={`transition-opacity duration-400 flex justify-center ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={image}
            alt={`banner_${current + 1}`}
            className="h-28 sm:h-32 w-auto object-contain"
            priority
          />
        </div>

      </div>

      <div className="md:hidden flex flex-col gap-y-6 items-center justify-center">
        {/* BOTON */}
          <Link
            href={"/shop"}
            className="bg-danashop-textDark text-danashop-textPrimary/90 px-6 py-2 rounded-md text-sm font-bold tracking-wider hover:bg-danashop-brandHover hover:text-white hover:bg-shop_dark_green transition"
          >
            Comprar Ahora
          </Link>

          {/* INDICADORES */}
          <div className="flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-danashop-textDark w-5"
                    : "bg-danashop-textDark/30 w-2"
                }`}
              />
            ))}
          </div>
      </div>

    </div>
  );
};

export default HomeBanner;