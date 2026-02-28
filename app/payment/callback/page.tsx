"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/app/components/Container";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { clearCart } = useStore();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");

  // Controladores para evitar ejecuciones duplicadas por el StrictMode de React
  const isProcessingRef = useRef(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // 1. Esperar a que Clerk cargue el usuario para tener el ID correcto
    if (!isUserLoaded) return;

    const id = searchParams.get("id");
    const ref = searchParams.get("ref");

    if (!id) {
      setStatus("error");
      setMessage("No se encontró información del pago");
      return;
    }

    // 2. Protecciones de instancia (Evita el doble render de React 18)
    if (isProcessingRef.current || hasProcessedRef.current) return;

    // 3. Protección persistente (Evita re-procesar si el usuario recarga la página)
    const processedKey = `processed_payment_${id}`;
    if (localStorage.getItem(processedKey)) {
      console.log("⚠️ Pago ya procesado previamente");
      setStatus("success");
      setMessage("¡Tu pago fue procesado exitosamente!");
      setOrderReference(ref || "");
      return;
    }

    const checkPaymentStatus = async () => {
      isProcessingRef.current = true;

      try {
        // Verificar status con el backend
        const response = await fetch(`/api/verify-payment?id=${id}`);
        const data = await response.json();

        if (data.status === "APPROVED") {
          const pendingOrderRaw = localStorage.getItem("pendingOrder");

          if (!pendingOrderRaw) {
            // Si no hay datos en localStorage, verificamos si la orden ya existe en DB 
            // para no mostrar error al usuario si solo refrescó la página.
            setStatus("success");
            setMessage("¡Tu pago fue procesado exitosamente!");
            return;
          }

          const pendingOrder = JSON.parse(pendingOrderRaw);

          // Guardar en Firebase enviando el ID del usuario actual (Clerk)
          const saveResponse = await fetch("/api/save-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: id,
              reference: ref || data.data?.reference,
              paymentData: data.data,
              userId: user?.id || null, // Aseguramos que el ID esté presente
              shipping: pendingOrder.shipping,
              items: pendingOrder.items,
              subtotal: pendingOrder.subtotal,
            }),
          });

          const saveResult = await saveResponse.json();

          if (saveResult.success || saveResult.message?.includes("ya procesada")) {
            // Marcar como procesado para evitar bucles
            localStorage.setItem(processedKey, "true");
            hasProcessedRef.current = true;

            // 🧹 Limpieza de datos temporales
            localStorage.removeItem("pendingOrder");
            
            // 🛒 Limpiar carrito del Store (Zustand) y base de datos
            await clearCart(user?.id);

            setStatus("success");
            setMessage("¡Tu pago fue procesado exitosamente!");
            setOrderReference(ref || data.data?.reference || saveResult.reference || "");

            toast.success("¡Compra realizada con éxito!", {
              duration: 5000,
              icon: "🎉",
            });
          } else {
            throw new Error(saveResult.message || "Error al guardar la orden");
          }

        } else if (data.status === "PENDING") {
          setStatus("pending");
          setMessage("Tu pago está siendo procesado...");
        } else {
          setStatus("error");
          setMessage(data.message || "El pago no pudo ser procesado");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        setStatus("error");
        setMessage("Hubo un problema al confirmar tu pedido.");
      } finally {
        isProcessingRef.current = false;
      }
    };

    checkPaymentStatus();
  }, [searchParams, user, isUserLoaded, clearCart]); // Dependencias completas

  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border shadow-sm">
        {status === "loading" && (
          <>
            <Loader2 className="w-20 h-20 text-blue-500 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-4">Verificando pago...</h1>
            <p className="text-gray-600">Por favor espera un momento</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
            <p className="text-gray-600 mb-4">{message}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-green-800 mb-2">
                Tu pedido será procesado pronto
              </p>
              {orderReference && (
                <p className="text-xs text-green-600">
                  Número de pedido: <span className="font-mono font-bold">{orderReference}</span>
                </p>
              )}
              <p className="text-xs text-green-600 mt-2">
                Recibirás un email de confirmación en los próximos minutos
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/tienda">Seguir Comprando</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <Loader2 className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-4">Pago Pendiente</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Pago Fallido</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/cart">Volver al Carrito</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/tienda">Seguir Comprando</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}