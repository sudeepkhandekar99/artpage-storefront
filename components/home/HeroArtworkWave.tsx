"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import type { Product } from "@/lib/products/types";
import { getProductImageUrl, productHref } from "@/lib/products/utils";
import { ButtonLink } from "@/components/ui/ButtonLink";

type HeroArtworkWaveProps = {
  products?: Product[];
};

type HeroItem = {
  product: Product;
  imageUrl: string;
  size: number;
  phase: number;
};

type MovingPoint = {
  element: HTMLElement;
  x: number;
  size: number;
  phase: number;
};

function getImageProducts(products: Product[] = []) {
  return products
    .map((product) => ({
      product,
      imageUrl: getProductImageUrl(product),
    }))
    .filter((item): item is { product: Product; imageUrl: string } =>
      Boolean(item.imageUrl)
    );
}

function buildItems(
  products: { product: Product; imageUrl: string }[],
  count: number,
  offset = 0
): HeroItem[] {
  if (products.length === 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const item = products[(index + offset) % products.length];
    const sizes = [76, 92, 108, 124, 86, 104];

    return {
      product: item.product,
      imageUrl: item.imageUrl,
      size: sizes[index % sizes.length],
      phase: index * 0.75,
    };
  });
}

function getTopY(x: number, width: number, phase: number) {
  const center = width / 2;
  const normalized = (x - center) / (width * 0.34);
  const centerLift = Math.exp(-(normalized * normalized));

  const sideY = 148;
  const centerRise = 122;
  const smallWave = Math.sin(x / 180 + phase) * 7;

  return sideY - centerRise * centerLift + smallWave;
}

function getBottomY(x: number, width: number, phase: number) {
  const center = width / 2;
  const normalized = (x - center) / (width * 0.34);
  const centerDrop = Math.exp(-(normalized * normalized));

  const sideY = 24;
  const centerDip = 146;
  const smallWave = Math.sin(x / 190 + phase) * 7;

  return sideY + centerDip * centerDrop + smallWave;
}

