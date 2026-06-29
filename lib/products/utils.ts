import { supabasePublic } from "@/lib/supabase/public";
import type { Product } from "./types";

const PRODUCT_IMAGES_BUCKET = "product-images";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function productHref(product: Product) {
  return `/store/${slugify(product.name)}--${product.id}`;
}

export function getProductIdFromSlug(slug: string) {
  const parts = slug.split("--");
  return parts[parts.length - 1];
}

export function getProductImagePath(product: Product) {
  return product.jpg_image_path || product.png_image_path || null;
}

export function getProductImageUrl(product: Product) {
  const path = getProductImagePath(product);

  if (!path) {
    return null;
  }

  const { data } = supabasePublic.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export function formatPrice(price: number | string) {
  return `$${Number(price).toFixed(2)}`;
}

export function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}