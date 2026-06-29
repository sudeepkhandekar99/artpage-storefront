import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "soft-motion inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold",
        variant === "primary" &&
          "bg-[#F9B2D7] text-[#24171f] shadow-[0_12px_28px_rgba(249,178,215,0.38)] hover:bg-[#f5a4cd]",
        variant === "secondary" &&
          "border border-[#ead8e2] bg-white/80 text-[#24171f] hover:bg-white",
        variant === "ghost" && "text-[#24171f] hover:bg-white/70",
        className
      )}
    >
      {children}
    </Link>
  );
}