"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Heart } from "lucide-react";

import type { WishlistItem } from "@/lib/wishlist/types";

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  isSaved: (id: string) => boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
};

const WISHLIST_KEY = "ranin-wishlist";

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistItem[]) {
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ranin-wishlist-updated"));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readWishlist());
    setHydrated(true);

    function syncWishlist() {
      setItems(readWishlist());
    }

    window.addEventListener("storage", syncWishlist);
    window.addEventListener("ranin-wishlist-updated", syncWishlist);

    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener("ranin-wishlist-updated", syncWishlist);
    };
  }, []);

  function persist(nextItems: WishlistItem[]) {
    setItems(nextItems);
    writeWishlist(nextItems);
  }

  function isSaved(id: string) {
    return items.some((item) => item.id === id);
  }

  function addItem(item: WishlistItem) {
    if (isSaved(item.id)) return;
    persist([item, ...items]);
  }

  function removeItem(id: string) {
    persist(items.filter((item) => item.id !== id));
  }

  function toggleItem(item: WishlistItem) {
    if (isSaved(item.id)) {
      removeItem(item.id);
      return;
    }

    addItem(item);
  }

  function clearWishlist() {
    persist([]);
  }

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isSaved,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
    }),
    [items]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}

      {hydrated && items.length > 0 && (
        <Link
          href="/wishlist"
          className="fixed bottom-5 left-5 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-[0_18px_50px_rgba(36,23,31,0.18)] transition hover:bg-[#F9B2D7]"
        >
          <Heart size={18} fill="currentColor" />
          Saved
          <span className="rounded-full bg-[#24171f]/10 px-2 py-0.5">
            {items.length}
          </span>
        </Link>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}