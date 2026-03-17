"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { getProductsByCategory } from "@/lib/firebase/products";
import type { Productos } from "@/lib/firebase/products";
import NoProductAvailable from "../../NoProductAvailable";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../../Container";
import HomeTabbar from "./HomeTabBar";
import { productType } from "../../../constants/data";

const PRODUCTS_PER_PAGE = 10;

const ProductGrid = () => {
  const [products, setProducts] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.value || "");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(selectedTab);
        setProducts(data);
        setCurrentPage(1); // Resetear a página 1 al cambiar categoría
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-eshop-bgCard rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-eshop-goldDeep">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando Productos...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <>
          {/* Contador de productos */}
          <div className="mt-10 mb-2 text-sm text-eshop-textSecondary">
            Mostrando {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} de {products.length} productos
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {paginatedProducts.map((product) => (
              <AnimatePresence key={product?.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {/* Botón anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-eshop-goldLight hover:bg-eshop-borderEmphasis hover:border-eshop-goldDeep disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Números de página */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Mostrar: primera, última, y páginas cercanas a la actual
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                  // Agregar "..." cuando hay saltos
                  if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-eshop-textSecondary">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item
                          ? "bg-eshop-goldDeep text-eshop-textPrimary"
                          : "border border-eshop-borderEmphasis hover:bg-eshop-goldLight hover:border-eshop-accent text-eshop-textSecondary"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              {/* Botón siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-eshop-borderEmphasis hover:bg-eshop-goldLight hover:border-eshop-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;