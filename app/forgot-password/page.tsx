import Link from "next/link";
import { sendResetEmail } from "./actions";
import { PageShell } from "@/components/ui/PageShell";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export const metadata = {
  title: "Forgot password | Ranin Art",
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <PageShell className="py-0">
      <section className="flex min-h-[72vh] items-center justify-center py-12">
        <div className="premium-card w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Reset
          </p>

          <h1 className="mt-3 font-display text-5xl font-bold leading-none">
            Forgot password?
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Enter your email and we will send a reset link.
          </p>

          {params.message && (
            <div className="mt-5 rounded-2xl bg-white/85 p-3 text-sm font-bold text-[#24171f]">
              {params.message}
            </div>
          )}

          <form action={sendResetEmail} className="mt-6 grid gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
              required
            />

            <button
              type="submit"
              className="soft-motion h-12 rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] hover:bg-[#f69cca]"
            >
              Send reset link
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-bold text-[#b9598c]"
          >
            Back to login
          </Link>
        </div>
      </section>
    </PageShell>
  );
}