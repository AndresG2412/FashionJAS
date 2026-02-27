"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Productos } from "@/lib/firebase/products";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  currentProduct: Productos;
  maxProducts?: number;
}

export default function SimilarProducts({ currentProduct, maxProducts = 6 }: Props) {
  const [similarProducts, setSimilarProducts] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProducts();
  }, [currentProduct.id]);

  const fetchSimilarProducts = async () => {
    if (!currentProduct.categorias || currentProduct.categorias.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const productsRef = collection(db, "productos");
      
      const q = query(
        productsRef,
        where("categorias", "array-contains-any", currentProduct.categorias.slice(0, 10)),
        limit(maxProducts + 5)
      );

      const snapshot = await getDocs(q);
      
      const products = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          subido: doc.data().subido?.toDate() || new Date(),
        }))
        .filter((product: any) => product.id !== currentProduct.id)
        .slice(0, maxProducts) as Productos[];

      setSimilarProducts(products);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-2">
          <p className="text-xl font-bold text-gray-900 mb-2">
            Productos Similares
          </p>
        </div>

        {/* Grid de productos simplificado */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {similarProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              {/* Imagen */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={product.imagenes?.[0] || "/placeholder.png"}
                  alt={product.nombre}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
                {/* Badge de stock bajo (opcional) */}
                {product.stock <= 2 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ¡Últimas!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Sin stock</span>
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}