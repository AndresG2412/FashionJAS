"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import { Store, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Order } from "@/lib/firebase/order";

// ✅ Server Action en lugar de llamada directa a Firebase desde el cliente
import { getOrders } from "@/app/actions/orderActions";

const statusStyles: Record<string, string> = {
  pendiente: "bg-eshop-bgCard text-eshop-goldDeep border border-eshop-borderEmphasis/30",
  "en-envio": "bg-eshop-accent/10 text-eshop-accent border border-eshop-accent/20",
  entregado: "bg-green-50 text-green-700 border border-green-200",
  cancelado: "bg-eshop-textError/5 text-eshop-textError border border-eshop-textError/10",
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleOrders, setVisibleOrders] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // ✅ Sin user?.id — el Server Action verifica internamente con Clerk
    getOrders().then(setOrders).catch(console.error);
  }, []);

  const loadMore = () => {
    setVisibleOrders((prev) => Math.min(prev + 3, orders.length));
  };

  const handleCancelRequest = (order: Order) => {
    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold text-eshop-textPrimary">
          Cancelar este pedido puede generar un costo por cancelación.
        </p>
        <div className="flex gap-2">
          <Button size="sm" className="bg-eshop-textError text-white hover:opacity-90" onClick={() => { toast.dismiss(t.id); showCancelOptions(order); }}>
            Continuar
          </Button>
          <Button size="sm" variant="outline" className="border-eshop-borderSubtle text-eshop-textSecondary" onClick={() => toast.dismiss(t.id)}>
            Volver
          </Button>
        </div>
      </div>
    ), { style: { background: '#FFFFFF', color: '#1A1A1A', border: '1px solid #E2D1B3' } });
  };

  const showCancelOptions = (order: Order) => {
    const message = encodeURIComponent(`Hola, deseo cancelar el pedido ${order.reference}.\nProductos: ${order.items.map((i) => i.name).join(", ")}`);
    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold text-eshop-textPrimary">¿Cómo deseas solicitar la cancelación?</p>
        <div className="flex flex-col gap-2">
          <Link href={`https://wa.me/573204504785?text=${message}`} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#25D366] hover:opacity-90 text-white border-none">WhatsApp</Button>
          </Link>
          <Button variant="outline" className="border-eshop-borderSubtle text-eshop-textSecondary" onClick={() => toast.dismiss(t.id)}>
            Cerrar
          </Button>
        </div>
      </div>
    ), { style: { background: '#FFFFFF', color: '#1A1A1A', border: '1px solid #E2D1B3' } });
  };

  return (
    <>
      <Container className="py-10 bg-eshop-bgMain">
        {orders?.length > 0 ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl text-eshop-textPrimary font-bold tracking-tight">Mis pedidos</h1>
              <p className="text-eshop-textSecondary mt-2 font-medium">
                Tienes {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} registrados
              </p>
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden md:block overflow-hidden bg-eshop-bgWhite rounded-xl border border-eshop-borderSubtle shadow-sm">
              <table className="w-full">
                <thead className="bg-eshop-bgCard/50 border-b border-eshop-borderSubtle">
                  <tr>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Pedido</th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Productos</th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Estado</th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Total</th>
                    <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-eshop-textSecondary">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eshop-borderSubtle">
                  {orders.slice(0, visibleOrders).map((order) => (
                    <tr key={order.id} className="cursor-pointer hover:bg-eshop-bgCard/20 transition-colors" onClick={() => setSelectedOrder(order)}>
                      <td className="p-4">
                        <p className="font-bold text-eshop-textPrimary">{order.reference}</p>
                        <p className="text-xs text-eshop-textDisabled font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="relative w-10 h-10 border border-eshop-borderSubtle rounded-lg overflow-hidden bg-eshop-bgCard">
                              <Image src={safeImageUrl(item?.image)} alt={item?.name || "Producto"} fill className="object-cover" unoptimized />
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="w-10 h-10 border border-eshop-borderSubtle rounded-lg bg-eshop-bgWhite flex items-center justify-center">
                              <span className="text-xs font-bold text-eshop-goldDeep">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-eshop-textPrimary">
                        {order.total?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                      </td>
                      <td className="p-4 text-center">
                        {order.status !== "entregado" && order.status !== "cancelado" && (
                          <Button variant="outline" size="sm" className="text-eshop-textError border-eshop-textError/30 hover:bg-eshop-textError hover:text-white transition-all text-xs font-bold"
                            onClick={(e) => { e.stopPropagation(); handleCancelRequest(order); }}>
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
                <div key={order.id} className="bg-eshop-bgWhite p-5 rounded-2xl border border-eshop-borderSubtle shadow-sm space-y-4 cursor-pointer hover:border-eshop-borderEmphasis transition-all" onClick={() => setSelectedOrder(order)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-eshop-textPrimary">{order.reference}</p>
                      <p className="text-xs text-eshop-textDisabled mt-1 font-medium">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-CO") : "-"}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {order.items?.map((item, i) => (
                      <div key={i} className="relative w-14 h-14 shrink-0 border border-eshop-borderSubtle rounded-xl overflow-hidden bg-eshop-bgCard">
                        <Image src={safeImageUrl(item?.image)} alt="item" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-bold text-eshop-textPrimary text-lg">
                      {order.total?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                    </p>
                    {order.status !== "entregado" && order.status !== "cancelado" && (
                      <Button variant="outline" size="sm" className="text-eshop-textError border-eshop-textError/20 font-bold"
                        onClick={(e) => { e.stopPropagation(); handleCancelRequest(order); }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleOrders < orders.length && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" className="border-eshop-borderEmphasis text-eshop-textPrimary hover:bg-eshop-bgCard font-bold rounded-full px-8" onClick={loadMore}>
                  Cargar más ({orders.length - visibleOrders})
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center bg-eshop-bgWhite rounded-3xl border border-dashed border-eshop-borderEmphasis py-16">
            <div className="relative">
              <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-eshop-accent/20" />
              <Store className="h-16 w-16 text-eshop-borderSubtle" strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-bold text-eshop-textPrimary">No tienes pedidos aún</h2>
            <p className="text-eshop-textSecondary max-w-md font-medium">
              ¡Explora nuestra tienda y encuentra productos increíbles para empezar tu primera orden!
            </p>
            <Link href="/tienda" className="rounded-xl px-8 py-2.5 text-eshop-textDark text-sm font-bold bg-eshop-buttonBase hover:bg-eshop-buttonHover hoverEffect">
              Ir a la Tienda
            </Link>
          </div>
        )}
      </Container>

      {/* ================= MODAL DETALLE ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-eshop-textDark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-eshop-bgWhite rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-eshop-borderSubtle">
            <div className="flex justify-between items-center p-6 border-b border-eshop-borderSubtle bg-eshop-bgCard/30">
              <div>
                <h2 className="text-2xl font-bold text-eshop-textPrimary">Detalle del pedido</h2>
                <p className="text-sm text-eshop-goldDeep mt-1 font-mono font-bold">{selectedOrder.reference}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-eshop-bgCard text-eshop-textSecondary rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-eshop-bgCard/20 rounded-xl border border-eshop-borderSubtle">
                <div>
                  <p className="text-[10px] text-eshop-textDisabled uppercase font-black mb-1">Estado</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-eshop-textDisabled uppercase font-black mb-1">Fecha</p>
                  <p className="font-bold text-eshop-textPrimary">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-eshop-textPrimary mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-eshop-buttonBase rounded-full" />
                  Productos ({selectedOrder.items?.length || 0})
                </h3>
                <div className="grid gap-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 border border-eshop-borderSubtle rounded-xl bg-eshop-bgWhite">
                      <div className="relative w-20 h-20 shrink-0 border border-eshop-borderSubtle rounded-lg overflow-hidden bg-eshop-bgCard">
                        <Image src={safeImageUrl(item?.image)} alt="item" fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-eshop-textPrimary">{item?.name || "Sin nombre"}</p>
                        <p className="text-sm text-eshop-textSecondary mt-1 font-medium">Cantidad: <span className="text-eshop-goldDeep font-bold">{item?.quantity || 0}</span></p>
                        <p className="text-sm font-bold text-eshop-textPrimary mt-1">
                          {((item?.price || 0) * (item?.quantity || 0)).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.shipping && (
                <div className="p-4 bg-eshop-bgCard/30 border border-eshop-borderSubtle rounded-xl">
                  <h3 className="font-bold text-eshop-textPrimary mb-2 text-xs uppercase tracking-wider">Dirección de envío</h3>
                  <p className="text-eshop-textSecondary font-medium">{selectedOrder.shipping.address}</p>
                  <p className="text-eshop-textDisabled text-sm font-medium">{selectedOrder.shipping.city}, {selectedOrder.shipping.state}</p>
                </div>
              )}

              <div className="bg-eshop-bgCard/10 p-5 rounded-xl border border-eshop-borderSubtle space-y-3">
                <div className="flex justify-between text-eshop-textSecondary text-sm font-medium">
                  <span>Subtotal:</span>
                  <span className="text-eshop-textPrimary font-bold">{(selectedOrder.subtotal || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-eshop-textSecondary text-sm font-medium">
                  <span>Envío:</span>
                  <span className="text-eshop-accent font-bold">{(selectedOrder.shippingCost || 0) === 0 ? "GRATIS" : (selectedOrder.shippingCost || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-eshop-textPrimary pt-3 border-t border-eshop-borderSubtle">
                  <span>Total:</span>
                  <span>{(selectedOrder.total || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-eshop-borderSubtle bg-eshop-bgWhite">
              <Button onClick={() => setSelectedOrder(null)} className="w-full bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark py-6 text-lg font-bold rounded-xl border-none transition-all">
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