import NoAccess from "@/app/components/NoAccess";
import WishListProducts from "@/app/components/WishListProducts";
import { auth } from "@clerk/nextjs/server";
import Container from "@/app/components/Container";

export const metadata = {
  title: "Favoritos - Tiendanna",
  description: "Tus productos favoritos",
};

const FavoritosPage = async () => {
  const { userId } = await auth();

  return (
    <Container>
      {userId ? (
        <WishListProducts />
      ) : (
        <NoAccess 
          details="Inicia sesión para ver tus productos favoritos. ¡No pierdas de vista los productos que te gustan!" 
        />
      )}
    </Container>
  );
};

export default FavoritosPage;