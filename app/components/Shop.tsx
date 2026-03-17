"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { Loader2 } from "lucide-react";
import ProductCard from "./client/welcome/ProductCard";
import {
  getFilteredProducts,
  getAllProducts,
  searchProductsAdmin,
} from "@/lib/firebase/products";
import type { Productos } from "@/lib/firebase/products";
import type { Category } from "@/lib/firebase/categories";
import { motion } from "motion/react";
import SearchBar from "./SearchBar";

interface Props {
  categories: Category[];
}

const Shop = ({ categories }: Props) => {
  const [products, setProducts] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data: Productos[];

      if (searchText) {
        data = await searchProductsAdmin("nombre", searchText);
      } else if (selectedCategory || selectedPrice) {
        let minPrice = 0;
        let maxPrice = 100000000;

        if (selectedPrice) {
          const [min, max] = selectedPrice.split("-").map(Number);
          minPrice = min;
          maxPrice = max;
        }

        data = await getFilteredProducts({
          category: selectedCategory,
          minPrice,
          maxPrice,
        });
      } else {
        data = await getAllProducts();
      }

      setProducts(data);
    } catch (error) {
      console.error("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPrice, searchText]);

  const handleSearch = (text: string) => {
    if (text) {
      setSelectedCategory(null);
      setSelectedPrice(null);
    }
    setSearchText(text);
  };

  // 🔥 NUEVO: resetear todos los filtros
  const resetFilters = () => {
    setSearchText("");
    setSelectedCategory(null);
    setSelectedPrice(null);
  };

  return (
    <Container className="bg-eshop-bgMain">
      <div className="flex flex-col md:flex-row gap-1 md:gap-5 border-t-0">
        {/* Sidebar de filtros */}
        <aside className="border-b mt-5 md:border-b-0 border-eshop-goldDeep md:mt-4 md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 scrollbar-hide space-y-4">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <PriceList
            setSelectedPrice={setSelectedPrice}
            selectedPrice={selectedPrice}
          />
        </aside>

        {/* Grid de productos */}
        <main className="flex-1 pt-5 md:border-l border-eshop-goldDeep md:pl-5">
          <div className="h-[calc(100vh-160px)] overflow-y-auto md:pr-2 scrollbar-hide">
            
            {/* Indicador de búsqueda activa */}
            {searchText && (
              <div className="mb-4 p-3 bg-eshop-inCart border-eshop-borderEmphasis border rounded-lg flex items-center justify-between">
                <p className="text-sm text-eshop-textPrimary">
                  Resultados para:{" "}
                  <span className="font-bold font-serif text-eshop-accent">
                    "{searchText}"
                  </span>
                </p>
                <button
                  onClick={resetFilters}
                  className="text-sm font-serif text-eshop-textError hover:underline font-semibold"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}

            {loading ? (
              <div className="p-20 flex flex-col gap-2 items-center justify-center bg-eshop-bgCard rounded-lg border border-eshop-borderSubtle">
                <Loader2 className="w-10 h-10 text-eshop-accent animate-spin" />
                <p className="font-semibold tracking-wide text-base text-eshop-textSecondary">
                  {searchText ? "Buscando productos..." : "Cargando productos..."}
                </p>
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="mb-5">
                  <SearchBar onSearch={handleSearch} isSearching={loading} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2.5">
                  {products?.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="bg-eshop-bgCard border border-eshop-borderSubtle rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-eshop-formsBackground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-eshop-textDisabled" />
                </div>

                <h3 className="text-lg font-bold text-eshop-textPrimary mb-2">
                  {searchText
                    ? `No se encontraron productos con "${searchText}"`
                    : "No hay productos disponibles"}
                </h3>

                <p className="text-eshop-textSecondary text-sm mb-6 flex flex-col gap-y-4">
                  {searchText
                    ? "Intenta con otras palabras clave o categorías"
                    : "Prueba ajustando los filtros de precio o categoría"}
                </p>

                {/* 🔥 FIX: botón aparece también con filtros */}
                {(searchText || selectedCategory || selectedPrice) && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-eshop-buttonBase text-eshop-textDark font-semibold rounded-lg hover:bg-eshop-buttonHover transition-colors shadow-sm"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
};

export default Shop;