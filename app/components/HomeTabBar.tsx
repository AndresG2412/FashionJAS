"use client";
import { productType } from "../constants/data";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.value)} // ← Cambio aquí: usa value
              key={item?.value} // ← Cambio aquí: usa value como key
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${
                selectedTab === item?.value // ← Cambio aquí: compara con value
                  ? "bg-shop_light_green text-white border-shop_light_green"
                  : "bg-shop_light_green/10"
              }`}
            >
              {item?.title} {/* ← Esto sigue igual, muestra el título en español */}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect"
      >
        Mostrar Todos
      </Link>
    </div>
  );
};

export default HomeTabBar;