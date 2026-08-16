"use client";

import { useEffect } from "react";

import type { Product } from "@/lib/products/types";
import {
  formatPrice,
  getProductImageUrl,
  productHref,
} from "@/lib/products/utils";

type RecentlyViewedItem = {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  href: string;
  category: string;
  viewedAt: string;
};

const RECENT_KEY = "ranin-recently-viewed";

export function RecentlyViewedTracker({ product }: { product: Product }) {
  useEffect(() => {
    const item: RecentlyViewedItem = {
      id: product.id,
      name: product.name,
      price: formatPrice(product.price),
      imageUrl: getProductImageUrl(product),
      href: productHref(product),
      category: product.category,
      viewedAt: new Date().toISOString(),
    };

    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      const existing = raw ? JSON.parse(raw) : [];

      const next = [
        item,
        ...existing.filter(
          (recent: RecentlyViewedItem) => recent.id !== product.id
        ),
      ].slice(0, 12);

      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("ranin-recently-viewed-updated"));
    } catch {
      // ignore localStorage failures
    }
  }, [product]);

  return null;
}