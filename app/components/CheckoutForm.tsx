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
} from "./ui/select";
import { ArrowLeft, Loader2, Package, MapPin, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const CIUDADES = [
  { nombre: "Mocoa", departamento: "Putumayo", codigoPostal: "860001" },
] as const;

type CiudadNombre = (typeof CIUDADES)[number]["nombre"];

const getCiudadInfo = (nombre: CiudadNombre) =>
  CIUDADES.find((c) => c.nombre === nombre)!;

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
      const shipping = {
        address: formData.direccion,
        city: formData.ciudad,
        state: formData.departamento,
        postalCode: formData.codigoPostal,
        cost: envio,
      };

      // ── Los items ahora incluyen talla y color seleccionados ─────────────
      const items = cartItems.map((item) => ({
        productId: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: item.quantity,
        image: item.imagenes[0],
        tallaSeleccionada: (item as any).tallaSeleccionada ?? null,
        colorSeleccionado: (item as any).colorSeleccionado ?? null,
      }));

      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          shipping,
          items,
          subtotal,
          customer: {
            name: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            phone: formData.telefono,
          },
        })
      );

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <Container className="bg-eshop-bgMain min-h-screen flex items-center justify-center py-10">
        <div className="flex flex-col items-center justify-center space-y-6 px-10 py-16 text-center bg-eshop-bgWhite rounded-3xl border border-dashed border-eshop-borderEmphasis shadow-inner">
          <div className="relative p-6 bg-eshop-bgCard rounded-full">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-eshop-accent/20" />
            <Package className="h-16 w-16 text-eshop-textDisabled" strokeWidth={1} />
          </div>
          <div className="max-w-xs space-y-2">
            <h2 className="text-2xl font-bold text-eshop-textPrimary">Tu carrito está vacío</h2>
            <p className="text-eshop-textSecondary text-base font-medium">
              Agrega productos extraordinarios antes de proceder al pago
            </p>
          </div>
          <Link href="/tienda" className="rounded-full px-8 py-3 bg-eshop-buttonBase text-eshop-textDark font-bold text-sm hover:bg-eshop-buttonHover transition-all shadow-md">
            Explorar Tienda
          </Link>
        </div>
      </Container>
    );
  }

  const inputClass =
    "bg-eshop-bgWhite border-eshop-borderSubtle text-eshop-textPrimary placeholder:text-eshop-textDisabled focus:border-eshop-accent focus:ring-eshop-accent/20 rounded-xl h-12";
  const inputReadonlyClass =
    "bg-eshop-bgCard border-eshop-borderSubtle text-eshop-textSecondary rounded-xl cursor-not-allowed select-none h-12 font-medium";
  const labelClass =
    "text-eshop-textSecondary text-xs font-bold uppercase tracking-wider pb-2 block";

  return (
    <Container className="py-8 bg-eshop-bgMain">
      <div className="max-w-6xl mx-auto">
        <Link href="/cart" className="inline-flex items-center text-sm font-medium text-eshop-textSecondary hover:text-eshop-accent mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-eshop-textPrimary tracking-tight">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Formulario ── */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderSubtle p-6 shadow-sm">
                <h2 className="text-sm font-bold mb-5 flex items-center gap-2.5 text-eshop-textPrimary uppercase tracking-wider">
                  <Mail className="w-5 h-5 text-eshop-accent" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="nombre" className={labelClass}>Nombre *</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Juan" className={inputClass} />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className={labelClass}>Apellido *</Label>
                    <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Pérez" className={inputClass} />
                  </div>
                  <div>
                    <Label htmlFor="email" className={labelClass}>Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className={inputClass} />
                  </div>
                  <div>
                    <Label htmlFor="telefono" className={labelClass}>Teléfono *</Label>
                    <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required placeholder="3001234567" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderSubtle p-6 shadow-sm">
                <h2 className="text-sm font-bold mb-5 flex items-center gap-2.5 text-eshop-textPrimary uppercase tracking-wider">
                  <MapPin className="w-5 h-5 text-eshop-accent" />
                  Dirección de Envío
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="direccion" className={labelClass}>Dirección Completa *</Label>
                    <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required placeholder="Calle 1 #23-45" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <Label className={labelClass}>Ciudad *</Label>
                      <Select value={formData.ciudad} onValueChange={handleCiudadChange}>
                        <SelectTrigger className={`${inputClass} w-full`}>
                          <SelectValue placeholder="Selecciona ciudad" />
                        </SelectTrigger>
                        <SelectContent className="bg-eshop-bgWhite border-eshop-borderSubtle">
                          {CIUDADES.map((ciudad) => (
                            <SelectItem key={ciudad.nombre} value={ciudad.nombre} className="text-eshop-textPrimary focus:bg-eshop-bgCard focus:text-eshop-accent cursor-pointer font-medium">
                              {ciudad.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className={labelClass}>
                        Departamento
                        <span className="ml-1 normal-case text-eshop-textDisabled font-normal">(auto)</span>
                      </Label>
                      <Input value={formData.departamento} readOnly tabIndex={-1} className={inputReadonlyClass} />
                    </div>
                    <div>
                      <Label className={labelClass}>
                        Código Postal
                        <span className="ml-1 normal-case text-eshop-textDisabled font-normal">(auto)</span>
                      </Label>
                      <Input value={formData.codigoPostal} readOnly tabIndex={-1} className={inputReadonlyClass} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notas" className={labelClass}>Notas del Pedido (Opcional)</Label>
                    <Textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} placeholder="Ej: Entregar en la portería, llamar antes..." rows={3} className="bg-eshop-bgWhite border-eshop-borderSubtle text-eshop-textPrimary placeholder:text-eshop-textDisabled focus:border-eshop-accent focus:ring-eshop-accent/20 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Botón Submit móvil */}
              <div className="lg:hidden mt-4">
                <Button type="submit" disabled={loading} className="w-full py-7 rounded-2xl font-bold text-eshop-textDark bg-eshop-buttonBase hover:bg-eshop-buttonHover flex items-center justify-center gap-2 disabled:opacity-60 shadow-md border-none text-lg">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Proceder al Pago <ArrowRight size={20} /></>}
                </Button>
              </div>
            </form>
          </div>

          {/* ── Resumen del Pedido ── */}
          <div className="lg:col-span-1">
            <div className="bg-eshop-bgWhite rounded-2xl border border-eshop-borderEmphasis p-6 sticky top-24 shadow-md">
              <h2 className="text-lg font-bold text-eshop-textPrimary mb-5 pb-3 border-b border-eshop-borderSubtle">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-eshop-borderSubtle">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-start">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-eshop-borderSubtle bg-eshop-bgCard">
                      <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-eshop-textPrimary line-clamp-1">{item.nombre}</p>
                      <p className="text-xs text-eshop-textSecondary mt-0.5 font-medium">
                        {item.quantity} × <span className="text-eshop-accent font-bold">{formatCOP(item.precio)}</span>
                      </p>
                      {/* ── Talla y color en el resumen ── */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(item as any).tallaSeleccionada && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-eshop-bgCard border border-eshop-borderSubtle text-eshop-textSecondary">
                            Talla: {(item as any).tallaSeleccionada}
                          </span>
                        )}
                        {(item as any).colorSeleccionado && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-eshop-bgCard border border-eshop-borderSubtle text-eshop-textSecondary">
                            🎨 {(item as any).colorSeleccionado}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-eshop-textPrimary shrink-0">{formatCOP(item.precio * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 py-4 border-t border-eshop-borderSubtle">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-eshop-textSecondary">Subtotal</span>
                  <span className="text-eshop-textPrimary font-bold">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-eshop-textSecondary">Envío</span>
                  <span className="font-bold">
                    {envio === 0
                      ? <span className="text-eshop-accent">GRATIS</span>
                      : <span className="text-eshop-textPrimary">{formatCOP(envio)}</span>}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-eshop-borderSubtle">
                <span className="text-base font-bold text-eshop-textPrimary">Total</span>
                <span className="text-2xl font-black text-eshop-textPrimary">{formatCOP(total)}</span>
              </div>

              <div className="hidden lg:block mt-2">
                <Button type="button" onClick={handleSubmit} disabled={loading} className="w-full py-7 rounded-2xl font-bold text-eshop-textDark bg-eshop-buttonBase hover:bg-eshop-buttonHover flex items-center justify-center gap-2 disabled:opacity-60 shadow-md border-none text-lg transition-all active:scale-95">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Proceder al Pago <ArrowRight size={20} /></>}
                </Button>
              </div>
              <p className="text-[11px] text-eshop-textDisabled text-center mt-4 font-medium">
                Al continuar, aceptas nuestros términos y condiciones de venta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutForm;