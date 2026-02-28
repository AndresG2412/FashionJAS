import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { reduceMultipleProductsStock } from "@/lib/firebase/admin";
import { Resend } from "resend";
import { AdminOrderEmail } from "@/lib/email/templates/admin-order-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ShippingInfo {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      transactionId,
      reference,
      paymentData,
      userId,
      shipping,
      items,
      subtotal,
    } = body;

    if (!transactionId || !paymentData) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const totalAmount = paymentData.amount_in_cents / 100;
    const shippingCost = totalAmount - subtotal;

    console.log("💾 Guardando orden en Firebase...");
    console.log("Transaction ID:", transactionId);

    // 🔥 REDUCIR STOCK CON LOS ITEMS REALES
    const stockResult = await reduceMultipleProductsStock(
      (items || []).map((item: OrderItem) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (!stockResult.success) {
      console.error("❌ Error reduciendo stock:", stockResult.errors);
    }

    // 🔥 CONSTRUIR ORDEN LIMPIA
    const orderData = {
      reference: reference || paymentData.reference,
      transactionId,
      userId: userId || "guest",
      status: "pendiente",

      customer: {
        name:
          paymentData.customer_data?.full_name ||
          paymentData.billing_data?.full_name ||
          "Cliente",
        email: paymentData.customer_email || "",
        phone: paymentData.customer_data?.phone_number || "",
        legalId: paymentData.billing_data?.legal_id || "",
        legalIdType: paymentData.billing_data?.legal_id_type || "CC",
      },

      payment: {
        transactionId,
        method: paymentData.payment_method_type,
        methodDetails: paymentData.payment_method?.type || "",
        installments: paymentData.payment_method?.installments || 1,
        status: paymentData.status,
        statusMessage: paymentData.status_message || "",
        amount: totalAmount,
        currency: paymentData.currency,
        paymentDate:
          paymentData.finalized_at || paymentData.created_at,
      },

      items: items || [],

      total: totalAmount,
      subtotal: subtotal,
      shippingCost: shippingCost,

      shipping: {
        address: shipping?.address || "",
        city: shipping?.city || "",
        state: shipping?.state || "",
        postalCode: shipping?.postalCode || "",
        country: "CO",
      },

      notes: "",
      adminNotes: "",

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      wompiData: {
        id: paymentData.id,
        paymentLinkId: paymentData.payment_link_id,
        merchantId: paymentData.merchant?.id,
        merchantName: paymentData.merchant?.name,
        redirectUrl: paymentData.redirect_url,
      },
    };

    // 🔥 GUARDAR EN FIREBASE
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, orderData);

    console.log("✅ Orden guardada:", docRef.id);

    // 🔥 ENVIAR EMAIL
    try {
      await resend.emails.send({
        from: "GaboShop <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL!,
        subject: `🎉 Nuevo Pedido #${orderData.reference}`,
        react: await AdminOrderEmail({
          reference: orderData.reference,
          customerName: orderData.customer.name,
          customerEmail: orderData.customer.email,
          customerPhone: orderData.customer.phone,
          items: orderData.items,
          total: orderData.total,
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost,
          shippingAddress: orderData.shipping.address,
          city: orderData.shipping.city,
          state: orderData.shipping.state,
        }),
      });
    } catch (emailError) {
      console.error("❌ Error enviando email:", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      reference: orderData.reference,
      stockReduced: stockResult.success,
      stockErrors: stockResult.errors,
    });

  } catch (error: any) {
    console.error("❌ Error guardando orden:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error interno",
      },
      { status: 500 }
    );
  }
}