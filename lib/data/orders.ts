import type { Order } from "@/types/order";

// ─── Data Access Layer for Orders (Frontend) ──────────────────────────────────
// Designed for seamless transition to Supabase.

export async function createOrder(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    ...orderData,
    id: `o${Date.now()}`,
    orderNumber: `BH-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  // Future Supabase integration:
  // const { data, error } = await supabase.from('orders').insert([order]).select().single();
  // if (error) throw error;
  // return data;

  return order;
}
