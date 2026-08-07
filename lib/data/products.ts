import { mockProducts } from "@/data/mock";
import type { Product } from "@/types/product";

// ─── Data Access Layer for Products (Frontend) ────────────────────────────────
// Designed for seamless transition to Supabase.
// When Supabase is configured, replace function bodies with Supabase queries.

export async function getProducts(): Promise<Product[]> {
  // Future Supabase integration:
  // const { data, error } = await supabase.from('products').select('*');
  // if (error) throw error;
  // return data;

  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
