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
      <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No hay pedidos registrados</p>
        <p className="text-sm text-gray-400">Los pedidos aparecerán aquí cuando se realicen compras</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar pedido:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Referencia, email o nombre..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar por estado:
          </label>
          <div className="flex flex-wrap gap-2">
            {(["all", "pendiente", "en-envio", "entregado", "cancelado"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="divide-y">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                {/* Resumen del pedido */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id!)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{order.reference}</p>
                      <p className="text-sm text-gray-600">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt && format(order.createdAt, "dd MMM yyyy - HH:mm", { locale: es })}
                      </p>
                    </div>

                    <div className="text-right hidden md:block">
                      <p className="font-bold text-gray-900">
                        {order.total.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{order.items.length} producto(s)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Detalles expandidos */}
                {isExpanded && (
                  <div className="mt-4 pl-12 pr-4 space-y-4 border-t pt-4">
                    {/* Productos */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Productos:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            {item.image && (
                              <div className="relative w-12 h-12 rounded overflow-hidden border">
                                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} x{" "}
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

                    {/* Dirección de envío */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Envío:</h4>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-gray-600">{order.customer.email}</p>
                        <p className="text-gray-600">{order.customer.phone}</p>
                        <p className="text-gray-600 mt-2">
                          {order.shipping.address}
                          <br />
                          {order.shipping.city}, {order.shipping.state}
                          {order.shipping.postalCode && ` - ${order.shipping.postalCode}`}
                        </p>
                      </div>
                    </div>

                    {/* Cambiar estado */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cambiar estado:</h4>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id!, e.target.value as Order["status"])}
                        className="w-full md:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en-envio">En Envío</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    {/* Botón ver más detalles */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver todos los detalles
                    </button>
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
  );
}