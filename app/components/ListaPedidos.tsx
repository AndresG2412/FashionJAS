"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import { Store, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { getOrdersByUser, type Order } from "@/lib/firebase/order";

const statusStyles: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "en-envio": "bg-blue-100 text-blue-700 border border-blue-200",
  entregado: "bg-green-100 text-green-700 border border-green-200",
  cancelado: "bg-red-100 text-red-700 border border-red-200",
};

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  "en-envio": "En Envío",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const safeImageUrl = (url?: string) => {
  if (!url || typeof url !== "string") return "/placeholder.png";
  try {
    return encodeURI(url.replace("http://", "https://"));
  } catch {
    return "/placeholder.png";
  }
};

const ListaPedidos = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleOrders, setVisibleOrders] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    getOrdersByUser(user.id).then(setOrders);
  }, [user?.id]);

  const loadMore = () => {
    setVisibleOrders((prev) => Math.min(prev + 3, orders.length));
  };

  const handleCancelRequest = (order: Order) => {
    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold">
          Cancelar este pedido puede generar un costo por cancelación.
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              toast.dismiss(t.id);
              showCancelOptions(order);
            }}
          >
            Continuar
          </Button>

          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)}>
            Volver
          </Button>
        </div>
      </div>
    ));
  };

  const showCancelOptions = (order: Order) => {
    const message = encodeURIComponent(
      `Hola, deseo cancelar el pedido ${order.reference}.\nProductos: ${order.items
        .map((i) => i.name)
        .join(", ")}`
    );

    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold">¿Cómo deseas solicitar la cancelación?</p>

        <div className="flex flex-col gap-2">
          <Link
            href={`https://wa.me/573157870130?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              WhatsApp
            </Button>
          </Link>
          <Button variant="outline" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Container className="py-10">
        {orders?.length > 0 ? (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Mis pedidos</h1>
              <p className="text-gray-600 mt-2">
                Tienes {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
              </p>
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Pedido</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Productos</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, visibleOrders).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{order.reference}</p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("es-CO", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="relative w-12 h-12 border rounded-lg overflow-hidden bg-gray-100"
                            >
                              <Image
                                src={safeImageUrl(item?.image)}
                                alt={item?.name || "Producto"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="w-12 h-12 border rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            statusStyles[order.status]
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        {order.total?.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </td>

                      <td className="p-4 text-center">
                        {order.status !== "entregado" && order.status !== "cancelado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequest(order);
                            }}
                          >
                            Solicitar cancelación
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="md:hidden grid gap-4">
              {orders.slice(0, visibleOrders).map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-xl border shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{order.reference}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("es-CO")
                          : "-"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        statusStyles[order.status]
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div
                        key={i}
                        className="relative w-16 h-16 hrink-0 border rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={safeImageUrl(item?.image)}
                          alt={item?.name || "Producto"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-16 h-16 hrink-0 border rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="font-black text-blue-600">
                    {order.total?.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </p>

                  {order.status !== "entregado" && order.status !== "cancelado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelRequest(order);
                      }}
                    >
                      Solicitar cancelación
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            {visibleOrders < orders.length && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" onClick={loadMore}>
                  Cargar más ({orders.length - visibleOrders} restantes)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200 py-12">
            <Store className="h-20 w-20 text-gray-200" strokeWidth={1} />
            <h2 className="text-2xl font-bold text-gray-900">Tu lista está vacía</h2>
            <p className="text-gray-600 max-w-md">
              Aún no has realizado ningún pedido. ¡Explora nuestra tienda y encuentra productos increíbles!
            </p>
            <Button asChild size="lg" className="rounded-full px-10">
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* ================= MODAL DETALLE ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Detalle del pedido</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedOrder.reference}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Estado y fecha */}
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-600">Estado:</p>
                  <span
                    className={`inline-block mt-1 text-sm font-bold px-3 py-1 rounded-full ${
                      statusStyles[selectedOrder.status]
                    }`}
                  >
                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fecha:</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Productos ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-20 h-20 hrink-0 border rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={safeImageUrl(item?.image)}
                          alt={item?.name || "Producto"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item?.name || "Sin nombre"}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Cantidad: <span className="font-semibold">{item?.quantity || 0}</span>
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {((item?.price || 0) * (item?.quantity || 0)).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dirección de envío */}
              {selectedOrder.shipping && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Dirección de envío:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{selectedOrder.shipping.address || "No especificada"}</p>
                    <p className="text-gray-700 mt-1">
                      {selectedOrder.shipping.city}, {selectedOrder.shipping.state}
                    </p>
                    {selectedOrder.shipping.postalCode && (
                      <p className="text-gray-700">CP: {selectedOrder.shipping.postalCode}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {(selectedOrder.subtotal || 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {(selectedOrder.shippingCost || 0) === 0
                      ? "GRATIS"
                      : (selectedOrder.shippingCost || 0).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>
                    {(selectedOrder.total || 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <Button onClick={() => setSelectedOrder(null)} className="w-full" size="lg">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaPedidos;