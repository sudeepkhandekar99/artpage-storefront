"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";
import { formatPrice } from "@/lib/products/utils";
import { useWishlist } from "./WishlistProvider";

export function WishlistPageClient() {
  const { items, removeItem, clearWishlist } = useWishlist();

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Wishlist
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Saved pieces
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Save pieces while browsing and come back to them later.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="premium-card flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
              <Heart size={24} />
            </div>

            <h2 className="font-display text-5xl font-bold">
              Nothing saved yet
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Tap the heart on any product to save it here.
            </p>

            <Link
              href="/store"
              className="soft-motion mt-7 inline-flex items-center gap-2 rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              <ShoppingBag size={17} />
              Browse store
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-full border border-[#ead8e2] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-[#fff8fc]"
              >
                Clear wishlist
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#ead8e2]/90 bg-white shadow-[0_14px_45px_rgba(36,23,31,0.055)]"
                >
                  <Link
                    href={item.href}
                    className="flex aspect-square items-center justify-center bg-[#fff8fc] p-7"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(36,23,31,0.10)] transition group-hover:scale-[1.035]"
                      />
                    ) : (
                      <div className="h-full w-full rounded-[1.4rem] bg-[#f8eff4]" />
                    )}
                  </Link>

                  <div className="p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
                      {item.category}
                    </p>

                    <Link href={item.href}>
                      <h2 className="mt-2 font-display text-3xl font-bold leading-none">
                        {item.name}
                      </h2>
                    </Link>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="font-extrabold">
                        {formatPrice(item.price)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8fc] transition hover:bg-[#F9B2D7]"
                        aria-label="Remove saved item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}