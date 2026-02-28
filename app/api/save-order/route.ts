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
  cost?: number;
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
    const { transactionId, reference, paymentData, userId } = body;

    console.log("💾 Guardando orden en Firebase...");
    console.log("Transaction ID:", transactionId);
    console.log("Reference:", reference);

    // Extraer datos
    let items: OrderItem[] = [];
    let shippingInfo: ShippingInfo = {};
    let subtotal = 0;
    let shippingCost = 0;

    if (paymentData.metadata) {
      try {
        if (paymentData.metadata.items) {
          items = typeof paymentData.metadata.items === 'string' 
            ? JSON.parse(paymentData.metadata.items)
            : paymentData.metadata.items;
        }
        if (paymentData.metadata.shipping) {
          shippingInfo = typeof paymentData.metadata.shipping === 'string'
            ? JSON.parse(paymentData.metadata.shipping)
            : paymentData.metadata.shipping;
        }
        subtotal = paymentData.metadata.subtotal || 0;
      } catch (parseError) {
        console.error("Error parsing metadata:", parseError);
      }
    }

    const totalAmount = paymentData.amount_in_cents / 100;
    if (subtotal === 0) subtotal = totalAmount;
    shippingCost = totalAmount - subtotal;

    // 🆕 PASO 1: REDUCIR STOCK
    console.log("📦 Reduciendo stock de productos...");
    const stockResult = await reduceMultipleProductsStock(
      items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (!stockResult.success) {
      console.error("❌ Errores al reducir stock:", stockResult.errors);
      // Continuar de todos modos, pero registrar el error
    } else {
      console.log("✅ Stock reducido correctamente");
    }

    // Preparar datos del pedido
    const orderData = {
      reference: reference || paymentData.reference,
      transactionId: transactionId,
      userId: userId || "guest",
      status: "pendiente",
      
      customer: {
        name: paymentData.customer_data?.full_name || paymentData.billing_data?.full_name || "Cliente",
        email: paymentData.customer_email || "",
        phone: paymentData.customer_data?.phone_number || "",
        legalId: paymentData.billing_data?.legal_id || "",
        legalIdType: paymentData.billing_data?.legal_id_type || "CC",
      },
      
      payment: {
        transactionId: transactionId,
        method: paymentData.payment_method_type,
        methodDetails: paymentData.payment_method?.type || "",
        installments: paymentData.payment_method?.installments || 1,
        status: paymentData.status,
        statusMessage: paymentData.status_message || "",
        amount: totalAmount,
        currency: paymentData.currency,
        paymentDate: paymentData.finalized_at || paymentData.created_at,
      },
      
      items: items.length > 0 ? items : [{
        productId: "unknown",
        name: "Producto",
        price: totalAmount,
        quantity: 1,
        image: "",
      }],
      
      total: totalAmount,
      subtotal: subtotal,
      shippingCost: shippingCost,
      
      shipping: {
        address: shippingInfo?.address || paymentData.shipping_address?.address_line_1 || "",
        city: shippingInfo?.city || paymentData.shipping_address?.city || "",
        state: shippingInfo?.state || paymentData.shipping_address?.region || "",
        postalCode: shippingInfo?.postalCode || paymentData.shipping_address?.postal_code || "",
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

    // Guardar en Firebase
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, orderData);

    console.log("✅ Orden guardada en Firebase:", docRef.id);

    // 🆕 PASO 2: ENVIAR EMAIL AL ADMIN
    try {
      console.log("📧 Enviando email de notificación al admin...");
      
      await resend.emails.send({
        from: "GaboShop <onboarding@resend.dev>", // Cambiar en producción
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

      console.log("✅ Email enviado correctamente");
    } catch (emailError: any) {
      console.error("❌ Error enviando email:", emailError);
      // No fallar la orden si el email falla
    }

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      reference: orderData.reference,
      message: "Pedido guardado correctamente",
      stockReduced: stockResult.success,
      stockErrors: stockResult.errors,
    });

  } catch (error: any) {
    console.error("❌ Error guardando orden:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message || "Error al guardar el pedido",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}