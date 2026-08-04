export type FabricMeterage = {
  topMeters?: string;
  bottomMeters?: string;
  dupattaMeters?: string;
  top?: string;
  bottom?: string;
  dupatta?: string;
};

// Backwards-compatibility alias
export type CustomMeasurements = FabricMeterage;

export type CartItem = {
  id: string; // unique cart item id
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  currency: "AED" | "PKR";
  image: string;
  selectedSize?: string;
  selectedColour?: string;
  customMeasurements?: FabricMeterage;
  quantity: number;
};

export type BookingDetails = {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
};
