import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Link from "next/link";
import { User, Package, Heart, ShoppingBag } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <AnnouncementBar />
      <SiteHeader />

      <main className="pt-24 pb-16 px-5 max-w-4xl mx-auto">
        <div className="bg-white border border-brand-border rounded-3xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-brand-text mb-2">Customer Account</h1>
          <p className="text-sm font-body text-brand-text-muted max-w-md mx-auto mb-8">
            Welcome to Banat Halima. View your wishlist or check out our latest collection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Link
              href="/collections/churidar-suits"
              className="flex items-center justify-center gap-2 p-4 bg-brand-muted hover:bg-brand-accent/10 text-brand-text font-body text-sm rounded-2xl transition-colors"
            >
              <ShoppingBag size={18} />
              <span>Shop Collection</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-center gap-2 p-4 bg-brand-muted hover:bg-brand-accent/10 text-brand-text font-body text-sm rounded-2xl transition-colors"
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 p-4 bg-brand-muted hover:bg-brand-accent/10 text-brand-text font-body text-sm rounded-2xl transition-colors"
            >
              <Package size={18} />
              <span>My Bag</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
