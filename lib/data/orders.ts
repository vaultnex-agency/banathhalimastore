import type { Order } from "@/types/order";
import { getSupabaseClient, TABLES, mapOrderToSupabaseRow, mapSupabaseRowToOrder } from "@/lib/supabase";
import { promises as fs } from "fs";
import path from "path";

// ─── Data Access Layer for Orders (Storefront) ────────────────────────────────
// Persists orders directly to Supabase when configured, or local flat-file DB fallback.

async function saveOrderToFlatFile(order: Order): Promise<void> {
  const dbPaths = [
    path.join(process.cwd(), "..", "banath-admin", "data", "db.json"),
    path.join(process.cwd(), "data", "db.json"),
  ];

  for (const dbPath of dbPaths) {
    try {
      let db: { products: any[]; orders: any[] } = { products: [], orders: [] };
      try {
        const raw = await fs.readFile(dbPath, "utf-8");
        db = JSON.parse(raw);
      } catch {
        // Create directory and file if missing
      }
      if (!Array.isArray(db.orders)) db.orders = [];
      db.orders.unshift(order);
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");
      return;
    } catch (err) {
      console.warn("Flat-file DB write warning:", err);
    }
  }
}

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

  // Fallback to local flat-file JSON DB
  await saveOrderToFlatFile(order);

  return order;
}

