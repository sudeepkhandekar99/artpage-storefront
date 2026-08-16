"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";
import { formatPrice } from "@/lib/products/utils";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "./CartProvider";

export function CartPageClient() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <Link
          href="/store"
          className="soft-motion mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold shadow-sm hover:bg-white"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Cart
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Review your pieces
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="premium-card flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
              <ShoppingBag size={24} />
            </div>

            <h2 className="font-display text-5xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Browse the collection and add handmade pieces to start your order.
            </p>

            <Link
              href="/store"
              className="soft-motion mt-7 rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Browse store
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-3">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-fit rounded-full border border-[#ead8e2] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-[#fff8fc]"
              >
                Clear cart
              </button>
            </div>

            <aside className="premium-card h-fit rounded-[2rem] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
                Summary
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-extrabold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground">
                    Shipping
                  </span>
                  <span className="font-extrabold">Calculated later</span>
                </div>

                <div className="border-t border-[#ead8e2] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold">Estimated total</span>
                    <span className="text-2xl font-extrabold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="soft-motion mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca]"
              >
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
}