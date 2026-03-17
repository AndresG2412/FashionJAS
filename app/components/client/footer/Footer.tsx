// Footer.tsx
"use client";

import React, { useState } from "react";
import Container from "../../Container";
import FooterTop from "./FooterTop";
import SocialMedia from "../../SocialMedia";
import { SubText, SubTitle } from "../../ui/text";
import { categoriesData, quickLinksData } from "../../../constants/data";
import Link from "next/link";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:contents">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden w-full flex items-center justify-between py-3 border-b border-eshop-borderSubtle text-eshop-textPrimary"
      >
        <span className="font-bold tracking-wider uppercase text-sm">{title}</span>
        <ChevronDown
          size={18}
          className={cn(
            "text-eshop-accent transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:overflow-visible md:block",
          open ? "max-h-96" : "max-h-0 md:max-h-none"
        )}
      >
        <SubTitle className="hidden md:block cursor-default text-eshop-textPrimary tracking-wider pb-1">
          {title}
        </SubTitle>
        <ul className="space-y-3 mt-3 md:mt-4 pb-4 md:pb-0">
          {children}
        </ul>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-eshop-bgMain">
      <Container>
        <FooterTop />
        <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8">

          {/* Col 1: Logo + descripción */}
          <div className="space-y-4 pb-6 md:pb-0 border-b border-eshop-borderSubtle md:border-none">
            <div className="cursor-default">
              <h2 className="group font-serif text-2xl text-eshop-textPrimary font-black tracking-wider">
                <span className="text-eshop-accent">FASHION</span>JAS
              </h2>
            </div>
            <SubText className="cursor-default text-eshop-textSecondary tracking-wide">
              Encuentra lo que necesites en nuestra tienda, combinando calidad y precio, todo aqui en FashionJAS!
            </SubText>
            <SocialMedia
              iconClassName="border-eshop-borderEmphasis hover:border-eshop-accent hover:text-eshop-accent"
            />
          </div>

          {/* Col 2: Accesos Rápidos */}
          <AccordionSection title="Accesos Rapidos">
            {quickLinksData?.map((item) => (
              <li key={item?.title}>
                <Link
                  href={item?.href}
                  className="hover:text-eshop-accent text-eshop-textSecondary hoverEffect font-medium"
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </AccordionSection>

          {/* Col 3: Categorías */}
          <AccordionSection title="Categorias">
            {categoriesData?.map((item) => (
              <li key={item?.title}>
                <Link
                  href="/info"
                  className="hover:text-eshop-accent text-eshop-textSecondary hoverEffect font-medium"
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </AccordionSection>

          {/* Col 4: Suscripciones */}
          <div className="space-y-4 pt-6 md:pt-0 border-t border-eshop-borderSubtle md:border-none">
            <SubTitle className="cursor-default text-eshop-textPrimary tracking-wider pb-1">
              Suscripciones
            </SubTitle>
            <SubText className="cursor-default text-eshop-textSecondary tracking-wide">
              Ingresa tu correo electronico para ser el primero en recibir las ofertas y novedades de FashionJAS!
            </SubText>
            <form className="space-y-3">
              <Input
                placeholder="Ingresa tu Correo Electronico"
                type="email"
                className="border-eshop-borderEmphasis hover:border-eshop-accent placeholder:text-eshop-textDisabled text-eshop-textPrimary focus:border-eshop-accent"
                required
              />
              <Button className="w-full bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark font-semibold hoverEffect">
                Suscribete
              </Button>
            </form>
          </div>
        </div>

        <div className="py-6 border-t border-eshop-borderSubtle text-center text-sm text-eshop-textSecondary">
          <div className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()}{" "}
            <p className="font-extrabold tracking-widest text-eshop-textPrimary">FASHIONJAS</p>. Todos los derechos reservados.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;