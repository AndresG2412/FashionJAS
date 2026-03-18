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

// ✅ Ya no se necesita useUser — el Server Action obtiene el userId internamente
const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { favoriteItems, removeFromFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteItems.length));
  };

  const handleResetWishlist = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-eshop-textPrimary">
          ¿Estás seguro de que quieres <b>vaciar tu lista</b> de favoritos?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-eshop-textSecondary hover:bg-eshop-bgCard rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              // ✅ sin user?.id — cada removeFromFavorite llama el Server Action internamente
              for (const product of favoriteItems) {
                await removeFromFavorite(product.id);
              }
              toast.dismiss(t.id);
              toast.success("Lista de favoritos vaciada");
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-eshop-textError text-white hover:opacity-90 rounded-md transition-colors shadow-sm"
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
        border: "1px solid #E2D1B3",
        backgroundColor: "#FFFFFF"
      },
    });
  };

  const handleRemove = async (id: string) => {
    await removeFromFavorite(id); // ✅ sin user?.id
    toast.success("Producto eliminado de favoritos");
  };

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

  return (
    <Container className="py-8 bg-eshop-bgMain">
      {favoriteItems?.length > 0 ? (
        <>
          {/* Header */}
          <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-eshop-textPrimary">Mis Favoritos</h1>
              <p className="text-eshop-textSecondary text-sm mt-0.5 font-medium">
                Tienes {favoriteItems.length} {favoriteItems.length === 1 ? 'producto guardado' : 'productos guardados'}
              </p>
            </div>
            <button
              onClick={handleResetWishlist}
              className="bg-eshop-textError/10 border border-eshop-textError/20 px-4 py-2 rounded-lg text-eshop-textError font-bold hover:bg-eshop-textError hover:text-white transition-all active:scale-95 w-full md:w-auto"
            >
              Vaciar Lista
            </button>
          </div>

          {/* ── VISTA PC (TABLA) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-eshop-borderSubtle bg-eshop-bgWhite shadow-sm">
            <div className="grid grid-cols-[2fr_1fr_0.6fr_0.9fr_1.4fr] gap-4 px-4 py-2.5 border-b border-eshop-borderSubtle bg-eshop-bgCard/30">
              <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Producto</span>
              <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Categorías</span>
              <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Estado</span>
              <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Precio</span>
              <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary text-center">Acciones</span>
            </div>

            <div className="divide-y divide-eshop-borderSubtle">
              {favoriteItems.slice(0, visibleProducts).map((product: Productos) => (
                <div key={product?.id} className="grid grid-cols-[2fr_1fr_0.6fr_0.9fr_1.4fr] gap-4 items-center px-4 py-3 hover:bg-eshop-bgCard/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Link href={`/${product.slug}`} className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-eshop-borderSubtle group">
                      <Image src={product.imagenes[0]} alt={product.nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </Link>
                    <Link href={`/${product.slug}`} className="text-sm font-bold text-eshop-textPrimary hover:text-eshop-accent transition-colors line-clamp-2 leading-snug">
                      {product?.nombre}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.categorias?.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-eshop-bgCard text-eshop-goldDeep px-1.5 py-0.5 rounded border border-eshop-borderSubtle">{cat}</span>
                    ))}
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${product?.stock > 0 ? 'bg-eshop-accent/10 text-eshop-accent' : 'bg-eshop-textError/10 text-eshop-textError'}`}>
                      {product?.stock > 0 ? 'En Stock' : 'Agotado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-start gap-x-1">
                    <span className="text-sm font-bold text-eshop-success">{formatCOP(product?.precio)}</span>
                    <span className="text-[10px] text-eshop-textDisabled font-bold uppercase">COP</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 min-w-0">
                    <div className="min-w-30 flex-1">
                      <AddToCar product={product} className="py-2 w-full bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark font-bold rounded-lg transition-all" />
                    </div>
                    <button onClick={() => handleRemove(product.id)} className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold text-eshop-textError bg-eshop-textError/5 border border-eshop-textError/20 hover:bg-eshop-textError hover:text-white rounded-lg transition-all">
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
              <div key={product?.id} className="bg-eshop-bgWhite rounded-xl border border-eshop-borderSubtle overflow-hidden shadow-sm">
                <div className="flex gap-3 p-3">
                  <Link href={`/${product.slug}`} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-eshop-borderSubtle group">
                    <Image src={product.imagenes[0]} alt={product.nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/${product.slug}`} className="text-sm font-bold text-eshop-textPrimary line-clamp-2 leading-snug hover:text-eshop-accent transition-colors">
                        {product?.nombre}
                      </Link>
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${product?.stock > 0 ? 'bg-eshop-accent/10 text-eshop-accent' : 'bg-eshop-textError/10 text-eshop-textError'}`}>
                        {product?.stock > 0 ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-black text-eshop-cart">{formatCOP(product?.precio)}</span>
                      {product.categorias?.slice(0, 1).map((cat, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-eshop-bgCard text-eshop-goldDeep px-1.5 py-0.5 rounded">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2.5 border-t border-eshop-borderSubtle bg-eshop-bgCard/10">
                  <div className="flex-1 min-w-0">
                    <AddToCar product={product} className="w-full py-2 text-sm bg-eshop-buttonBase text-eshop-textDark font-bold rounded-lg" />
                  </div>
                  <button onClick={() => handleRemove(product.id)} className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold text-eshop-textError bg-eshop-textError/5 border border-eshop-textError/20 hover:bg-eshop-textError hover:text-white rounded-lg">
                    <Trash2 size={15} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            {visibleProducts < favoriteItems?.length && (
              <Button variant="outline" onClick={loadMore} className="rounded-full px-8 border-eshop-borderEmphasis text-eshop-textPrimary hover:bg-eshop-bgCard font-bold">
                Cargar más productos
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button onClick={() => setVisibleProducts(10)} variant="ghost" className="text-eshop-textDisabled font-bold hover:text-eshop-textPrimary">
                Ver menos
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-100 flex-col items-center justify-center space-y-5 px-4 py-16 text-center bg-eshop-bgWhite rounded-2xl border border-dashed border-eshop-borderEmphasis">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-200" />
            <Heart className="h-16 w-16 text-eshop-borderSubtle" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h2 className="text-xl font-bold text-eshop-textPrimary">Tu lista está vacía</h2>
            <p className="text-eshop-textSecondary text-sm font-medium">¡Explora nuestra tienda y guarda los productos que más te gusten!</p>
          </div>
          <Link href="/tienda" className="rounded-xl px-8 py-2.5 text-eshop-textDark text-sm font-bold bg-eshop-buttonBase hover:bg-eshop-buttonHover hoverEffect">
            Ir a la Tienda
          </Link>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;