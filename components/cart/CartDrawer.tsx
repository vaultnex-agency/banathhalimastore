"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createCartCheckoutWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } =
    useCart();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const whatsAppCheckoutUrl = createCartCheckoutWhatsAppUrl(
    items,
    subtotal,
    items[0]?.currency || "AED"
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-surface">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-brand-primary" size={20} />
                <h2 className="font-heading text-xl font-semibold text-brand-text">
                  Your Shopping Bag
                </h2>
                <span className="bg-brand-primary text-white text-xs font-body font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-brand-muted transition-colors"
                aria-label="Close cart"
              >
                <X size={20} className="text-brand-text" />
              </button>
            </div>

            {/* Drawer Body - Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center mx-auto text-brand-text-muted">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="font-heading text-lg font-medium text-brand-text">
                    Your bag is empty
                  </p>
                  <p className="text-xs font-body text-brand-text-muted max-w-xs mx-auto">
                    Explore our exquisite collection of Pakistani churidar suits and add items to your cart.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-5 py-2.5 bg-brand-primary text-white text-xs font-body font-semibold rounded-xl hover:bg-brand-accent transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-2xl bg-brand-surface border border-brand-border/60 hover:border-brand-border transition-all"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-brand-muted flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="font-body text-xs font-semibold text-brand-text line-clamp-1 hover:text-brand-accent transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-brand-text-muted hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-body text-brand-text-muted">
                          {item.selectedSize && (
                            <span className="bg-brand-muted px-2 py-0.5 rounded-md font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColour && (
                            <span className="bg-brand-muted px-2 py-0.5 rounded-md font-medium">
                              Color: {item.selectedColour}
                            </span>
                          )}
                        </div>

                        {/* Fabric Meterage (Churidar Bits) */}
                        {item.customMeasurements && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-body space-y-0.5">
                            <p className="font-bold text-amber-900 text-[9px] uppercase tracking-wider">Churidar Bits Fabric Lengths:</p>
                            {(item.customMeasurements.topMeters || item.customMeasurements.top) && (
                              <p className="text-brand-text line-clamp-1">
                                <strong>Top Bit:</strong> {item.customMeasurements.topMeters || item.customMeasurements.top}
                              </p>
                            )}
                            {(item.customMeasurements.bottomMeters || item.customMeasurements.bottom) && (
                              <p className="text-brand-text line-clamp-1">
                                <strong>Bottom Bit:</strong> {item.customMeasurements.bottomMeters || item.customMeasurements.bottom}
                              </p>
                            )}
                            {(item.customMeasurements.dupattaMeters || item.customMeasurements.dupatta) && (
                              <p className="text-brand-text line-clamp-1">
                                <strong>Dupatta Bit:</strong> {item.customMeasurements.dupattaMeters || item.customMeasurements.dupatta}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-brand-border/40">
                        <span className="text-xs font-body font-bold text-brand-text">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </span>

                        <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-brand-muted rounded transition-colors text-brand-text"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-body font-bold px-1 min-w-[1.25rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-brand-muted rounded transition-colors text-brand-text"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-surface space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-body font-medium text-brand-text-muted">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-heading text-xl font-bold text-brand-text">
                    {formatPrice(subtotal, items[0]?.currency || "AED")}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Proceed to Checkout & Booking Details */}
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-body font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle size={18} className="fill-white/20" />
                    <span>Proceed to Booking ({DISPLAY_WHATSAPP_NUMBER})</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* View Full Cart Button */}
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-accent text-white text-xs font-body font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={15} />
                    View Bag Details
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
