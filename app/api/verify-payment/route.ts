import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        error: "ID de transacción no proporcionado",
      }, { status: 400 });
    }

    // Consultar el estado de la transacción en Wompi
    const wompiResponse = await fetch(
      `https://sandbox.wompi.co/v1/transactions/${transactionId}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        },
      }
    );

    const wompiData = await wompiResponse.json();

    console.log("Payment verification:", wompiData);

    return NextResponse.json({
      status: wompiData.data?.status || "DECLINED",
      message: wompiData.data?.status_message || "Estado desconocido",
      data: wompiData.data,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({
      success: false,
      error: "Error al verificar el pago",
    }, { status: 500 });
  }
}