"use client";

import Link from "next/link";
import { Gift, Mail, Palette, Share2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { Product } from "@/lib/products/types";
import { productHref } from "@/lib/products/utils";
import { toWishlistItem } from "@/lib/wishlist/utils";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

type ProductActionPanelProps = {
  product: Product;
};

function isSoldOut(product: Product) {
  return (
    product.sold_out === true ||
    product.status === "sold_out" ||
    product.metadata?.sold_out === true ||
    product.metadata?.sold_out === "true"
  );
}

export function ProductActionPanel({ product }: ProductActionPanelProps) {
  const [shareMessage, setShareMessage] = useState("");
  const [email, setEmail] = useState("");
  const [interestSaved, setInterestSaved] = useState(false);
  const [giftNoteSaved, setGiftNoteSaved] = useState(false);

  const soldOut = isSoldOut(product);
  const wishlistItem = toWishlistItem(product);

  async function shareProduct() {
    const url = `${window.location.origin}${productHref(product)}`;
    const title = product.name;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Look at this piece from Ranin Art: ${title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied");
        window.setTimeout(() => setShareMessage(""), 1800);
      }
    } catch {
      setShareMessage("");
    }
  }

  function saveBackInStockInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) return;

    const key = "ranin-back-in-stock-interest";

    try {
      const raw = window.localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];

      const next = [
        {
          productId: product.id,
          productName: product.name,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
        },
        ...existing.filter(
          (item: { productId: string; email: string }) =>
            !(item.productId === product.id && item.email === cleanEmail)
        ),
      ];

      window.localStorage.setItem(key, JSON.stringify(next));
      setInterestSaved(true);
    } catch {
      setInterestSaved(true);
    }
  }

  function saveGiftNoteInterest() {
    try {
      window.localStorage.setItem(
        "ranin-gift-note-interest",
        JSON.stringify({
          productId: product.id,
          productName: product.name,
          createdAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore localStorage failures
    }

    setGiftNoteSaved(true);
  }

  return (
    <div className="premium-card rounded-[2rem] p-5 sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
        Helpful actions
      </p>

      <div className="mt-4 grid gap-3">
        <WishlistButton item={wishlistItem} label className="h-12 w-full" />

        {/* <button
          type="button"
          onClick={shareProduct}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
        >
          <Share2 size={17} />
          {shareMessage || "Share this piece"}
        </button> */}
{/* 
        <Link
          href={`/contact?type=inquiry&product=${encodeURIComponent(
            product.name
          )}`}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
        >
          <Mail size={17} />
          Ask about this piece
        </Link> */}

        <Link
          href={`/contact?type=custom&product=${encodeURIComponent(
            product.name
          )}`}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
        >
          <Palette size={17} />
          Request custom version
        </Link>

        {/* <button
          type="button"
          onClick={saveGiftNoteInterest}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
        >
          <Gift size={17} />
          {giftNoteSaved ? "Gift note saved" : "Add gift note later"}
        </button> */}
      </div>

      {soldOut && (
        <form onSubmit={saveBackInStockInterest} className="mt-5">
          <p className="text-sm font-extrabold">Back in stock interest</p>

          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Save your email locally for now. In a later sprint this can connect
            to Resend or Supabase.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email address"
              className="h-11 rounded-full border border-[#ead8e2] bg-white px-4 text-sm font-semibold outline-none"
            />

            <button
              type="submit"
              className="h-11 rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f]"
            >
              {interestSaved ? "Saved" : "Notify me"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}