import type { Order } from "@/types/order";
import { getSupabaseClient, TABLES, mapOrderToSupabaseRow, mapSupabaseRowToOrder } from "@/lib/supabase";

// ─── Data Access Layer for Orders (Storefront) ────────────────────────────────
// Persists orders directly to Supabase when configured.

export async function createOrder(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const now = new Date().toISOString();
  const orderId = `o${Date.now()}`;
  const orderNumber = `BH-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

  const order: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbRow = mapOrderToSupabaseRow(order);
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.error("Supabase createOrder error:", error);
      } else if (data) {
        return mapSupabaseRowToOrder(data);
      }
    } catch (err) {
      console.error("Supabase createOrder exception:", err);
    }
  }

  // Return generated order object if offline/unconfigured
  return order;
}
