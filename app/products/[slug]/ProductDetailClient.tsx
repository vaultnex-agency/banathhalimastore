"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RefreshCw, Heart, ShoppingBag, ArrowLeft, MessageCircle, Plus, Minus, Check, Ruler, Layers } from "lucide-react";
import type { Product } from "@/types/product";
import type { FabricMeterage } from "@/types/cart";
import { brand } from "@/lib/tokens";
import { formatPrice, discountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { createDirectProductWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from "@/lib/whatsapp";

type Props = {
  product: Product;
};

const TOP_METER_PRESETS = ["2.25m", "2.5m", "2.75m", "3.0m"];
const BOTTOM_METER_PRESETS = ["2.0m", "2.25m", "2.5m", "3.0m"];
const DUPATTA_METER_PRESETS = ["2.0m", "2.25m", "2.5m"];

export default function ProductDetailClient({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Meterage selections for Churidar Bits
  const [fabricMeterage, setFabricMeterage] = useState<FabricMeterage>({
    topMeters: "2.5m",
    bottomMeters: "2.5m",
    dupattaMeters: "2.25m",
  });

  const [selectedColour, setSelectedColour] = useState<string>(
    product.colours[0]?.name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = discountPercent(product.originalPrice, product.price);

  const handleMeterChange = (field: keyof FabricMeterage, value: string) => {
    setFabricMeterage((prev) => ({ ...prev, [field]: value }));
  };

  const summaryMeterageLabel = `Top: ${fabricMeterage.topMeters || "2.5m"} | Bottom: ${fabricMeterage.bottomMeters || "2.5m"} | Dupatta: ${fabricMeterage.dupattaMeters || "2.25m"}`;

  const handleAddToCart = () => {
    addToCart(
      product,
      summaryMeterageLabel,
      selectedColour,
      quantity,
      fabricMeterage
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsAppUrl = createDirectProductWhatsAppUrl(
    product,
    summaryMeterageLabel,
    selectedColour,
    quantity,
    fabricMeterage
  );

  return (
    <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/collections/churidar-suits"
          className="inline-flex items-center gap-1.5 text-xs font-body text-brand-text-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft size={14} /> Back to Churidar Collection
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-brand-muted shadow-sm border border-brand-border/40">
            <Image
              src={product.images[selectedImageIndex] || product.images[0] || "/product-teal.png"}
              alt={product.name}
              fill
              priority
              className="object-cover object-top transition-all duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-body font-semibold px-3 py-1 rounded-full shadow-xs">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-brand-muted flex-shrink-0 border-2 transition-all min-h-0 min-w-0 ${
                    selectedImageIndex === i
                      ? "border-brand-primary ring-2 ring-brand-primary/20 scale-105"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Churidar Bits Fabric Meterage Selector */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-body font-semibold text-brand-accent uppercase tracking-widest mb-1">
              {brand.name} • Unstitched Churidar Bits
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-brand-text mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-brand-accent text-brand-accent"
                        : "text-brand-border fill-brand-border"
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-body font-medium text-brand-text">
                {product.rating}
              </span>
              <span className="text-xs font-body text-brand-text-muted">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-body font-semibold text-brand-text">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base font-body text-brand-text-muted line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
            <span className="text-xs font-body text-brand-text-muted">(Per Dress Material Set)</span>
          </div>

          <p className="text-sm font-body text-brand-text-muted leading-relaxed">
            {product.description}
          </p>

          <hr className="border-brand-border" />

          {/* Colour Selector */}
          {product.colours.length > 0 && (
            <div>
              <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-2">
                Colour Shade: <span className="font-normal text-brand-text-muted">{selectedColour || product.colours[0]?.name}</span>
              </label>
              <div className="flex gap-2.5">
                {product.colours.map(({ name, hex }) => (
                  <button
                    key={name}
                    title={name}
                    onClick={() => setSelectedColour(name)}
                    className={`w-9 h-9 rounded-full p-0.5 border-2 transition-all min-h-0 min-w-0 ${
                      selectedColour === name
                        ? "border-brand-primary ring-2 ring-brand-primary/20 scale-110"
                        : "border-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Churidar Bits Fabric Meterage Input Box */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-brand-accent" />
                <div>
                  <h3 className="text-xs font-body font-bold text-brand-text uppercase tracking-wider">
                    Fabric Meterage (Churidar Bits)
                  </h3>
                  <p className="text-[11px] font-body text-brand-text-muted">
                    Select or enter custom cut length in meters for Top, Bottom &amp; Dupatta
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {/* 1. TOP BIT METERS */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-body font-bold text-brand-text">
                    1. Top Bit Fabric Length (Meters):
                  </label>
                  <span className="text-xs font-body font-bold text-brand-accent">
                    {fabricMeterage.topMeters || "2.5m"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {TOP_METER_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMeterChange("topMeters", m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-body font-bold border transition-all ${
                        fabricMeterage.topMeters === m
                          ? "bg-black text-white border-black shadow-xs scale-105"
                          : "border-brand-border text-brand-text hover:border-black bg-brand-surface"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  <div className="flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={fabricMeterage.topMeters || ""}
                      onChange={(e) => handleMeterChange("topMeters", e.target.value)}
                      placeholder="e.g. 2.75m or 3 Meters"
                      className="w-full px-3 py-1.5 rounded-xl border border-brand-border text-xs font-body bg-brand-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* 2. BOTTOM BIT METERS */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-body font-bold text-brand-text">
                    2. Bottom Bit Fabric Length (Meters):
                  </label>
                  <span className="text-xs font-body font-bold text-brand-accent">
                    {fabricMeterage.bottomMeters || "2.5m"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {BOTTOM_METER_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMeterChange("bottomMeters", m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-body font-bold border transition-all ${
                        fabricMeterage.bottomMeters === m
                          ? "bg-black text-white border-black shadow-xs scale-105"
                          : "border-brand-border text-brand-text hover:border-black bg-brand-surface"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  <div className="flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={fabricMeterage.bottomMeters || ""}
                      onChange={(e) => handleMeterChange("bottomMeters", e.target.value)}
                      placeholder="e.g. 2.5m or 3 Meters"
                      className="w-full px-3 py-1.5 rounded-xl border border-brand-border text-xs font-body bg-brand-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* 3. DUPATTA BIT METERS */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-body font-bold text-brand-text">
                    3. Dupatta Bit Fabric Length (Meters):
                  </label>
                  <span className="text-xs font-body font-bold text-brand-accent">
                    {fabricMeterage.dupattaMeters || "2.25m"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {DUPATTA_METER_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMeterChange("dupattaMeters", m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-body font-bold border transition-all ${
                        fabricMeterage.dupattaMeters === m
                          ? "bg-black text-white border-black shadow-xs scale-105"
                          : "border-brand-border text-brand-text hover:border-black bg-brand-surface"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  <div className="flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={fabricMeterage.dupattaMeters || ""}
                      onChange={(e) => handleMeterChange("dupattaMeters", e.target.value)}
                      placeholder="e.g. 2.25m or 2.5 Meters"
                      className="w-full px-3 py-1.5 rounded-xl border border-brand-border text-xs font-body bg-brand-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-2">
              Number of Sets (Quantity)
            </label>
            <div className="inline-flex items-center gap-3 border border-brand-border rounded-xl p-1 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-brand-muted rounded-lg transition-colors text-brand-text"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-body font-bold w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-brand-muted rounded-lg transition-colors text-brand-text"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 bg-black text-white text-sm font-body font-bold rounded-2xl hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 transition-all flex items-center justify-center gap-2 shadow-md min-h-0 cursor-pointer"
              >
                {added ? (
                  <>
                    <Check size={18} className="text-emerald-400" />
                    Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Shopping Bag
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                aria-label="Add to Wishlist"
                className="p-4 border border-brand-border rounded-2xl hover:border-brand-primary transition-colors min-h-0 min-w-0"
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-brand-text"}
                />
              </button>
            </div>

            {/* Direct WhatsApp Booking Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-body font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={20} className="fill-white/20" />
              <span>Book / Order via WhatsApp ({DISPLAY_WHATSAPP_NUMBER})</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-brand-border text-center">
            <div className="p-3 bg-brand-muted rounded-2xl">
              <Truck size={18} className="mx-auto mb-1 text-brand-accent" />
              <p className="text-[11px] font-body font-semibold text-brand-text">Express Delivery</p>
              <p className="text-[10px] font-body text-brand-text-muted">Across UAE & India</p>
            </div>
            <div className="p-3 bg-brand-muted rounded-2xl">
              <Ruler size={18} className="mx-auto mb-1 text-brand-accent" />
              <p className="text-[11px] font-body font-semibold text-brand-text">Custom Meterage</p>
              <p className="text-[10px] font-body text-brand-text-muted">Exact Cut Fabrics</p>
            </div>
            <div className="p-3 bg-brand-muted rounded-2xl">
              <RefreshCw size={18} className="mx-auto mb-1 text-brand-accent" />
              <p className="text-[11px] font-body font-semibold text-brand-text">100% Authentic</p>
              <p className="text-[10px] font-body text-brand-text-muted">Pakistani Material</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
