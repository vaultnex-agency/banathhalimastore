"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { DISPLAY_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

interface TrackedItem {
  productName: string;
  productImage?: string;
  size?: string;
  quantity: number;
  price: number;
}

interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  currency: string;
  total: number;
  items: TrackedItem[];
  customer: { fullName: string; city: string };
}

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; description: string; color: string; bg: string; icon: React.ElementType; step: number }
> = {
  pending: {
    label: "Order Received",
    description: "We've received your WhatsApp booking and are reviewing it.",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
    step: 1,
  },
  processing: {
    label: "Processing",
    description: "Your order is being prepared and packed with care.",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: Package,
    step: 2,
  },
  shipped: {
    label: "Shipped",
    description: "Your order is on its way! Expect delivery soon.",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered successfully. Enjoy!",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    step: 4,
  },
  cancelled: {
    label: "Cancelled",
    description: "This order has been cancelled. Contact us if this was a mistake.",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    step: 0,
  },
  refunded: {
    label: "Refunded",
    description: "A refund has been issued for this order.",
    color: "text-neutral-600",
    bg: "bg-neutral-50 border-neutral-200",
    icon: RefreshCw,
    step: 0,
  },
};

const TIMELINE_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "pending",    label: "Order Received", icon: Clock },
  { key: "processing", label: "Processing",     icon: Package },
  { key: "shipped",    label: "Shipped",        icon: Truck },
  { key: "delivered",  label: "Delivered",      icon: CheckCircle },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone,       setPhone]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [order,       setOrder]       = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim() });
      if (phone.trim()) params.set("phone", phone.trim());

      const res = await fetch(`/api/orders/track?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setOrder(data as TrackedOrder);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const config   = order ? STATUS_CONFIG[order.status] : null;
  const isFailed = order?.status === "cancelled" || order?.status === "refunded";
  const currentStep = config?.step ?? 0;

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-brand-surface pt-6 pb-20">
        <div className="max-w-2xl mx-auto px-4">

          {/* ── Page Header ───────────────────────────────────────────── */}
          <div className="text-center mb-10 pt-8">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="text-brand-primary" size={28} strokeWidth={1.5} />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-brand-text">
              Track My Order
            </h1>
            <p className="text-sm font-body text-brand-text-muted mt-2 max-w-sm mx-auto">
              Enter your order number (e.g. <strong>BH-2025-1234</strong>) to see the live status of your delivery.
            </p>
          </div>

          {/* ── Search Form ───────────────────────────────────────────── */}
          <form
            onSubmit={handleTrack}
            className="bg-white rounded-3xl border border-brand-border shadow-xs p-6 space-y-4 mb-8"
          >
            <div>
              <label
                htmlFor="track-order-number"
                className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5"
              >
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                id="track-order-number"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. BH-2025-1234"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-border text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface"
              />
            </div>

            <div>
              <label
                htmlFor="track-phone"
                className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1.5"
              >
                Phone Number <span className="text-brand-text-muted font-normal">(optional, for verification)</span>
              </label>
              <input
                id="track-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +971 50 123 4567"
                className="w-full px-4 py-3 rounded-xl border border-brand-border text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-brand-surface"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              id="track-order-submit"
              className="w-full py-3.5 px-6 bg-brand-primary hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-body font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search size={17} />
                  Track Order
                </>
              )}
            </button>
          </form>

          {/* ── Error ─────────────────────────────────────────────────── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 mb-8">
              <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-body font-semibold text-red-700">{error}</p>
                <p className="text-xs font-body text-red-500 mt-1">
                  Need help?{" "}
                  <a
                    href={`https://wa.me/${DISPLAY_WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Contact us on WhatsApp
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* ── Order Result ──────────────────────────────────────────── */}
          {order && config && (
            <div className="space-y-5">

              {/* Status Banner */}
              <div className={`rounded-2xl border p-5 flex items-start gap-4 ${config.bg}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color} bg-white shadow-xs`}>
                  <config.icon size={20} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className={`text-sm font-body font-bold ${config.color}`}>{config.label}</p>
                    <p className="text-xs font-body text-brand-text-muted">
                      Updated {new Date(order.updatedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p className="text-xs font-body text-brand-text-muted mt-0.5">{config.description}</p>
                  <p className="text-xs font-body font-semibold text-brand-text mt-2">
                    Order #{order.orderNumber} · {order.customer.fullName}
                    {order.customer.city && <span className="font-normal text-brand-text-muted"> · {order.customer.city}</span>}
                  </p>
                </div>
              </div>

              {/* Progress Timeline (only for active orders) */}
              {!isFailed && (
                <div className="bg-white rounded-2xl border border-brand-border p-5">
                  <h2 className="text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-5">
                    Order Progress
                  </h2>
                  <div className="flex items-start justify-between relative">
                    {/* Connector line */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-100 z-0" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-brand-primary z-0 transition-all duration-700"
                      style={{
                        width: currentStep < 2 ? "0%" :
                               currentStep === 2 ? "33%" :
                               currentStep === 3 ? "66%" : "100%",
                      }}
                    />

                    {TIMELINE_STEPS.map((step, idx) => {
                      const stepNum   = idx + 1;
                      const isDone    = currentStep >= stepNum;
                      const isCurrent = currentStep === stepNum;

                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isDone
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "bg-white border-neutral-200 text-neutral-300"
                            } ${isCurrent ? "ring-4 ring-brand-primary/20" : ""}`}
                          >
                            <step.icon size={15} strokeWidth={2} />
                          </div>
                          <span className={`text-[10px] font-body text-center leading-tight ${isDone ? "font-semibold text-brand-text" : "text-brand-text-muted"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-brand-border p-5">
                <h2 className="text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-brand-primary" />
                  Items Ordered ({order.items.length})
                </h2>

                <div className="divide-y divide-brand-border/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center gap-3">
                      {item.productImage ? (
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-brand-muted flex-shrink-0 border border-brand-border/40">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-16 rounded-xl bg-brand-muted flex-shrink-0 flex items-center justify-center border border-brand-border/40">
                          <ShoppingBag size={18} className="text-brand-text-muted" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-semibold text-brand-text line-clamp-1">
                          {item.productName}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.size && (
                            <span className="text-[11px] font-body text-brand-text-muted bg-brand-muted px-2 py-0.5 rounded-md">
                              Size: {item.size}
                            </span>
                          )}
                          <span className="text-[11px] font-body text-brand-text-muted bg-brand-muted px-2 py-0.5 rounded-md">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-body font-bold text-brand-text flex-shrink-0">
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-brand-border mt-1 flex justify-between items-center">
                  <span className="text-sm font-body text-brand-text-muted">Total</span>
                  <span className="text-lg font-heading font-bold text-brand-primary">
                    {formatPrice(order.total, order.currency)}
                  </span>
                </div>
              </div>

              {/* Help CTA */}
              <div className="bg-white rounded-2xl border border-brand-border p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-body font-semibold text-brand-text">Have a question about your order?</p>
                  <p className="text-xs font-body text-brand-text-muted mt-0.5">
                    Chat with us directly on WhatsApp — we respond fast.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${DISPLAY_WHATSAPP_NUMBER.replace(/\D/g, "")}?text=Hi! I have a question about my order ${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-body font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageCircle size={15} />
                  WhatsApp Us
                </a>
              </div>

              {/* Track another / Continue shopping */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setOrder(null); setOrderNumber(""); setPhone(""); setError(null); }}
                  className="flex-1 py-3 px-5 border border-brand-border rounded-2xl text-xs font-body font-semibold text-brand-text hover:bg-brand-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={15} /> Track Another Order
                </button>
                <Link
                  href="/collections/churidar-suits"
                  className="flex-1 py-3 px-5 bg-brand-primary hover:bg-brand-accent text-white rounded-2xl text-xs font-body font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={15} /> Continue Shopping
                </Link>
              </div>
            </div>
          )}

          {/* ── Help note when no search yet ──────────────────────────── */}
          {!order && !error && !loading && (
            <div className="bg-white rounded-2xl border border-brand-border p-5 flex items-start gap-3">
              <MapPin size={18} className="text-brand-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs font-body text-brand-text-muted leading-relaxed">
                <strong className="text-brand-text block mb-0.5">Where is my order number?</strong>
                Your order number starts with <strong>BH-</strong> and was included in your WhatsApp booking confirmation message. If you can't find it, contact us at{" "}
                <a
                  href={`https://wa.me/${DISPLAY_WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary underline font-semibold"
                >
                  {DISPLAY_WHATSAPP_NUMBER}
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
