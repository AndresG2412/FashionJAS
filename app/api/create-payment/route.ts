import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, customer, shipping, items, userId } = body;

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { success: false, error: "El monto mínimo es $1.000 COP" },
        { status: 400 }
      );
    }

    if (!customer?.email) {
      return NextResponse.json(
        { success: false, error: "Email del cliente es obligatorio" },
        { status: 400 }
      );
    }

    // 🔥 Generar referencia única
    const reference = `ORDER-${Date.now()}-${userId?.slice(0, 6) || "GUEST"}`;

    // 🔥 Crear Payment Link en PRODUCCIÓN
    const wompiResponse = await fetch("https://api.wompi.co/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        name: `Pedido #${reference}`,
        description: `Compra en GaboTienda - ${items.length} producto(s)`,
        single_use: true,
        collect_shipping: false,
        currency: "COP",
        amount_in_cents: Math.round(amount * 100),

        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?ref=${reference}`,

        metadata: {
          reference,
          customerName: customer.name,
          customerEmail: customer.email,
          items: JSON.stringify(items),
          shipping: JSON.stringify(shipping),
        },
      }),
    });

    const wompiResult = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error("Error Wompi:", wompiResult);
      return NextResponse.json(
        {
          success: false,
          error:
            wompiResult.error?.messages?.[0]?.message ||
            wompiResult.error?.reason ||
            "Error creando el pago en Wompi",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: `https://checkout.wompi.co/l/${wompiResult.data.id}`,
      reference,
      paymentId: wompiResult.data.id,
    });
  } catch (error: any) {
    console.error("Error interno:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}