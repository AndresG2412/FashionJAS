"use client";
import { productType } from "../constants/data";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 sm:justify-between">
      {/* Tabs con scroll horizontal en móvil */}
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 md:gap-3 min-w-max pb-2 sm:pb-0">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.value)}
              key={item?.value}
              // 1. Agregamos la clase 'group' y quitamos 'hover:scale-110' del botón
              className={`group cursor-pointer border-2 hoverEffect border-danashop-brandSoft/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-danashop-brandHover hover:border-shop_light_green hover:text-white whitespace-nowrap text-sm font-semibold transition-all ${
                selectedTab === item?.value
                  ? "bg-danashop-brandHover text-danashop-textPrimary border-danashop-brandSoft border-2"
                  : "bg-danashop-brandSoft/10"
              }`}
            >
              {/* 2. Aplicamos el scale solo aquí usando group-hover */}
              <span className="block transition-transform duration-300 group-hover:scale-105">
                {item?.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Botón "Mostrar Todos" */}
      <Link
        href={"/tienda"}
        className="border-2 border-danashop-brandSoft/30 bg-danashop-brandSoft/10 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-danashop-brandHover text-danashop-textPrimary hoverEffect text-sm font-semibold whitespace-nowrap shrink-0"
      >
        Mostrar Todos
      </Link>
    </div>
  );
};

export default HomeTabBar;