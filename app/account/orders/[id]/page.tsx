import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { requireUser } from "@/lib/auth/currentUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/products/utils";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const user = await requireUser();

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (
    !order ||
    (order.user_id !== user.id &&
      String(order.customer_email).toLowerCase() !==
        String(user.email).toLowerCase())
  ) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-6">
        <Link
          href="/account/orders"
          className="soft-motion mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold shadow-sm hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            {order.order_number}
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Order details
          </h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em]">
              {order.status}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em]">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3">
            {(items || []).map((item) => (
              <div
                key={item.id}
                className="premium-card grid gap-4 rounded-[1.5rem] p-4 sm:grid-cols-[110px_1fr]"
              >
                <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#fff8fc] p-3">
                  {item.product_image_url ? (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full rounded-xl bg-[#f8eff4]" />
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
                    {item.product_category}
                  </p>

                  <h2 className="mt-2 font-display text-3xl font-bold">
                    {item.product_name}
                  </h2>

                  <p className="mt-2 text-sm font-bold text-muted-foreground">
                    Qty {item.quantity} ·{" "}
                    {formatPrice((item.unit_price_cents || 0) / 100)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="premium-card h-fit rounded-[2rem] p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
              Summary
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-extrabold">
                  {formatPrice((order.subtotal_cents || 0) / 100)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-bold text-muted-foreground">
                  Shipping
                </span>
                <span className="font-extrabold">
                  {formatPrice((order.shipping_cents || 0) / 100)}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#ead8e2] pt-4">
                <span className="font-extrabold">Total</span>
                <span className="text-2xl font-extrabold">
                  {formatPrice((order.total_cents || 0) / 100)}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] bg-white/75 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b9598c]">
                Shipping
              </p>

              <p className="mt-2 text-sm font-bold leading-6">
                {order.shipping_method}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {order.shipping_address?.line1}
                {order.shipping_address?.line2
                  ? `, ${order.shipping_address.line2}`
                  : ""}
                <br />
                {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
                {order.shipping_address?.postal_code}
                <br />
                {order.shipping_address?.country}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}