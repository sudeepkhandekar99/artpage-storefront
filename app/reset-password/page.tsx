import { updatePassword } from "./actions";
import { PageShell } from "@/components/ui/PageShell";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export const metadata = {
  title: "Reset password | Ranin Art",
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <PageShell className="py-0">
      <section className="flex min-h-[72vh] items-center justify-center py-12">
        <div className="premium-card w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Reset
          </p>

          <h1 className="mt-3 font-display text-5xl font-bold leading-none">
            New password
          </h1>

          {params.message && (
            <div className="mt-5 rounded-2xl bg-white/85 p-3 text-sm font-bold text-[#24171f]">
              {params.message}
            </div>
          )}

          <form action={updatePassword} className="mt-6 grid gap-4">
            <input
              name="password"
              type="password"
              placeholder="New password"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
              required
            />

            <button
              type="submit"
              className="soft-motion h-12 rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] hover:bg-[#f69cca]"
            >
              Update password
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}