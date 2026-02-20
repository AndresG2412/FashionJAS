import Shop from "@/app/components/Shop";
import { getAllCategories } from "@/lib/firebase/categories";

export const metadata = {
  title: "Tienda - GaboShop",
  description: "Explora todos nuestros productos",
};

const ShopPage = async () => {
  const categories = await getAllCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Shop categories={categories} />
    </div>
  );
};

export default ShopPage;