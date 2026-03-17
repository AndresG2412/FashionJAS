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
    <div className="w-full bg-eshop-bgCard rounded-lg shadow-sm border-eshop-goldLight border-2 overflow-hidden">
      {/* Encabezado del Acordeón */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-eshop-formsBackground hoverEffect"
      >
        <Title className="text-base font-black text-eshop-accent/90 tracking-wider mb-0 font-serif">Categorías</Title>
        <ChevronDown 
          className={`w-5 h-5 hoverEffect text-eshop-textPrimary ${isOpen ? "rotate-180" : ""}`} 
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
            <div className="px-5 pb-5 pt-0 ">
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
                      className="border border-eshop-textSecondary/40 rounded-sm color-white text-eshop-textPrimary peer-data-[state=checked]:bg-eshop-accent text-sm hoverEffect group-hover:bg-eshop-accent/50"
                    />
                    <Label
                      htmlFor={`cat-${category?.slug}`}
                      className={`cursor-pointer flex-1 ${
                        selectedCategory === category?.slug
                          ? "font-semibold text-eshop-textPrimary"
                          : "font-normal text-eshop-textSecondary"
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
                  className="text-sm font-serif font-medium mt-4 underline underline-offset-2 decoration-1 cursor-pointer hoverEffect text-red-600 hover:text-red-400 text-left block"
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