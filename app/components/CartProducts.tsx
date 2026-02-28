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
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await clearCart(user?.id);
              toast.dismiss(t.id);
              toast.success("Carrito vaciado");
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

  const subtotal = getCartTotal();
  const envio = subtotal > 100000 ? 0 : 15000; // Envío gratis sobre $100k
  const total = subtotal + envio;

  return (
    <Container className="py-10">
      {cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
                <p className="text-gray-600 mt-2">
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
                </p>
              </div>
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Vaciar Carrito
              </Button>
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Imagen */}
                    <Link
                      href={`/${item.slug}`}
                      className="relative h-32 w-32 shrink-0 border rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/${item.slug}`}
                          className="text-lg font-bold text-gray-900 hover:text-shop_light_green transition-colors line-clamp-2"
                        >
                          {item.nombre}
                        </Link>
                        <div className="flex gap-2 mt-2">
                          {item.categorias?.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs uppercase font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        {/* Cantidad */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">Cantidad:</span>
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-xs text-gray-500">
                            (Stock: {item.stock})
                          </span>
                        </div>

                        {/* Precio */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Precio unitario</p>
                            <p className="text-lg font-bold text-blue-600">
                              {item.precio.toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id, item.nombre)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal del producto */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal del producto:</span>
                    <span className="text-xl font-bold text-shop_dark_green">
                      {(item.precio * item.quantity).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* VISTA MÓVIL */}
            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Imagen */}
                    <Link
                      href={`/${item.slug}`}
                      className="relative h-24 w-24 shrink-0 border rounded-lg overflow-hidden"
                    >
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1">
                      <Link
                        href={`/${item.slug}`}
                        className="text-sm font-bold text-gray-900 line-clamp-2"
                      >
                        {item.nombre}
                      </Link>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        {item.precio.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Cantidad y acciones */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id, item.nombre)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                    <span className="text-xs text-gray-600">Subtotal:</span>
                    <span className="text-sm font-bold text-shop_dark_green">
                      {(item.precio * item.quantity).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {envio === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      envio.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })
                    )}
                  </span>
                </div>
                {envio > 0 && (
                  <p className="text-xs text-gray-500">
                    ¡Envío gratis en compras mayores a $100,000!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-shop_dark_green">
                  {total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>

              <Button
                className="w-full mt-6 py-6 text-lg font-bold"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                Proceder al Pago
                <ArrowRight className="ml-2" size={20} />
              </Button>

              <Link href="/tienda"
                className="block text-center mt-4 text-sm text-gray-600 hover:text-shop_light_green transition-colors"
              >
                ← Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Carrito vacío */
        <div className="flex min-h-125 flex-col items-center justify-center space-y-6 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-blue-100" />
            <ShoppingCart className="h-20 w-20 text-gray-200" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
            <p className="text-gray-500">
              ¡Agrega productos increíbles y comienza a comprar!
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-10">
            <Link href="/tienda">Explorar Productos</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CartProducts;