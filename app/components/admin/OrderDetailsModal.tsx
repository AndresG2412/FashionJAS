"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { X, Package, MapPin, CreditCard, User, FileText, Save } from "lucide-react";
import { updateOrderStatus, updateOrderAdminNotes } from "@/lib/firebase/admin";
import type { Order } from "@/lib/firebase/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(order.id!, status, adminNotes);
      toast.success("Pedido actualizado correctamente");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar pedido");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pendiente: "text-yellow-600 bg-yellow-50",
      "en-envio": "text-blue-600 bg-blue-50",
      entregado: "text-green-600 bg-green-50",
      cancelado: "text-red-600 bg-red-50",
    };
    return colors[status];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Pedido</h2>
            <p className="text-sm text-gray-600 mt-1">{order.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del pedido:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order["status"])}
                className={`w-full px-4 py-2 rounded-lg font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                  status
                )}`}
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="en-envio">🚚 En Envío</option>
                <option value="entregado">✅ Entregado</option>
                <option value="cancelado">❌ Cancelado</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Fecha de pedido:</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {order.createdAt && format(order.createdAt, "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-sm text-gray-600">
                {order.createdAt && format(order.createdAt, "HH:mm", { locale: es })}
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div className="border rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre:</p>
                <p className="font-semibold text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-semibold text-gray-900">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono:</p>
                <p className="font-semibold text-gray-900">{order.customer.phone || "No proporcionado"}</p>
              </div>
              {order.customer.legalId && (
                <div>
                  <p className="text-sm text-gray-600">Documento:</p>
                  <p className="font-semibold text-gray-900">
                    {order.customer.legalIdType} {order.customer.legalId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="border rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <MapPin className="w-5 h-5 text-green-600" />
              Dirección de Envío
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">{order.shipping.address}</p>
              <p className="text-gray-700 mt-1">
                {order.shipping.city}, {order.shipping.state}
              </p>
              {order.shipping.postalCode && (
                <p className="text-gray-700">Código Postal: {order.shipping.postalCode}</p>
              )}
              <p className="text-gray-700">{order.shipping.country}</p>
            </div>
          </div>

          {/* Productos */}
          <div className="border rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <Package className="w-5 h-5 text-purple-600" />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: <span className="font-semibold">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}{" "}
                      c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de pago */}
          <div className="border rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Información de Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Método de pago:</p>
                <p className="font-semibold text-gray-900">{order.payment.method}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Estado del pago:</p>
                <p className="font-semibold text-green-600">{order.payment.status}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">ID de transacción:</p>
                <p className="font-mono text-xs text-gray-900 break-all">{order.payment.transactionId}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Fecha de pago:</p>
                <p className="font-semibold text-gray-900">
                  {order.payment.paymentDate &&
                    format(new Date(order.payment.paymentDate), "dd/MM/yyyy HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          </div>

          {/* Totales */}
          <div className="border rounded-lg p-4 bg-linear-to-br from-blue-50 to-purple-50">
            <h3 className="font-bold text-gray-900 mb-3">Resumen de Totales</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {order.subtotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Envío:</span>
                <span className="font-semibold">
                  {order.shippingCost === 0
                    ? "GRATIS"
                    : order.shippingCost.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>
                  {order.total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Notas del admin */}
          <div className="border rounded-lg p-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <FileText className="w-5 h-5 text-orange-600" />
              Notas del Administrador
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Agrega notas internas sobre este pedido..."
              rows={4}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Estas notas solo son visibles para los administradores
            </p>
          </div>

          {/* Notas del cliente */}
          {order.notes && (
            <div className="border rounded-lg p-4 bg-yellow-50">
              <h3 className="font-bold text-gray-900 mb-2">Nota del Cliente:</h3>
              <p className="text-gray-700 italic">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}