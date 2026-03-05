"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Productos } from "@/lib/firebase/products";
import AddToCar from "./AddToCar";
import { useUser } from '@clerk/nextjs';

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { favoriteItems, removeFromFavorite } = useStore();
  const { user } = useUser();

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
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              for (const product of favoriteItems) {
                await removeFromFavorite(product.id, user?.id);
              }
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
      duration: 5000,
      position: "top-center",
      style: {
        minWidth: "300px",
        padding: "16px",
        border: "1px solid #fee2e2",
      },
    });
  };

  const handleRemove = async (id: string) => {
    await removeFromFavorite(id, user?.id);
    toast.success("Producto eliminado de favoritos");
  };

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

  return (
    <Container className="py-8">
      {favoriteItems?.length > 0 ? (
        <>
          {/* Header */}
          <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-danashop-textPrimary">Mis Favoritos</h1>
              <p className="text-danashop-textSecondary text-sm mt-0.5">
                Tienes {favoriteItems.length} {favoriteItems.length === 1 ? 'producto guardado' : 'productos guardados'}
              </p>
            </div>
            {/* Botón vaciar — sin cambios */}
            <button
              onClick={handleResetWishlist}
              className="bg-red-500 px-4 py-2 rounded-lg text-danashop-textPrimary hover:bg-red-600 hover:scale-105 hoverEffect w-full md:w-auto"
            >
              Vaciar Lista
            </button>
          </div>

          {/* ── VISTA PC (TABLA) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-danashop-borderColor bg-danashop-bgColorCard">
            {/* Cabecera */}
            <div className="grid grid-cols-[2fr_1fr_0.6fr_0.9fr_1.4fr] gap-4 px-4 py-2.5 border-b border-danashop-borderColor bg-bgForms/20">
              <span className="text-xs font-bold uppercase tracking-wider text-danashop-textSecondary">Producto</span>
              <span className="text-xs font-bold uppercase tracking-wider text-danashop-textSecondary">Categorías</span>
              <span className="text-xs font-bold uppercase tracking-wider text-danashop-textSecondary">Estado</span>
              <span className="text-xs font-bold uppercase tracking-wider text-danashop-textSecondary">Precio</span>
              <span className="text-xs font-bold uppercase tracking-wider text-danashop-textSecondary text-center">Acciones</span>
            </div>

            {/* Filas */}
            <div className="divide-y divide-danashop-borderColor">
              {favoriteItems.slice(0, visibleProducts).map((product: Productos) => (
                <div
                  key={product?.id}
                  className="grid grid-cols-[2fr_1fr_0.6fr_0.9fr_1.4fr] gap-4 items-center px-4 py-3 hover:bg-danashop-hover/40 transition-colors"
                >
                  {/* Col 1: Imagen + Nombre */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Link href={`/${product.slug}`} className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-danashop-borderColor group">
                      <Image
                        src={product.imagenes[0]}
                        alt={product.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <Link
                      href={`/${product.slug}`}
                      className="text-sm font-bold text-danashop-textPrimary hover:text-danashop-brandSoft transition-colors line-clamp-2 leading-snug"
                    >
                      {product?.nombre}
                    </Link>
                  </div>

                  {/* Col 2: Categorías */}
                  <div className="flex flex-wrap gap-1">
                    {product.categorias?.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-bgForms/30 text-danashop-brandSoft px-1.5 py-0.5 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Col 3: Estado */}
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${product?.stock > 0 ? 'bg-danashop-success/15 text-danashop-success' : 'bg-danashop-error/15 text-danashop-error'}`}>
                      {product?.stock > 0 ? 'En Stock' : 'Agotado'}
                    </span>
                  </div>

                  {/* Col 4: Precio */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-blue-500">{formatCOP(product?.precio)}</span>
                    <span className="text-[10px] text-danashop-textMuted font-bold uppercase">COP</span>
                  </div>

                  {/* Col 5: Acciones */}
                  <div className="flex items-center justify-center gap-2 min-w-0">
                    <div className="min-w-30 flex-1">
                      <AddToCar product={product} className="py-2 w-full" />
                    </div>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold text-danashop-error bg-danashop-error/10 border border-danashop-error/20 hoverEffect hover:bg-danashop-error hover:text-white rounded-lg whitespace-nowrap"
                    >
                      <Trash2 size={15} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── VISTA MÓVIL (CARDS) ── */}
          <div className="md:hidden flex flex-col gap-2.5">
            {favoriteItems.slice(0, visibleProducts).map((product: Productos) => (
              <div
                key={product?.id}
                className="bg-danashop-bgColorCard rounded-xl border border-danashop-borderColor overflow-hidden"
              >
                {/* Fila superior: imagen + info */}
                <div className="flex gap-3 p-3">
                  <Link href={`/${product.slug}`} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-danashop-borderColor group">
                    <Image
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/${product.slug}`}
                        className="text-sm font-bold text-danashop-textPrimary line-clamp-2 leading-snug hover:text-danashop-brandSoft transition-colors"
                      >
                        {product?.nombre}
                      </Link>
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${product?.stock > 0 ? 'bg-danashop-success/15 text-danashop-success' : 'bg-danashop-error/15 text-danashop-error'}`}>
                        {product?.stock > 0 ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-black text-blue-500">{formatCOP(product?.precio)}</span>
                      {product.categorias?.slice(0, 1).map((cat, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-bgForms/30 text-danashop-brandSoft px-1.5 py-0.5 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fila inferior: acciones */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-t border-danashop-borderColor bg-bgForms/20">
                  <div className="flex-1 min-w-0">
                    <AddToCar product={product} className="w-full py-2 text-sm" />
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold text-danashop-error bg-danashop-error/10 border border-danashop-error/20 hoverEffect hover:bg-danashop-error hover:text-white rounded-lg whitespace-nowrap"
                  >
                    <Trash2 size={15} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de paginación */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {visibleProducts < favoriteItems?.length && (
              <Button variant="outline" onClick={loadMore} className="rounded-full px-8 border-danashop-borderColor text-danashop-textSecondary hover:bg-bgForms/30">
                Cargar más productos
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button onClick={() => setVisibleProducts(10)} variant="ghost" className="text-danashop-textMuted">
                Ver menos
              </Button>
            )}
          </div>
        </>
      ) : (
        /* Estado vacío */
        <div className="flex min-h-100 flex-col items-center justify-center space-y-5 px-4 text-center bg-danashop-bgColorCard rounded-2xl border border-dashed border-danashop-borderColor">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-danashop-favorite/30" />
            <Heart className="h-16 w-16 text-danashop-borderColor" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h2 className="text-xl font-bold text-danashop-textPrimary">Tu lista está vacía</h2>
            <p className="text-danashop-textSecondary text-sm">¡Explora nuestra tienda y guarda los productos que más te gusten!</p>
          </div>
          <Link
            href="/tienda"
            className="rounded-full px-6 py-2 border border-danashop-brandMain text-danashop-brandSoft text-sm font-semibold hover:bg-danashop-brandMain hover:text-white hoverEffect"
          >
            Ir a la Tienda
          </Link>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;