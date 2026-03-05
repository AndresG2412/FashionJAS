import CheckoutForm from "@/app/components/CheckoutForm";
import NoAccess from "@/app/components/NoAccess";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Checkout - GaboShop",
  description: "Finaliza tu compra",
};

const CheckoutPage = async () => {
  const { userId } = await auth();

  return (
    <div className="bg-background min-h-screen py-10">
      {userId ? (
        <CheckoutForm />
      ) : (
        <NoAccess 
          details="Inicia sesión para finalizar tu compra. ¡Estás a un paso de tener tus productos!" 
        />
      )}
    </div>
  );
};

export default CheckoutPage;