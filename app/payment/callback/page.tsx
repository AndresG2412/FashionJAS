"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/app/components/Container";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { clearCart } = useStore();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    const ref = searchParams.get("ref");

    const checkPaymentStatus = async () => {
      if (!id) {
        setStatus("error");
        setMessage("No se encontró información del pago");
        return;
      }

      try {
        const response = await fetch(`/api/verify-payment?id=${id}`);
        const data = await response.json();

        if (data.status === "APPROVED") {
          // GUARDAR PEDIDO EN FIREBASE
          await fetch("/api/save-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: id,
              reference: ref || data.data?.reference,
              paymentData: data.data,
              userId: user?.id,
            }),
          });

          // LIMPIAR CARRITO
          await clearCart(user?.id);

          // Mostrar éxito
          setStatus("success");
          setMessage("¡Tu pago fue procesado exitosamente!");
          setOrderReference(ref || data.data?.reference || "");

          // Toast de éxito
          toast.success("¡Compra realizada con éxito! Tu pedido será procesado pronto.", {
            duration: 5000,
            icon: "🎉",
          });

        } else if (data.status === "PENDING") {
          setStatus("pending");
          setMessage("Tu pago está siendo procesado...");
        } else {
          setStatus("error");
          setMessage(data.message || "El pago no pudo ser procesado");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
        setMessage("Error al verificar el pago");
      }
    };

    checkPaymentStatus();
  }, [searchParams, user, clearCart]);

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
            <p className="text-sm text-gray-500 mb-6">
              Te notificaremos cuando se confirme el pago
            </p>
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