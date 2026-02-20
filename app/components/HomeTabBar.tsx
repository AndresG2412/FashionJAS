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
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect whitespace-nowrap text-sm font-semibold transition-all ${
                selectedTab === item?.value
                  ? "bg-shop_light_green text-white border-shop_light_green"
                  : "bg-shop_light_green/10"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>

      {/* Botón "Mostrar Todos" */}
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect text-sm font-semibold whitespace-nowrap transition-all shrink-0"
      >
        Mostrar Todos
      </Link>
    </div>
  );
};

export default HomeTabBar;