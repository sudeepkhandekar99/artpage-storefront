"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { formatPrice } from "@/lib/products/utils";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const {
    items,
    subtotal,
    itemCount,
    drawerOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={closeCart}
        aria-label="Close cart"
        className="absolute inset-0 bg-[#24171f]/35 backdrop-blur-sm"
      />

      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[460px] flex-col bg-[#fffaf7] shadow-[0_0_80px_rgba(36,23,31,0.22)]">
        <div className="flex items-center justify-between border-b border-[#ead8e2] px-5 py-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
              Cart
            </p>
            <h2 className="font-display text-4xl font-bold">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length > 0 ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
                <ShoppingBag size={24} />
              </div>

              <h3 className="font-display text-4xl font-bold">
                Your cart is empty
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">
                Add handmade pieces from the store and they will appear here.
              </p>

              <Link
                href="/store"
                onClick={closeCart}
                className="soft-motion mt-6 rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
              >
                Browse store
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#ead8e2] bg-white/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">
                Subtotal
              </span>
              <span className="text-2xl font-extrabold">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="grid gap-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca]"
              >
                Checkout
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
              >
                View cart
              </Link>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Taxes, shipping, and payment will be handled during checkout.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}