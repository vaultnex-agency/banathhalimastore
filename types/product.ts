export type Currency = "AED" | "PKR";

export type ProductColour = {
  name: string;
  hex: string;
};

export type DefaultMeterage = {
  topMeters: string;
  bottomMeters: string;
  dupattaMeters: string;
};

export type ProductType = "bit-piece" | "ready-made";

export type SizeDetails = {
  shirt?: string;
  bottom?: string;
  dupatta?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  images: string[];          // array of public-folder paths or URLs
  colours: ProductColour[];
  sizes: string[];
  fabric: string;
  occasion: string[];
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  productType?: ProductType;         // "bit-piece" or "ready-made"
  sizeDetails?: SizeDetails;         // shirt/bottom/dupatta measurements (bit-piece only)
  defaultMeterage?: DefaultMeterage; // admin-configured default fabric cut lengths
  createdAt: string;         // ISO date string
  updatedAt: string;
};
