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

export default function ProductDetailClient({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use product's admin-configured default meterage (if available)
  const fabricMeterage: FabricMeterage | undefined = product.defaultMeterage
    ? {
        topMeters: product.defaultMeterage.topMeters,
        bottomMeters: product.defaultMeterage.bottomMeters,
        dupattaMeters: product.defaultMeterage.dupattaMeters,
      }
    : undefined;

  const [selectedColour, setSelectedColour] = useState<string>(
    product.colours[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = discountPercent(product.originalPrice, product.price);

  const summaryMeterageLabel = fabricMeterage
    ? `Top: ${fabricMeterage.topMeters} | Bottom: ${fabricMeterage.bottomMeters} | Dupatta: ${fabricMeterage.dupattaMeters}`
    : undefined;

  const sizeToPass = product.productType === "ready-made" ? selectedSize : summaryMeterageLabel;
  const meterageToPass = product.productType === "ready-made" ? undefined : fabricMeterage;

  const handleAddToCart = () => {
    addToCart(
      product,
      sizeToPass,
      selectedColour,
      quantity,
      meterageToPass
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsAppUrl = createDirectProductWhatsAppUrl(
    product,
    sizeToPass,
    selectedColour,
    quantity,
    meterageToPass
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

        {/* Right: Product Details */}
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

          {/* Size Information — conditional on productType */}
          {product.productType === "ready-made" ? (
            /* Ready-Made: show available sizes as interactive selectors */
            product.sizes && product.sizes.length > 0 ? (
              <div>
                <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-2">
                  Select Size: <span className="font-normal text-brand-text-muted">{selectedSize || "Select a size"}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-3.5 rounded-xl text-sm font-body font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white border-black shadow-2xs ring-2 ring-black/10"
                          : "bg-white text-brand-text border-brand-border hover:border-brand-primary/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          ) : (
            /* Bit Piece (default / legacy): show sizeDetails or fallback to defaultMeterage */
            (() => {
              const shirt = product.sizeDetails?.shirt || fabricMeterage?.topMeters;
              const bottom = product.sizeDetails?.bottom || fabricMeterage?.bottomMeters;
              const dupatta = product.sizeDetails?.dupatta || fabricMeterage?.dupattaMeters;
              const hasAny = shirt || bottom || dupatta;
              if (!hasAny) return null;
              return (
                <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-2xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers size={20} className="text-brand-accent" />
                    <div>
                      <h3 className="text-xs font-body font-bold text-brand-text uppercase tracking-wider">
                        Size Description
                      </h3>
                      <p className="text-[11px] font-body text-brand-text-muted">
                        Fabric cut lengths for this product
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {shirt && (
                      <div className="bg-brand-surface rounded-xl p-3 text-center border border-brand-border/60">
                        <p className="text-[10px] font-body font-semibold text-brand-text-muted uppercase tracking-wider mb-0.5">Shirt</p>
                        <p className="text-sm font-body font-bold text-brand-text">{shirt}</p>
                      </div>
                    )}
                    {bottom && (
                      <div className="bg-brand-surface rounded-xl p-3 text-center border border-brand-border/60">
                        <p className="text-[10px] font-body font-semibold text-brand-text-muted uppercase tracking-wider mb-0.5">Bottom</p>
                        <p className="text-sm font-body font-bold text-brand-text">{bottom}</p>
                      </div>
                    )}
                    {dupatta && (
                      <div className="bg-brand-surface rounded-xl p-3 text-center border border-brand-border/60">
                        <p className="text-[10px] font-body font-semibold text-brand-text-muted uppercase tracking-wider mb-0.5">Dupatta</p>
                        <p className="text-sm font-body font-bold text-brand-text">{dupatta}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}

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
