import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

/**
 * Supabase Client Helper (Frontend / Storefront)
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

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const config = getSupabaseConfig();
  if (!config) return null;

  supabaseInstance = createClient(config.url, config.anonKey);
  return supabaseInstance;
}

// Table names for consistent querying across the application
export const TABLES = {
  PRODUCTS: "products",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
} as const;

// ─── Data Mappers ────────────────────────────────────────────────────────────

export function mapSupabaseRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: row.category ?? "Churidar Suits",
    price: Number(row.price ?? 0),
    originalPrice: Number(row.original_price ?? row.price ?? 0),
    currency: row.currency ?? "AED",
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 0),
    images: Array.isArray(row.images) ? row.images : [],
    colours: Array.isArray(row.colours) ? row.colours : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    fabric: row.fabric ?? "",
    occasion: Array.isArray(row.occasion) ? row.occasion : [],
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count ?? 0),
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_bestseller),
    isFeatured: Boolean(row.is_featured),
    productType: row.product_type ?? "bit-piece",
    sizeDetails: row.size_details ?? undefined,
    defaultMeterage: row.default_meterage ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export function mapProductToSupabaseRow(product: Partial<Product>): Record<string, any> {
  const row: Record<string, any> = {};
  if (product.id !== undefined) row.id = product.id;
  if (product.slug !== undefined) row.slug = product.slug;
  if (product.name !== undefined) row.name = product.name;
  if (product.description !== undefined) row.description = product.description;
  if (product.category !== undefined) row.category = product.category;
  if (product.price !== undefined) row.price = product.price;
  if (product.originalPrice !== undefined) row.original_price = product.originalPrice;
  if (product.currency !== undefined) row.currency = product.currency;
  if (product.rating !== undefined) row.rating = product.rating;
  if (product.reviewCount !== undefined) row.review_count = product.reviewCount;
  if (product.images !== undefined) row.images = product.images;
  if (product.colours !== undefined) row.colours = product.colours;
  if (product.sizes !== undefined) row.sizes = product.sizes;
  if (product.fabric !== undefined) row.fabric = product.fabric;
  if (product.occasion !== undefined) row.occasion = product.occasion;
  if (product.inStock !== undefined) row.in_stock = product.inStock;
  if (product.stockCount !== undefined) row.stock_count = product.stockCount;
  if (product.isNew !== undefined) row.is_new = product.isNew;
  if (product.isBestSeller !== undefined) row.is_bestseller = product.isBestSeller;
  if (product.isFeatured !== undefined) row.is_featured = product.isFeatured;
  if (product.productType !== undefined) row.product_type = product.productType;
  if (product.sizeDetails !== undefined) row.size_details = product.sizeDetails;
  if (product.defaultMeterage !== undefined) row.default_meterage = product.defaultMeterage;
  if (product.createdAt !== undefined) row.created_at = product.createdAt;
  if (product.updatedAt !== undefined) row.updated_at = product.updatedAt;
  return row;
}

export function mapSupabaseRowToOrder(row: any): Order {
  return {
    id: String(row.id),
    orderNumber: row.order_number ?? row.orderNumber,
    customer: typeof row.customer === "string" ? JSON.parse(row.customer) : row.customer,
    items: typeof row.items === "string" ? JSON.parse(row.items) : (row.items ?? []),
    subtotal: Number(row.subtotal ?? 0),
    shippingCost: Number(row.shipping_cost ?? row.shippingCost ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total ?? 0),
    currency: row.currency ?? "AED",
    status: row.status ?? "pending",
    paymentMethod: row.payment_method ?? row.paymentMethod ?? "cod",
    notes: row.notes ?? undefined,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
  };
}

export function mapOrderToSupabaseRow(order: Partial<Order>): Record<string, any> {
  const row: Record<string, any> = {};
  if (order.id !== undefined) row.id = order.id;
  if (order.orderNumber !== undefined) row.order_number = order.orderNumber;
  if (order.customer !== undefined) row.customer = order.customer;
  if (order.items !== undefined) row.items = order.items;
  if (order.subtotal !== undefined) row.subtotal = order.subtotal;
  if (order.shippingCost !== undefined) row.shipping_cost = order.shippingCost;
  if (order.discount !== undefined) row.discount = order.discount;
  if (order.total !== undefined) row.total = order.total;
  if (order.currency !== undefined) row.currency = order.currency;
  if (order.status !== undefined) row.status = order.status;
  if (order.paymentMethod !== undefined) row.payment_method = order.paymentMethod;
  if (order.notes !== undefined) row.notes = order.notes;
  if (order.createdAt !== undefined) row.created_at = order.createdAt;
  if (order.updatedAt !== undefined) row.updated_at = order.updatedAt;
  return row;
}
