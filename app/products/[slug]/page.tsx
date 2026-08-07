import { getProductBySlug } from "@/lib/data/products";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Newsletter from "@/components/shared/Newsletter";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <AnnouncementBar />
      <SiteHeader />

      <ProductDetailClient product={product} />

      <Newsletter />
      <SiteFooter />
    </div>
  );
}
