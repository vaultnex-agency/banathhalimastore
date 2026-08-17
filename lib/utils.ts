import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "AED" | "PKR" = "AED"): string {
  const symbols: Record<string, string> = { AED: "AED ", PKR: "Rs " };
  return `${symbols[currency]}${amount.toLocaleString("en-AE")}`;
}

export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function getProductImageUrl(pathOrUrl: string | undefined): string {
  if (!pathOrUrl) return "/product-teal.png";
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("blob:") ||
    pathOrUrl.startsWith("/")
  ) {
    return pathOrUrl;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/product-images/${pathOrUrl}`;
  }

  return `/${pathOrUrl}`;
}
