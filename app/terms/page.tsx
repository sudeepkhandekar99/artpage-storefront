import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Terms | Ranin Art",
  description:
    "Terms for using Ranin Art, placing orders, requesting custom pieces, and purchasing handmade artwork.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Policy"
      title="Terms"
      description="By using the site or placing an order, you agree to the basic terms for purchasing handmade artwork from Ranin Art."
      sections={[
        {
          title: "Product details",
          text: "Product photos, descriptions, colors, and dimensions are provided as accurately as possible. Handmade pieces may have natural variation in texture, finish, and small details.",
        },
        {
          title: "Orders",
          text: "An order is not considered paid until payment is confirmed through the payment provider. Ranin Art may contact you if additional order details are needed.",
        },
        {
          title: "Custom orders",
          text: "Custom orders should be discussed before purchase. The artist may confirm colors, size, theme, budget, and timeline before work begins.",
        },
        {
          title: "Pricing",
          text: "Prices may change over time. The price shown at checkout is the price used for that order unless an error or special custom quote needs review.",
        },
        {
          title: "Shipping and returns",
          text: "Shipping, returns, exchanges, cancellations, and refunds are handled according to the related store policies.",
        },
        {
          title: "Site use",
          text: "Do not misuse the site, attempt unauthorized access, copy original artwork without permission, or interfere with checkout or account features.",
        },
      ]}
    />
  );
}