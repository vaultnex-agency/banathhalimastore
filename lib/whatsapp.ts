import type { CartItem, BookingDetails, FabricMeterage } from "@/types/cart";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

export const WHATSAPP_PHONE_NUMBER = "918113824528";
export const DISPLAY_WHATSAPP_NUMBER = "+91 8113824528";

/**
 * Creates a WhatsApp URL for single product direct booking (Churidar Suits / Bits)
 */
export function createDirectProductWhatsAppUrl(
  product: Product,
  selectedSize?: string,
  selectedColour?: string,
  quantity: number = 1,
  fabricMeterage?: FabricMeterage,
  bookingDetails?: BookingDetails,
  orderNumber?: string
): string {
  const total = product.price * quantity;
  const messageLines: (string | null)[] = [
    `🌸 *ORDER BOOKING - BANAT HALIMA*`,
    ``,
  ];

  if (orderNumber) {
    messageLines.push(`📋 *Order Reference Number:* \`${orderNumber}\``);
    messageLines.push(`🔗 *Track Order:* ${typeof window !== "undefined" ? window.location.origin : ""}/track-order`);
    messageLines.push(``);
  }

  if (bookingDetails?.customerName) {
    messageLines.push(`👤 *CUSTOMER DETAILS:*`);
    messageLines.push(`  • *Name:* ${bookingDetails.customerName}`);
    if (bookingDetails.phone)   messageLines.push(`  • *Phone:* ${bookingDetails.phone}`);
    if (bookingDetails.address) messageLines.push(`  • *Address:* ${bookingDetails.address}`);
    if (bookingDetails.notes)   messageLines.push(`  • *Notes:* ${bookingDetails.notes}`);
    messageLines.push(``);
  }

  messageLines.push(`👗 *PRODUCT DETAILS:*`);
  messageLines.push(`  • *Product Name:* ${product.name}`);
  messageLines.push(`  • *Product ID:* \`${product.id}\``);
  messageLines.push(`  • *Price:* ${formatPrice(product.price, product.currency)}`);
  if (selectedColour) messageLines.push(`  • *Colour:* ${selectedColour}`);

  if (
    fabricMeterage &&
    (fabricMeterage.topMeters || fabricMeterage.bottomMeters || fabricMeterage.dupattaMeters)
  ) {
    messageLines.push(`  • *Fabric Cut Lengths:*`);
    if (fabricMeterage.topMeters)
      messageLines.push(`      - Top Bit: ${fabricMeterage.topMeters}`);
    if (fabricMeterage.bottomMeters)
      messageLines.push(`      - Bottom Bit: ${fabricMeterage.bottomMeters}`);
    if (fabricMeterage.dupattaMeters)
      messageLines.push(`      - Dupatta Bit: ${fabricMeterage.dupattaMeters}`);
  } else if (selectedSize) {
    messageLines.push(`  • *Size Cut:* ${selectedSize}`);
  }

  messageLines.push(``);
  messageLines.push(`📦 *Quantity:* ${quantity}`);
  messageLines.push(`💰 *TOTAL AMOUNT:* ${formatPrice(total, product.currency)}`);
  messageLines.push(``);
  messageLines.push(`Please confirm availability and delivery schedule for my order. Thank you!`);

  const filtered = messageLines.filter((line) => line !== null) as string[];
  const encodedText = encodeURIComponent(filtered.join("\n"));
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;
}

/**
 * Creates a WhatsApp URL for full cart checkout with customer booking details.
 */
export function createCartCheckoutWhatsAppUrl(
  items: CartItem[],
  totalAmount: number,
  currency: "AED" | "PKR" = "AED",
  bookingDetails?: BookingDetails,
  orderNumber?: string
): string {
  const messageLines: string[] = [
    `🛍️ *ORDER BOOKING - BANAT HALIMA*`,
    ``,
  ];

  // ── Order reference ──
  if (orderNumber) {
    messageLines.push(`📋 *Order Reference Number:* \`${orderNumber}\``);
    messageLines.push(`🔗 *Track Order:* ${typeof window !== "undefined" ? window.location.origin : ""}/track-order`);
    messageLines.push(``);
  }

  if (bookingDetails?.customerName) {
    messageLines.push(`👤 *CUSTOMER DETAILS:*`);
    messageLines.push(`  • *Name:* ${bookingDetails.customerName}`);
    if (bookingDetails.phone)   messageLines.push(`  • *Phone:* ${bookingDetails.phone}`);
    if (bookingDetails.address) messageLines.push(`  • *Address:* ${bookingDetails.address}`);
    if (bookingDetails.notes)   messageLines.push(`  • *Notes:* ${bookingDetails.notes}`);
    messageLines.push(``);
  }

  messageLines.push(`📦 *ORDER ITEMS (${items.length}):*`);

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    let desc = `${index + 1}. *${item.name}* (ID: \`${item.productId}\`)`;
    const specs: string[] = [];
    if (item.selectedColour) specs.push(`Color: ${item.selectedColour}`);
    if (item.selectedSize) specs.push(`Size/Cut: ${item.selectedSize}`);
    if (specs.length > 0) desc += `\n   ${specs.join(" | ")}`;

    if (
      item.customMeasurements &&
      (item.customMeasurements.topMeters || item.customMeasurements.bottomMeters || item.customMeasurements.dupattaMeters)
    ) {
      desc += `\n   Fabric Meterage:`;
      if (item.customMeasurements.topMeters) desc += ` Top: ${item.customMeasurements.topMeters};`;
      if (item.customMeasurements.bottomMeters) desc += ` Bottom: ${item.customMeasurements.bottomMeters};`;
      if (item.customMeasurements.dupattaMeters) desc += ` Dupatta: ${item.customMeasurements.dupattaMeters};`;
    }

    desc += `\n   ${item.quantity} x ${formatPrice(item.price, item.currency)} = ${formatPrice(itemTotal, item.currency)}`;
    messageLines.push(desc);
  });

  messageLines.push(``);
  messageLines.push(`💰 *TOTAL AMOUNT:* ${formatPrice(totalAmount, currency)}`);
  messageLines.push(``);
  messageLines.push(`Please confirm availability and share payment/delivery instructions. Thank you!`);

  const encodedText = encodeURIComponent(messageLines.join("\n"));
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;
}
