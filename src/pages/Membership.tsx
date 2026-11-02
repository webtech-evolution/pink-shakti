import { Check, Minus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { PageExtras } from "@/components/PageExtras";
import { EnquiryForm, cityOptions, iAmOptions } from "@/components/EnquiryForm";

// Static plan data until the new admin manages plans.
const plans = [
  {
    name: "Aarambh",
    meaning: "The beginning",
    price: "Free",
    per: "for life",
    tag: "Start here",
    features: [
      "Community membership & newsletter",
      "Open events, webinars & city meet-ups",
      "Health, safety & rights sessions",
    ],
  },
  {
    name: "Udaan",
    meaning: "Take flight",
    price: "₹1,499",
    per: "per year",
    features: [
      "Everything in Aarambh",
      "Skill workshops across 8 pillars",
      "Priority seats at summits & masterclasses",
      "Digital certificate & member ID",
      "Stall discount at events",
      "Sakhi Bazaar product listings",
    ],
  },
  {
    name: "Pragati",
    meaning: "Progress",
    price: "₹2,999",
    per: "per year",
    tag: "For growing businesses",
    features: [
      "Everything in Udaan",
      "Stage pitch at city meet-ups",
      "Mentorship circles",
      "Business & career networking meets",
      "Client introductions",
      "Panel & media feature consideration",
    ],
  },
  {
    name: "Shikhar",
    meaning: "The summit",
    price: "₹4,999",
    per: "per year",
    features: [
      "Everything in Pragati",
      "Stage pitch at summits",
      "Priority client introductions",
      "VIP Awards night access",
      "1-to-1 expert advisory",
      "Featured profile + dedicated reel",
    ],
  },
];

const table: [string, ...boolean[]][] = [
  ["Community membership & newsletter", true, true, true, true],
  ["Open events, webinars, city meet-ups", true, true, true, true],
  ["Health, safety & rights sessions", true, true, true, true],
  ["Priority seats at summits & masterclasses", false, true, true, true],
  ["Skill workshops across 8 pillars", false, true, true, true],
  ["Digital certificate & member ID", false, true, true, true],
  ["Stall discount at events", false, true, true, true],
  ["Sakhi Bazaar product listings", false, true, true, true],
  ["Stage pitch at events", false, false, true, true],
  ["Mentorship circles", false, false, true, true],
  ["Business & career networking meets", false, false, true, true],
  ["Client introductions", false, false, true, true],
  ["Panel & media feature consideration", false, false, true, true],
  ["VIP Awards night access", false, false, false, true],
  ["1-to-1 expert advisory", false, false, false, true],
  ["Featured profile + dedicated reel", false, false, false, true],
];

export default function MembershipPage() {
  usePageMeta(
    "Pink Saathi Membership Plans | Join Free | Pink Shakti",
    "Compare Pink Saathi plans: Aarambh is free for life; Udaan, Pragati and Shikhar add skill workshops, stage time, stall discounts, client introductions and selling on Sakhi Bazaar.",
  );
  return (
    <main>
      <PageHero
        eyebrow="Pink Saathi"
        title={
          <>
            Become a <span className="italic text-gold">Pink Saathi</span>
          </>
        }
        subtitle="Start free today with Aarambh. When you're ready, upgrade for skill workshops, stage time at our events, stall discounts, client introductions and your own space on Sakhi Bazaar."
      />

      <section className="py-16 bg-ivory" aria-label="Membership plans">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <article
              key={p.name}
              className="relative rounded-3xl bg-white border border-maroon/10 p-7 flex flex-col"
            >
              {p.tag && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-maroon">
                  <Sparkles size={11} /> {p.tag}
                </span>
              )}
              <h2 className="font-display text-3xl text-maroon">{p.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-maroon/40 mt-1">
                {p.meaning}
              </p>
              <p className="mt-5 font-display text-4xl text-maroon">
                {p.price} <span className="text-sm text-maroon/50 font-body">{p.per}</span>
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-maroon/70">
                    <Check className="size-4 shrink-0 text-gold mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              {p.price === "Free" ? (
                <Link
                  to="/join"
                  className="mt-8 text-center px-6 py-3 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all"
                >
                  Join free
                </Link>
              ) : (
                <a
                  href="#reserve"
                  className="mt-8 text-center px-6 py-3 border border-maroon/20 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-maroon hover:text-ivory transition-all"
                >
                  Reserve my spot
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white" aria-labelledby="compare">
        <div className="max-w-6xl mx-auto px-6">
          <span className="page-label mb-4">Compare plans</span>
          <h2 id="compare" className="font-display text-3xl lg:text-5xl text-maroon mb-8">
            What each plan includes
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-maroon/10">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-ivory text-maroon">
                <tr>
                  <th className="text-left p-4 font-display text-lg">Benefit</th>
                  {plans.map((p) => (
                    <th key={p.name} className="p-4 font-display text-lg">
                      {p.name}
                      <span className="block text-xs font-body text-maroon/50">{p.price}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map(([label, ...cells]) => (
                  <tr key={label} className="border-t border-maroon/10">
                    <td className="p-4 text-maroon/75">{label}</td>
                    {cells.map((c, i) => (
                      <td key={i} className="p-4 text-center">
                        {c ? (
                          <Check className="inline size-4 text-gold" aria-label="Included" />
                        ) : (
                          <Minus
                            className="inline size-4 text-maroon/20"
                            aria-label="Not included"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        id="reserve"
        className="py-16 bg-ivory scroll-mt-24"
        aria-labelledby="reserve-heading"
      >
        <div className="max-w-3xl mx-auto px-6">
          <span className="page-label mb-4">Founding members</span>
          <h2 id="reserve-heading" className="font-display text-3xl lg:text-4xl text-maroon mb-4">
            Reserve your spot on a paid plan
          </h2>
          <p className="text-maroon/60 leading-relaxed mb-8">
            Tell us which plan you're interested in. Our team will WhatsApp you within 48 hours with
            your Founding Member offer.
          </p>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
            <EnquiryForm
              subject="Pink Saathi plan reservation"
              button="Reserve my spot"
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "city", label: "City", options: cityOptions, required: true },
                { name: "iam", label: "I am a", options: iAmOptions, required: true },
                {
                  name: "plan",
                  label: "Plan I'm interested in",
                  options: ["Udaan", "Pragati", "Shikhar"],
                  required: true,
                },
                { name: "instagram", label: "Instagram handle" },
              ]}
            />
          </div>
        </div>
      </section>

      <PageExtras page="membership" />
    </main>
  );
}
