import { PageShell } from "@/components/ui/PageShell";
import { requireUser } from "@/lib/auth/currentUser";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

type AccountPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export const metadata = {
  title: "Account | Ranin Art",
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const address = profile?.shipping_address || {};

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-6">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Account
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Your profile
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Save your shipping details and view orders connected to your email.
          </p>
        </div>

        {params.message && (
          <div className="mb-6 rounded-2xl bg-white/85 p-4 text-sm font-bold">
            {params.message}
          </div>
        )}

        <form
          action={updateProfile}
          className="premium-card max-w-3xl rounded-[2rem] p-5 sm:p-6"
        >
          <h2 className="font-display text-4xl font-bold">
            Saved details
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              name="fullName"
              defaultValue={profile?.full_name || ""}
              placeholder="Full name"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />

            <input
              name="phone"
              defaultValue={profile?.phone || ""}
              placeholder="Phone"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />

            <input
              name="email"
              defaultValue={user.email || ""}
              disabled
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold opacity-70 outline-none sm:col-span-2"
            />

            <input
              name="addressLine1"
              defaultValue={address.line1 || ""}
              placeholder="Address line 1"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none sm:col-span-2"
            />

            <input
              name="addressLine2"
              defaultValue={address.line2 || ""}
              placeholder="Apartment, suite, etc."
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none sm:col-span-2"
            />

            <input
              name="city"
              defaultValue={address.city || ""}
              placeholder="City"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />

            <input
              name="state"
              defaultValue={address.state || ""}
              placeholder="State"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />

            <input
              name="postalCode"
              defaultValue={address.postal_code || ""}
              placeholder="ZIP / postal code"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />

            <input
              name="country"
              defaultValue={address.country || "United States"}
              placeholder="Country"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
            />
          </div>

          <button
            type="submit"
            className="soft-motion mt-6 h-12 rounded-full bg-[#F9B2D7] px-6 text-sm font-extrabold text-[#24171f] hover:bg-[#f69cca]"
          >
            Save profile
          </button>
        </form>
      </section>
    </PageShell>
  );
}