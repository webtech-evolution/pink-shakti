import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";

const sections = [
  {
    h: "Acceptance",
    p: "By using pinkshakti.com you agree to these terms. If you do not agree, please discontinue use of the website and its services.",
  },
  {
    h: "Event Registrations & Tickets",
    p: "Tickets are confirmed only after successful payment. Tickets are non-transferable unless approved in writing. PINK SHAKTI may reschedule an event; in that case your ticket remains valid for the revised date.",
  },
  {
    h: "Pink Saathi & Seller Plans",
    p: "Pink Saathi and seller plans are valid for the duration displayed at purchase. Seller plans include a product limit and a commission rate as stated on the plan, and require completion of onboarding and verification before a store goes live.",
  },
  {
    h: "Marketplace & Sellers",
    p: "Products are listed and fulfilled by independent verified sellers. Sellers are responsible for product accuracy, quality, stock, packaging and dispatch timelines. PINK SHAKTI facilitates the transaction and retains the commission stated in the seller's plan.",
  },
  {
    h: "Pricing, Charges & Payments",
    p: "All prices are in INR. Delivery charges vary for Gujarat and other states, and platform plus payment gateway charges are shown at checkout before payment. Payments are processed by Razorpay.",
  },
  {
    h: "Cancellations, Returns & Refunds",
    p: "Order cancellation requests are accepted before dispatch. Damaged or incorrect items must be reported within 48 hours of delivery with photographic proof; approved refunds are returned to the original payment method within 7-10 business days. Event tickets are non-refundable unless the event is cancelled by us.",
  },
  {
    h: "Conduct",
    p: "Our events and communities are safe spaces. Harassment, discrimination, misrepresentation or misuse of member data results in removal without refund.",
  },
  {
    h: "Intellectual Property",
    p: "The PINK SHAKTI name, logo, content and creatives are owned by PINK SHAKTI 360° and may not be reproduced without written permission.",
  },
  {
    h: "Liability & Governing Law",
    p: "Our liability for any claim is limited to the amount paid for the relevant transaction. These terms are governed by Indian law, with jurisdiction in the courts of Ahmedabad, Gujarat.",
  },
];

export default function TermsPage() {
  usePageMeta(
    "Terms & Conditions | PINK SHAKTI",
    "Terms governing event registrations, Pink Saathi plans, marketplace orders, refunds and use of pinkshakti.com.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Last updated: 21 August 2026"
      />
      <section className="py-20 bg-ivory">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl text-maroon mb-3">{s.h}</h2>
              <p className="text-maroon/65 text-sm leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
