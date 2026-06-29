"use client";

export function ErrorState({
  title = "Something went wrong",
  description = "Please refresh the page or try again in a moment.",
  reset,
}: {
  title?: string;
  description?: string;
  reset?: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="premium-card max-w-md rounded-[1.5rem] px-6 py-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
          Error
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {reset && (
          <button
            type="button"
            onClick={reset}
            className="soft-motion mt-6 rounded-full bg-[#F9B2D7] px-5 py-3 text-sm font-extrabold text-[#24171f]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}