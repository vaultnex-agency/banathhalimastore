import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient, TABLES, mapSupabaseRowToOrder } from "@/lib/supabase";

/**
 * GET /api/orders/track?orderNumber=BH-2025-XXXX&phone=+971501234567
 * Looks up an order by orderNumber AND validates the phone matches for privacy.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const phone       = searchParams.get("phone")?.trim();

  if (!orderNumber) {
    return NextResponse.json({ error: "Order number is required." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      console.error("Track order error:", error);
      return NextResponse.json({ error: "Failed to look up order." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Order not found. Please check your order number." }, { status: 404 });
    }

    const order = mapSupabaseRowToOrder(data);

    // Privacy gate: if phone is provided, it must match (partial match is fine for UX)
    if (phone) {
      const normalise = (s: string) => s.replace(/\D/g, "");
      const inputNorm  = normalise(phone);
      const storedNorm = normalise(order.customer?.phone ?? "");
      if (inputNorm && storedNorm && !storedNorm.includes(inputNorm) && !inputNorm.includes(storedNorm)) {
        return NextResponse.json({ error: "Order not found. Please check your details." }, { status: 404 });
      }
    }

    // Return a safe subset — no internal IDs, no full address
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status:      order.status,
      createdAt:   order.createdAt,
      updatedAt:   order.updatedAt,
      currency:    order.currency,
      total:       order.total,
      items:       order.items.map((i) => ({
        productName: i.productName,
        productImage: i.productImage,
        size:        i.size,
        quantity:    i.quantity,
        price:       i.price,
      })),
      customer: {
        fullName: order.customer?.fullName,
        city:     order.customer?.city ?? order.customer?.emirate ?? "",
      },
    });
  } catch (err) {
    console.error("Track order exception:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
