import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Shipping Policy | Ranin Art",
  description:
    "Shipping timelines, made-to-order processing, packaging, and delivery details for Ranin Art.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policy"
      title="Shipping policy"
      description="Shipping depends on the product type, destination, packaging needs, and whether the artwork is ready-made or made to order."
      sections={[
        {
          title: "Processing timeline",
          text: "Ready-made items may ship sooner, while made-to-order and custom pieces require additional time before shipping. Processing timelines are shared during checkout or after the order is reviewed.",
        },
        {
          title: "Made-to-order artwork",
          text: "Some artwork is created or finished after purchase. The artist may contact you to confirm final details before production or shipment.",
        },
        {
          title: "Packaging",
          text: "Artwork is packed carefully based on size, material, and fragility. Larger or delicate pieces may require extra packaging time.",
        },
        {
          title: "Shipping cost",
          text: "Shipping costs are shown during checkout when available. If an item needs special packaging or handling, the artist may contact you before shipment.",
        },
        {
          title: "Delivery issues",
          text: "If your package is delayed, lost, or damaged, contact Ranin Art with your order number and photos if relevant. The artist will help review the next step.",
        },
      ]}
    />
  );
}