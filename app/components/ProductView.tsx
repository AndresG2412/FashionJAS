"use client";

import Image from "next/image";
import { useState } from "react";
import type { Productos } from "@/lib/firebase/products";
import AddToCar from "./AddToCar";
import AddToFav from "./AddToFav";
import ProductTags from './ProductTags';
import SimilarProducts from './SimilarProducts';

interface Props {
  product: Productos;
}

export default function ProductView({ product }: Props) {
    const [mainImage, setMainImage] = useState(product.imagenes?.[0]);

    const getStockInfo = (stock: number) => {
        if (stock <= 0) return { label: "Sin stock", color: "text-gray-500" };
        if (stock <= 2) return { label: "¡Últimas unidades!", color: "text-red-600 font-bold" };
        if (stock < 10) return { label: "Pocas unidades!", color: "text-yellow-600 font-bold" };
        return { label: "Más de 10 unidades", color: "text-green-600 font-bold" };
    };

    const stockInfo = getStockInfo(product.stock);

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                {/* SECCIÓN IZQUIERDA: GALERIA */}
                <div className="space-y-4">
                    <div className="aspect-square relative bg-danashop-disabled rounded-xl overflow-hidden shadow-sm">
                        {mainImage && (
                            <Image src={mainImage} alt={product.nombre} fill className="object-cover" priority />
                        )}
                    </div>

                    {/* thumbnails */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.imagenes?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 shrink-0 relative rounded-lg border-2 overflow-hidden transition-all ${
                                    mainImage === img ? 'border-blue-500 scale-95' : 'border-transparent'
                                }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* INFO */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-danashop-textPrimary">{product.nombre}</h1>

                    <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-blue-600">
                            ${product.precio.toLocaleString("es-CO")}
                        </p>
                    </div>

                    {/* INDICADOR DE STOCK */}
                    <p className={`text-sm ${stockInfo.color}`}>
                        {stockInfo.label}
                    </p>

                    <p className="text-danashop-textSecondary pb-2 border-b-2 hidden md:block">
                        Descripción: {product.descripcion}
                    </p>

                    <div className="flex gap-3">
                        <AddToCar product={product} />
                        <AddToFav product={product} />
                    </div>

                    <ProductTags/>

                    <p className="text-danashop-textSecondary mt-4 pb-2 border-b-2 block md:hidden">
                        Descripción: {product.descripcion}
                    </p>
                    <SimilarProducts currentProduct={product} maxProducts={4} />
                </div>
            </div>

            {/* PRODUCTOS SIMILARES */}
        </>
    );
}