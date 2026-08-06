"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Product, ProductColour, DefaultMeterage, ProductType, SizeDetails } from "@/types/product";

type FormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

type Props = {
  product?: Product;
  mode: "create" | "edit";
};

const FABRICS = ["Georgette", "Chiffon", "Cotton", "Silk", "Organza", "Velvet", "Net", "Raw Silk", "Linen", "Lawn"];
const OCCASIONS = ["Casual", "Festive", "Wedding", "Bridal", "Formal", "Party", "Daily Wear", "Eid"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const CATEGORIES = ["Churidar Suits", "Salwar Suits", "Straight Suits", "Anarkali", "Sharara Sets", "Co-ord Sets"];

const DEFAULT_METERAGE: DefaultMeterage = {
  topMeters: "2.5m",
  bottomMeters: "2.5m",
  dupattaMeters: "2.25m",
};

const DEFAULT_SIZE_DETAILS: SizeDetails = {
  shirt: "",
  bottom: "",
  dupatta: "",
};

const DEFAULTS: FormData = {
  slug: "",
  name: "",
  description: "",
  category: "Churidar Suits",
  price: 0,
  originalPrice: 0,
  currency: "AED",
  rating: 0,
  reviewCount: 0,
  images: [""],
  colours: [{ name: "", hex: "#000000" }],
  sizes: [],
  fabric: "Georgette",
  occasion: ["Casual"],
  inStock: true,
  stockCount: 0,
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  productType: "bit-piece",
  sizeDetails: DEFAULT_SIZE_DETAILS,
  defaultMeterage: DEFAULT_METERAGE,
};

/* ── Stable sub-components (defined outside to avoid remount on every render) ── */

function Section({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4" style={style}>
      <h2 className="font-body font-semibold text-brand-text text-sm">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-body font-medium text-brand-text-muted mb-1.5">{children}</span>
  );
}

function FormInput({
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-3 border border-brand-border rounded-xl text-sm font-body bg-brand-surface outline-none focus:border-brand-accent transition-colors ${className}`}
    />
  );
}

/* ── Main form component ── */

export default function ProductForm({ product, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    product
      ? {
          slug: product.slug,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          currency: product.currency,
          rating: product.rating,
          reviewCount: product.reviewCount,
          images: product.images,
          colours: product.colours,
          sizes: product.sizes || [],
          fabric: product.fabric,
          occasion: product.occasion,
          inStock: product.inStock,
          stockCount: product.stockCount,
          isNew: product.isNew,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured,
          productType: product.productType || "bit-piece",
          sizeDetails: product.sizeDetails || DEFAULT_SIZE_DETAILS,
          defaultMeterage: product.defaultMeterage || DEFAULT_METERAGE,
        }
      : DEFAULTS
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = useCallback(
    (key: keyof FormData, value: unknown) => setForm((f) => ({ ...f, [key]: value })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Auto-generate slug from name if empty
    // Only include relevant size data based on productType
    const isBitPiece = form.productType === "bit-piece";
    const body = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      images: form.images.filter(Boolean),
      sizes: isBitPiece ? [] : form.sizes,
      sizeDetails: isBitPiece ? form.sizeDetails : undefined,
      defaultMeterage: isBitPiece
        ? {
            topMeters: form.sizeDetails?.shirt || "",
            bottomMeters: form.sizeDetails?.bottom || "",
            dupattaMeters: form.sizeDetails?.dupatta || "",
          }
        : undefined,
    };

    const url = mode === "create" ? "/api/products" : `/api/products/${product?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError("Failed to save product. Please try again.");
    }
  };

  const toggleSize = (s: string) =>
    set("sizes", form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);

  const toggleOccasion = (o: string) =>
    set("occasion", form.occasion.includes(o) ? form.occasion.filter((x) => x !== o) : [...form.occasion, o]);

  const updateColour = (i: number, field: keyof ProductColour, val: string) => {
    const next = [...form.colours];
    next[i] = { ...next[i], [field]: val };
    set("colours", next);
  };

  const isBitPiece = form.productType === "bit-piece";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-brand-text">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h1>
          <p className="text-sm font-body text-brand-text-muted mt-1">
            {mode === "create" ? "Create a new product listing." : "Update product details."}
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-white text-sm font-body font-semibold rounded-xl hover:bg-brand-accent transition-colors disabled:opacity-60 min-h-0 flex-shrink-0"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {loading ? "Saving..." : mode === "create" ? "Publish" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Section title="Basic Information">
        <div>
          <Label>Product Name *</Label>
          <FormInput value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Zara Embroidered Churidar Set" />
        </div>
        <div>
          <Label>URL Slug (auto-generated if empty)</Label>
          <FormInput value={form.slug} onChange={(v) => set("slug", v)} placeholder="zara-embroidered-churidar-set" />
        </div>
        <div>
          <Label>Description *</Label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="Product description..."
            className="w-full px-3.5 py-3 border border-brand-border rounded-xl text-sm font-body bg-brand-surface outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>
        <div>
          <Label>Category</Label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3.5 py-3 border border-brand-border rounded-xl text-sm font-body bg-brand-surface outline-none focus:border-brand-accent transition-colors"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sale Price (AED) *</Label>
            <FormInput type="number" value={form.price} onChange={(v) => set("price", Number(v))} />
          </div>
          <div>
            <Label>Original Price (AED)</Label>
            <FormInput type="number" value={form.originalPrice} onChange={(v) => set("originalPrice", Number(v))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Stock Count</Label>
            <FormInput type="number" value={form.stockCount} onChange={(v) => set("stockCount", Number(v))} />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-sm font-body">In Stock</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Images */}
      <Section title="Product Images">
        <p className="text-xs font-body text-brand-text-muted -mt-1">Enter image URLs or /public paths (e.g. /product-teal.png)</p>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <FormInput
              value={img}
              onChange={(v) => {
                const next = [...form.images];
                next[i] = v;
                set("images", next);
              }}
              placeholder={`Image ${i + 1} URL or /path`}
              className="flex-1"
            />
            {form.images.length > 1 && (
              <button
                type="button"
                onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                className="p-2.5 text-red-400 hover:text-red-600 border border-brand-border rounded-xl min-h-0 min-w-0"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("images", [...form.images, ""])}
          className="flex items-center gap-2 text-sm font-body text-brand-accent hover:underline min-h-0"
        >
          <Plus size={14} /> Add image
        </button>
      </Section>

      {/* Product Type — radio buttons only update state, no navigation */}
      <Section title="Product Type">
        <div className="flex gap-4">
          {(["bit-piece", "ready-made"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value={type}
                checked={form.productType === type}
                onChange={() => set("productType", type)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-sm font-body font-medium">
                {type === "bit-piece" ? "Bit Piece" : "Ready-Made"}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/*
        Both size sections are always mounted in the DOM.
        We toggle visibility via display:none so React never unmounts/remounts
        them — this prevents scroll position reset, focus loss, and layout shift.
      */}
      <Section
        title="Size Description (Bit Piece)"
        style={{ display: isBitPiece ? undefined : "none" }}
      >
        <p className="text-xs font-body text-brand-text-muted -mt-1">
          Enter the fabric measurements for Shirt, Bottom &amp; Dupatta. These are shown read-only on the product page.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Shirt</Label>
            <FormInput
              value={form.sizeDetails?.shirt || ""}
              onChange={(v) =>
                set("sizeDetails", {
                  ...(form.sizeDetails || DEFAULT_SIZE_DETAILS),
                  shirt: v,
                })
              }
              placeholder="e.g. 2.5 m"
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <FormInput
              value={form.sizeDetails?.bottom || ""}
              onChange={(v) =>
                set("sizeDetails", {
                  ...(form.sizeDetails || DEFAULT_SIZE_DETAILS),
                  bottom: v,
                })
              }
              placeholder="e.g. 2.5 m"
            />
          </div>
          <div>
            <Label>Dupatta</Label>
            <FormInput
              value={form.sizeDetails?.dupatta || ""}
              onChange={(v) =>
                set("sizeDetails", {
                  ...(form.sizeDetails || DEFAULT_SIZE_DETAILS),
                  dupatta: v,
                })
              }
              placeholder="e.g. 2.25 m"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Sizes (Ready-Made)"
        style={{ display: isBitPiece ? "none" : undefined }}
      >
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 text-sm font-body border rounded-xl transition-all min-h-0 ${
                form.sizes.includes(s)
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "border-brand-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Colours */}
      <Section title="Colours">
        {form.colours.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="color"
              value={c.hex}
              onChange={(e) => updateColour(i, "hex", e.target.value)}
              className="w-10 h-10 rounded-lg border border-brand-border cursor-pointer flex-shrink-0"
            />
            <FormInput
              value={c.name}
              onChange={(v) => updateColour(i, "name", v)}
              placeholder="Colour name (e.g. Teal)"
              className="flex-1"
            />
            {form.colours.length > 1 && (
              <button
                type="button"
                onClick={() => set("colours", form.colours.filter((_, j) => j !== i))}
                className="p-2.5 text-red-400 hover:text-red-600 border border-brand-border rounded-xl min-h-0 min-w-0"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("colours", [...form.colours, { name: "", hex: "#C9A96E" }])}
          className="flex items-center gap-2 text-sm font-body text-brand-accent hover:underline min-h-0"
        >
          <Plus size={14} /> Add colour
        </button>
      </Section>

      {/* Details */}
      <Section title="Product Details">
        <div>
          <Label>Fabric</Label>
          <select
            value={form.fabric}
            onChange={(e) => set("fabric", e.target.value)}
            className="w-full px-3.5 py-3 border border-brand-border rounded-xl text-sm font-body bg-brand-surface outline-none focus:border-brand-accent transition-colors"
          >
            {FABRICS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <Label>Occasions</Label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleOccasion(o)}
                className={`px-3 py-1.5 text-sm font-body border rounded-full transition-all min-h-0 ${
                  form.occasion.includes(o)
                    ? "bg-brand-accent text-white border-brand-accent"
                    : "border-brand-border"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </Section>



      {/* Flags */}
      <Section title="Visibility Flags">
        <div className="grid grid-cols-3 gap-3">
          {(["isNew", "isBestSeller", "isFeatured"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[flag]}
                onChange={(e) => set(flag, e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-sm font-body capitalize">
                {flag.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
              </span>
            </label>
          ))}
        </div>
      </Section>
    </form>
  );
}
