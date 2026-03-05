"use client";

import React, { useState } from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "../constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:contents">
      {/* Botón acordeón — solo visible en móvil */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden w-full flex items-center justify-between py-3 border-b border-danashop-textSecondary/20 text-danashop-textPrimary"
      >
        <span className="font-bold tracking-wider uppercase text-sm">{title}</span>
        <ChevronDown
          size={18}
          className={cn(
            "text-danashop-brandSoft transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Contenido — en móvil se despliega, en desktop siempre visible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:overflow-visible md:block",
          open ? "max-h-96" : "max-h-0 md:max-h-none"
        )}
      >
        {/* Título decorativo solo en desktop */}
        <SubTitle className="hidden md:block cursor-default text-danashop-textPrimary tracking-wider pb-1">
          {title}
        </SubTitle>
        <ul className="space-y-3 mt-3 md:mt-4 pb-4 md:pb-0">
          {children}
        </ul>
      </div>
    </div>
  );
};

const Footer = ({ className, spanDesing }: { className?: string; spanDesing?: string }) => {
  return (
    <footer className="bg-danashop-colorMain">
      <Container>
        <FooterTop />
        <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8">

          {/* Col 1: Logo + descripción */}
          <div className="space-y-4 pb-6 md:pb-0 border-b border-danashop-textSecondary/20 md:border-none">
            <div className="cursor-default">
              <h2 className={cn("group font-sans text-2xl text-danashop-brandMain font-extrabold tracking-wider", className)}>
                <span className={cn("text-danashop-brandSoft", spanDesing)}>DANNA</span>SHOP
              </h2>
            </div>
            <SubText className="cursor-default text-danashop-textPrimary tracking-wide">
              Encuentra lo que necesites en nuestra tienda, combinando calidad y precio, todo aqui en GaboShop!
            </SubText>
            <SocialMedia
              className="text-shop-darkColor/60"
              iconClassName="border-shop-darkColor/60 hover:border-danashop-brandtext-danashop-brandSoft hover:text-danashop-brandSoft"
              tooltipClassName="bg-shop-darkColor text-shop-whiteColor"
            />
          </div>

          {/* Col 2: Accesos Rápidos — acordeón en móvil */}
          <AccordionSection title="Accesos Rapidos">
            {quickLinksData?.map((item) => (
              <li key={item?.title}>
                <Link
                  href={item?.href}
                  className="hover:text-danashop-brandSoft text-danashop-textPrimary hoverEffect font-medium"
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </AccordionSection>

          {/* Col 3: Categorías — acordeón en móvil */}
          <AccordionSection title="Categorias">
            {categoriesData?.map((item) => (
              <li key={item?.title}>
                <Link
                  href={`/category/${item?.href}`}
                  className="hover:text-danashop-brandSoft text-danashop-textPrimary hoverEffect font-medium"
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </AccordionSection>

          {/* Col 4: Suscripciones */}
          <div className="space-y-4 pt-6 md:pt-0 border-t border-danashop-textSecondary/20 md:border-none">
            <SubTitle className="cursor-default text-danashop-textPrimary tracking-wider pb-1">Suscripciones</SubTitle>
            <SubText className="cursor-default text-danashop-textPrimary tracking-wide">
              Ingresa tu correo electronico para ser el primero en recibir las ofertas y novedades de GaboShop!
            </SubText>
            <form className="space-y-3">
              <Input
                placeholder="Ingresa tu Correo Electronico"
                type="email"
                className="hover:border-danashop-brandSoft placeholder:text-danashop-textPrimary text-danashop-textPrimary"
                required
              />
              <Button className="w-full hover:bg-danashop-brandHover hover:text-danashop-textPrimary hoverEffect">
                Suscribete
              </Button>
            </form>
          </div>
        </div>

        <div className="py-6 border-t border-danashop-textSecondary/20 text-center text-sm text-danashop-textPrimary">
          <div className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()}{" "}
            <p className="font-extrabold tracking-widest">DANNASHOP</p>. Todos los derechos reservados.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;