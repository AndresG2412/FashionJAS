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
import { ArrowLeft, Loader2, Package, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const { user } = useUser();
  const { cartItems, getCartTotal } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: user?.firstName || "",
    apellido: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    telefono: "",
    direccion: "",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    codigoPostal: "",
    notas: "",
  });

  const subtotal = getCartTotal();
  const envio = 0;
  const total = subtotal + envio;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      toast.error("El monto mínimo para comprar es $1,000 COP");
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
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos antes de continuar</p>
          <Button asChild>
            <Link href="/tienda">Ir a la Tienda</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm text-gray-600 hover:text-shop_light_green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre" className="pb-2">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className="pb-2">Apellido *</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      placeholder="Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="pb-2">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono" className="pb-2">Teléfono *</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="3001234567"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direccion" className="pb-2">Dirección Completa *</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      placeholder="Calle 5 # 38-25, Apto 401"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ciudad" className="pb-2">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                        placeholder="Cali"
                      />
                    </div>
                    <div>
                      <Label htmlFor="departamento" className="pb-2">Departamento *</Label>
                      <Input
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                        required
                        placeholder="Valle del Cauca"
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigoPostal" className="pb-2">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        placeholder="760001"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notas" className="pb-2">Notas del Pedido (Opcional)</Label>
                    <Textarea
                      id="notas"
                      name="notas"
                      value={formData.notas}
                      onChange={handleChange}
                      placeholder="Ej: Entregar en la portería, tocar el timbre 2 veces..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Botón Submit en móvil */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg font-bold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>Proceder al Pago</>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

              {/* Productos */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.precio.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-2 py-4 border-t border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">
                    {envio.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-shop_dark_green">
                  {total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>

              {/* Botón Submit en desktop */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full py-6 text-lg font-bold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>Proceder al Pago</>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
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