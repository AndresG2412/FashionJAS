import * as React from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AdminOrderEmailProps {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  shippingAddress: string;
  city: string;
  state: string;
}

export const AdminOrderEmail: React.FC<AdminOrderEmailProps> = ({
  reference,
  customerName,
  customerEmail,
  customerPhone,
  items,
  total,
  subtotal,
  shippingCost,
  shippingAddress,
  city,
  state,
}) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; }
            .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #22c55e; }
            .item { background: white; padding: 10px; margin: 10px 0; border-radius: 6px; display: flex; align-items: center; gap: 10px; }
            .totals { background: #22c55e; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .badge { background: #fbbf24; color: #92400e; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px; }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>🎉 ¡Nuevo Pedido Recibido!</h1>
            <p style={{ margin: 0, fontSize: 14 }}>
              GaboShop - Sistema de Ventas
            </p>
          </div>

          <div className="content">
            <div className="order-info">
              <h2 style={{ marginTop: 0, color: "#22c55e" }}>
                📦 Pedido #{reference}
              </h2>
              <p>
                <strong>Estado:</strong>{" "}
                <span className="badge">
                  PENDIENTE DE ALISTAMIENTO
                </span>
              </p>
            </div>

            <div className="order-info">
              <h3 style={{ color: "#22c55e" }}>
                👤 Información del Cliente
              </h3>
              <p><strong>Nombre:</strong> {customerName}</p>
              <p><strong>Email:</strong> {customerEmail}</p>
              <p><strong>Teléfono:</strong> {customerPhone}</p>
            </div>

            <div className="order-info">
              <h3 style={{ color: "#22c55e" }}>
                📍 Dirección de Envío
              </h3>
              <p><strong>Dirección:</strong> {shippingAddress}</p>
              <p><strong>Ciudad:</strong> {city}, {state}</p>
            </div>

            <div className="order-info">
              <h3 style={{ color: "#22c55e" }}>
                🛍️ Productos ({items.length})
              </h3>

              {items.map((item, index) => (
                <div className="item" key={index}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {item.name}
                    </p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        color: "#666",
                        fontSize: 14,
                      }}
                    >
                      {item.quantity} x $
                      {item.price.toLocaleString("es-CO")} = $
                      {(item.price * item.quantity).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="totals">
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "5px 0",
                }}
              >
                <span>Subtotal:</span>
                <strong>
                  ${subtotal.toLocaleString("es-CO")}
                </strong>
              </p>

              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "5px 0",
                }}
              >
                <span>Envío:</span>
                <strong>
                  {shippingCost === 0
                    ? "GRATIS"
                    : `$${shippingCost.toLocaleString("es-CO")}`}
                </strong>
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.3)",
                  margin: "10px 0",
                }}
              />

              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "10px 0 0 0",
                  fontSize: 20,
                }}
              >
                <span>TOTAL:</span>
                <strong>
                  ${total.toLocaleString("es-CO")} COP
                </strong>
              </p>
            </div>

            <div style={{ textAlign: "center", marginTop: 30 }}>
              <a
                href={`${appUrl}/studio/orders`}
                style={{
                  background: "#22c55e",
                  color: "white",
                  padding: "12px 30px",
                  textDecoration: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                Ver Pedido en el Panel Admin
              </a>
            </div>
          </div>

          <div className="footer">
            <p>Este es un email automático del sistema GaboShop</p>
            <p>No respondas a este correo</p>
          </div>
        </div>
      </body>
    </html>
  );
};