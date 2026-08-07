"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { brand } from "@/lib/tokens";
import SearchOverlay from "@/components/search/SearchOverlay";

import { useCart } from "@/context/CartContext";
import { AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

export default function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart, toastNotice, dismissToast } = useCart();
  const [wishlistCount] = useState(0);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(250,250,249,0)", "rgba(250,250,249,0.97)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0 0 rgba(0,0,0,0)", "0 1px 16px rgba(0,0,0,0.06)"]
  );

  // Prevent body scroll when search is open
  useEffect(() => {
    if (searchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  return (
    <>
      <motion.header
        style={{ backgroundColor: headerBg, boxShadow: headerShadow }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-h-0 min-w-0">
            <span className="font-heading text-xl font-semibold tracking-tight text-brand-primary leading-none">
              {brand.name}
            </span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 relative">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="relative p-2.5 rounded-full hover:bg-brand-muted transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2.5 rounded-full hover:bg-brand-muted transition-colors"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Customer Account"
              title="Customer Account"
              className="relative p-2.5 rounded-full hover:bg-brand-muted transition-colors"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Cart Button with Notification Badge */}
            <div className="relative">
              <button
                onClick={openCart}
                aria-label={`Shopping Bag (${totalItems} items)`}
                className="relative p-2.5 rounded-full hover:bg-brand-muted transition-all min-h-0 min-w-0 flex items-center justify-center group"
              >
                <ShoppingBag size={22} strokeWidth={1.75} className="text-brand-text group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Toast Notification Popover above/near Cart */}
              <AnimatePresence>
                {toastNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 z-50 w-72 bg-black text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-start gap-3"
                  >
                    <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <div className="flex-1 text-xs font-body">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-emerald-400">Added to Cart!</span>
                        <button onClick={dismissToast} className="text-white/60 hover:text-white p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                      <p className="line-clamp-1 text-white/90 font-medium">{toastNotice.productName}</p>
                      <p className="text-[11px] text-white/70 mt-1 font-bold">
                        🛒 {totalItems} {totalItems === 1 ? "item" : "items"} in shopping bag
                      </p>
                      <button
                        onClick={openCart}
                        className="mt-2 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline"
                      >
                        View Shopping Bag & Checkout →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
