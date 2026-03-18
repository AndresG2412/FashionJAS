"use client";

import useStore from "@/store";
import Container from "./Container";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Productos } from "@/lib/firebase/products";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CartProducts = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
  const { user } = useUser();
  const router = useRouter();

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity, user?.id);
  };

  const handleRemove = async (productId: string, productName: string) => {
    await removeFromCart(productId, user?.id);
    toast.success(`${productName} eliminado del carrito`);
  };

  const handleClearCart = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-eshop-textPrimary">
          ¿Estás seguro de que quieres <b>vaciar tu carrito</b>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-base font-semibold text-eshop-textSecondary hover:text-eshop-textPrimary hover:bg-eshop-bgCard rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await clearCart(user?.id);
              toast.dismiss(t.id);
              toast.success("Carrito vaciado");
            }}
            className="px-3 py-1.5 text-base font-semibold bg-eshop-textError text-white hover:opacity-90 rounded-md transition-colors shadow-sm"
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
        border: "1px solid #E2D1B3", // Color basado en la paleta gold
        backgroundColor: "#FFFFFF" 
      },
    });
  };

  const subtotal = getCartTotal();
  const envio = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + envio;

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

  return (
    <Container className="py-8 bg-eshop-bgMain">
      {cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Lista de productos ── */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-eshop-textPrimary">Tu Carrito</h1>
                <p className="text-eshop-textSecondary text-sm mt-0.5">
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <button
                onClick={handleClearCart}
                className="bg-eshop-textError/10 border border-eshop-textError/20 px-4 py-2 rounded-lg text-eshop-textError font-bold hover:bg-eshop-textError hover:text-white transition-all active:scale-95"
              >
                Vaciar Carrito
              </button>
            </div>

            {/* ── VISTA DESKTOP ── */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-eshop-borderSubtle bg-eshop-bgWhite">
              {/* Cabecera */}
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-eshop-borderSubtle bg-eshop-bgCard/30">
                <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Producto</span>
                <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary text-center">Cantidad</span>
                <span className="text-xs font-bold uppercase tracking-wider text-eshop-textSecondary text-right">Precio</span>
                <span className="w-8" />
              </div>

              {/* Filas */}
              <div className="divide-y divide-eshop-borderSubtle">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-eshop-bgCard/20 transition-colors">

                    {/* Col 1: Imagen + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Link href={`/${item.slug}`} className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-eshop-borderSubtle group">
                        <Image
                          src={item.imagenes[0]}
                          alt={item.nombre}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/${item.slug}`} className="text-sm font-bold text-eshop-textPrimary hover:text-eshop-accent transition-colors line-clamp-1">
                          {item.nombre}
                        </Link>
                        <div className="flex gap-1 mt-0.5">
                          {item.categorias?.slice(0, 1).map((cat, idx) => (
                            <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-eshop-bgCard text-eshop-goldDeep px-1.5 py-0.5 rounded border border-eshop-borderSubtle">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-eshop-textDisabled mt-0.5">Stock: {item.stock}</p>
                      </div>
                    </div>

                    {/* Col 2: Cantidad */}
                    <div className="flex items-center justify-center gap-1 border border-eshop-borderSubtle rounded-lg overflow-hidden bg-eshop-bgCard/10 w-fit mx-auto">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-eshop-bgCard disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-eshop-textSecondary"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-eshop-textPrimary">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-eshop-bgCard disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-eshop-textSecondary"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Col 3: Precio */}
                    <div className="text-right">
                      <p className="text-xs text-eshop-textDisabled font-medium">Unitario</p>
                      <p className="text-sm font-bold text-eshop-textPrimary">{formatCOP(item.precio)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs font-black text-eshop-accent mt-0.5">{formatCOP(item.precio * item.quantity)}</p>
                      )}
                    </div>

                    {/* Col 4: Eliminar */}
                    <button
                      onClick={() => handleRemove(item.id, item.nombre)}
                      className="p-1.5 text-eshop-textError/60 hover:text-eshop-textError hover:bg-eshop-textError/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── VISTA MÓVIL ── */}
            <div className="md:hidden flex flex-col gap-2.5">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-eshop-bgWhite rounded-xl border border-eshop-borderSubtle overflow-hidden shadow-sm">
                  {/* Fila principal */}
                  <div className="flex gap-3 p-3">
                    <Link href={`/${item.slug}`} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-eshop-borderSubtle">
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <Link href={`/${item.slug}`} className="text-sm font-bold text-eshop-textPrimary line-clamp-2 leading-snug hover:text-eshop-accent">
                        {item.nombre}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-black text-eshop-textPrimary">{formatCOP(item.precio)}</span>
                        {item.categorias?.slice(0, 1).map((cat, idx) => (
                          <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-eshop-bgCard text-eshop-goldDeep px-1.5 py-0.5 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fila de acciones */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-eshop-borderSubtle bg-eshop-bgCard/10">
                    <div className="flex items-center gap-1 border border-eshop-borderSubtle rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-eshop-bgCard disabled:opacity-30"
                      >
                        <Minus size={13} className="text-eshop-textSecondary" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-eshop-textPrimary">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-eshop-bgCard disabled:opacity-30"
                      >
                        <Plus size={13} className="text-eshop-textSecondary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.quantity > 1 && (
                        <div className="text-right">
                          <p className="text-[10px] text-eshop-textDisabled">Subtotal</p>
                          <p className="text-sm font-black text-eshop-accent">{formatCOP(item.precio * item.quantity)}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemove(item.id, item.nombre)}
                        className="p-1.5 text-eshop-textError hover:bg-eshop-textError/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Resumen del pedido ── */}
          <div className="lg:col-span-1">
            <div className="bg-eshop-bgWhite rounded-xl border border-eshop-borderEmphasis p-5 sticky top-24 shadow-md">
              <h2 className="text-base font-bold text-eshop-textPrimary mb-4 pb-3 border-b border-eshop-borderSubtle">
                Resumen del Pedido
              </h2>

              <div className="space-y-2.5 pb-4 border-b border-eshop-borderSubtle">
                <div className="flex justify-between text-sm">
                  <span className="text-eshop-textSecondary font-medium">Subtotal</span>
                  <span className="font-bold text-eshop-textPrimary">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-eshop-textSecondary font-medium">Envío</span>
                  <span className="font-bold">
                    {envio === 0
                      ? <span className="text-eshop-accent font-bold">GRATIS</span>
                      : <span className="text-eshop-textPrimary">{formatCOP(envio)}</span>}
                  </span>
                </div>
                {envio > 0 && (
                  <p className="text-[11px] text-eshop-goldDeep bg-eshop-bgCard px-3 py-2 rounded-lg border border-eshop-borderSubtle">
                    🎁 ¡Envío gratis en compras mayores a $100.000!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-bold text-eshop-textPrimary">Total</span>
                <span className="text-xl font-black text-eshop-textPrimary">{formatCOP(total)}</span>
              </div>

              <button
                className="w-full py-3 rounded-xl font-bold text-eshop-textDark bg-eshop-buttonBase hover:bg-eshop-buttonHover shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                onClick={() => router.push("/checkout")}
              >
                Proceder al Pago
                <ArrowRight size={18} />
              </button>

              <Link
                href="/tienda"
                className="block text-center mt-4 text-xs font-bold text-eshop-textSecondary hover:text-eshop-accent transition-colors"
              >
                ← Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Carrito vacío */
        <div className="flex min-h-100 flex-col items-center justify-center space-y-5 px-4 py-16 text-center bg-eshop-bgWhite rounded-2xl border border-dashed border-eshop-borderEmphasis">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-eshop-accent/20" />
            <ShoppingCart className="h-16 w-16 text-eshop-borderSubtle" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h2 className="text-xl font-bold text-eshop-textPrimary">Tu carrito está vacío</h2>
            <p className="text-eshop-textSecondary text-sm font-medium">¡Agrega productos increíbles y comienza a comprar!</p>
          </div>
          <Link
            href="/tienda"
              className="rounded-xl px-8 py-2.5 text-eshop-textDark text-sm font-bold bg-eshop-buttonBase hover:bg-eshop-buttonHover hoverEffect"
            >
            Ir a la Tienda
          </Link>
        </div>
      )}
    </Container>
  );
};

export default CartProducts;