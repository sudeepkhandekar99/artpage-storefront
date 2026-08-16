import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Return Policy | Ranin Art",
  description:
    "Return and exchange rules for ready-made, made-to-order, and custom Ranin Art pieces.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policy"
      title="Return policy"
      description="Because the store sells handmade artwork, return eligibility depends on whether the item is ready-made, made to order, or custom."
      sections={[
        {
          title: "Ready-made pieces",
          text: "Ready-made pieces may be eligible for return or exchange if they are unused, undamaged, and returned in original condition. Contact Ranin Art as soon as possible after delivery.",
        },
        {
          title: "Custom orders",
          text: "Custom pieces may be final sale once work begins, because they are made specifically for the customer. Please contact the artist before ordering if you have questions.",
        },
        {
          title: "Made-to-order pieces",
          text: "Made-to-order items may have limited cancellation or return options once production starts. Timing and eligibility depend on the stage of the order.",
        },
        {
          title: "Damaged items",
          text: "If an item arrives damaged, contact Ranin Art with photos of the product, packaging, and order details. The issue will be reviewed case by case.",
        },
        {
          title: "Refunds",
          text: "Approved refunds are returned to the original payment method. Shipping fees and special handling costs may not always be refundable.",
        },
      ]}
    />
  );
}