"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, X, Check, Menu, Package, Info, ChevronRight } from "lucide-react";
import { brand } from "@/lib/tokens";
import SearchOverlay from "@/components/search/SearchOverlay";
import { useCart } from "@/context/CartContext";

const menuLinks = [
  { href: "/about",           label: "About",           icon: Info,    description: "Our story & craftsmanship" },
  { href: "/track-order",     label: "Track My Order",  icon: Package, description: "Check your order status"   },
  { href: "/account",         label: "My Account",      icon: User,    description: "Profile & order history"   },
];

export default function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const { totalItems, openCart, toastNotice, dismissToast } = useCart();
  const [wishlistCount] = useState(0);
  const { scrollY } = useScroll();

  // Scroll animations
  const headerBg     = useTransform(scrollY, [0, 60], ["rgba(255,255,255,0.75)", "rgba(255,255,255,0.92)"]);
  const headerBorder = useTransform(scrollY, [0, 60], ["rgba(255,255,255,0.35)", "rgba(229,229,226,0.6)"]);
  const headerShadow = useTransform(scrollY, [0, 60], ["0 2px 12px rgba(0,0,0,0.03)", "0 4px 16px rgba(0,0,0,0.05)"]);

  // Lock body scroll when menu or search is open
  useEffect(() => {
    document.body.style.overflow = (searchOpen || menuOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen]);

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 grid grid-cols-3 items-center">

          {/* Left — hamburger + search */}
          <div className="flex items-center gap-0.5 justify-self-start">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 md:p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              className="p-2 md:p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center — brand logo + wordmark */}
          <Link
            href="/"
            className="justify-self-center flex items-center gap-2 group"
            style={{ fontFamily: brand.fonts.heading }}
          >
            <Image
              src="/bh-logo.png"
              alt="Banat Halima Logo"
              width={40}
              height={40}
              className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span
              className="text-[22px] md:text-[28px] font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-600 transition-colors whitespace-nowrap"
              style={{ letterSpacing: "-0.01em" }}
            >
              Banat <span style={{ color: brand.colors.accent }}>Halima</span>
            </span>
          </Link>

          {/* Right — wishlist + cart (no account icon) */}
          <div className="flex items-center gap-0.5 justify-self-end relative">

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2 md:p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 transition-colors"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={openCart}
                aria-label={`Shopping Bag (${totalItems} items)`}
                className="relative p-2 md:p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 transition-all flex items-center justify-center group"
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

      {/* ── Menu Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Slide-in panel */}
            <motion.div
              key="menu-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <span
                  className="text-[22px] font-semibold text-neutral-900"
                  style={{ fontFamily: brand.fonts.heading }}
                >
                  Banat <span style={{ color: brand.colors.accent }}>Halima</span>
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuLinks.map(({ href, label, icon: Icon, description }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 transition-colors group"
                  >
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: brand.colors.accentLight }}
                    >
                      <Icon size={17} strokeWidth={1.6} style={{ color: brand.colors.accent }} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[15px] font-medium leading-tight">{label}</span>
                      <span className="block text-[12px] text-neutral-400 mt-0.5">{description}</span>
                    </span>
                    <ChevronRight size={15} className="text-neutral-300 group-hover:text-neutral-500 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-neutral-100">
                <p className="text-[11px] text-neutral-400 text-center" style={{ fontFamily: brand.fonts.body }}>
                  {brand.tagline}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
