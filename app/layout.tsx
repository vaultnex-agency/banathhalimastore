import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Banat Halima | Premium Pakistani Fashion",
    template: "%s | Banat Halima",
  },
  description:
    "Discover exquisite Pakistani churidar suits and ethnic wear. Premium quality, authentic craftsmanship — delivered across the UAE.",
  keywords: [
    "Pakistani fashion",
    "churidar suits",
    "ethnic wear UAE",
    "Pakistani clothes Dubai",
    "salwar kameez",
    "banat halima",
  ],
  openGraph: {
    title: "Banat Halima | Premium Pakistani Fashion",
    description: "Exquisite Pakistani churidar suits delivered across the UAE.",
    locale: "en_AE",
    type: "website",
  },
};

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased bg-brand-surface text-brand-text">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
