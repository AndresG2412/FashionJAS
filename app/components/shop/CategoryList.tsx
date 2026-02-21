import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import type { Category } from "@/lib/firebase/categories";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-sm">
      <Title className="text-base font-black">Categorías de Productos</Title>
      <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
        {categories?.map((category) => (
          <div
            onClick={() => setSelectedCategory(category?.slug)}
            key={category?.id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug}
              id={category?.slug}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug}
              className={`cursor-pointer ${
                selectedCategory === category?.slug
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }`}
            >
              {category?.titulo}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect text-left"
        >
          Limpiar selección
        </button>
      )}
    </div>
  );
};

export default CategoryList;