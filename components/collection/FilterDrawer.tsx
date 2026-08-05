"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  filters: FilterState;
};

const COLOURS = [
  { name: "Teal", hex: "#1a7a7a" },
  { name: "Rose", hex: "#d4829e" },
  { name: "Ivory", hex: "#f5f0e8" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Mustard", hex: "#d4a017" },
  { name: "Maroon", hex: "#800020" },
  { name: "Sage", hex: "#7a9e7e" },
  { name: "Lavender", hex: "#b8a9c9" },
];
const FABRICS = ["Georgette", "Chiffon", "Cotton", "Silk", "Organza", "Velvet", "Net", "Raw Silk"];
const OCCASIONS = ["Casual", "Festive", "Wedding", "Bridal", "Formal", "Party", "Daily Wear", "Eid"];

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-brand-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left min-h-0"
      >
        <span className="text-sm font-body font-semibold text-brand-text">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-brand-text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterDrawer({ isOpen, onClose, onApply, filters: initial }: Props) {
  const [local, setLocal] = useState<FilterState>(initial);

  const toggle = <K extends "sizes" | "colours" | "fabrics" | "occasions">(
    key: K,
    value: string
  ) => {
    setLocal((f) => ({
      ...f,
      [key]: (f[key] as string[]).includes(value)
        ? (f[key] as string[]).filter((x) => x !== value)
        : [...(f[key] as string[]), value],
    }));
  };

  const clear = () =>
    setLocal({
      categories: [],
      priceMin: 0,
      priceMax: 1000,
      sizes: [],
      colours: [],
      fabrics: [],
      occasions: [],
      availability: "all",
    });

  const apply = () => {
    onApply(local);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface rounded-t-3xl max-h-[92vh] flex flex-col"
          >
            {/* Handle + Header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-brand-border rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border">
                <h2 className="font-heading text-xl font-semibold">Filters</h2>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="p-2 -mr-2 text-brand-text-muted hover:text-brand-text transition-colors min-h-0 min-w-0"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5">
              {/* Price */}
              <AccordionSection title="Price (AED)">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-brand-text-muted font-body">Min</label>
                    <input
                      type="number"
                      value={local.priceMin}
                      onChange={(e) => setLocal((f) => ({ ...f, priceMin: Number(e.target.value) }))}
                      className="w-full mt-1 px-3 py-2 border border-brand-border rounded-xl text-sm font-body bg-white outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-brand-text-muted font-body">Max</label>
                    <input
                      type="number"
                      value={local.priceMax}
                      onChange={(e) => setLocal((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                      className="w-full mt-1 px-3 py-2 border border-brand-border rounded-xl text-sm font-body bg-white outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>
              </AccordionSection>



              {/* Colour */}
              <AccordionSection title="Colour">
                <div className="flex flex-wrap gap-3">
                  {COLOURS.map(({ name, hex }) => (
                    <button
                      key={name}
                      onClick={() => toggle("colours", name)}
                      aria-label={name}
                      title={name}
                      className={`w-8 h-8 rounded-full border-2 transition-all min-h-0 min-w-0 ${
                        local.colours.includes(name)
                          ? "border-brand-primary scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </AccordionSection>

              {/* Fabric */}
              <AccordionSection title="Fabric">
                <div className="flex flex-wrap gap-2">
                  {FABRICS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggle("fabrics", f)}
                      className={`px-3 py-1.5 text-sm font-body border rounded-full transition-all min-h-0 ${
                        local.fabrics.includes(f)
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "border-brand-border text-brand-text hover:border-brand-primary"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </AccordionSection>

              {/* Occasion */}
              <AccordionSection title="Occasion">
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => toggle("occasions", o)}
                      className={`px-3 py-1.5 text-sm font-body border rounded-full transition-all min-h-0 ${
                        local.occasions.includes(o)
                          ? "bg-brand-accent text-white border-brand-accent"
                          : "border-brand-border text-brand-text hover:border-brand-accent"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </AccordionSection>

              {/* Availability */}
              <AccordionSection title="Availability">
                <div className="flex gap-2">
                  {["all", "in_stock", "out_of_stock"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setLocal((f) => ({ ...f, availability: v }))}
                      className={`flex-1 py-2 text-sm font-body border rounded-xl transition-all min-h-0 ${
                        local.availability === v
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "border-brand-border text-brand-text"
                      }`}
                    >
                      {v === "all" ? "All" : v === "in_stock" ? "In Stock" : "Out of Stock"}
                    </button>
                  ))}
                </div>
              </AccordionSection>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-5 border-t border-brand-border flex gap-3 bg-brand-surface">
              <button
                onClick={clear}
                className="flex-1 py-3.5 text-sm font-body font-medium border border-brand-border rounded-2xl text-brand-text-muted hover:text-brand-text hover:border-brand-text transition-colors min-h-0"
              >
                Clear All
              </button>
              <button
                onClick={apply}
                className="flex-2 flex-grow-[2] py-3.5 text-sm font-body font-semibold bg-brand-primary text-white rounded-2xl hover:bg-brand-accent transition-colors min-h-0"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
