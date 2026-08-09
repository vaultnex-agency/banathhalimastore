import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Newsletter from "@/components/shared/Newsletter";
import CollectionClient from "./CollectionClient";

type Props = { params: Promise<{ slug: string }> };

const COLLECTION_META: Record<string, { name: string; description: string }> = {
  "churidar-suits": {
    name: "Churidar Suits",
    description: "Handcrafted Pakistani churidar sets for every occasion — from daily elegance to bridal grandeur.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = COLLECTION_META[slug] ?? { name: slug, description: "" };
  return {
    title: meta.name,
    description: meta.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const meta = COLLECTION_META[slug] ?? {
    name: slug.replace(/-/g, " "),
    description: "Explore our curated collection.",
  };

  const products = await getProducts();

  return (
    <div className="min-h-screen bg-brand-surface">
      <AnnouncementBar />
      <SiteHeader />

      <main>
        <CollectionClient
          products={products}
          collectionName={meta.name}
          description={meta.description}
        />
      </main>

      <Newsletter />
      <SiteFooter />
    </div>
  );
}
