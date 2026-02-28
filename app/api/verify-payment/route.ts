import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de transacción no proporcionado",
        },
        { status: 400 }
      );
    }

    // 🔥 PRODUCCIÓN (NO sandbox)
    const wompiResponse = await fetch(
      `https://api.wompi.co/v1/transactions/${transactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error("Error Wompi:", wompiData);
      return NextResponse.json(
        {
          success: false,
          error:
            wompiData.error?.messages?.[0]?.message ||
            wompiData.error?.reason ||
            "Error consultando la transacción",
        },
        { status: 400 }
      );
    }

    const status = wompiData.data?.status || "ERROR";

    return NextResponse.json({
      success: true,
      status,
      message: wompiData.data?.status_message || "Estado consultado correctamente",
      reference: wompiData.data?.reference,
      amount: wompiData.data?.amount_in_cents
        ? wompiData.data.amount_in_cents / 100
        : null,
      currency: wompiData.data?.currency,
      paymentMethod: wompiData.data?.payment_method_type,
      raw: wompiData.data,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno al verificar el pago",
      },
      { status: 500 }
    );
  }
}