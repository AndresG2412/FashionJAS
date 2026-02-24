import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Definir interfaces para los datos
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

    console.log("Saving order to Firebase...");
    console.log("Transaction ID:", transactionId);
    console.log("Reference:", reference);

    // Extraer items y shipping de metadata si existen
    let items: OrderItem[] = [];
    let shippingInfo: ShippingInfo = {}; // ← Tipado correcto
    let subtotal = 0;
    let shippingCost = 0;

    // Si Wompi devuelve metadata (lo agregamos en create-payment)
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

    // Calcular totales
    const totalAmount = paymentData.amount_in_cents / 100;
    if (subtotal === 0) {
      subtotal = totalAmount;
    }
    shippingCost = totalAmount - subtotal;

    // Preparar datos del pedido
    const orderData = {
      // ===== IDENTIFICACIÓN =====
      reference: reference || paymentData.reference,
      transactionId: transactionId,
      userId: userId || "guest",
      
      // ===== ESTADO DEL PEDIDO =====
      status: "pendiente",
      
      // ===== INFORMACIÓN DEL CLIENTE =====
      customer: {
        name: paymentData.customer_data?.full_name || paymentData.billing_data?.full_name || "Cliente",
        email: paymentData.customer_email || "",
        phone: paymentData.customer_data?.phone_number || "",
        legalId: paymentData.billing_data?.legal_id || "",
        legalIdType: paymentData.billing_data?.legal_id_type || "CC",
      },
      
      // ===== INFORMACIÓN DE PAGO =====
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
      
      // ===== PRODUCTOS =====
      items: items.length > 0 ? items : [
        {
          productId: "unknown",
          name: "Producto",
          price: totalAmount,
          quantity: 1,
          image: "",
        }
      ],
      
      // ===== TOTALES =====
      total: totalAmount,
      subtotal: subtotal,
      shippingCost: shippingCost,
      
      // ===== DIRECCIÓN DE ENVÍO (CON TIPADO CORRECTO) =====
      shipping: {
        address: shippingInfo?.address || paymentData.shipping_address?.address_line_1 || "",
        city: shippingInfo?.city || paymentData.shipping_address?.city || "",
        state: shippingInfo?.state || paymentData.shipping_address?.region || "",
        postalCode: shippingInfo?.postalCode || paymentData.shipping_address?.postal_code || "",
        country: "CO",
      },
      
      // ===== NOTAS =====
      notes: "",
      adminNotes: "",
      
      // ===== TIMESTAMPS =====
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // ===== DATOS COMPLETOS DE WOMPI =====
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

    console.log("✅ Orden guardada con exito en Firebase:", docRef.id);
    console.log("Referencia de orden:", orderData.reference);

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      reference: orderData.reference,
      message: "Pedido guardado correctamente",
    });

  } catch (error: any) {
    console.error("❌ Error de guardado en Firebase:", error);
    console.error("Detalles de Error:", error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message || "Error al guardar el pedido",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}