"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, X, Check } from "lucide-react";
import { brand } from "@/lib/tokens";
import SearchOverlay from "@/components/search/SearchOverlay";
import { useCart } from "@/context/CartContext";

export default function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart, toastNotice, dismissToast } = useCart();
  const [wishlistCount] = useState(0);
  const { scrollY } = useScroll();

  // Scroll animations for smooth transition from 75% translucent white to 92% opaque white
  const headerBg = useTransform(
    scrollY,
    [0, 60],
    ["rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 0.92)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 60],
    ["rgba(255, 255, 255, 0.35)", "rgba(229, 229, 226, 0.6)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 60],
    ["0 2px 12px rgba(0, 0, 0, 0.03)", "0 4px 16px rgba(0, 0, 0, 0.05)"]
  );

  // Prevent body scroll when search is open
  useEffect(() => {
    if (searchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          borderColor: headerBorder,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        className="sticky top-0 z-40 w-full border-b transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-h-0 min-w-0">
            <span className="font-heading text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 leading-none">
              {brand.name}
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 md:gap-1.5 relative">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              className="relative p-2 md:p-2.5 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2 md:p-2.5 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              aria-label="Customer Account"
              title="Customer Account"
              className="relative p-2 md:p-2.5 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={openCart}
                aria-label={`Shopping Bag (${totalItems} items)`}
                className="relative p-2 md:p-2.5 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100/70 transition-all flex items-center justify-center group"
              >
                <ShoppingBag size={21} strokeWidth={1.6} className="group-hover:scale-105 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Toast Notification Popover */}
              <AnimatePresence>
                {toastNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 z-50 w-72 bg-neutral-900 text-white p-3.5 rounded-2xl shadow-xl border border-neutral-800 flex items-start gap-3"
                  >
                    <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <div className="flex-1 text-xs font-sans">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-emerald-400">Added to Bag!</span>
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
