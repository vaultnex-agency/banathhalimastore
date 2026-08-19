"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, MessageCircle, Truck, ShieldCheck, CheckCircle, PartyPopper, Clock, Phone, Copy, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createCartCheckoutWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import type { BookingDetails } from "@/types/cart";

export default function CartClient() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [ordered,     setOrdered]     = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [booking,     setBooking]     = useState(false);
  const [copied,      setCopied]      = useState(false);

  const [bookingForm, setBookingForm] = useState<BookingDetails>({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const currency = items[0]?.currency || "AED";

  const whatsAppCheckoutUrl = createCartCheckoutWhatsAppUrl(
    items,
    subtotal,
    currency,
    bookingForm
  );

  const handleCartBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBooking(true);

    let resolvedOrderNumber: string | null = null;

    try {
      const orderPayload = {
        customer: {
          fullName: bookingForm.customerName || "Store Customer",
          phone: bookingForm.phone || "",
          addressLine1: bookingForm.address || "",
          city: "Dubai",
          emirate: "Dubai",
          country: "UAE",
        },
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          colour: item.selectedColour || "",
          size: item.selectedSize || "Default",
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
        })),
        subtotal,
        shippingCost: 0,
        discount: 0,
        total: subtotal,
        currency,
        status: "pending",
        paymentMethod: "cod",
        notes: bookingForm.notes || undefined,
      };

      // Await order creation to get the order number
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const created = await res.json();
        resolvedOrderNumber = created.orderNumber ?? null;
      }
    } catch (err) {
      console.error("Order creation error:", err);
    }

    // Build WhatsApp URL — with order number stamped at the top
    const url = createCartCheckoutWhatsAppUrl(
      items,
      subtotal,
      currency,
      bookingForm,
      resolvedOrderNumber ?? undefined
    );

    // Open WhatsApp in a new tab
    window.open(url, "_blank", "noopener,noreferrer");

    // Clear cart and show success
    clearCart();
    setOrderNumber(resolvedOrderNumber);
    setOrdered(true);
    setBooking(false);
  };

  const handleCopyOrderNumber = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Order Success Screen ─────────────────────────────────────────────────────
  if (ordered) {
    return (
      <div className="pt-20 pb-20 px-4 max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle size={40} className="text-emerald-600" strokeWidth={1.5} />
            </div>
            <span className="absolute -top-1 -right-1 text-xl">🎉</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-brand-text mb-2">
            Order Sent to WhatsApp!
          </h1>
          <p className="text-sm font-body text-brand-text-muted max-w-md mx-auto leading-relaxed">
            Your order details — including your order number — were sent in the WhatsApp message. Scroll up in your chat to find them anytime.
          </p>
        </div>

        {/* Order Number Card — hero element */}
        {orderNumber && (
          <div className="bg-white border-2 border-brand-primary/30 rounded-3xl p-6 mb-6 text-center shadow-xs">
            <p className="text-xs font-body font-semibold text-brand-text-muted uppercase tracking-wider mb-2">Your Order Reference</p>
            <p className="font-heading text-4xl font-bold text-brand-primary tracking-wide mb-3">{orderNumber}</p>
            <p className="text-[11px] font-body text-brand-text-muted mb-4">Keep this number to track your order at any time.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCopyOrderNumber}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-border rounded-xl text-xs font-body font-semibold text-brand-text hover:bg-brand-muted transition-colors"
              >
                {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Order Number"}
              </button>
              <Link
                href={`/track-order?orderNumber=${orderNumber}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-accent text-white rounded-xl text-xs font-body font-semibold transition-colors"
              >
                <Package size={14} /> Track My Order
              </Link>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col items-center text-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <MessageCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-body font-semibold text-brand-text">Sent via WhatsApp</p>
              <p className="text-[11px] font-body text-brand-text-muted mt-0.5">Order number is in your WhatsApp chat.</p>
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col items-center text-center gap-2.5">
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-body font-semibold text-brand-text">Confirmation Soon</p>
              <p className="text-[11px] font-body text-brand-text-muted mt-0.5">We'll reply within a few hours.</p>
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col items-center text-center gap-2.5">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <Phone size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-body font-semibold text-brand-text">Need Help?</p>
              <p className="text-[11px] font-body text-brand-text-muted mt-0.5">{DISPLAY_WHATSAPP_NUMBER}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/collections/churidar-suits"
            className="inline-flex items-center gap-2 px-7 py-4 bg-brand-primary text-white text-sm font-body font-semibold rounded-2xl hover:bg-brand-accent transition-all shadow-sm"
          >
            <PartyPopper size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty Cart Screen ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto text-center">
        <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner text-brand-text-muted">
          <ShoppingBag size={36} />
        </div>
        <h1 className="font-heading text-3xl font-semibold text-brand-text mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm font-body text-brand-text-muted mb-8 max-w-md mx-auto">
          Explore our handcrafted Pakistani churidar suits and ethnic wear collection to add items to your cart.
        </p>
        <Link
          href="/collections/churidar-suits"
          className="inline-flex items-center gap-2 px-7 py-4 bg-brand-primary text-white text-sm font-body font-semibold rounded-2xl hover:bg-brand-accent transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/collections/churidar-suits"
            className="inline-flex items-center gap-1.5 text-xs font-body text-brand-text-muted hover:text-brand-text transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-brand-text">
            Shopping Bag ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-body text-brand-text-muted hover:text-red-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 size={14} /> Clear Entire Bag
        </button>
      </div>

      {/* Main Grid: Items List & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-xs space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 sm:p-4 rounded-2xl bg-brand-surface border border-brand-border/60 hover:border-brand-border transition-all"
              >
                {/* Item Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-24 h-32 rounded-xl overflow-hidden bg-brand-muted flex-shrink-0 group"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-heading text-lg font-semibold text-brand-text hover:text-brand-accent transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-text-muted hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-body text-brand-text-muted">
                      {item.selectedSize && (
                        <span className="bg-brand-muted px-2.5 py-0.5 rounded-md border border-brand-border/40 font-medium">
                          Size: <strong className="text-brand-text">{item.selectedSize}</strong>
                        </span>
                      )}
                      {item.selectedColour && (
                        <span className="bg-brand-muted px-2.5 py-0.5 rounded-md border border-brand-border/40 font-medium">
                          Color: <strong className="text-brand-text">{item.selectedColour}</strong>
                        </span>
                      )}
                    </div>

                    {/* Fabric Meterage (Churidar Bits) */}
                    {item.customMeasurements && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-body space-y-0.5">
                        <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">Churidar Bits Fabric Meterage:</p>
                        {(item.customMeasurements.topMeters || item.customMeasurements.top) && (
                          <p className="text-brand-text">
                            <strong>Top Bit:</strong> {item.customMeasurements.topMeters || item.customMeasurements.top}
                          </p>
                        )}
                        {(item.customMeasurements.bottomMeters || item.customMeasurements.bottom) && (
                          <p className="text-brand-text">
                            <strong>Bottom Bit:</strong> {item.customMeasurements.bottomMeters || item.customMeasurements.bottom}
                          </p>
                        )}
                        {(item.customMeasurements.dupattaMeters || item.customMeasurements.dupatta) && (
                          <p className="text-brand-text">
                            <strong>Dupatta Bit:</strong> {item.customMeasurements.dupattaMeters || item.customMeasurements.dupatta}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-brand-border/40">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-body font-bold text-brand-text">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs font-body text-brand-text-muted">
                          ({formatPrice(item.price, item.currency)} each)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl p-1 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-brand-muted rounded-lg transition-colors text-brand-text"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-body font-bold px-2 min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-brand-muted rounded-lg transition-colors text-brand-text"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-brand-border flex items-start gap-3">
              <Truck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-body font-semibold text-brand-text">Express UAE Delivery</h4>
                <p className="text-[11px] font-body text-brand-text-muted">Fast dispatch with tracking updates.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-brand-border flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-body font-semibold text-brand-text">Instant WhatsApp Booking</h4>
                <p className="text-[11px] font-body text-brand-text-muted">Direct confirmation with customer care.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp Booking Details Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs space-y-6 sticky top-20">
            <div className="border-b border-brand-border pb-4">
              <h2 className="font-heading text-2xl font-semibold text-brand-text">
                Booking & Delivery Details
              </h2>
              <p className="text-xs font-body text-brand-text-muted mt-1">
                Enter your details to generate your WhatsApp order booking.
              </p>
            </div>

            {/* Customer Details Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={bookingForm.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Halima Ahmed"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border text-xs font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +971 50 123 4567"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border text-xs font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Delivery Address / City
                </label>
                <input
                  type="text"
                  name="address"
                  value={bookingForm.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Villa 12, Jumeirah 1, Dubai"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border text-xs font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Special Notes / Customizations (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific fitting or delivery instructions..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-border text-xs font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface resize-none"
                />
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-brand-border">
              <div className="flex justify-between text-xs font-body text-brand-text-muted">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-brand-text">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-body text-brand-text-muted">
                <span>Estimated Delivery</span>
                <span className="text-emerald-600 font-semibold">FREE (UAE)</span>
              </div>
              <div className="flex justify-between text-sm font-heading font-bold text-brand-text pt-2 border-t border-brand-border">
                <span>Total Amount</span>
                <span className="text-xl text-brand-primary">{formatPrice(subtotal, currency)}</span>
              </div>
            </div>

            {/* Primary Action Button - Redirect to WhatsApp */}
            <button
              type="button"
              onClick={handleCartBooking}
              disabled={booking}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-body font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 group"
            >
              {booking ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={22} className="fill-white/20" />
                  <span>Confirm & Book via WhatsApp</span>
                </>
              )}
            </button>

            <div className="text-center bg-brand-surface p-3 rounded-xl border border-brand-border/50">
              <p className="text-[11px] font-body text-brand-text-muted flex items-center justify-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-600" />
                Direct WhatsApp contact number: <strong className="text-brand-text">{DISPLAY_WHATSAPP_NUMBER}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
