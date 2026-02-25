"use client";

import Image from "next/image";
import { useState } from "react";
import type { Productos } from "@/lib/firebase/products";
import AddToCar from "./AddToCar";
import AddToFav from "./AddToFav";

interface Props {
  product: Productos;
}

export default function ProductView({ product }: Props) {
  const [mainImage, setMainImage] = useState(product.imagenes?.[0]);

return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

        {/* SECCIÓN IZQUIERDA: GALERIA */}
        <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden shadow-sm">
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
        <div className="flex flex-col gap-4 bg-blue-500">
            <h1 className="text-3xl font-bold">{product.nombre}</h1>

            <p className="text-2xl font-bold text-blue-600">
                ${product.precio.toLocaleString("es-CO")}
            </p>

            <p className="text-gray-600 pb-2 border-b-2 hidden md:block">Descripción: {product.descripcion}</p>

            <div className="flex gap-3">
                <AddToCar product={product} />
                <AddToFav product={product} />
            </div>

            <p className="text-gray-600 mt-4 pb-2 border-b-2 block md:hidden">Descripción: {product.descripcion}</p>

        </div>
    </div>
  );
}