"use client";

import { Heart } from "lucide-react";

import type { WishlistItem } from "@/lib/wishlist/types";
import { useWishlist } from "./WishlistProvider";

type WishlistButtonProps = {
  item: WishlistItem;
  label?: boolean;
  className?: string;
};

export function WishlistButton({
  item,
  label = false,
  className = "",
}: WishlistButtonProps) {
  const { isSaved, toggleItem } = useWishlist();
  const saved = isSaved(item.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(item);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-[#24171f] shadow-sm transition hover:bg-[#F9B2D7] ${className}`}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart
        size={17}
        className={saved ? "text-[#b9598c]" : ""}
        fill={saved ? "currentColor" : "none"}
      />
      {label && <span>{saved ? "Saved" : "Save for later"}</span>}
    </button>
  );
}