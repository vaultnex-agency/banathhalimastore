"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import FilterSortBar from "@/components/collection/FilterSortBar";
import FilterDrawer from "@/components/collection/FilterDrawer";
import SortSheet from "@/components/collection/SortSheet";
import ProductGrid from "@/components/collection/ProductGrid";
import LoadMoreButton from "@/components/collection/LoadMoreButton";

type FilterState = {
  categories: string[];
  priceMin: number;
  priceMax: number;
  sizes: string[];
  colours: string[];
  fabrics: string[];
  occasions: string[];
  availability: string;
};

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceMin: 0,
  priceMax: 10000,
  sizes: [],
  colours: [],
  fabrics: [],
  occasions: [],
  availability: "all",
};

const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  newest: "Newest",
  price_asc: "Price ↑",
  price_desc: "Price ↓",
  best_selling: "Best Selling",
  most_reviewed: "Most Reviewed",
  top_rated: "Top Rated",
};

const PAGE_SIZE = 8;

type Props = {
  products: Product[];
  collectionName: string;
  description: string;
};

import HeroBanner from "@/components/collection/HeroBanner";

export default function CollectionClient({ products, collectionName, description }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter logic
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (filters.colours.length && !filters.colours.some((c) => p.colours.some((pc) => pc.name === c))) return false;
      if (filters.fabrics.length && !filters.fabrics.includes(p.fabric)) return false;
      if (filters.occasions.length && !filters.occasions.some((o) => p.occasion.includes(o))) return false;
      if (filters.availability === "in_stock" && !p.inStock) return false;
      if (filters.availability === "out_of_stock" && p.inStock) return false;
      return true;
    });
  }, [products, filters]);

  // Sort logic
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "newest": return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "price_asc": return arr.sort((a, b) => a.price - b.price);
      case "price_desc": return arr.sort((a, b) => b.price - a.price);
      case "best_selling": return arr.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      case "most_reviewed": return arr.sort((a, b) => b.reviewCount - a.reviewCount);
      case "top_rated": return arr.sort((a, b) => b.rating - a.rating);
      default: return arr.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filtered, sort]);

  const visible = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < sorted.length;

  const activeFilterCount = [
    filters.sizes.length,
    filters.colours.length,
    filters.fabrics.length,
    filters.occasions.length,
    filters.priceMin > 0 || filters.priceMax < 10000 ? 1 : 0,
    filters.availability !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 500));
    setPage((p) => p + 1);
    setLoadingMore(false);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroBanner
        title={collectionName}
        subtitle={description}
        count={sorted.length}
      />

      {/* Sticky filter/sort bar */}
      <FilterSortBar
        onFilterClick={() => setFilterOpen(true)}
        onSortClick={() => setSortOpen(true)}
        activeFilterCount={activeFilterCount}
        sortLabel={SORT_LABELS[sort] ?? "Sort"}
      />

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <ProductGrid products={visible} />
        <div className="mt-8">
          <LoadMoreButton
            onLoadMore={handleLoadMore}
            loading={loadingMore}
            hasMore={hasMore}
            loaded={visible.length}
            total={sorted.length}
          />
        </div>
      </div>

      {/* Drawers */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setFilters(f); setPage(1); }}
        filters={filters}
      />
      <SortSheet
        isOpen={sortOpen}
        onClose={() => setSortOpen(false)}
        selected={sort}
        onSelect={(v) => { setSort(v); setPage(1); }}
      />
    </>
  );
}
