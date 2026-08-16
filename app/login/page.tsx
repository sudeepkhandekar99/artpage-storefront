import Link from "next/link";
import { login } from "./actions";
import { PageShell } from "@/components/ui/PageShell";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export const metadata = {
  title: "Login | Ranin Art",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <PageShell className="py-0">
      <section className="flex min-h-[72vh] items-center justify-center py-12">
        <div className="premium-card w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Account
          </p>

          <h1 className="mt-3 font-display text-5xl font-bold leading-none">
            Welcome back
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Log in to view your profile and order history. Guest checkout still
            works without an account.
          </p>

          {params.message && (
            <div className="mt-5 rounded-2xl bg-white/85 p-3 text-sm font-bold text-[#24171f]">
              {params.message}
            </div>
          )}

          <form action={login} className="mt-6 grid gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
              required
            />

            <button
              type="submit"
              className="soft-motion h-12 rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] hover:bg-[#f69cca]"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
            <Link href="/signup" className="hover:text-[#b9598c]">
              Create account
            </Link>

            <Link href="/forgot-password" className="hover:text-[#b9598c]">
              Forgot password?
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}