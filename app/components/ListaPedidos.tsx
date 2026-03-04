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

// Estilos de estado adaptados al modo oscuro
const statusStyles: Record<string, string> = {
  pendiente: "bg-danashop-warning/10 text-danashop-warning border border-danashop-warning/30",
  "en-envio": "bg-danashop-inCart/10 text-danashop-inCart border border-danashop-inCart/30",
  entregado: "bg-danashop-success/10 text-danashop-success border border-danashop-success/30",
  cancelado: "bg-danashop-error/10 text-danashop-error border border-danashop-error/30",
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
        <p className="font-semibold text-danashop-textPrimary">
          Cancelar este pedido puede generar un costo por cancelación.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-danashop-error text-white hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              showCancelOptions(order);
            }}
          >
            Continuar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-danashop-borderColor text-danashop-textSecondary"
            onClick={() => toast.dismiss(t.id)}
          >
            Volver
          </Button>
        </div>
      </div>
    ), { style: { background: '#1C182D', color: '#F3F4F6', border: '1px solid #2D2845' } });
  };

  const showCancelOptions = (order: Order) => {
    const message = encodeURIComponent(`Hola, deseo cancelar el pedido ${order.reference}.\nProductos: ${order.items.map((i) => i.name).join(", ")}`);

    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold text-danashop-textPrimary">¿Cómo deseas solicitar la cancelación?</p>
        <div className="flex flex-col gap-2">
          <Link
            href={`https://wa.me/573157870130?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-danashop-success hover:bg-green-600 text-white">
              WhatsApp
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-danashop-borderColor text-danashop-textSecondary"
            onClick={() => toast.dismiss(t.id)}
          >
            Cerrar
          </Button>
        </div>
      </div>
    ), { style: { background: '#1C182D', color: '#F3F4F6', border: '1px solid #2D2845' } });
  };

  return (
    <>
      <Container className="py-10">
        {orders?.length > 0 ? (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl text-danashop-textPrimary font-bold tracking-tight">Mis pedidos</h1>
              <p className="text-danashop-textSecondary mt-2">
                Tienes {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} registrados
              </p>
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden md:block overflow-hidden bg-danashop-bgColorCard rounded-xl border border-danashop-borderColor shadow-xl">
              <table className="w-full">
                <thead className="bg-danashop-colorMain/80 border-b border-danashop-borderColor">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-danashop-textPrimary">Pedido</th>
                    <th className="p-4 text-left text-sm font-bold text-danashop-textPrimary">Productos</th>
                    <th className="p-4 text-left text-sm font-bold text-danashop-textPrimary">Estado</th>
                    <th className="p-4 text-left text-sm font-bold text-danashop-textPrimary">Total</th>
                    <th className="p-4 text-center text-sm font-bold text-danashop-textPrimary">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, visibleOrders).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-danashop-borderColor cursor-pointer hover:bg-danashop-hover transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4">
                        <p className="font-bold text-danashop-brandSoft">{order.reference}</p>
                        <p className="text-xs text-danashop-textMuted">
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
                              className="relative w-10 h-10 border border-danashop-borderColor rounded-lg overflow-hidden bg-danashop-colorMain"
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
                            <div className="w-10 h-10 border border-danashop-borderColor rounded-lg bg-danashop-colorMain flex items-center justify-center">
                              <span className="text-xs font-bold text-danashop-brandMain">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-danashop-textPrimary">
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
                            className="text-danashop-error border-danashop-error/30 hover:bg-danashop-error hover:text-white transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequest(order);
                            }}
                          >
                            Cancelar
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
                  className="bg-danashop-bgColorCard p-5 rounded-2xl border border-danashop-borderColor shadow-lg space-y-4 cursor-pointer hover:border-danashop-brandSoft/50 transition-all"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-danashop-brandSoft">{order.reference}</p>
                      <p className="text-xs text-danashop-textSecondary mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-CO") : "-"}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {order.items?.map((item, i) => (
                      <div key={i} className="relative w-14 h-14 shrink-0 border border-danashop-borderColor rounded-xl overflow-hidden bg-danashop-colorMain">
                        <Image src={safeImageUrl(item?.image)} alt="item" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="font-black text-danashop-accentAction text-lg">
                      {order.total?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                    </p>
                    {order.status !== "entregado" && order.status !== "cancelado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-danashop-error border-danashop-error/20"
                        onClick={(e) => { e.stopPropagation(); handleCancelRequest(order); }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            {visibleOrders < orders.length && (
              <div className="flex justify-center mt-10">
                <Button 
                  variant="outline" 
                  className="border-danashop-borderColor text-danashop-brandSoft hover:bg-danashop-brandMain hover:text-white"
                  onClick={loadMore}
                >
                  Cargar más ({orders.length - visibleOrders})
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center bg-danashop-bgColorCard rounded-3xl border border-dashed border-danashop-borderColor py-12">
            <div className="p-6 bg-danashop-colorMain rounded-full">
                <Store className="h-16 w-16 text-danashop-brandSoft" strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-bold text-danashop-textPrimary">Tu lista está vacía</h2>
            <p className="text-danashop-textSecondary max-w-md">
              Aún no has realizado ningún pedido. ¡Explora nuestra tienda y encuentra productos increíbles!
            </p>
            <Button asChild size="lg" className="bg-danashop-brandMain hover:bg-danashop-brandHover text-white rounded-full px-10">
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* ================= MODAL DETALLE ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-danashop-colorMain/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-danashop-bgColorCard rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-danashop-borderColor">
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-danashop-borderColor bg-danashop-colorMain/80">
              <div className="">
                <h2 className="text-2xl font-bold text-danashop-textPrimary">Detalle del pedido</h2>
                <p className="text-sm text-danashop-brandSoft mt-1 font-mono tracking-tighter">{selectedOrder.reference}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-danashop-hover text-danashop-textSecondary rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-danashop-colorMain rounded-xl border border-danashop-borderColor">
                <div>
                  <p className="text-xs text-danashop-textMuted uppercase font-bold mb-1">Estado</p>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${statusStyles[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-danashop-textMuted uppercase font-bold mb-1">Fecha</p>
                  <p className="font-semibold text-danashop-textPrimary">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-bold text-danashop-textPrimary mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-danashop-brandMain rounded-full" />
                  Productos ({selectedOrder.items?.length || 0})
                </h3>
                <div className="grid gap-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 border border-danashop-borderColor rounded-xl bg-danashop-colorMain/50">
                      <div className="relative w-20 h-20 shrink-0 border border-danashop-borderColor rounded-lg overflow-hidden bg-danashop-colorMain">
                        <Image src={safeImageUrl(item?.image)} alt="item" fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-danashop-textPrimary">{item?.name || "Sin nombre"}</p>
                        <p className="text-sm text-danashop-textSecondary mt-1">
                          Cantidad: <span className="text-danashop-brandSoft font-bold">{item?.quantity || 0}</span>
                        </p>
                        <p className="text-sm font-black text-danashop-accentAction mt-1">
                          {((item?.price || 0) * (item?.quantity || 0)).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dirección */}
              {selectedOrder.shipping && (
                <div className="p-4 bg-danashop-colorMain border border-danashop-borderColor rounded-xl">
                  <h3 className="font-bold text-danashop-textPrimary mb-2 text-sm uppercase tracking-wider">Dirección de envío</h3>
                  <p className="text-danashop-textSecondary">{selectedOrder.shipping.address}</p>
                  <p className="text-danashop-textMuted text-sm">{selectedOrder.shipping.city}, {selectedOrder.shipping.state}</p>
                </div>
              )}

              {/* Totales */}
              <div className="bg-danashop-colorMain p-5 rounded-xl border border-danashop-borderColor space-y-3">
                <div className="flex justify-between text-danashop-textSecondary text-sm">
                  <span>Subtotal:</span>
                  <span className="font-bold">{(selectedOrder.subtotal || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-danashop-textSecondary text-sm">
                  <span>Envío:</span>
                  <span className="text-danashop-success font-bold">{(selectedOrder.shippingCost || 0) === 0 ? "GRATIS" : (selectedOrder.shippingCost || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-danashop-textPrimary pt-3 border-t border-danashop-borderColor">
                  <span>Total:</span>
                  <span className="text-danashop-accentAction">{(selectedOrder.total || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-danashop-borderColor bg-danashop-colorMain">
              <Button onClick={() => setSelectedOrder(null)} className="w-full bg-danashop-brandMain hover:bg-danashop-brandHover text-white py-6 text-lg font-bold rounded-xl transition-all">
                Cerrar Detalle
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaPedidos;