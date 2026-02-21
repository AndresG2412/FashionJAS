"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { getFilteredProducts, getAllProducts } from "@/lib/firebase/products";
import type { Productos } from "@/lib/firebase/products";
import type { Category } from "@/lib/firebase/categories";
import { motion } from "motion/react";

interface Props {
  categories: Category[];
}

const Shop = ({ categories }: Props) => {
  const [products, setProducts] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      // IMPORTANTE: Un número muy alto para cubrir precios en COP (ej. 100 millones)
      let maxPrice = 100000000; 

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      let data: Productos[];
      
      // Si hay algún filtro activo, llamamos a la función filtrada
      if (selectedCategory || selectedPrice) {
        data = await getFilteredProducts({
          category: selectedCategory, // Aquí pasas el slug (ej: "celulares")
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
  }, [selectedCategory, selectedPrice]);

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5 bg-white py-4">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Encuentra los productos que necesitas
            </Title>
            {(selectedCategory !== null || selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline text-sm font-medium hover:text-red-600 hoverEffect"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Sidebar de filtros */}
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide space-y-4">
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
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white rounded-lg">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Cargando productos...
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
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
              ) : (
                <NoProductAvailable className="bg-white mt-0" selectedTab="todos" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;