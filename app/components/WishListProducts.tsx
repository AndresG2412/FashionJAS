"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Productos } from "@/lib/firebase/products";
import AddToCar from "./AddToCar";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { favoriteItems, removeFromFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteItems.length));
  };

  const handleResetWishlist = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">
          ¿Estás seguro de que quieres <b>vaciar tu lista</b> de favoritos?
        </p>
        <div className="flex justify-end gap-2">
          {/* Botón para Cancelar */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          {/* Botón para Confirmar */}
          <button
            onClick={() => {
              favoriteItems.forEach(product => removeFromFavorite(product.id));
              toast.dismiss(t.id);
              toast.success("Lista de favoritos vaciada");
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            Sí, vaciar
          </button>
        </div>
      </div>
    ), {
      duration: 5000, // Le damos tiempo suficiente para decidir
      position: "top-center",
      style: {
        minWidth: "300px",
        padding: "16px",
        border: "1px solid #fee2e2", // Un borde sutil rojizo
      },
    });
};

  const handleRemove = (id: string) => {
    removeFromFavorite(id);
    toast.success("Producto eliminado de favoritos");
  };

  return (
    <Container className="py-10">
      {favoriteItems?.length > 0 ? (
        <>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mis Favoritos</h1>
              <p className="text-gray-600 mt-2">
                Tienes {favoriteItems.length} {favoriteItems.length === 1 ? 'producto guardado' : 'productos guardados'} 
              </p>
            </div>
            <Button
              onClick={handleResetWishlist}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full md:w-auto"
            >
              Vaciar Lista
            </Button>
          </div>

          {/* VISTA PARA PC (TABLA) */}
          <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left font-bold text-gray-700">Producto</th>
                  <th className="p-4 text-left font-bold text-gray-700">Categorías</th>
                  <th className="p-4 text-left font-bold text-gray-700">Estado</th>
                  <th className="p-4 text-left font-bold text-gray-700">Precio</th>
                  <th className="p-4 text-center font-bold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {favoriteItems.slice(0, visibleProducts).map((product: Productos) => (
                  <tr key={product?.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link href={`/product/${product?.slug}`} className="relative h-16 w-16 shrink-0 border rounded-lg overflow-hidden group">
                          <Image
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        <Link href={`/product/${product?.slug}`} className="font-medium text-gray-900 hover:text-shop_light_green transition-colors line-clamp-1">
                          {product?.nombre}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categorias?.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product?.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product?.stock > 0 ? 'En Stock' : 'Agotado'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-blue-600">
                          {product?.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">COP</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón de Agregar al Carrito */}
                        <AddToCar product={product} />
                        
                        {/* Botón de Eliminar */}
                        <Button 
                          variant="outline" 
                          onClick={() => handleRemove(product.id)}
                          className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center gap-2 transition-all"
                        >
                          <Trash2 size={16} />
                          <span className="font-medium">Eliminar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA PARA CELULARES (CARDS) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {favoriteItems.slice(0, visibleProducts).map((product: Productos) => (
              <div key={product?.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-4">
                  {/* Imagen */}
                  <Link href={`/product/${product?.slug}`} className="relative h-24 w-24 shrink-0 border rounded-lg overflow-hidden">
                    <Image
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  {/* Info */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <Link href={`/product/${product?.slug}`} className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                        {product?.nombre}
                      </Link>
                      <div className="flex gap-1 mt-1">
                        {product.categorias?.slice(0, 1).map((cat, idx) => (
                          <span key={idx} className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl font-black text-blue-600">
                        {product?.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones móviles */}
                <div className="flex items-center gap-2 border-t border-gray-100">
                  <div className="flex-1">
                    {/* Botón Agregar - Ahora comparte el ancho */}
                    <AddToCar product={product} className="w-full text-sm py-2.5" />
                  </div>
                  
                  <div className="flex-1">
                    {/* Botón Eliminar - Ahora en la misma línea con ícono y texto */}
                    <Button 
                      variant="outline" 
                      onClick={() => handleRemove(product.id)}
                      className="w-full border-red-100 text-red-500 hover:bg-red-50 gap-2 py-2.5 text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="font-semibold">Eliminar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de carga */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {visibleProducts < favoriteItems?.length && (
              <Button variant="outline" onClick={loadMore} className="rounded-full px-8">
                Cargar más productos
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button
                onClick={() => setVisibleProducts(10)}
                variant="ghost"
                className="text-gray-500"
              >
                Ver menos
              </Button>
            )}
          </div>
        </>
      ) : (
        /* Estado vacío (Sin cambios) */
        <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-100" />
            <Heart className="h-20 w-20 text-gray-200" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Tu lista está vacía</h2>
            <p className="text-gray-500">¡Explora nuestra tienda y guarda los productos que más te gusten!</p>
          </div>
          <Button asChild size="lg" className="rounded-full px-10">
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;