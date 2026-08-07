/**
 * Supabase Client Helper (Frontend)
 * 
 * Centralized Supabase integration layer for banathalima-frontend.
 * When Supabase environment variables are provided, this helper instantiates
 * the Supabase client.
 * 
 * Integration Steps:
 * 1. Run `npm install @supabase/supabase-js`
 * 2. Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
 * 3. Switch functions in `@/lib/data/products.ts` & `@/lib/data/orders.ts` to use Supabase.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

// Table names for consistent querying across the application
export const TABLES = {
  PRODUCTS: "products",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
} as const;
