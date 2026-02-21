import NoAccess from "@/app/components/NoAccess";
import WishListProducts from "@/app/components/WishListProducts";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Favoritos - GaboShop",
  description: "Tus productos favoritos",
};

const FavoritosPage = async () => {
  const { userId } = await auth();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {userId ? (
        <WishListProducts />
      ) : (
        <NoAccess 
          details="Inicia sesión para ver tus productos favoritos. ¡No pierdas de vista los productos que te gustan!" 
        />
      )}
    </div>
  );
};

export default FavoritosPage;