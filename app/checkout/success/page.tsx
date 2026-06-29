import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Order received | Ranin Art",
};

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: {
    session_id?: string;
  };
}) {
  return (
    <PageShell className="py-0">
      <section className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="premium-card max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#DAF9DE]">
            <CheckCircle2 size={28} />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
            Payment submitted
          </p>

          <h1 className="mt-3 font-display text-5xl font-bold leading-none">
            Thank you for your order.
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Stripe is confirming your payment. Once confirmed, your order will
            be marked paid automatically and confirmation emails will be sent.
          </p>

          {searchParams.session_id && (
            <p className="mt-4 break-all rounded-2xl bg-white/75 p-3 text-xs font-bold text-muted-foreground">
              Session: {searchParams.session_id}
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/store"
              className="soft-motion inline-flex h-12 items-center justify-center rounded-full bg-[#24171f] px-5 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Continue shopping
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