import { CreditCard, HandHeart, PackageCheck, Palette } from "lucide-react";

const trustItems = [
  {
    icon: HandHeart,
    title: "Handmade artwork",
    text: "Each piece is handled as artwork, not a mass-produced product.",
  },
  {
    icon: PackageCheck,
    title: "Made to order",
    text: "Some pieces are prepared after purchase, with timing shared clearly.",
  },
  {
    icon: CreditCard,
    title: "Secure checkout",
    text: "Payments are processed through Stripe checkout.",
  },
  {
    icon: Palette,
    title: "Custom requests",
    text: "Contact the artist before custom orders so details are confirmed first.",
  },
];

export function TrustSection() {
  return (
    <section className="py-14">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
          Trust
        </p>

        <h2 className="mt-2 font-display text-5xl font-bold leading-none">
          Made carefully, shipped clearly.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="premium-card rounded-[1.6rem] p-5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F9B2D7]/65">
                <Icon size={20} />
              </div>

              <h3 className="font-display text-3xl font-bold leading-none">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}