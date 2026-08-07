import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/data/orders";
import type { Order } from "@/types/order";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">;
    const created = await createOrder(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
