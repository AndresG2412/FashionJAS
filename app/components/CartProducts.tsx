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
        <p className="text-sm font-medium text-gray-900">
          ¿Estás seguro de que quieres <b>vaciar tu carrito</b>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-base font-semibold text-danashop-textDark hover:text-danashop-textPrimary hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await clearCart(user?.id);
              toast.dismiss(t.id);
              toast.success("Carrito vaciado");
            }}
            className="px-3 py-1.5 text-base font-semibold bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            Sí, vaciar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
      style: { minWidth: "300px", padding: "16px", border: "1px solid #fee2e2" },
    });
  };

  const subtotal = getCartTotal();
  const envio = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + envio;

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });

  return (
    <Container className="py-8">
      {cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Lista de productos ── */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-danashop-textPrimary">Tu Carrito</h1>
                <p className="text-danashop-textSecondary text-sm mt-0.5">
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <button
                onClick={handleClearCart}
                className="bg-red-500 px-4 py-2 rounded-lg text-danashop-textPrimary hover:bg-red-600 hover:scale-105 hoverEffect"
              >
                Vaciar Carrito
              </button>
            </div>

            {/* ── VISTA DESKTOP ── */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-danashop-textSecondary/50 bg-danashop-bgColorCard">
              {/* Cabecera */}
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-danashop-textSecondary/50 bg-bgForms/20">
                <span className="text-xs font-bold uppercase tracking-wider text-danashop-textPrimary">Producto</span>
                <span className="text-xs font-bold uppercase tracking-wider text-danashop-textPrimary text-center">Cantidad</span>
                <span className="text-xs font-bold uppercase tracking-wider text-danashop-textPrimary text-right">Precio</span>
                <span className="w-8" />
              </div>

              {/* Filas */}
              <div className="divide-y divide-danashop-textSecondary/50">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 hover:bg-danashop-hover/40 transition-colors">

                    {/* Col 1: Imagen + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Link href={`/${item.slug}`} className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-danashop-borderColor group">
                        <Image
                          src={item.imagenes[0]}
                          alt={item.nombre}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/${item.slug}`} className="text-sm font-bold text-danashop-textPrimary hover:text-danashop-brandSoft transition-colors line-clamp-1">
                          {item.nombre}
                        </Link>
                        <div className="flex gap-1 mt-0.5">
                          {item.categorias?.slice(0, 1).map((cat, idx) => (
                            <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-bgForms/30 text-danashop-brandSoft px-1.5 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-danashop-textMuted mt-0.5">Stock: {item.stock}</p>
                      </div>
                    </div>

                    {/* Col 2: Cantidad */}
                    <div className="flex items-center justify-center gap-1 border border-danashop-textSecondary/50 rounded-lg overflow-hidden w-fit mx-auto">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-bgForms/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-danashop-textSecondary"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-danashop-textPrimary">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-bgForms/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-danashop-textSecondary"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Col 3: Precio */}
                    <div className="text-right">
                      <p className="text-xs text-danashop-textMuted">Unitario</p>
                      <p className="text-sm font-bold text-blue-500">{formatCOP(item.precio)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs font-black text-danashop-brandSoft mt-0.5">{formatCOP(item.precio * item.quantity)}</p>
                      )}
                    </div>

                    {/* Col 4: Eliminar */}
                    <button
                      onClick={() => handleRemove(item.id, item.nombre)}
                      className="p-1.5 text-danashop-error/60 hover:text-danashop-error hover:bg-danashop-error/10 rounded-lg transition-colors"
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
                <div key={item.id} className="bg-danashop-bgColorCard rounded-xl border border-danashop-borderColor overflow-hidden">
                  {/* Fila principal */}
                  <div className="flex gap-3 p-3">
                    <Link href={`/${item.slug}`} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-danashop-borderColor group">
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <Link href={`/${item.slug}`} className="text-sm font-bold text-danashop-textPrimary line-clamp-2 leading-snug hover:text-danashop-brandSoft transition-colors">
                        {item.nombre}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-black text-blue-500">{formatCOP(item.precio)}</span>
                        {item.categorias?.slice(0, 1).map((cat, idx) => (
                          <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-bgForms/30 text-danashop-brandSoft px-1.5 py-0.5 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fila de acciones */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-danashop-borderColor bg-bgForms/20">
                    {/* Cantidad */}
                    <div className="flex items-center gap-1 border border-danashop-borderColor rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-bgForms/30 disabled:opacity-30 transition-colors text-danashop-textSecondary"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-danashop-textPrimary">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-bgForms/30 disabled:opacity-30 transition-colors text-danashop-textSecondary"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Subtotal + eliminar */}
                    <div className="flex items-center gap-3">
                      {item.quantity > 1 && (
                        <div className="text-right">
                          <p className="text-[10px] text-danashop-textMuted">Subtotal</p>
                          <p className="text-sm font-black text-danashop-brandSoft">{formatCOP(item.precio * item.quantity)}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemove(item.id, item.nombre)}
                        className="p-1.5 text-danashop-error/60 hover:text-danashop-error hover:bg-danashop-error/10 rounded-lg transition-colors"
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
            <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5 sticky top-24">
              <h2 className="text-base font-bold text-danashop-textPrimary mb-4 pb-3 border-b border-danashop-borderColor">
                Resumen del Pedido
              </h2>

              <div className="space-y-2.5 pb-4 border-b border-danashop-borderColor">
                <div className="flex justify-between text-sm">
                  <span className="text-danashop-textSecondary">Subtotal</span>
                  <span className="font-semibold text-danashop-textPrimary">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-danashop-textSecondary">Envío</span>
                  <span className="font-semibold">
                    {envio === 0
                      ? <span className="text-danashop-success font-bold">GRATIS</span>
                      : <span className="text-danashop-textPrimary">{formatCOP(envio)}</span>}
                  </span>
                </div>
                {envio > 0 && (
                  <p className="text-xs text-danashop-accentHighlight bg-danashop-accentHighlight/10 px-2 py-1 rounded-lg">
                    🎁 ¡Envío gratis en compras mayores a $100.000!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-bold text-danashop-textPrimary">Total</span>
                <span className="text-xl font-black text-danashop-accentAction">{formatCOP(total)}</span>
              </div>

              <button
                className="w-full py-3 rounded-xl font-bold text-danashop-textDark bg-danashop-accentAction hover:brightness-110 hoverEffect flex items-center justify-center gap-2"
                onClick={() => router.push("/checkout")}
              >
                Proceder al Pago
                <ArrowRight size={18} />
              </button>

              <Link
                href="/tienda"
                className="block text-center mt-3 text-xs text-danashop-textMuted hover:text-danashop-brandSoft transition-colors"
              >
                ← Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Carrito vacío */
        <div className="flex min-h-100 flex-col items-center justify-center space-y-5 px-4 text-center bg-danashop-bgColorCard rounded-2xl border border-dashed border-danashop-borderColor">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-danashop-brandMain/30" />
            <ShoppingCart className="h-16 w-16 text-danashop-borderColor" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h2 className="text-xl font-bold text-danashop-textPrimary">Tu carrito está vacío</h2>
            <p className="text-danashop-textSecondary text-sm">¡Agrega productos increíbles y comienza a comprar!</p>
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

export default CartProducts;