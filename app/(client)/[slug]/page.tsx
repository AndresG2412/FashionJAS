import ProductView from "@/app/components/ProductView";
import { getProductBySlug } from "@/lib/firebase/products";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return <ProductView product={product} />;
}