import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export type InfoItem = { title: string; text: string };
export type InfoSection = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  items: InfoItem[];
  numbered?: boolean;
  img?: string;
  imgAlt?: string;
  cta?: { to: string; label: string };
};

// Generic content section (eyebrow, heading, intro, card grid, optional image + CTA) shared by all pages.
export function InfoGrid({ s, bg = "bg-white" }: { s: InfoSection; bg?: string }) {
  const List = s.numbered ? "ol" : "div";
  return (
    <section className={`py-16 lg:py-20 ${bg}`} aria-labelledby={s.id}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={
            s.img ? "grid gap-10 lg:grid-cols-[2fr_3fr] items-start mb-10" : "max-w-3xl mb-10"
          }
        >
          <div>
            <span className="page-label mb-4">{s.eyebrow}</span>
            <h2
              id={s.id}
              className="font-display text-3xl lg:text-5xl text-maroon mb-5 leading-tight"
            >
              {s.title}
            </h2>
            {s.intro && <p className="text-maroon/60 leading-relaxed">{s.intro}</p>}
          </div>
          {s.img && (
            <img
              src={s.img}
              alt={s.imgAlt ?? s.title}
              loading="lazy"
              className="rounded-3xl aspect-[16/9] w-full object-cover shadow-lg"
            />
          )}
        </div>
        <List
          className={`grid gap-5 sm:grid-cols-2 ${s.items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
        >
          {s.items.map((it, i) => (
            <li
              key={it.title}
              className="list-none rounded-2xl border border-maroon/10 bg-ivory p-6"
            >
              {s.numbered && (
                <span className="font-display text-3xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <h3 className="font-display text-xl text-maroon mb-2">{it.title}</h3>
              <p className="text-sm text-maroon/60 leading-relaxed">{it.text}</p>
            </li>
          ))}
        </List>
        {s.cta && (
          <Link
            to={s.cta.to}
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all group"
          >
            {s.cta.label}{" "}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </section>
  );
}
