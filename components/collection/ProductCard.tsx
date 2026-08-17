"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Eye, Check } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, discountPercent, getProductImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const discount = discountPercent(product.originalPrice, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className="group relative flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-muted">
        {/* Main Product Link Overlay */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={product.name}
        >
          {/* Product Image */}
          <div className="absolute inset-0">
            <Image
              src={getProductImageUrl(product.images[0])}
              alt={product.name}
              fill
              priority={index < 4}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-brand-primary text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-accent text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded-full">
              BESTSELLER
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 pointer-events-none bg-white/60 flex items-center justify-center">
            <span className="text-xs font-body font-semibold text-brand-text-muted tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick actions on hover (desktop) */}
        <div className="absolute bottom-2 left-2 right-2 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden md:flex gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 flex items-center justify-center gap-1.5 bg-black text-white text-xs font-body font-bold py-2.5 rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors min-h-0 cursor-pointer shadow-sm"
          >
            {added ? (
              <>
                <Check size={13} className="text-emerald-400" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                Quick Add
              </>
            )}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="p-2.5 bg-white rounded-xl hover:bg-brand-muted transition-colors min-h-0 min-w-0 flex items-center justify-center border border-brand-border"
            title="View Details"
          >
            <Eye size={14} className="text-brand-text" />
          </Link>
        </div>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform min-h-0 min-w-0"
      >
        <motion.div
          animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-brand-text"}
          />
        </motion.div>
      </button>

      {/* Card Body */}
      <div className="mt-2.5 space-y-1.5 px-0.5">
        {/* Colour dots */}
        {product.colours.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {product.colours.slice(0, 5).map(({ name, hex }) => (
              <button
                key={name}
                title={name}
                aria-label={name}
                className="w-3.5 h-3.5 rounded-full border border-brand-border hover:scale-110 transition-transform min-h-0 min-w-0"
                style={{ backgroundColor: hex }}
              />
            ))}
            {product.colours.length > 5 && (
              <span className="text-[10px] text-brand-text-muted font-body self-center">
                +{product.colours.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <h3 className="text-sm font-body font-medium text-brand-text line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-brand-accent text-brand-accent"
                    : "text-brand-border fill-brand-border"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-brand-text-muted font-body">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-body font-semibold text-brand-text">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs font-body text-brand-text-muted line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2.5 mt-1 text-xs font-body font-bold bg-black text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors active:scale-95 md:hidden min-h-0 cursor-pointer shadow-sm"
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}
