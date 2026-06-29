import { ButtonLink } from "@/components/ui/ButtonLink";

export function EmptyState({
  title = "Nothing here yet",
  description = "This section is ready, but content will be added soon.",
  actionHref,
  actionLabel,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="premium-card rounded-[1.5rem] px-6 py-14 text-center">
      <h2 className="font-display text-4xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {actionHref && actionLabel && (
        <div className="mt-6">
          <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
        </div>
      )}
    </div>
  );
}