"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

type RecentlyViewedItem = {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  href: string;
  category: string;
  viewedAt: string;
};

const RECENT_KEY = "ranin-recently-viewed";

export function RecentlyViewedRail({
  currentProductId,
}: {
  currentProductId?: string;
}) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    function readRecent() {
      try {
        const raw = window.localStorage.getItem(RECENT_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        setItems(
          parsed.filter(
            (item: RecentlyViewedItem) => item.id !== currentProductId
          )
        );
      } catch {
        setItems([]);
      }
    }

    readRecent();

    window.addEventListener("storage", readRecent);
    window.addEventListener("ranin-recently-viewed-updated", readRecent);

    return () => {
      window.removeEventListener("storage", readRecent);
      window.removeEventListener("ranin-recently-viewed-updated", readRecent);
    };
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-5 flex items-center gap-2">
        <Clock size={18} />
        <h2 className="font-display text-4xl font-bold">Recently viewed</h2>
      </div>

      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
        {items.slice(0, 8).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="premium-card w-[72%] shrink-0 snap-start rounded-[1.5rem] p-4 sm:w-[38%] lg:w-[24%]"
          >
            <div className="flex aspect-square items-center justify-center rounded-[1.2rem] bg-[#fff8fc] p-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full rounded-xl bg-[#f8eff4]" />
              )}
            </div>

            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#b9598c]">
              {item.category}
            </p>

            <h3 className="mt-1 line-clamp-2 font-display text-2xl font-bold leading-none">
              {item.name}
            </h3>

            <p className="mt-3 text-sm font-extrabold">{item.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}