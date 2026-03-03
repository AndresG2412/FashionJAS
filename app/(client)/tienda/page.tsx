import Shop from "@/app/components/Shop";
import { getAllCategories } from "@/lib/firebase/categories";
import Container from "@/app/components/Container";

export const metadata = {
  title: "Tienda - GaboShop",
  description: "Explora todos nuestros productos",
};

const ShopPage = async () => {
  const categories = await getAllCategories();

  return (
    <Container className="">
      <Shop categories={categories} />
    </Container>
  );
};

export default ShopPage;