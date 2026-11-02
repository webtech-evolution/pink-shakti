import { Link } from "react-router-dom";
import { ArrowRight, CircleHelp } from "lucide-react";
import { useStructuredData } from "@/lib/use-page-meta";

export type Faq = { q: string; a: string };

// Visible FAQ + FAQPage JSON-LD, reused on every key page.
export function FaqBlock({
  id,
  faqs,
  eyebrow = "Questions women ask us",
  bg = "bg-white",
}: {
  id: string;
  faqs: Faq[];
  eyebrow?: string;
  bg?: string;
}) {
  useStructuredData(id, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });
  return (
    <section className={`py-20 ${bg}`} aria-labelledby={id}>
      <div className="mx-auto max-w-4xl px-6">
        <span className="page-label mb-4">{eyebrow}</span>
        <h2 id={id} className="font-display text-4xl lg:text-5xl text-maroon mb-6 leading-tight">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-maroon/10 mt-8">
          {faqs.map((f) => (
            <article key={f.q} className="py-6">
              <h3 className="flex items-start gap-3 font-display text-xl text-maroon">
                <CircleHelp className="mt-1 size-5 shrink-0 text-gold" /> {f.q}
              </h3>
              <p className="mt-3 pl-8 text-sm leading-relaxed text-maroon/65">{f.a}</p>
            </article>
          ))}
        </div>
        <Link
          to="/faq"
          className="inline-flex items-center gap-2 mt-6 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] group"
        >
          All FAQs{" "}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
