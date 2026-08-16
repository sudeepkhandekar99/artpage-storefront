import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Privacy Policy | Ranin Art",
  description:
    "How Ranin Art collects and uses customer information for orders, checkout, accounts, and communication.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policy"
      title="Privacy policy"
      description="Ranin Art collects only the information needed to process orders, communicate with customers, and improve the shopping experience."
      sections={[
        {
          title: "Information collected",
          text: "The site may collect your name, email, phone number, shipping address, order details, saved profile information, and messages submitted through contact or checkout forms.",
        },
        {
          title: "How information is used",
          text: "Information is used to process orders, send confirmations, manage shipping, respond to inquiries, support customer accounts, and improve the store experience.",
        },
        {
          title: "Payments",
          text: "Payments are processed through Stripe. Ranin Art does not store full card details on the site.",
        },
        {
          title: "Accounts",
          text: "If you create an account, your profile and order history may be connected to your email address so you can view past orders.",
        },
        {
          title: "Third-party services",
          text: "The site may use services such as Supabase for data, Stripe for payment processing, and Resend or another email provider for transactional emails.",
        },
        {
          title: "Contact",
          text: "For privacy questions or deletion requests, contact Ranin Art through the contact page.",
        },
      ]}
    />
  );
}