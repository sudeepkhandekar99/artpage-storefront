import Link from "next/link";
import { Package } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { requireUser } from "@/lib/auth/currentUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/products/utils";

export const metadata = {
  title: "Orders | Ranin Art",
};

export default async function AccountOrdersPage() {
  const user = await requireUser();

  await supabaseAdmin
    .from("orders")
    .update({ user_id: user.id })
    .is("user_id", null)
    .ilike("customer_email", user.email || "");

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, status, total_cents, currency, created_at")
    .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-6">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Orders
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Order history
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Orders placed as a guest with this email will appear here too.
          </p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="grid gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="premium-card flex flex-col gap-4 rounded-[1.5rem] p-5 transition hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c]">
                    {order.order_number}
                  </p>

                  <h2 className="mt-2 font-display text-3xl font-bold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em]">
                    {order.status}
                  </span>

                  <span className="text-lg font-extrabold">
                    {formatPrice((order.total_cents || 0) / 100)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="premium-card flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
              <Package size={24} />
            </div>

            <h2 className="font-display text-5xl font-bold">
              No orders yet
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Once you place an order, it will show up here.
            </p>

            <Link
              href="/store"
              className="soft-motion mt-7 rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Browse store
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}