import { mockProducts } from "@/data/mock";
import type { Product } from "@/types/product";
import { getSupabaseClient, TABLES, mapSupabaseRowToProduct } from "@/lib/supabase";

// ─── Data Access Layer for Products (Storefront) ─────────────────────────────
// Connects to Supabase when configured, otherwise falls back gracefully to mockProducts.

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase getProducts error:", error);
      } else if (data && data.length > 0) {
        return data.map(mapSupabaseRowToProduct);
      }
    } catch (err) {
      console.error("Supabase client fetch exception:", err);
    }
  }

  // Fallback to local mock data
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase getProductById error:", error);
      } else if (data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch (err) {
      console.error("Supabase client single fetch exception:", err);
    }
  }

  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Supabase getProductBySlug error:", error);
      } else if (data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch (err) {
      console.error("Supabase client slug fetch exception:", err);
    }
  }

  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
