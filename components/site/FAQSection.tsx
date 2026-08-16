const faqs = [
  {
    question: "Are all pieces handmade?",
    answer:
      "Yes. Ranin Art focuses on handmade artwork including canvases, painted vinyls, bookmarks, and custom pieces.",
  },
  {
    question: "Are products ready to ship?",
    answer:
      "Some items may be ready to ship, while custom or made-to-order pieces need additional processing time. The timeline is shared before or during checkout.",
  },
  {
    question: "Can I request a custom version?",
    answer:
      "Yes. Please contact the artist before placing a custom order so size, colors, theme, budget, and timeline can be confirmed.",
  },
  {
    question: "Can I add a gift note?",
    answer:
      "Gift note support is planned. For now, add any gift message or special packaging request in the order notes or contact form.",
  },
  {
    question: "Can I return a custom piece?",
    answer:
      "Custom pieces may be final sale once work begins. Ready-made items may be eligible for return or exchange depending on condition and timing.",
  },
  {
    question: "Is checkout secure?",
    answer:
      "Payment is handled through Stripe checkout. The store only marks an order as paid after Stripe confirms payment.",
  },
];

export function FAQSection() {
  return (
    <section className="py-14">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
          FAQ
        </p>

        <h2 className="mt-2 font-display text-5xl font-bold leading-none">
          Questions before ordering
        </h2>
      </div>

      <div className="grid gap-3">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            open={index === 0}
            className="group rounded-[1.4rem] border border-[#ead8e2] bg-white/80 p-5"
          >
            <summary className="cursor-pointer list-none font-extrabold">
              <div className="flex items-center justify-between gap-4">
                <span>{faq.question}</span>
                <span className="text-xl transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}