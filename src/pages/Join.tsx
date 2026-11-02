import { Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { PageExtras } from "@/components/PageExtras";
import { EnquiryForm, cityOptions, iAmOptions } from "@/components/EnquiryForm";

const interestOptions = [
  "Health & Wellness",
  "Leadership & Power",
  "Wealth & Entrepreneurship",
  "Education & Future",
  "Rights & Justice",
  "Society & Culture",
  "Media & Global Connect",
  "Awards & Recognition",
];

const benefits = [
  "Invitations to Pink Shakti summits, city meet-ups and open webinars",
  "Awareness sessions on health, safety and women's rights",
  "Introductions within a pan-India sisterhood of women achievers",
  "The option to upgrade any time for workshops, stage time and selling on Sakhi Bazaar",
];

export default function JoinPage() {
  usePageMeta(
    "Join Pink Shakti Free | Women's Community in India",
    "Join the free Pink Shakti women's community for events, masterclasses, mentorship and a pan-India sisterhood.",
  );
  return (
    <main>
      <PageHero
        eyebrow="Aarambh · Free for life"
        title={
          <>
            Join the <span className="italic text-gold">sisterhood</span>
          </>
        }
        subtitle="Become a Pink Saathi in two minutes. No fees, no card details, just a community of women who rise together."
      />
      <section className="py-16 lg:py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid gap-10 lg:grid-cols-[2fr_3fr] items-start">
          <div>
            <h2 className="font-display text-3xl text-maroon mb-6">What you get, free</h2>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 text-maroon/70 leading-relaxed">
                  <Check className="size-5 shrink-0 text-gold mt-0.5" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
            <h2 className="font-display text-2xl text-maroon mb-6">Tell us about you</h2>
            <EnquiryForm
              subject="Join Pink Shakti: Aarambh (free)"
              button="Join free"
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "email", label: "Email", type: "email" },
                { name: "city", label: "City", options: cityOptions, required: true },
                { name: "iam", label: "I am a", options: iAmOptions, required: true },
                { name: "interest", label: "Most interested in", options: interestOptions },
              ]}
            />
          </div>
        </div>
      </section>
      <PageExtras page="join" />
    </main>
  );
}
