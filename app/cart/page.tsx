import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartClient from "./CartClient";

export const metadata = {
  title: "Shopping Bag",
  description: "View your selected items and complete your order booking via WhatsApp.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <SiteHeader />
        <CartClient />
      </div>

      <SiteFooter />
    </div>
  );
}
