"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useStore from "@/store";
import Container from "./Container";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ArrowLeft, Loader2, Package, MapPin, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTE DE CIUDADES DISPONIBLES
// Para añadir una nueva ciudad en el futuro, solo agrega un objeto aquí:
// { nombre: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110111" }
// ─────────────────────────────────────────────────────────────────────────────
const CIUDADES = [
  { nombre: "Cali", departamento: "Valle del Cauca", codigoPostal: "760001" },
  // { nombre: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110111" },
  // { nombre: "Medellín", departamento: "Antioquia", codigoPostal: "050001" },
] as const;

type CiudadNombre = (typeof CIUDADES)[number]["nombre"];

const getCiudadInfo = (nombre: CiudadNombre) =>
  CIUDADES.find((c) => c.nombre === nombre)!;

// ─────────────────────────────────────────────────────────────────────────────

const CheckoutForm = () => {
  const { user } = useUser();
  const { cartItems, getCartTotal } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const ciudadDefault = CIUDADES[0];

  const [formData, setFormData] = useState({
    nombre: user?.firstName || "",
    apellido: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    telefono: "",
    direccion: "",
    ciudad: ciudadDefault.nombre,
    departamento: ciudadDefault.departamento,
    codigoPostal: ciudadDefault.codigoPostal,
    notas: "",
  });

  const subtotal = getCartTotal();
  const envio = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + envio;

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Al elegir ciudad, auto-completa departamento y código postal
  const handleCiudadChange = (value: string) => {
    const info = getCiudadInfo(value as CiudadNombre);
    setFormData((prev) => ({
      ...prev,
      ciudad: info.nombre,
      departamento: info.departamento,
      codigoPostal: info.codigoPostal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.telefono || !formData.direccion) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    if (total < 1000) {
      toast.error("El monto mínimo para comprar es $1,500 COP");
      return;
    }

    setLoading(true);

    try {
      // 🔥 PREPARAR DATOS DEL PEDIDO
      const shipping = {
        address: formData.direccion,
        city: formData.ciudad,
        state: formData.departamento,
        postalCode: formData.codigoPostal,
        cost: envio,
      };

      const items = cartItems.map(item => ({
        productId: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: item.quantity,
        image: item.imagenes[0],
      }));

      // 🔥 GUARDAR EN LOCALSTORAGE ANTES DE IR A WOMPI
      localStorage.setItem("pendingOrder", JSON.stringify({
        shipping,
        items,
        subtotal,
        customer: {
          name: `${formData.nombre} ${formData.apellido}`,
          email: formData.email,
          phone: formData.telefono,
        },
      }));

      console.log("💾 Datos guardados en localStorage:", {
        shipping,
        items,
        subtotal,
      });

      // Crear la transacción en Wompi
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          customer: {
            name: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            phone: formData.telefono,
          },
          shipping,
          items,
          userId: user?.id,
          subtotal,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirigir a Wompi
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Error al procesar el pago");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar el pago");
      setLoading(false);
    }
  };


  if (cartItems.length === 0) {
    return (
      <Container>
        <div className="flex min-h-100 flex-col items-center justify-center space-y-5 px-4 text-center bg-danashop-bgColorCard rounded-2xl border border-dashed border-danashop-borderColor">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-danashop-brandMain/30" />
            <Package className="h-16 w-16 text-danashop-borderColor" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h2 className="text-xl font-bold text-danashop-textPrimary">
              Tu carrito está vacío
            </h2>
            <p className="text-danashop-textSecondary text-sm">
              Agrega productos antes de continuar
            </p>
          </div>
          <Link
            href="/tienda"
            className="rounded-full px-6 py-2 border border-danashop-brandMain text-danashop-brandSoft text-sm font-semibold hover:bg-danashop-brandMain hover:text-white hoverEffect"
          >
            Ir a la Tienda
          </Link>
        </div>
      </Container>
    );
  }

  const inputClass =
    "bg-danashop-colorMain border-danashop-textSecondary/50 text-danashop-textPrimary placeholder:text-danashop-textMuted focus:border-danashop-focus focus:ring-danashop-focus/20 rounded-lg";
  const inputReadonlyClass =
    "bg-danashop-colorMain/50 border-danashop-textSecondary/30 text-danashop-textMuted rounded-lg cursor-not-allowed select-none";
  const labelClass =
    "text-danashop-textSecondary text-xs font-semibold uppercase tracking-wider pb-1.5 block";

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm text-danashop-textSecondary hover:text-danashop-brandSoft mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al carrito
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-danashop-textPrimary">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Formulario ── */}
          <div className="lg:col-span-2 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Información Personal */}
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5">
                <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-danashop-textPrimary uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-danashop-brandSoft" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre" className={labelClass}>
                      Nombre *
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className={labelClass}>
                      Apellido *
                    </Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      placeholder="Pérez"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className={labelClass}>
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono" className={labelClass}>
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="3001234567"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5">
                <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-danashop-textPrimary uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-danashop-brandSoft" />
                  Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direccion" className={labelClass}>
                      Dirección Completa *
                    </Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      placeholder="Calle 5 # 38-25, Apto 401"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ── Select de Ciudad ── */}
                    <div>
                      <Label className={labelClass}>Ciudad *</Label>
                      <Select
                        value={formData.ciudad}
                        onValueChange={handleCiudadChange}
                      >
                        <SelectTrigger
                          className={`${inputClass} w-full`}
                        >
                          <SelectValue placeholder="Selecciona ciudad" />
                        </SelectTrigger>
                        <SelectContent className="bg-danashop-bgColorCard border-danashop-textSecondary/50">
                          {CIUDADES.map((ciudad) => (
                            <SelectItem
                              key={ciudad.nombre}
                              value={ciudad.nombre}
                              className="text-danashop-textPrimary focus:bg-danashop-brandMain/20 focus:text-danashop-brandSoft cursor-pointer"
                            >
                              {ciudad.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ── Departamento (auto, readonly) ── */}
                    <div>
                      <Label className={labelClass}>
                        Departamento
                        <span className="ml-1 normal-case text-danashop-textMuted font-normal">(auto)</span>
                      </Label>
                      <Input
                        value={formData.departamento}
                        readOnly
                        tabIndex={-1}
                        className={`${inputReadonlyClass} text-white`}
                      />
                    </div>

                    {/* ── Código Postal (auto, readonly) ── */}
                    <div>
                      <Label className={labelClass}>
                        Código Postal
                        <span className="ml-1 normal-case text-danashop-textMuted font-normal">(auto)</span>
                      </Label>
                      <Input
                        value={formData.codigoPostal}
                        readOnly
                        tabIndex={-1}
                        className={`${inputReadonlyClass} text-white`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notas" className={labelClass}>
                      Notas del Pedido (Opcional)
                    </Label>
                    <Textarea
                      id="notas"
                      name="notas"
                      value={formData.notas}
                      onChange={handleChange}
                      placeholder="Ej: Entregar en la portería, tocar el timbre 2 veces..."
                      rows={3}
                      className={`${inputReadonlyClass} text-white placeholder:text-danashop-textSecondary`}
                    />
                  </div>
                </div>
              </div>

              {/* Botón Submit móvil */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-danashop-textDark bg-danashop-accentAction hover:brightness-110 hoverEffect flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      Proceder al Pago <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Resumen del Pedido ── */}
          <div className="lg:col-span-1">
            <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5 sticky top-24">
              <h2 className="text-base font-bold text-danashop-textPrimary mb-4 pb-3 border-b border-danashop-textSecondary/50">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-danashop-borderColor">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-danashop-borderColor">
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-danashop-textPrimary line-clamp-1">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-danashop-textMuted mt-0.5">
                        {item.quantity} ×{" "}
                        <span className="text-danashop-inCart font-bold">
                          {formatCOP(item.precio)}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs font-black text-danashop-brandSoft shrink-0">
                      {formatCOP(item.precio * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-3 border-t border-danashop-textSecondary/50">
                <div className="flex justify-between text-sm">
                  <span className="text-danashop-textSecondary">Subtotal</span>
                  <span className="font-semibold text-danashop-textPrimary">
                    {formatCOP(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-danashop-textSecondary">Envío</span>
                  <span className="font-semibold">
                    {envio === 0 ? (
                      <span className="text-danashop-success font-bold">GRATIS</span>
                    ) : (
                      <span className="text-danashop-textPrimary">{formatCOP(envio)}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-danashop-textSecondary/50">
                <span className="text-base font-bold text-danashop-textPrimary">Total</span>
                <span className="text-xl font-black text-danashop-accentAction">
                  {formatCOP(total)}
                </span>
              </div>

              <div className="hidden lg:block mt-1">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl font-bold text-danashop-textDark bg-danashop-accentAction hover:brightness-110 hoverEffect flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      Proceder al Pago <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-danashop-textMuted text-center mt-3">
                Al continuar, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutForm;