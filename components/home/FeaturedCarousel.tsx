"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.clientWidth / 1.1;

    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3"
      >
        {children}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 sm:justify-end">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="soft-motion flex h-11 w-11 items-center justify-center rounded-full border border-[#ead8e2] bg-white/85 shadow-sm hover:bg-white"
          aria-label="Previous featured products"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="soft-motion flex h-11 w-11 items-center justify-center rounded-full border border-[#ead8e2] bg-white/85 shadow-sm hover:bg-white"
          aria-label="Next featured products"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}