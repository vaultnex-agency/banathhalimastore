"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Product, ProductColour, DefaultMeterage } from "@/types/product";

type FormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

type Props = {
  product?: Product;
  mode: "create" | "edit";
};

const FABRICS = ["Georgette", "Chiffon", "Cotton", "Silk", "Organza", "Velvet", "Net", "Raw Silk", "Linen", "Lawn"];
const OCCASIONS = ["Casual", "Festive", "Wedding", "Bridal", "Formal", "Party", "Daily Wear", "Eid"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const CATEGORIES = ["Churidar Suits", "Salwar Suits", "Straight Suits", "Anarkali", "Sharara Sets", "Co-ord Sets"];

const DEFAULT_METERAGE: DefaultMeterage = {
  topMeters: "2.5m",
  bottomMeters: "2.5m",
  dupattaMeters: "2.25m",
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
  sizes: ["S", "M", "L"],
  fabric: "Georgette",
  occasion: ["Casual"],
  inStock: true,
  stockCount: 0,
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  defaultMeterage: DEFAULT_METERAGE,
};

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
          sizes: product.sizes,
          fabric: product.fabric,
          occasion: product.occasion,
          inStock: product.inStock,
          stockCount: product.stockCount,
          isNew: product.isNew,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured,
          defaultMeterage: product.defaultMeterage || DEFAULT_METERAGE,
        }
      : DEFAULTS
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Auto-generate slug from name if empty
    const body = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      images: form.images.filter(Boolean),
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

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4">
      <h2 className="font-body font-semibold text-brand-text text-sm">{title}</h2>
      {children}
    </div>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <span className="block text-xs font-body font-medium text-brand-text-muted mb-1.5">{children}</span>
  );

  const Input = ({
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
  }) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-3 border border-brand-border rounded-xl text-sm font-body bg-brand-surface outline-none focus:border-brand-accent transition-colors ${className}`}
    />
  );

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
          <Input value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Zara Embroidered Churidar Set" />
        </div>
        <div>
          <Label>URL Slug (auto-generated if empty)</Label>
          <Input value={form.slug} onChange={(v) => set("slug", v)} placeholder="zara-embroidered-churidar-set" />
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
            <Input type="number" value={form.price} onChange={(v) => set("price", Number(v))} />
          </div>
          <div>
            <Label>Original Price (AED)</Label>
            <Input type="number" value={form.originalPrice} onChange={(v) => set("originalPrice", Number(v))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Stock Count</Label>
            <Input type="number" value={form.stockCount} onChange={(v) => set("stockCount", Number(v))} />
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
            <Input
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

      {/* Variants */}
      <Section title="Sizes">
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
            <Input
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

      {/* Default Fabric Meterage */}
      <Section title="Default Fabric Meterage (Churidar Bits)">
        <p className="text-xs font-body text-brand-text-muted -mt-1">Set the default cut lengths in meters for Top, Bottom & Dupatta. Customers will see these values on the product page.</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Top Bit (Meters)</Label>
            <Input
              value={form.defaultMeterage?.topMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || DEFAULT_METERAGE),
                  topMeters: v,
                })
              }
              placeholder="e.g. 2.5m"
            />
          </div>
          <div>
            <Label>Bottom Bit (Meters)</Label>
            <Input
              value={form.defaultMeterage?.bottomMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || DEFAULT_METERAGE),
                  bottomMeters: v,
                })
              }
              placeholder="e.g. 2.5m"
            />
          </div>
          <div>
            <Label>Dupatta Bit (Meters)</Label>
            <Input
              value={form.defaultMeterage?.dupattaMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || DEFAULT_METERAGE),
                  dupattaMeters: v,
                })
              }
              placeholder="e.g. 2.25m"
            />
          </div>
        </div>
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

      {/* Default Fabric Meterage */}
      <Section title="Default Fabric Meterage (Churidar Bits)">
        <p className="text-xs font-body text-brand-text-muted -mt-1">
          Set the default cut lengths displayed to customers. These values are shown read-only on the product page.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Top Bit (meters)</Label>
            <Input
              value={form.defaultMeterage?.topMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || { topMeters: "", bottomMeters: "", dupattaMeters: "" }),
                  topMeters: v,
                })
              }
              placeholder="e.g. 2.5m"
            />
          </div>
          <div>
            <Label>Bottom Bit (meters)</Label>
            <Input
              value={form.defaultMeterage?.bottomMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || { topMeters: "", bottomMeters: "", dupattaMeters: "" }),
                  bottomMeters: v,
                })
              }
              placeholder="e.g. 2.5m"
            />
          </div>
          <div>
            <Label>Dupatta Bit (meters)</Label>
            <Input
              value={form.defaultMeterage?.dupattaMeters || ""}
              onChange={(v) =>
                set("defaultMeterage", {
                  ...(form.defaultMeterage || { topMeters: "", bottomMeters: "", dupattaMeters: "" }),
                  dupattaMeters: v,
                })
              }
              placeholder="e.g. 2.25m"
            />
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