export function HeroArtworkWave({ products = [] }: HeroArtworkWaveProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const imageProducts = useMemo(() => getImageProducts(products), [products]);

  const topItems = useMemo(
    () => buildItems(imageProducts, 22, 0),
    [imageProducts]
  );

  const bottomItems = useMemo(
    () => buildItems(imageProducts, 22, 11),
    [imageProducts]
  );

  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();

    let topPoints: MovingPoint[] = [];
    let bottomPoints: MovingPoint[] = [];

    function setupPoints() {
      const heroEl = heroRef.current;
      const topLayerEl = topRef.current;
      const bottomLayerEl = bottomRef.current;

      if (!heroEl || !topLayerEl || !bottomLayerEl) {
        topPoints = [];
        bottomPoints = [];
        return;
      }

      const width = heroEl.clientWidth;
      const margin = 220;
      const area = width + margin * 2;

      const topElements = Array.from(
        topLayerEl.querySelectorAll<HTMLElement>("[data-hero-art]")
      );

      const bottomElements = Array.from(
        bottomLayerEl.querySelectorAll<HTMLElement>("[data-hero-art]")
      );

      if (topElements.length === 0 || bottomElements.length === 0) {
        topPoints = [];
        bottomPoints = [];
        return;
      }

      topPoints = topElements.map((element, index) => ({
        element,
        x: -margin + (area / topElements.length) * index,
        size: Number(element.dataset.size || 96),
        phase: Number(element.dataset.phase || 0),
      }));

      bottomPoints = bottomElements.map((element, index) => ({
        element,
        x: -margin + (area / bottomElements.length) * index,
        size: Number(element.dataset.size || 96),
        phase: Number(element.dataset.phase || 0),
      }));
    }

    function animate(now: number) {
      const heroEl = heroRef.current;

      if (!heroEl) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      const width = heroEl.clientWidth;
      const margin = 220;
      const area = width + margin * 2;

      const topSpeed = 24;
      const bottomSpeed = 22;

      for (const point of topPoints) {
        point.x -= topSpeed * delta;

        if (point.x < -margin - point.size) {
          point.x += area;
        }

        const y = getTopY(point.x, width, point.phase);

        point.element.style.opacity = "1";
        point.element.style.width = `${point.size}px`;
        point.element.style.height = `${point.size}px`;
        point.element.style.transform = `translate3d(${point.x}px, ${y}px, 0)`;
      }

      for (const point of bottomPoints) {
        point.x += bottomSpeed * delta;

        if (point.x > width + margin) {
          point.x -= area;
        }

        const y = getBottomY(point.x, width, point.phase);

        point.element.style.opacity = "1";
        point.element.style.width = `${point.size}px`;
        point.element.style.height = `${point.size}px`;
        point.element.style.transform = `translate3d(${point.x}px, ${y}px, 0)`;
      }

      frame = requestAnimationFrame(animate);
    }

    setupPoints();
    frame = requestAnimationFrame(animate);

    window.addEventListener("resize", setupPoints);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", setupPoints);
    };
  }, [topItems, bottomItems]);

  return (
    <section
      ref={heroRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white"
    >
      <div className="relative min-h-[700px] overflow-hidden bg-[radial-gradient(circle_at_8%_8%,rgba(249,178,215,0.24),transparent_30%),radial-gradient(circle_at_92%_10%,rgba(207,236,243,0.28),transparent_32%),radial-gradient(circle_at_12%_92%,rgba(218,249,222,0.20),transparent_32%),radial-gradient(circle_at_88%_90%,rgba(246,255,220,0.24),transparent_34%),linear-gradient(180deg,#fff8fc_0%,#ffffff_48%,#ffffff_100%)] sm:min-h-[740px] lg:min-h-[790px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-b from-transparent via-white/80 to-white" />

        {topItems.length > 0 && (
          <div
            ref={topRef}
            className="absolute inset-x-0 top-10 z-[3] hidden h-[285px] overflow-visible lg:block"
          >
            {topItems.map((item, index) => (
              <Link
                key={`top-${item.product.id}-${index}`}
                href={productHref(item.product)}
                data-hero-art
                data-size={item.size}
                data-phase={item.phase}
                className="hero-orbit-art group"
                aria-label={item.product.name}
              >
                <img
                  src={item.imageUrl}
                  alt={item.product.alt_text || item.product.name}
                  className="hero-orbit-image transition duration-300 group-hover:scale-110"
                />
              </Link>
            ))}
          </div>
        )}

        {bottomItems.length > 0 && (
          <div
            ref={bottomRef}
            className="absolute inset-x-0 bottom-16 z-[3] hidden h-[305px] overflow-visible lg:block"
          >
            {bottomItems.map((item, index) => (
              <Link
                key={`bottom-${item.product.id}-${index}`}
                href={productHref(item.product)}
                data-hero-art
                data-size={item.size}
                data-phase={item.phase}
                className="hero-orbit-art group"
                aria-label={item.product.name}
              >
                <img
                  src={item.imageUrl}
                  alt={item.product.alt_text || item.product.name}
                  className="hero-orbit-image transition duration-300 group-hover:scale-110"
                />
              </Link>
            ))}
          </div>
        )}

        {topItems.length > 0 && (
          <div className="absolute bottom-10 left-0 right-0 z-[3] lg:hidden">
            <div className="hero-row-mask overflow-hidden py-5">
              <div className="hero-mobile-track flex w-max items-center gap-6">
                {[...topItems.slice(0, 10), ...topItems.slice(0, 10)].map(
                  (item, index) => (
                    <Link
                      key={`mobile-${item.product.id}-${index}`}
                      href={productHref(item.product)}
                      className="block shrink-0"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.product.alt_text || item.product.name}
                        className="h-16 w-16 object-contain drop-shadow-sm"
                      />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] h-[360px] w-[820px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-3xl" />

        <div className="relative z-[5] mx-auto flex min-h-[640px] max-w-3xl flex-col items-center justify-center px-4 text-center sm:min-h-[690px] lg:min-h-[735px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#b9598c] shadow-sm sm:text-xs">
            <Sparkles size={14} />
            Premium Handmade Art
          </div>

          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-tight text-[#24171f] sm:text-5xl lg:text-6xl">
            You will find yourself
            <br />
            among art
          </h1>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <ButtonLink href="/store">Shop the collection</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Request custom art
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}