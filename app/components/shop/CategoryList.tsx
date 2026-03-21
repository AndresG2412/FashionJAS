"use client";
import React, { useState } from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import type { Category } from "@/lib/firebase/categories";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const ITEMS_PER_PAGE = 6;

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleSelect = (slug: string) => {
    setSelectedCategory(slug);
    setIsOpen(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <div className="w-full bg-eshop-bgCard rounded-lg shadow-sm border-eshop-goldLight border-2 overflow-hidden">
      {/* Encabezado del Acordeón */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-eshop-formsBackground hoverEffect"
      >
        <Title className="text-base font-black text-eshop-accent/90 tracking-wider mb-0 font-serif">
          Categorías
        </Title>
        <ChevronDown
          className={`w-5 h-5 hoverEffect text-eshop-textPrimary transition-transform ${isOpen ? "rotate-180" : ""}`}
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
            <div className="px-5 pb-4 pt-0">
              <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
                {paginatedCategories.map((category) => (
                  <div
                    onClick={() => handleSelect(category?.slug)}
                    key={category?.id}
                    className="flex items-center space-x-2 py-1.5 hover:cursor-pointer group"
                  >
                    <RadioGroupItem
                      value={category?.slug}
                      id={`cat-${category?.slug}`}
                      className="border border-eshop-textSecondary/40 rounded-sm text-eshop-textPrimary group-hover:bg-eshop-accent/50 hoverEffect"
                    />
                    <Label
                      htmlFor={`cat-${category?.slug}`}
                      className={`cursor-pointer flex-1 ${
                        selectedCategory === category?.slug
                          ? "font-semibold text-eshop-textPrimary"
                          : "font-normal text-eshop-textSecondary"
                      }`}
                    >
                      {category?.titulo}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Paginación — solo si hay más de una página */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-eshop-borderSubtle">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="p-1 rounded-md text-eshop-textSecondary hover:text-eshop-textPrimary hover:bg-eshop-formsBackground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold text-eshop-textSecondary">
                    {currentPage + 1} / {totalPages}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1}
                    className="p-1 rounded-md text-eshop-textSecondary hover:text-eshop-textPrimary hover:bg-eshop-formsBackground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Limpiar selección */}
              {selectedCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(null);
                  }}
                  className="text-sm font-serif font-medium mt-3 underline underline-offset-2 decoration-1 cursor-pointer hoverEffect text-red-600 hover:text-red-400 text-left block"
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