import type { CartItem, BookingDetails, FabricMeterage } from "@/types/cart";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

export const WHATSAPP_PHONE_NUMBER = "917306613586";
export const DISPLAY_WHATSAPP_NUMBER = "+91 7306613586";

/**
 * Creates a WhatsApp URL for single product direct booking (Churidar Bits)
 */
export function createDirectProductWhatsAppUrl(
  product: Product,
  selectedSize?: string,
  selectedColour?: string,
  quantity: number = 1,
  fabricMeterage?: FabricMeterage
): string {
  const total = product.price * quantity;
  const messageLines: (string | null)[] = [
    `🌸 *CHURIDAR BITS BOOKING INQUIRY - BANAT HALIMA*`,
    ``,
    `*Product:* ${product.name}`,
    `*Price:* ${formatPrice(product.price, product.currency)}`,
    selectedColour ? `*Colour:* ${selectedColour}` : null,
  ];

  if (
    fabricMeterage &&
    (fabricMeterage.topMeters || fabricMeterage.bottomMeters || fabricMeterage.dupattaMeters)
  ) {
    messageLines.push(``);
    messageLines.push(`*FABRIC METERAGE (CHURIDAR BITS):*`);
    if (fabricMeterage.topMeters)
      messageLines.push(`  • *Top Bit:* ${fabricMeterage.topMeters}`);
    if (fabricMeterage.bottomMeters)
      messageLines.push(`  • *Bottom Bit:* ${fabricMeterage.bottomMeters}`);
    if (fabricMeterage.dupattaMeters)
      messageLines.push(`  • *Dupatta Bit:* ${fabricMeterage.dupattaMeters}`);
  } else if (selectedSize) {
    messageLines.push(`*Size Cut:* ${selectedSize}`);
  }

  messageLines.push(``);
  messageLines.push(`*Quantity:* ${quantity}`);
  messageLines.push(`*Total Amount:* ${formatPrice(total, product.currency)}`);
  messageLines.push(``);
  messageLines.push(`Hi, I would like to order these Churidar Bits with the specified meterage. Please confirm stock!`);

  const filtered = messageLines.filter((line) => line !== null) as string[];
  const encodedText = encodeURIComponent(filtered.join("\n"));
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;
}

/**
 * Creates a WhatsApp URL for full cart checkout with customer booking details
 */
export function createCartCheckoutWhatsAppUrl(
  items: CartItem[],
  totalAmount: number,
  currency: "AED" | "PKR" = "AED",
  bookingDetails?: BookingDetails
): string {
  const messageLines: string[] = [
    `🛍️ *CHURIDAR BITS ORDER BOOKING - BANAT HALIMA*`,
    ``,
  ];

  if (bookingDetails?.customerName) {
    messageLines.push(`*CUSTOMER DETAILS:*`);
    messageLines.push(`• *Name:* ${bookingDetails.customerName}`);
    if (bookingDetails.phone) messageLines.push(`• *Phone:* ${bookingDetails.phone}`);
    if (bookingDetails.address) messageLines.push(`• *Address:* ${bookingDetails.address}`);
    if (bookingDetails.notes) messageLines.push(`• *Notes:* ${bookingDetails.notes}`);
    messageLines.push(``);
  }

  messageLines.push(`*ORDER ITEMS (${items.length}):*`);

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    let desc = `${index + 1}. *${item.name}*`;
    const specs: string[] = [];
    if (item.selectedColour) specs.push(`Color: ${item.selectedColour}`);
    if (item.selectedSize) specs.push(`Pack: ${item.selectedSize}`);
    if (specs.length > 0) desc += ` (${specs.join(" | ")})`;

    if (
      item.customMeasurements &&
      (item.customMeasurements.topMeters || item.customMeasurements.bottomMeters || item.customMeasurements.dupattaMeters)
    ) {
      desc += `\n   *Meterage:*`;
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
