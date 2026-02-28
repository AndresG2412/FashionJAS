import Container from "@/app/components/Container";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border shadow-sm">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación pronto.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/tienda">Seguir Comprando</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}