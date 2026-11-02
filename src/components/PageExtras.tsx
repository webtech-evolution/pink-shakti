import { InfoGrid } from "@/components/InfoGrid";
import { FaqBlock } from "@/components/FaqBlock";
import { pageContent } from "@/lib/page-content";

// Extra SEO/AEO content for a page (photo band, sections, quote, FAQ), driven by lib/page-content.ts.
export function PageExtras({ page }: { page: keyof typeof pageContent }) {
  const { sections, faqs, photos, quote } = pageContent[page];
  return (
    <>
      {photos && (
        <section className="py-12 bg-white" aria-label="Photos">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-5 sm:grid-cols-3">
            {photos.map((p) => (
              <figure key={p.src} className="group relative overflow-hidden rounded-3xl">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/85 to-transparent p-5 pt-12 font-display text-xl italic text-ivory">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {sections.map((s, i) => (
        <InfoGrid key={s.id} s={s} bg={i % 2 ? "bg-white" : "bg-ivory"} />
      ))}
      {quote && (
        <section className="py-16 bg-maroon" aria-label="Inspiration">
          <blockquote className="max-w-4xl mx-auto px-6 text-center font-display text-3xl lg:text-4xl italic leading-snug text-ivory">
            <span className="text-gold">“</span>
            {quote}
            <span className="text-gold">”</span>
          </blockquote>
        </section>
      )}
      {faqs.length > 0 && <FaqBlock id={`${page}-faq`} faqs={faqs} bg="bg-ivory" />}
    </>
  );
}
