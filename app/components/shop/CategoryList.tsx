"use client";
import React, { useState } from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import type { Category } from "@/lib/firebase/categories";
import { ChevronDown } from "lucide-react"; // Importa un icono
import { motion, AnimatePresence } from "motion/react";

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
  const [isOpen, setIsOpen] = useState(false);

  // Función para seleccionar y cerrar automáticamente
  const handleSelect = (slug: string) => {
    setSelectedCategory(slug);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Encabezado del Acordeón */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 transition-colors"
      >
        <Title className="text-base font-black mb-0">Categorías</Title>
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Contenido Animado */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0">
              <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
                {categories?.map((category) => (
                  <div
                    onClick={() => handleSelect(category?.slug)}
                    key={category?.id}
                    className="flex items-center space-x-2 py-1.5 hover:cursor-pointer group"
                  >
                    <RadioGroupItem
                      value={category?.slug}
                      id={`cat-${category?.slug}`}
                      className="rounded-sm"
                    />
                    <Label
                      htmlFor={`cat-${category?.slug}`}
                      className={`cursor-pointer flex-1 ${
                        selectedCategory === category?.slug
                          ? "font-semibold text-shop_dark_green"
                          : "font-normal group-hover:text-shop_dark_green"
                      }`}
                    >
                      {category?.titulo} {/* Usamos titulo según tu captura */}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {selectedCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(null);
                  }}
                  className="text-sm font-medium mt-4 underline underline-offset-2 decoration-1 hover:text-red-600 text-left block"
                >
                  Limpiar selección
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;