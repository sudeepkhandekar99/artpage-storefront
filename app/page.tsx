import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/products/ProductCard";
import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/products/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    getFeaturedProducts(3),
    getNewProducts(6),
    getCategories(),
  ]);

  const productsToShow =
    featuredProducts.length > 0 ? featuredProducts : newProducts.slice(0, 3);

  return (
    <PageShell className="py-0">
      <section className="grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="slide-up">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.35em] text-[#b9598c]">
            Premium handmade art
          </p>

          <h1 className="font-display text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            Art made for soft, expressive spaces.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover hand-painted canvases, custom vinyl records, bookmarks,
            and thoughtful pieces made with a calm, playful, and personal touch.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/store">Shop the collection</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Request custom art
            </ButtonLink>
          </div>
        </div>

        <div className="premium-card float-soft hidden aspect-square overflow-hidden rounded-[2.25rem] p-6 lg:block">
          {productsToShow[0] ? (
            <ProductCard product={productsToShow[0]} />
          ) : (
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="rounded-[2rem] bg-[#F9B2D7]" />
              <div className="rounded-[2rem] bg-[#CFECF3]" />
              <div className="rounded-[2rem] bg-[#DAF9DE]" />
              <div className="rounded-[2rem] bg-[#F6FFDC]" />
            </div>
          )}
        </div>
      </section>

      <Section
        eyebrow="Featured"
        title="Pieces to start with"
        description="A curated first look at available handmade pieces."
      >
        {productsToShow.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productsToShow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="premium-card rounded-[1.5rem] p-8 text-center">
            <h3 className="font-display text-4xl font-bold">
              Products coming soon
            </h3>
            <p className="mt-3 text-muted-foreground">
              Add active products in Supabase to show them here.
            </p>
          </div>
        )}
      </Section>

      <Section
        eyebrow="Explore"
        title="Shop by category"
        description="Browse handmade pieces by format and mood."
      >
        {categories.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category, index) => {
              const colors = ["#F9B2D7", "#CFECF3", "#DAF9DE", "#F6FFDC"];

              return (
                <Link
                  key={category.name}
                  href={`/store?category=${category.name}`}
                  className="premium-card soft-motion rounded-[1.5rem] p-6"
                >
                  <div
                    className="mb-8 h-20 w-20 rounded-[1.5rem]"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <h3 className="font-display text-3xl font-bold capitalize">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {category.count} available piece
                    {category.count === 1 ? "" : "s"}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="premium-card rounded-[1.5rem] p-8 text-center">
            <p className="font-bold text-muted-foreground">
              Categories will appear after active products are added.
            </p>
          </div>
        )}
      </Section>

      <Section className="pb-20">
        <div className="premium-card rounded-[2rem] px-6 py-12 text-center sm:px-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Custom requests
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-bold leading-tight">
            Want something personal?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Custom pieces, gift ideas, and special requests will be handled
            through the contact flow in a later sprint.
          </p>
          <div className="mt-7">
            <ButtonLink href="/contact">Contact the artist</ButtonLink>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}