import CartProducts from "@/app/components/CartProducts";
import NoAccess from "@/app/components/NoAccess";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Carrito - GaboShop",
  description: "Tu carrito de compras",
};

const CartPage = async () => {
  const { userId } = await auth();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {userId ? (
        <CartProducts />
      ) : (
        <NoAccess 
          details="Inicia sesión para ver tu carrito y finalizar tu compra. ¡Tus productos te están esperando!" 
        />
      )}
    </div>
  );
};

export default CartPage;