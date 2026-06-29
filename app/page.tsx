import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/products/ProductCard";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroArtworkWave } from "@/components/home/HeroArtworkWave";

import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/products/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    getFeaturedProducts(12),
    getNewProducts(80),
    getCategories(),
  ]);

  const heroProducts =
    newProducts.length > 0 ? newProducts : featuredProducts;

  const featuredToShow =
    featuredProducts.length > 0 ? featuredProducts : newProducts.slice(0, 8);

  return (
    <PageShell className="py-0">
      <HeroArtworkWave products={heroProducts} />

      <Section
        eyebrow="Featured"
        title="Featured pieces"
        description="A curated first look at handmade pieces selected from the collection."
        className="pt-10 sm:pt-12"
      >
        {featuredToShow.length > 0 ? (
          <FeaturedCarousel>
            {featuredToShow.map((product) => (
              <div
                key={product.id}
                className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[31.8%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </FeaturedCarousel>
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
        description="Find the format that fits your space, shelf, or gift idea."
      >
        <CategoryGrid categories={categories} products={newProducts} />
      </Section>

      <Section
        eyebrow="New"
        title="New arrivals"
        description="Fresh handmade pieces recently added to the collection."
      >
        {newProducts.length > 0 ? (
          <FeaturedCarousel>
            {newProducts.slice(0, 12).map((product) => (
              <div
                key={product.id}
                className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[31.8%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </FeaturedCarousel>
        ) : (
          <div className="premium-card rounded-[1.5rem] p-8 text-center">
            <h3 className="font-display text-4xl font-bold">
              New pieces coming soon
            </h3>
            <p className="mt-3 text-muted-foreground">
              Fresh handmade work will appear here once new products are added.
            </p>
          </div>
        )}

        {newProducts.length > 0 && (
          <div className="mt-8 text-center">
            <ButtonLink href="/store?sort=newest" variant="secondary">
              View all new arrivals
            </ButtonLink>
          </div>
        )}
      </Section>

      <Section className="pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="premium-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,178,215,0.25),transparent_34%),radial-gradient(circle_at_85%_85%,rgba(246,255,220,0.22),transparent_34%)]" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c] shadow-sm">
                <Sparkles size={14} />
                Custom requests
              </div>

              <h2 className="font-display text-5xl font-bold leading-tight">
                Want something personal?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Ask about custom colors, gift pieces, personalized themes, or a
                product inspired by something meaningful.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact">Contact the artist</ButtonLink>

                <Link
                  href="/store"
                  className="soft-motion inline-flex items-center justify-center gap-2 rounded-full bg-white/75 px-5 py-3 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-white"
                >
                  Browse pieces
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="premium-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(207,236,243,0.3),transparent_34%),radial-gradient(circle_at_85%_85%,rgba(218,249,222,0.24),transparent_34%)]" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#b9598c] shadow-sm">
                <Mail size={14} />
                Studio updates
              </div>

              <h2 className="font-display text-5xl font-bold leading-tight">
                Get first look at new pieces.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                New drops, custom slots, and small handmade collections will be
                announced here.
              </p>

              <form className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="email"
                  placeholder="Email address"
                  disabled
                  className="h-12 rounded-full border border-[#ead8e2] bg-white/85 px-5 text-sm font-semibold outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />

                <button
                  type="button"
                  disabled
                  className="h-12 rounded-full bg-[#F9B2D7] px-6 text-sm font-extrabold text-[#24171f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Coming soon
                </button>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}