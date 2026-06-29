"use client";

import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const image = images[0] || "";
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!image) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <p className="font-display text-3xl font-bold text-muted-foreground">
          Image coming soon
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-[460px] items-center justify-center sm:min-h-[560px] lg:min-h-[640px]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative flex h-full w-full items-center justify-center"
          aria-label="Open product image"
        >
          <img
            src={image}
            alt={alt}
            className="max-h-[460px] w-full object-contain drop-shadow-[0_28px_38px_rgba(36,23,31,0.13)] transition duration-300 group-hover:scale-[1.025] sm:max-h-[560px] lg:max-h-[650px]"
          />

          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-extrabold shadow-sm opacity-0 transition duration-300 group-hover:opacity-100">
            <ZoomIn size={16} />
            Zoom
          </span>
        </button>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#24171f] shadow-sm"
            aria-label="Close image preview"
          >
            <X size={20} />
          </button>

          <img
            src={image}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] object-contain drop-shadow-[0_28px_42px_rgba(36,23,31,0.16)]"
          />
        </div>
      )}
    </>
  );
}