// Footer.tsx
"use client";

import React, { useState } from "react";
import Container from "../../Container";
import FooterTop from "./FooterTop";
import SocialMedia from "../../SocialMedia";
import { SubText } from "../../ui/text";
import { categoriesData, quickLinksData } from "../../../constants/data";
import { footerContact, paymentMethods, trustBadges } from "../../../constants/homeData";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, ShieldCheck, MessageCircle } from "lucide-react";

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
        <h3 className="hidden md:block cursor-default text-eshop-textPrimary tracking-wider pb-1 font-bold uppercase text-sm">
          {title}
        </h3>
        <ul className="space-y-3 mt-3 md:mt-4 pb-4 md:pb-0">
          {children}
        </ul>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-fashion-ink text-fashion-cream">
      <Container className="pt-10">
        <FooterTop />

        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8">
          {/* Col 1: Logo + descripción */}
          <div className="space-y-4 pb-6 md:pb-0 border-b border-fashion-cream/10 md:border-none">
            <div className="cursor-default">
              <h2 className="group font-display text-2xl text-fashion-cream font-black tracking-wider">
                <span className="text-gradient-gold">FASHION</span>JAS
              </h2>
            </div>
            <SubText className="cursor-default text-fashion-mist tracking-wide">
              Encuentra lo que necesites en nuestra tienda, combinando calidad y precio, todo aquí en FashionJAS!
            </SubText>
            <SocialMedia
              iconClassName="border-fashion-cream/15 text-fashion-mist hover:border-fashion-gold hover:text-fashion-gold"
            />
            {/* WhatsApp directo */}
            <a
              href={footerContact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2.5 rounded-full hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Col 2: Accesos Rápidos */}
          <AccordionSection title="Accesos Rapidos">
            {quickLinksData?.map((item) => (
              <li key={item?.title}>
                <Link
                  href={item?.href}
                  className="hover:text-eshop-accent text-fashion-mist hoverEffect font-medium"
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
                  href={`/categoria/${item.href}`}
                  className="hover:text-eshop-accent text-fashion-mist hoverEffect font-medium"
                >
                  {item?.title}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={footerContact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-eshop-accent text-fashion-mist hoverEffect font-medium"
              >
                {footerContact.whatsappLabel}
              </a>
            </li>
          </AccordionSection>

          {/* Col 4: Contacto + medios de pago */}
          <div className="space-y-4 pt-6 md:pt-0 border-t border-fashion-cream/10 md:border-none">
            <h3 className="cursor-default text-fashion-cream tracking-wider pb-1 font-bold uppercase text-sm">
              Contacto
            </h3>
            <div className="space-y-2 text-fashion-mist text-sm">
              <p>📍 {footerContact.location}</p>
              <p>📧 {footerContact.email}</p>
              <p>🕒 {footerContact.schedule}</p>
            </div>

            <h4 className="font-bold uppercase text-sm tracking-wider text-fashion-cream pt-2">
              Medios de pago
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-fashion-coal border border-fashion-cream/15 text-fashion-cream"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sellos de seguridad */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 text-xs text-fashion-mist"
            >
              <ShieldCheck className="w-4 h-4 text-fashion-gold" />
              {badge}
            </span>
          ))}
        </div>

        <div className="py-6 border-t border-fashion-cream/10 text-center text-sm text-fashion-mist">
          <div className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()}{" "}
            <p className="font-extrabold tracking-widest text-fashion-cream">FASHIONJAS</p>. Todos los derechos reservados.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
