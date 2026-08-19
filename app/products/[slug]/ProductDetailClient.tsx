"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RefreshCw, Heart, ShoppingBag, ArrowLeft, MessageCircle, Plus, Minus, Check, Ruler, Layers, X, Copy, CheckCircle } from "lucide-react";
import type { Product } from "@/types/product";
import type { FabricMeterage } from "@/types/cart";
import { brand } from "@/lib/tokens";
import { formatPrice, discountPercent, getProductImageUrl } from "@/lib/utils";
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

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [bookingErrors, setBookingErrors] = useState<{ fullName?: string; phone?: string; address?: string }>({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessOrderNumber, setBookingSuccessOrderNumber] = useState<string | null>(null);

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDirectWhatsAppBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { fullName?: string; phone?: string; address?: string } = {};
    if (!customerDetails.fullName.trim()) errors.fullName = "Full name is required";
    if (!customerDetails.phone.trim()) errors.phone = "Phone / WhatsApp number is required";
    if (!customerDetails.address.trim()) errors.address = "Delivery address is required";

    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors);
      return;
    }

    setBookingErrors({});
    setIsSubmittingBooking(true);

    let resolvedOrderNumber: string | null = null;

    try {
      const orderPayload = {
        customer: {
          fullName: customerDetails.fullName.trim(),
          phone: customerDetails.phone.trim(),
          addressLine1: customerDetails.address.trim(),
          city: "Dubai",
          emirate: "Dubai",
          country: "UAE",
        },
        items: [
          {
            productId: product.id,
            productName: product.name,
            productImage: getProductImageUrl(product.images[0]),
            colour: selectedColour || "",
            size: sizeToPass || "Custom",
            quantity,
            price: product.price,
            currency: product.currency,
          },
        ],
        subtotal: product.price * quantity,
        shippingCost: 0,
        discount: 0,
        total: product.price * quantity,
        currency: product.currency,
        status: "pending",
        paymentMethod: "cod",
        notes: customerDetails.notes.trim() || undefined,
      };

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
      console.error("Direct booking error:", err);
    }

    const whatsAppUrl = createDirectProductWhatsAppUrl(
      product,
      sizeToPass,
      selectedColour,
      quantity,
      meterageToPass,
      {
        customerName: customerDetails.fullName.trim(),
        phone: customerDetails.phone.trim(),
        address: customerDetails.address.trim(),
        notes: customerDetails.notes.trim() || undefined,
      },
      resolvedOrderNumber ?? undefined
    );

    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");

    setBookingSuccessOrderNumber(resolvedOrderNumber);
    setIsSubmittingBooking(false);
  };

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
              src={getProductImageUrl(product.images[selectedImageIndex] || product.images[0])}
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
                  <Image src={getProductImageUrl(img)} alt="" fill className="object-cover object-top" />
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
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-body font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MessageCircle size={20} className="fill-white/20" />
              <span>Book / Order via WhatsApp ({DISPLAY_WHATSAPP_NUMBER})</span>
            </button>
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

      {/* ── Customer Details Booking Modal ─────────────────────────────────────── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-brand-border">
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setBookingSuccessOrderNumber(null);
              }}
              className="absolute top-5 right-5 text-brand-text-muted hover:text-brand-text p-1.5 rounded-full hover:bg-brand-surface transition-colors"
            >
              <X size={20} />
            </button>

            {bookingSuccessOrderNumber ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle size={36} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-brand-text mb-1">Order Sent to WhatsApp!</h3>
                  <p className="text-xs font-body text-brand-text-muted">
                    Your details and order number were forwarded to our WhatsApp care team.
                  </p>
                </div>

                <div className="bg-brand-surface border border-brand-primary/30 rounded-2xl p-4">
                  <p className="text-[11px] font-body uppercase font-semibold text-brand-text-muted mb-1">Your Order Reference</p>
                  <p className="font-heading text-2xl font-bold text-brand-primary">{bookingSuccessOrderNumber}</p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={`/track-order?orderNumber=${bookingSuccessOrderNumber}`}
                    className="w-full py-3 bg-brand-primary text-white text-xs font-body font-bold rounded-xl text-center hover:bg-brand-accent transition-colors"
                  >
                    Track Order Progress
                  </Link>
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingSuccessOrderNumber(null);
                    }}
                    className="w-full py-3 bg-brand-surface text-brand-text text-xs font-body font-semibold rounded-xl border border-brand-border hover:bg-brand-muted transition-colors"
                  >
                    Back to Product
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectWhatsAppBookingSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="text-emerald-600" size={22} />
                    <h3 className="font-heading text-2xl font-semibold text-brand-text">
                      Booking Details
                    </h3>
                  </div>
                  <p className="text-xs font-body text-brand-text-muted">
                    Please provide your delivery info to generate your WhatsApp booking.
                  </p>
                </div>

                {/* Product Summary Mini Card */}
                <div className="flex gap-3 p-3 bg-brand-surface rounded-2xl border border-brand-border/60">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-brand-muted flex-shrink-0">
                    <Image
                      src={getProductImageUrl(product.images[0])}
                      alt={product.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-brand-text line-clamp-1">{product.name}</p>
                    <p className="text-[11px] font-body text-brand-text-muted mt-0.5">
                      Qty: {quantity} {selectedColour ? `| Color: ${selectedColour}` : ""}
                    </p>
                    <p className="font-body text-xs font-bold text-brand-primary mt-1">
                      Total: {formatPrice(product.price * quantity, product.currency)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerDetails.fullName}
                      onChange={handleBookingInputChange}
                      placeholder="e.g. Halima Ahmed"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-body focus:outline-none transition-all ${
                        bookingErrors.fullName ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                      }`}
                    />
                    {bookingErrors.fullName && (
                      <p className="text-[11px] font-body text-red-500 mt-1">{bookingErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleBookingInputChange}
                      placeholder="e.g. +971 50 123 4567"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-body focus:outline-none transition-all ${
                        bookingErrors.phone ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                      }`}
                    />
                    {bookingErrors.phone && (
                      <p className="text-[11px] font-body text-red-500 mt-1">{bookingErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1">
                      Delivery Address / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerDetails.address}
                      onChange={handleBookingInputChange}
                      placeholder="e.g. Villa 12, Jumeirah 1, Dubai"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-body focus:outline-none transition-all ${
                        bookingErrors.address ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                      }`}
                    />
                    {bookingErrors.address && (
                      <p className="text-[11px] font-body text-red-500 mt-1">{bookingErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-1">
                      Notes / Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={customerDetails.notes}
                      onChange={handleBookingInputChange}
                      placeholder="Fitting preferences, preferred delivery time..."
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-xs font-body focus:outline-none focus:border-brand-primary transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-body font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmittingBooking ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      Confirm & Book via WhatsApp
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
