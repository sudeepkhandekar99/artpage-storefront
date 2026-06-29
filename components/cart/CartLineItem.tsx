"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem } from "@/lib/cart/types";
import { formatPrice, slugify } from "@/lib/products/utils";

type CartLineItemProps = {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartLineItemProps) {
  const href = `/store/${slugify(item.name)}-${item.id}`;

  return (
    <div className="grid grid-cols-[92px_1fr] gap-4 rounded-[1.5rem] border border-[#ead8e2] bg-white/80 p-3">
      <Link
        href={href}
        className="flex aspect-square items-center justify-center rounded-[1.1rem] bg-[#fff8fc] p-2"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full rounded-xl bg-[#f8eff4]" />
        )}
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#b9598c]">
              {item.category}
            </p>

            <Link
              href={href}
              className="mt-1 block line-clamp-2 font-display text-2xl font-bold leading-none"
            >
              {item.name}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8fc] text-[#24171f] transition hover:bg-[#F9B2D7]"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-[#ead8e2] bg-white">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="flex h-9 w-9 items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-8 text-center text-sm font-extrabold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-9 w-9 items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-extrabold">
              {formatPrice(item.price * item.quantity)}
            </p>
            <p className="text-xs font-bold text-muted-foreground">
              {formatPrice(item.price)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}