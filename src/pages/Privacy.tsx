import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";

const sections = [
  {
    h: "Information We Collect",
    p: "We collect the details you provide when you register for an event, join our community, purchase a Pink Saathi plan, place an order or contact us — typically your name, email, phone number, shipping address and business details for sellers.",
  },
  {
    h: "How We Use Your Information",
    p: "Your information is used to process registrations and orders, deliver products, issue receipts, provide customer support, verify seller onboarding and share updates about PINK SHAKTI events and initiatives.",
  },
  {
    h: "Payments",
    p: "Payments are processed by Razorpay. We never store your card, UPI or netbanking credentials on our servers. We retain only the payment reference identifiers needed for reconciliation and refunds.",
  },
  {
    h: "Sharing",
    p: "Order details are shared with the relevant seller solely for fulfilment. We do not sell your personal data. Data may be shared with service providers (hosting, payments, email) and where required by law.",
  },
  {
    h: "Cookies & Local Storage",
    p: "We use browser storage to keep your cart, session and guest order history available on your device. You can clear this at any time from your browser settings.",
  },
  {
    h: "Data Retention & Security",
    p: "We retain transaction records as required for accounting and tax compliance, and apply reasonable technical safeguards to protect your information.",
  },
  {
    h: "Your Rights",
    p: "You may request access to, correction of, or deletion of your personal data by writing to hello@pinkshakti.com. We respond to verified requests within 30 days.",
  },
];

export default function PrivacyPage() {
  usePageMeta(
    "Privacy Policy | PINK SHAKTI",
    "How PINK SHAKTI 360° collects, uses, shares and protects your personal information.",
  );

  return (
    <main>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: 21 August 2026" />
      <section className="py-20 bg-ivory">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl text-maroon mb-3">{s.h}</h2>
              <p className="text-maroon/65 text-sm leading-relaxed">{s.p}</p>
            </div>
          ))}
          <p className="text-maroon/50 text-sm">
            Questions? Email{" "}
            <a href="mailto:hello@pinkshakti.com" className="text-gold hover:underline">
              hello@pinkshakti.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
