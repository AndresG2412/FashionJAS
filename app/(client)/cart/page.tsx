import CartProducts from "@/app/components/CartProducts";
import NoAccess from "@/app/components/NoAccess";
import { auth } from "@clerk/nextjs/server";
import Container from "@/app/components/Container";

export const metadata = {
  title: "Carrito - FashionJAS",
  description: "Tu carrito de compras",
};

const CartPage = async () => {
  const { userId } = await auth();

  return (
    <Container>
      {userId ? (
        <CartProducts />
      ) : (
        <NoAccess 
          details="Inicia sesión para ver tu carrito y finalizar tu compra. ¡Tus productos te están esperando!" 
        />
      )}
    </Container>
  );
};

export default CartPage;