"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, CustomMeasurements } from "@/types/cart";
import type { Product } from "@/types/product";
import { getProductImageUrl } from "@/lib/utils";

export type ToastNotice = {
  productName: string;
  itemCount: number;
} | null;

type CartContextType = {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedSize?: string,
    selectedColour?: string,
    quantity?: number,
    customMeasurements?: CustomMeasurements
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toastNotice: ToastNotice;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "banat_halima_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toastNotice, setToastNotice] = useState<ToastNotice>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage on state update
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isMounted]);

  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColour?: string,
    quantity: number = 1,
    customMeasurements?: CustomMeasurements
  ) => {
    const size = selectedSize || product.sizes?.[0] || "Custom";
    const colour = selectedColour || product.colours[0]?.name || "";
    const measKey = customMeasurements
      ? `${customMeasurements.topMeters || customMeasurements.top || ""}-${customMeasurements.bottomMeters || customMeasurements.bottom || ""}-${customMeasurements.dupattaMeters || customMeasurements.dupatta || ""}`
      : "";
    const cartItemId = `${product.id}-${size}-${colour}-${measKey}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency,
        image: getProductImageUrl(product.images[0]),
        selectedSize: size,
        selectedColour: colour,
        customMeasurements,
        quantity,
      };

      return [...prevItems, newItem];
    });

    const newTotal = items.reduce((sum, item) => sum + item.quantity, 0) + quantity;
    setToastNotice({
      productName: product.name,
      itemCount: newTotal,
    });

    // Auto dismiss toast after 4 seconds
    setTimeout(() => {
      setToastNotice((curr) => (curr?.productName === product.name ? null : curr));
    }, 4000);

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: isMounted ? items : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems: isMounted ? totalItems : 0,
        subtotal: isMounted ? subtotal : 0,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toastNotice: isMounted ? toastNotice : null,
        dismissToast: () => setToastNotice(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
