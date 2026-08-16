import type { Product } from "@/lib/products/types";
import { getProductImageUrl, productHref } from "@/lib/products/utils";
import type { WishlistItem } from "./types";

export function toWishlistItem(product: Product): WishlistItem {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    imageUrl: getProductImageUrl(product),
    href: productHref(product),
    category: product.category,
    dimensions: product.dimensions,
  };
}