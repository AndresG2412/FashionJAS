"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Package, Search, Filter, Calendar } from "lucide-react";
import { updateOrderStatus, searchOrdersAdmin, getOrdersByStatus } from "@/lib/firebase/admin";
import type { Order } from "@/lib/firebase/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import OrderDetailsModal from "./OrderDetailsModal";
import Image from "next/image";

interface Props {
  initialOrders: Order[];
}

export default function OrdersTable({ initialOrders }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setOrders(initialOrders);
      return;
    }

    setLoading(true);
    try {
      const results = await searchOrdersAdmin(searchText);
      setOrders(results);
      
      if (results.length === 0) {
        toast("No se encontraron pedidos", { icon: "🔍" });
      }
    } catch (error) {
      toast.error("Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (status: Order["status"] | "all") => {
    setStatusFilter(status);
    
    if (status === "all") {
      setOrders(initialOrders);
      return;
    }

    setLoading(true);
    try {
      const results = await getOrdersByStatus(status);
      setOrders(results);
    } catch (error) {
      toast.error("Error al filtrar");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Actualizar en el estado local
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Pedido actualizado a: ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "en-envio": "bg-blue-100 text-blue-700 border-blue-200",
      entregado: "bg-green-100 text-green-700 border-green-200",
      cancelado: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      pendiente: "Pendiente",
      "en-envio": "En Envío",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="bg-danashop-bgColorCard rounded-lg border-2 border-danashop-brandSoft shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-danashop-textSecondary mx-auto mb-4" />
        <p className="text-danashop-textPrimary mb-2">No hay pedidos registrados</p>
        <p className="text-sm text-danashop-textSecondary">Los pedidos aparecerán aquí cuando se realicen compras</p>
      </div>
    );
  }

  return (
  <div className="space-y-6">
    {/* Filtros */}
    <div className="bg-danashop-bgColorCard rounded-2xl border border-danashop-borderColor p-6 shadow-xl space-y-6">
      {/* Búsqueda */}
      <div>
        <label className="block text-sm font-bold text-danashop-textSecondary mb-3 uppercase tracking-wider">
          Buscar pedido:
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Referencia, email o nombre..."
            className="flex-1 bg-danashop-colorMain border border-danashop-borderColor rounded-xl px-4 py-2.5 text-danashop-textPrimary placeholder:text-danashop-textMuted focus:outline-none focus:ring-2 focus:ring-danashop-focus focus:border-transparent transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-danashop-brandMain text-white rounded-xl hover:bg-danashop-brandHover transition-all flex items-center gap-2 font-bold shadow-lg shadow-danashop-brandMain/20 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Filtro por estado */}
      <div>
        <label className="text-sm font-bold text-danashop-textSecondary mb-3 flex items-center gap-2 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-danashop-brandSoft" />
          Filtrar por estado:
        </label>
        <div className="flex flex-wrap gap-2">
          {(["all", "pendiente", "en-envio", "entregado", "cancelado"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${
                statusFilter === status
                  ? "bg-danashop-brandMain border-danashop-brandMain text-white shadow-lg shadow-danashop-brandMain/20"
                  : "bg-danashop-colorMain border-danashop-borderColor text-danashop-textSecondary hover:border-danashop-brandSoft"
              }`}
            >
              {status === "all" ? "Todos" : status.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Tabla de pedidos */}
    <div className="bg-danashop-bgColorCard rounded-2xl border border-danashop-borderColor shadow-xl overflow-hidden">
      <div className="divide-y divide-danashop-borderColor">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="group transition-colors hover:bg-danashop-colorMain/40">
              {/* Resumen del pedido */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id!)}
                    className="p-2.5 bg-danashop-colorMain border border-danashop-borderColor hover:border-danashop-brandSoft rounded-xl text-danashop-brandSoft transition-all"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-danashop-textPrimary tracking-tight text-lg group-hover:text-danashop-brandSoft transition-colors">
                      {order.reference}
                    </p>
                    <p className="text-sm text-danashop-textSecondary font-medium truncate">
                      {order.customer.name}
                    </p>
                    <p className="text-[10px] text-danashop-textMuted uppercase font-bold mt-1">
                      {order.createdAt && format(order.createdAt, "dd MMM yyyy - HH:mm", { locale: es })}
                    </p>
                  </div>

                  <div className="text-right hidden md:block px-4">
                    <p className="font-black text-danashop-accentAction text-lg">
                      {order.total.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-danashop-textMuted font-bold uppercase tracking-tighter">
                      {order.items.length} producto(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Aquí asumo que getStatusBadge usa los colores de statusStyles que definimos antes */}
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Detalles expandidos */}
              {isExpanded && (
                <div className="px-5 pb-6 ml-14 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="h-px bg-danashop-borderColor w-full" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Lista de Productos */}
                    <div>
                      <h4 className="text-xs font-black text-danashop-brandSoft uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Productos
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-danashop-colorMain border border-danashop-borderColor rounded-xl">
                            {item.image && (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-danashop-borderColor bg-danashop-bgColorCard">
                                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-bold text-danashop-textPrimary">{item.name}</p>
                              <p className="text-xs text-danashop-textSecondary mt-1">
                                <span className="text-danashop-brandSoft">{item.quantity}</span> x{" "}
                                {item.price.toLocaleString("es-CO", {
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

                    {/* Información de Envío */}
                    <div>
                      <h4 className="text-xs font-black text-danashop-brandSoft uppercase tracking-widest mb-4">Información de Envío</h4>
                      <div className="p-4 bg-danashop-colorMain border border-danashop-borderColor rounded-xl text-sm space-y-2">
                        <p className="font-bold text-danashop-textPrimary text-base">{order.customer.name}</p>
                        <div className="space-y-1 text-danashop-textSecondary font-medium">
                          <p className="flex items-center gap-2">📩 {order.customer.email}</p>
                          <p className="flex items-center gap-2">📱 {order.customer.phone}</p>
                          <div className="mt-3 pt-3 border-t border-danashop-borderColor/50">
                            <p className="text-danashop-textPrimary italic">"{order.shipping.address}"</p>
                            <p className="font-bold text-danashop-brandSoft mt-1">
                              {order.shipping.city}, {order.shipping.state}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Admin */}
                  <div className="pt-4 border-t border-danashop-borderColor flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                    <div className="w-full md:w-auto">
                      <h4 className="text-[10px] font-black text-danashop-textMuted uppercase tracking-widest mb-2">Cambiar estado del pedido:</h4>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id!, e.target.value as Order["status"])}
                        className="w-full md:w-64 bg-danashop-colorMain border border-danashop-borderColor text-danashop-textPrimary rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-danashop-focus outline-none font-bold"
                      >
                        <option value="pendiente">🟠 Pendiente</option>
                        <option value="en-envio">🔵 En Envío</option>
                        <option value="entregado">🟢 Entregado</option>
                        <option value="cancelado">🔴 Cancelado</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full md:w-auto px-6 py-2.5 bg-danashop-bgColorCard border border-danashop-brandMain text-danashop-brandMain font-black text-sm rounded-xl hover:bg-danashop-brandMain hover:text-white transition-all shadow-lg"
                    >
                      Ver todos los detalles
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Modal de detalles */}
    {selectedOrder && (
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    )}
  </div>
)
}