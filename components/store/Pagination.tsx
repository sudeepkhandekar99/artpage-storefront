import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function getHref(
  page: number,
  searchParams: Record<string, string | undefined>
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (!value || key === "page") continue;
    params.set(key, value);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/store?${query}` : "/store";
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((item) => {
      return (
        item === 1 ||
        item === totalPages ||
        Math.abs(item - page) <= 1
      );
    });

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={getHref(previousPage, searchParams)}
        className={`rounded-full border border-[#ead8e2] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-[#fff8fc] ${
          page === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Previous
      </Link>

      {pages.map((item, index) => {
        const previous = pages[index - 1];
        const showDots = previous && item - previous > 1;

        return (
          <span key={item} className="flex items-center gap-2">
            {showDots && (
              <span className="px-1 text-sm font-bold text-muted-foreground">
                …
              </span>
            )}

            <Link
              href={getHref(item, searchParams)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold transition ${
                item === page
                  ? "bg-[#24171f] text-white"
                  : "border border-[#ead8e2] bg-white text-[#24171f] hover:bg-[#fff8fc]"
              }`}
            >
              {item}
            </Link>
          </span>
        );
      })}

      <Link
        href={getHref(nextPage, searchParams)}
        className={`rounded-full border border-[#ead8e2] bg-white px-4 py-2 text-sm font-extrabold transition hover:bg-[#fff8fc] ${
          page === totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next
      </Link>
    </div>
  );
}