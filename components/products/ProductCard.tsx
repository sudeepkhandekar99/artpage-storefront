import Link from "next/link";

import type { Product } from "@/lib/products/types";
import {
  formatPrice,
  getProductImageUrl,
  productHref,
} from "@/lib/products/utils";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { toWishlistItem } from "@/lib/wishlist/utils";

function getMetadataBoolean(product: Product, key: string) {
  const value = product.metadata?.[key];
  return value === true || value === "true";
}

function isNewProduct(product: Product) {
  const created = new Date(product.created_at).getTime();
  if (Number.isNaN(created)) return false;

  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - created < fourteenDays;
}

function getBadges(product: Product) {
  const badges: string[] = [];

  if (product.featured) badges.push("Featured");
  if (isNewProduct(product)) badges.push("New");

  if (
    product.is_original ||
    getMetadataBoolean(product, "is_original") ||
    getMetadataBoolean(product, "original")
  ) {
    badges.push("Original");
  }

  if (
    product.is_limited ||
    product.edition_number ||
    getMetadataBoolean(product, "is_limited") ||
    getMetadataBoolean(product, "limited")
  ) {
    badges.push("Limited");
  }

  if (
    product.sold_out ||
    product.status === "sold_out" ||
    getMetadataBoolean(product, "sold_out")
  ) {
    badges.push("Sold out");
  } else {
    badges.push("Made to order");
  }

  return badges.slice(0, 3);
}

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);
  const badges = getBadges(product);
  const href = productHref(product);
  const wishlistItem = toWishlistItem(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#ead8e2]/90 bg-white shadow-[0_14px_45px_rgba(36,23,31,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(36,23,31,0.09)]">
      <div className="relative">
        <WishlistButton
          item={wishlistItem}
          className="absolute right-4 top-4 z-10 h-11 w-11 px-0"
        />

        <Link
          href={href}
          className="flex aspect-square items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8fc_100%)] p-7 sm:p-8"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.alt_text || product.name}
              className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(36,23,31,0.10)] transition duration-300 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-[#f8eff4] p-8 text-center">
              <span className="font-display text-2xl font-bold capitalize">
                {product.category}
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {badges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#ead8e2] bg-[#fffafc] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#24171f]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
            {product.category}
          </p>

          <p className="shrink-0 text-base font-extrabold text-[#24171f]">
            {formatPrice(product.price)}
          </p>
        </div>

        <Link href={href}>
          <h3 className="font-display text-[1.9rem] font-bold leading-[1.02] text-[#24171f] sm:text-[2rem]">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="text-sm font-bold text-muted-foreground">
            {product.dimensions || "Handmade piece"}
          </p>

          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-[#fff8fc] px-4 py-2 text-sm font-extrabold text-[#24171f] transition group-hover:bg-[#F9B2D7]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}