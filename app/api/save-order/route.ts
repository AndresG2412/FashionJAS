import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { reduceMultipleProductsStock } from "@/lib/firebase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 🔥 PASO 1: VERIFICAR SI YA EXISTE (EVITAR DUPLICADOS)
    const ordersRef = collection(db, "orders");
    const existingOrderQuery = query(
      ordersRef,
      where("transactionId", "==", transactionId)
    );
    const existingOrders = await getDocs(existingOrderQuery);

    if (!existingOrders.empty) {
      console.log("⚠️ Orden ya existe, evitando duplicado:", transactionId);
      const existingOrder = existingOrders.docs[0];
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        reference: existingOrder.data().reference,
        message: "Orden ya procesada previamente (duplicado evitado)",
        isDuplicate: true,
      });
    }

    const totalAmount = paymentData.amount_in_cents / 100;
    const shippingCost = totalAmount - (subtotal || 0);

    console.log("💾 Guardando NUEVA orden en Firebase...");
    console.log("Transaction ID:", transactionId);

    // 🔥 PASO 2: REDUCIR STOCK
    const stockResult = await reduceMultipleProductsStock(
      (items || []).map((item: OrderItem) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (!stockResult.success) {
      console.error("❌ Error reduciendo stock:", stockResult.errors);
    } else {
      console.log("✅ Stock reducido correctamente");
    }

    // 🔥 PASO 3: CONSTRUIR ORDEN
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
        method: paymentData.payment_method_type || "N/A",
        methodDetails: paymentData.payment_method?.type || "",
        installments: paymentData.payment_method?.installments || 1,
        status: paymentData.status,
        statusMessage: paymentData.status_message || "",
        amount: totalAmount,
        currency: paymentData.currency,
        paymentDate: paymentData.finalized_at || paymentData.created_at,
      },

      items: items || [],

      total: totalAmount,
      subtotal: subtotal || 0,
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

    // 🔥 PASO 4: GUARDAR EN FIREBASE
    const docRef = await addDoc(ordersRef, orderData);
    console.log("✅ Orden guardada:", docRef.id);

    // 🔥 PASO 5: ENVIAR EMAIL (SOLO SI ES ORDEN NUEVA)
    try {
      console.log("📧 Enviando email al admin...");

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
              .header { background: #22c55e; color: white; padding: 30px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 30px 20px; background: #f9fafb; }
              .order-info { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #22c55e; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              .order-info h3 { color: #22c55e; margin-top: 0; }
              .item { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border: 1px solid #e5e7eb; }
              .totals { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
              .button { background: #22c55e; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Nuevo Pedido Recibido</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">GaboShop</p>
              </div>

              <div class="content">
                <div class="order-info">
                  <h3>📦 Pedido #${orderData.reference}</h3>
                  <p><strong>Estado:</strong> PENDIENTE</p>
                  <p><strong>ID Transacción:</strong> ${orderData.transactionId}</p>
                </div>

                <div class="order-info">
                  <h3>👤 Cliente</h3>
                  <p><strong>Nombre:</strong> ${orderData.customer.name}</p>
                  <p><strong>Email:</strong> ${orderData.customer.email}</p>
                  <p><strong>Teléfono:</strong> ${orderData.customer.phone}</p>
                </div>

                <div class="order-info">
                  <h3>📍 Dirección de Envío</h3>
                  <p><strong>${orderData.shipping.address}</strong></p>
                  <p>${orderData.shipping.city}, ${orderData.shipping.state}</p>
                </div>

                <div class="order-info">
                  <h3>🛍️ Productos (${orderData.items.length})</h3>
                  ${orderData.items
                    .map(
                      (item: OrderItem) => `
                    <div class="item">
                      <p style="margin: 0; font-weight: bold;">${item.name}</p>
                      <p style="margin: 5px 0 0 0; color: #666;">
                        ${item.quantity} x $${item.price.toLocaleString("es-CO")} = 
                        <strong>$${(item.price * item.quantity).toLocaleString("es-CO")} COP</strong>
                      </p>
                    </div>
                  `
                    )
                    .join("")}
                </div>

                <div class="totals">
                  <p style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>Subtotal:</span>
                    <strong>$${orderData.subtotal.toLocaleString("es-CO")} COP</strong>
                  </p>
                  <p style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>Envío:</span>
                    <strong>${orderData.shippingCost === 0 ? "GRATIS" : `$${orderData.shippingCost.toLocaleString("es-CO")} COP`}</strong>
                  </p>
                  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 10px 0;" />
                  <p style="display: flex; justify-content: space-between; margin: 10px 0 0 0; font-size: 20px;">
                    <span>TOTAL:</span>
                    <strong>$${orderData.total.toLocaleString("es-CO")} COP</strong>
                  </p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/studio/orders" class="button">
                    Ver Pedido en el Panel Admin →
                  </a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await resend.emails.send({
        from: "GaboShop <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL!,
        subject: `🎉 Nuevo Pedido #${orderData.reference} - $${orderData.total.toLocaleString("es-CO")} COP`,
        html: emailHtml,
      });

      console.log("✅ Email enviado correctamente");
    } catch (emailError: any) {
      console.error("❌ Error enviando email:", emailError);
      // No fallar la orden si falla el email
    }

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
      reference: orderData.reference,
      stockReduced: stockResult.success,
      stockErrors: stockResult.errors,
      isDuplicate: false,
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