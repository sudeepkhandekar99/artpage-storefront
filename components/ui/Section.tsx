import { cn } from "@/lib/cn";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16", className)}>
      {(eyebrow || title || description) && (
        <div className="mb-8 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
              {eyebrow}
            </p>
          )}

          {title && (
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}