import React from "react";
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

const Footer = ({className, spanDesing }: {className?: string, spanDesing?: string}) => {
  return (
    <footer className="bg-danashop-colorMain ">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="cursor-default">
              <h2 className={cn(" group font-sans text-2xl text-danashop-brandMain font-extrabold tracking-wider",className)}>
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
          <div>
            <SubTitle className="cursor-default text-danashop-textPrimary tracking-wider pb-1">Accesos Rapidos</SubTitle>
            <ul className="space-y-3 mt-4">
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
            </ul>
          </div>
          <div>
            <SubTitle className="cursor-default text-danashop-textPrimary tracking-wider pb-1">Categorias</SubTitle>
            <ul className="space-y-3 mt-4">
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
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle className="cursor-default text-danashop-textPrimary tracking-wider pb-1">Suscripciones</SubTitle>
            <SubText className="cursor-default text-danashop-textPrimary tracking-wide">
              Ingresa tu correo electronico para ser el primero en recibir las ofertas y novedades de GaboShop!
            </SubText>
            <form className="space-y-3">
              <Input placeholder="Ingresa tu Correo Electronico" type="email" className="hover:border-danashop-brandSoft placeholder:text-danashop-textPrimary text-danashop-textPrimary" required />
              <Button className="w-full hover:bg-danashop-brandHover hover:text-danashop-textPrimary hoverEffect">Suscribete</Button>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-danashop-textPrimary pb-6">
            <div className="flex items-center justify-center gap-1">
                © {new Date().getFullYear()} <p className="font-extrabold tracking-widest">DANNASHOP</p>. Todos los derechos reservados.
            </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
