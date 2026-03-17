"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./client/welcome/ProductCard";
import { getFilteredProducts, getAllProducts, searchProductsAdmin } from "@/lib/firebase/products";
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

      // PRIORIDAD 1: Búsqueda por nombre
      if (searchText) {
        data = await searchProductsAdmin("nombre", searchText);
      }
      // PRIORIDAD 2: Filtros (categoría y/o precio)
      else if (selectedCategory || selectedPrice) {
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
      }
      // PRIORIDAD 3: Todos los productos
      else {
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
    // Limpiar filtros cuando se busca por nombre
    if (text) {
      setSelectedCategory(null);
      setSelectedPrice(null);
    }
    setSearchText(text);
  };

  return (
      <Container className="">
        <div className="flex flex-col md:flex-row gap-1 md:gap-5 border-t-0">
          {/* Sidebar de filtros */}
          <div className="border-b mt-5 md:border-b-0 border-white md:mt-4 md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 scrollbar-hide space-y-4">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* Grid de productos */}
          <div className="flex-1 pt-5 md:border-l border-l-gray-300/50 md:pl-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto md:pr-2 scrollbar-hide">
              {/* Indicador de búsqueda activa */}
              {searchText && (
                <div className="mb-4 p-3 bg-danashop-brandHover/30 border-danashop-brandSoft border-2 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-danashop-textPrimary">
                    Resultados para: <span className="font-bold">"{searchText}"</span>
                  </p>
                  <button
                    onClick={() => handleSearch("")}
                    className="text-xs text-danashop-error hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}

              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-danashop-brandSoft/30 rounded-lg">
                  <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
                  <p className="font-semibold tracking-wide text-base text-danashop-textPrimary">
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
                <div className="bg-danashop-brandSoft/30 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-danashop-textPrimary mb-2">
                    {searchText
                      ? `No se encontraron productos con "${searchText}"`
                      : "No hay productos disponibles"}
                  </h3>
                  <p className="text-danashop-textPrimary/70 text-sm mb-4">
                    {searchText
                      ? "Intenta con otras palabras clave"
                      : "Prueba ajustando los filtros"}
                  </p>
                  {searchText && (
                    <button
                      onClick={() => handleSearch("")}
                      className="px-6 py-2 bg-danashop-brandHover border-2 border-danashop-brandSoft hover:bg-danashop-brandHover/40 text-white rounded-lg hover:bg-shop_dark_green transition-colors"
                    >
                      Ver todos los productos
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
  );
};

export default Shop;