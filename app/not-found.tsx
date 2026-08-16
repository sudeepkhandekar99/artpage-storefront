import Link from "next/link";
import { Search } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";

export default function NotFound() {
  return (
    <PageShell className="py-0">
      <section className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="premium-card max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
            <Search size={26} />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            404
          </p>

          <h1 className="mt-3 font-display text-6xl font-bold leading-none">
            This piece wandered off.
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The page you are looking for does not exist or may have moved.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/store"
              className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-[#24171f] px-5 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Browse store
            </Link>

            <Link
              href="/"
              className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#fff8fc]"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}