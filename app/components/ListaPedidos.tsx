"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import { Store } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { getOrdersByUser, type Order } from "@/lib/firebase/order";

const ADMIN_EMAIL = "cgaviria930@gmail.com";

const statusStyles: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  "en-envio": "bg-blue-100 text-blue-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
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

  /* ================= CANCEL ================= */

  const handleCancelRequest = (order: Order) => {
    toast((t) => (
      <div className="space-y-3">
        <p className="font-semibold">
          Cancelar este pedido puede generar un costo por cancelación.
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-red-500 text-white"
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
          <a href={`https://wa.me/573001112233?text=${message}`} target="_blank">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              WhatsApp
            </Button>
          </a>

          <Button
            variant="outline"
            onClick={async () => {
              await fetch("/api/orders/request-cancel", {
                method: "POST",
                body: JSON.stringify({
                  adminEmail: ADMIN_EMAIL,
                  orderId: order.id,
                  reference: order.reference,
                  userName: user?.fullName,
                  products: order.items.map((i) => i.name).join(", "),
                }),
              });

              toast.success("Solicitud enviada por correo");
              toast.dismiss(t.id);
            }}
          >
            Enviar por correo
          </Button>
        </div>
      </div>
    ));
  };

  /* ================= UI ================= */

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

            {/* ================= PC ================= */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">Pedido</th>
                    <th className="p-4 text-left">Productos</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, visibleOrders).map(order => (
                    <tr
                      key={order.id}
                      className="border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4 font-bold">{order.reference}</td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="relative w-12 h-12 border rounded overflow-hidden">
                              {item.image && (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[order.status]}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 font-bold">
                        {order.total.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </td>

                      <td className="p-4 text-center">
                        {order.status !== "entregado" && order.status !== "cancelado" && (
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-100 hover:bg-red-50"
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
              {orders.slice(0, visibleOrders).map(order => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-xl border shadow-sm space-y-3 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between">
                    <p className="font-bold">{order.reference}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="relative w-14 h-14 border rounded overflow-hidden">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="font-black text-blue-600">
                    {order.total.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </p>

                  {order.status !== "entregado" && order.status !== "cancelado" && (
                    <Button
                      variant="outline"
                      className="w-full text-red-500 border-red-100 hover:bg-red-50"
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
            <div className="flex justify-center mt-10">
              {visibleOrders < orders.length && (
                <Button variant="outline" onClick={loadMore}>
                  Cargar más
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Store className="h-20 w-20 text-gray-200" strokeWidth={1} />
            <h2 className="text-2xl font-bold text-gray-900">Tu lista está vacía</h2>
            <Button asChild size="lg" className="rounded-full px-10">
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* ================= MODAL DETALLE ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Detalle del pedido</h2>
              <Button size="sm" variant="outline" onClick={() => setSelectedOrder(null)}>
                Cerrar
              </Button>
            </div>

            {selectedOrder.items.map((item, i) => (
              <div key={i} className="flex gap-3 border rounded p-2">
                <div className="relative w-14 h-14">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 text-sm space-y-1">
              <p>Total: {selectedOrder.total.toLocaleString("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0})}</p>
              <p>Fecha: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "-"}</p>
              <p>Dirección: {(selectedOrder as any).direccion ?? "-"}</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ListaPedidos;