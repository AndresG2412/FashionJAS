import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, customer, shipping, items, userId } = body;

    // Validación: monto mínimo
    if (amount < 1000) {
      return NextResponse.json({
        success: false,
        error: "El monto mínimo es $1,000 COP",
      }, { status: 400 });
    }

    // Generar referencia única
    const reference = `ORDER-${Date.now()}-${userId?.slice(0, 8) || 'GUEST'}`;

    // Crear enlace de pago usando la API de Payment Links
    const wompiResponse = await fetch("https://sandbox.wompi.co/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        name: `Pedido #${reference}`,
        description: `Compra en GaboShop - ${items.length} producto(s)`,
        single_use: true,
        collect_shipping: false,
        currency: "COP",
        amount_in_cents: Math.round(amount * 100),
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?ref=${reference}`,
        
        // AGREGAR: Metadata personalizada
        metadata: {
          items: JSON.stringify(items), // Guardar items como string
          shipping: JSON.stringify(shipping), // Guardar dirección
          subtotal: amount - (shipping?.cost || 0),
        },
      }),
    });

    const wompiResult = await wompiResponse.json();

    console.log("Wompi Response:", wompiResult);

    if (wompiResult.data && wompiResult.data.id) {
      return NextResponse.json({
        success: true,
        // Construir URL del widget de Wompi con el ID
        paymentUrl: `https://checkout.wompi.co/l/${wompiResult.data.id}`,
        reference: reference,
        paymentId: wompiResult.data.id,
      });
    } else {
      console.error("Error de Wompi API:", wompiResult);
      return NextResponse.json({
        success: false,
        error: wompiResult.error?.reason || "Error al crear el pago",
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error interno del servidor",
    }, { status: 500 });
  }
}