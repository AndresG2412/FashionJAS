"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { X, Package, MapPin, CreditCard, User, FileText, Save } from "lucide-react";
import { updateOrderStatus } from "@/lib/firebase/admin";
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
      pendiente: "text-orange-600 bg-orange-50 border-orange-200",
      "en-envio": "text-blue-600 bg-blue-50 border-blue-200",
      entregado: "text-green-600 bg-green-50 border-green-200",
      cancelado: "text-eshop-textError bg-eshop-cancelCart/10 border-eshop-cancelCart/30",
    };
    return colors[status];
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-eshop-formsBackground rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-eshop-textSecondary shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-eshop-formsBackground border-b border-eshop-textSecondary p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-black text-eshop-textPrimary tracking-tight uppercase">Detalles del Pedido</h2>
            <p className="text-sm text-eshop-goldDeep font-bold mt-1 tracking-widest">{order.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-eshop-cancelCart/20 rounded-xl transition-colors text-eshop-textSecondary hover:text-eshop-textError"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Estado y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-eshop-formsBackground/40 p-5 rounded-2xl border border-eshop-textSecondary">
              <label className="block text-xs font-black text-eshop-textSecondary mb-3 uppercase tracking-widest">
                Estado del pedido:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order["status"])}
                className={`w-full px-4 py-3 rounded-xl font-black border-2 transition-all focus:outline-none ${getStatusColor(
                  status
                )}`}
              >
                <option value="pendiente">⏳ PENDIENTE</option>
                <option value="en-envio">🚚 EN ENVÍO</option>
                <option value="entregado">✅ ENTREGADO</option>
                <option value="cancelado">❌ CANCELADO</option>
              </select>
            </div>

            <div className="bg-eshop-formsBackground/40 p-5 rounded-2xl border border-eshop-textSecondary">
              <p className="text-xs font-black text-eshop-textSecondary uppercase tracking-widest">Fecha de pedido:</p>
              <p className="text-xl font-black text-eshop-textPrimary mt-1 uppercase">
                {order.createdAt && format(order.createdAt, "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-sm text-eshop-goldDeep font-bold italic">
                {order.createdAt && format(order.createdAt, "HH:mm 'Hrs'", { locale: es })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cliente */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-black text-eshop-textPrimary uppercase text-sm tracking-widest">
                <User className="w-5 h-5 text-eshop-goldDeep" />
                Información del Cliente
              </h3>
              <div className="bg-eshop-formsBackground/20 rounded-2xl p-5 border border-eshop-textSecondary space-y-3">
                <div>
                  <p className="text-[10px] font-black text-eshop-textSecondary uppercase">Nombre</p>
                  <p className="font-bold text-eshop-textPrimary">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-eshop-textSecondary uppercase">Email</p>
                  <p className="font-bold text-eshop-textPrimary break-all italic">{order.customer.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-eshop-textSecondary/30">
                  <div>
                    <p className="text-[10px] font-black text-eshop-textSecondary uppercase">Teléfono</p>
                    <p className="font-bold text-eshop-textPrimary">{order.customer.phone || "---"}</p>
                  </div>
                  {order.customer.legalId && (
                    <div>
                      <p className="text-[10px] font-black text-eshop-textSecondary uppercase">Documento</p>
                      <p className="font-bold text-eshop-textPrimary text-xs">
                        {order.customer.legalIdType} {order.customer.legalId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-black text-eshop-textPrimary uppercase text-sm tracking-widest">
                <MapPin className="w-5 h-5 text-eshop-goldDeep" />
                Dirección de Envío
              </h3>
              <div className="bg-eshop-formsBackground/20 rounded-2xl p-5 border border-eshop-textSecondary min-h-35 flex flex-col justify-center">
                <p className="font-black text-eshop-textPrimary text-lg italic leading-tight">"{order.shipping.address}"</p>
                <p className="text-eshop-goldDeep font-black mt-2 uppercase tracking-tighter">
                  {order.shipping.city}, {order.shipping.state}
                </p>
                <div className="flex gap-4 mt-1 text-xs text-eshop-textSecondary font-bold">
                  {order.shipping.postalCode && <span>CP: {order.shipping.postalCode}</span>}
                  <span>{order.shipping.country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-eshop-textPrimary uppercase text-sm tracking-widest">
              <Package className="w-5 h-5 text-eshop-goldDeep" />
              Productos ({order.items.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-eshop-formsBackground/30 border border-eshop-textSecondary rounded-2xl hover:bg-eshop-formsBackground/50 transition-all"
                >
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-eshop-textSecondary shrink-0 bg-black">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-eshop-textPrimary truncate uppercase text-sm tracking-tight">{item.name}</p>
                    <p className="text-xs text-eshop-textSecondary font-bold mt-1">
                      CANTIDAD: <span className="text-eshop-goldDeep text-sm">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-eshop-textPrimary">
                      {(item.price * item.quantity).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[10px] text-eshop-goldDeep font-black uppercase">
                      {item.price.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}{" "}
                      C/U
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de pago y Totales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-black text-eshop-textPrimary uppercase text-sm tracking-widest">
                <CreditCard className="w-5 h-5 text-eshop-goldDeep" />
                Información de Pago
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-eshop-formsBackground/20 p-4 rounded-xl border border-eshop-textSecondary text-center">
                  <p className="text-[10px] font-black text-eshop-textSecondary uppercase mb-1">Método</p>
                  <p className="font-bold text-eshop-textPrimary text-xs">{order.payment.method}</p>
                </div>
                <div className="bg-eshop-formsBackground/20 p-4 rounded-xl border border-eshop-textSecondary text-center">
                  <p className="text-[10px] font-black text-eshop-textSecondary uppercase mb-1">Estado</p>
                  <p className="font-black text-green-600 text-xs uppercase">{order.payment.status}</p>
                </div>
              </div>
            </div>

            <div className="bg-eshop-formsBackground/40 border-2 border-eshop-goldDeep p-6 rounded-2xl shadow-inner">
              <h3 className="font-black text-eshop-textPrimary uppercase text-sm tracking-widest mb-4">Resumen Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-eshop-textSecondary font-bold text-sm">
                  <span>SUBTOTAL:</span>
                  <span>{order.subtotal.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-eshop-textSecondary font-bold text-sm">
                  <span>ENVÍO:</span>
                  <span className={order.shippingCost === 0 ? "text-green-600" : ""}>
                    {order.shippingCost === 0 ? "GRATIS" : order.shippingCost.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="border-t border-eshop-textSecondary pt-3 mt-3 flex justify-between text-2xl font-black text-eshop-textPrimary tracking-tighter">
                  <span>TOTAL:</span>
                  <span className="text-eshop-goldDeep">
                    {order.total.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas del admin */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-eshop-textPrimary uppercase text-sm tracking-widest">
              <FileText className="w-5 h-5 text-eshop-goldDeep" />
              Notas del Administrador
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Escribe notas internas aquí..."
              rows={4}
              className="w-full bg-eshop-formsBackground/20 border-2 border-eshop-textSecondary rounded-2xl p-4 text-eshop-textPrimary focus:outline-none focus:border-eshop-goldDeep transition-all resize-none font-medium"
            />
          </div>

          {/* Nota del cliente */}
          {order.notes && (
            <div className="border-2 border-dashed border-eshop-goldDeep p-5 rounded-2xl bg-eshop-goldDeep/5">
              <h3 className="font-black text-eshop-textPrimary uppercase text-xs mb-2 tracking-widest italic">Nota del Cliente:</h3>
              <p className="text-eshop-textPrimary font-serif italic text-lg leading-relaxed">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-eshop-formsBackground border-t border-eshop-textSecondary p-6 flex flex-col sm:flex-row gap-4 justify-end z-10">
          <button
            onClick={onClose}
            className="px-8 py-4 border-2 border-eshop-cancelCart text-eshop-textPrimary rounded-xl hover:bg-eshop-cancelCart/20 transition-all font-black uppercase text-xs tracking-widest"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-eshop-buttonBase text-eshop-textDark rounded-xl hover:bg-eshop-buttonHover transition-all font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-4 border-eshop-textDark border-t-transparent rounded-full animate-spin" />
                GUARDANDO...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                GUARDAR CAMBIOS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}