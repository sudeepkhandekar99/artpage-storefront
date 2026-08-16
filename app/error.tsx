"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageShell className="py-0">
      <section className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="premium-card max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
            <AlertTriangle size={26} />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Something went wrong
          </p>

          <h1 className="mt-3 font-display text-6xl font-bold leading-none">
            The page did not load.
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Try again, or return to the store.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] hover:bg-[#f69cca]"
            >
              Try again
            </button>

            <Link
              href="/store"
              className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
            >
              Browse store
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}