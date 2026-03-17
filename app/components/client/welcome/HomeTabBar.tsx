"use client";
import { productType } from "../../../constants/data";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-5 sm:justify-between">

      {/* Tabs underline con scroll horizontal en móvil */}
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
        <div className="flex items-center border-b border-eshop-borderSubtle min-w-max">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.value)}
              key={item?.value}
              className={`relative px-4 py-2 md:px-6 md:py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap hoverEffect border-b-2 -mb-px
                ${selectedTab === item?.value
                  ? "text-eshop-accent border-eshop-accent"
                  : "text-eshop-textDisabled border-transparent hover:text-eshop-textSecondary"
                }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>

      {/* Botón Mostrar Todos */}
      <Link
        href="/tienda"
        className="border border-eshop-borderEmphasis text-eshop-textSecondary bg-transparent px-5 py-1.5 md:px-6 md:py-2 rounded-full hover:border-eshop-accent hover:text-eshop-accent hoverEffect text-sm font-semibold whitespace-nowrap shrink-0 mb-2"
      >
        Mostrar Todos →
      </Link>

    </div>
  );
};

export default HomeTabBar;