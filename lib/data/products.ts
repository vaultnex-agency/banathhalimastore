import type { Product } from "@/types/product";
import { getSupabaseClient, TABLES, mapSupabaseRowToProduct } from "@/lib/supabase";

// ─── Data Access Layer for Products (Storefront) ─────────────────────────────
// Queries Supabase directly. Returns clean data or empty array/null.

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn("Supabase client not configured in storefront getProducts");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase storefront getProducts error:", error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToProduct);
  } catch (err) {
    console.error("Supabase client fetch exception:", err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase storefront getProductById error:", error);
      return null;
    }

    return data ? mapSupabaseRowToProduct(data) : null;
  } catch (err) {
    console.error("Supabase client single fetch exception:", err);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Supabase storefront getProductBySlug error:", error);
      return null;
    }

    return data ? mapSupabaseRowToProduct(data) : null;
  } catch (err) {
    console.error("Supabase client slug fetch exception:", err);
    return null;
  }
}
