import Link from "next/link";
import { logout } from "@/app/login/actions";
import { requireUser } from "@/lib/auth/currentUser";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div>
      <div className="border-b border-[#ead8e2] bg-white/65">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/account"
              className="rounded-full bg-white px-4 py-2 text-sm font-extrabold shadow-sm"
            >
              Profile
            </Link>

            <Link
              href="/account/orders"
              className="rounded-full bg-white px-4 py-2 text-sm font-extrabold shadow-sm"
            >
              Orders
            </Link>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-full bg-[#24171f] px-4 py-2 text-sm font-extrabold text-white"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {children}
    </div>
  );
}