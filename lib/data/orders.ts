import type { Order } from "@/types/order";
import { getSupabaseClient, TABLES, mapOrderToSupabaseRow, mapSupabaseRowToOrder } from "@/lib/supabase";

// ─── Data Access Layer for Orders (Storefront) ────────────────────────────────
// Persists customer orders directly to Supabase.

export async function createOrder(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const now = new Date().toISOString();
  const orderNumber = `BH-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

  const order: Omit<Order, "id"> = {
    ...orderData,
    orderNumber,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured for order creation.");
  }

  const dbRow = mapOrderToSupabaseRow(order);
  // Let database generate ID with DEFAULT
  delete dbRow.id;

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .insert([dbRow])
    .select()
    .single();

  if (error) {
    console.error("Supabase createOrder error:", error);
    throw new Error(`Failed to create order in database: ${error.message}`);
  }

  if (!data) {
    throw new Error("Order creation returned no data.");
  }

  return mapSupabaseRowToOrder(data);
}
