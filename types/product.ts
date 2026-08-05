export type Currency = "AED" | "PKR";

export type ProductColour = {
  name: string;
  hex: string;
};

export type SizeDetails = {
  shirt?: string;
  bottom?: string;
  dupatta?: string;
};

export type ProductType = "bit-piece" | "ready-made";

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
  productType?: ProductType;
  sizes?: string[];           // used when productType is "ready-made"
  sizeDetails?: SizeDetails;  // used when productType is "bit-piece"
  fabric: string;
  occasion: string[];
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  createdAt: string;         // ISO date string
  updatedAt: string;
};
