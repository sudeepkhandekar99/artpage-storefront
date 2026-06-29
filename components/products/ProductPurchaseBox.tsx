"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Product } from "@/lib/products/types";
import { formatPrice } from "@/lib/products/utils";
import { useCart } from "@/components/cart/CartProvider";

type ProductPurchaseBoxProps = {
  product: Product;
  imageUrl: string | null;
};

export function ProductPurchaseBox({
  product,
  imageUrl,
}: ProductPurchaseBoxProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const soldOut =
    product.sold_out === true ||
    product.status === "sold_out" ||
    product.metadata?.sold_out === true ||
    product.metadata?.sold_out === "true";

  function getCartItem() {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      imageUrl,
      category: product.category,
      dimensions: product.dimensions,
    };
  }

  function handleAddToCart() {
    addItem(getCartItem(), { openDrawer: true });
  }

  function handleBuyNow() {
    addItem(getCartItem(), { openDrawer: false });
    router.push("/checkout");
  }

  return (
    <div className="premium-card rounded-[2rem] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
            Price
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#24171f]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] ${
            soldOut
              ? "bg-[#24171f] text-white"
              : "bg-[#DAF9DE] text-[#24171f]"
          }`}
        >
          {soldOut ? "Sold out" : "Available"}
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          disabled={soldOut}
          onClick={handleAddToCart}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={17} />
          Add to cart
        </button>

        <button
          type="button"
          disabled={soldOut}
          onClick={handleBuyNow}
          className="soft-motion inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#24171f] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#F9B2D7] hover:text-[#24171f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap size={17} />
          Buy now
        </button>
      </div>

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Checkout is available as a guest. Payment will connect through Stripe in
        the next sprint.
      </p>
    </div>
  );
}