import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarHeart, MapPin, ArrowRight } from "lucide-react";
import { api, type EventItem } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { PageExtras } from "@/components/PageExtras";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";

export default function EventsPage() {
  usePageMeta(
    "Women's Events in Ahmedabad & Gujarat | Pink Shakti Summits & Meet-ups",
    "Join Pink Shakti for women's summits, city meet-ups and workshops. Learn, connect and find opportunities to showcase your work.",
  );
  const [events, setEvents] = useState<EventItem[] | null>(null);
  useEffect(() => {
    api<EventItem[]>("/events")
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (events ?? []).filter((e) => e.date >= today);
  return (
    <main>
      <PageHero
        eyebrow="Summits · Meet-ups · Workshops"
        title={
          <>
            Events where women <span className="italic text-gold">get seen</span>
          </>
        }
        subtitle="Summits, city meet-ups, workshops and awareness drives. Come to learn, to connect, or to showcase your business on stage and at a stall."
      />
      {upcoming.length > 0 && (
        <section className="py-16 bg-white" aria-labelledby="upcoming">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <span className="page-label mb-4">Upcoming events</span>
            <h2 id="upcoming" className="font-display text-3xl lg:text-5xl text-maroon mb-10">
              Save your seat
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} e={e} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-16 bg-ivory" aria-labelledby="next-event">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-white p-6 sm:p-10 border border-gold/10 shadow-sm">
            <span className="page-label mb-4 inline-flex items-center gap-2">
              <CalendarHeart size={14} /> Coming up next
            </span>
            <h2 id="next-event" className="font-display text-3xl lg:text-4xl text-maroon mb-3">
              {upcoming.length
                ? "Want to attend, exhibit or speak?"
                : "Our next Gujarat meet-up is being planned"}
            </h2>
            <p className="text-maroon/60 leading-relaxed mb-8">
              Tell us you're interested and you'll get the first invite, along with early access to
              stalls and stage pitch slots.
            </p>
            <EnquiryForm
              subject="Event interest: Pink Shakti"
              button="Register interest"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "city", label: "City", options: cityOptions, required: true },
                {
                  name: "want",
                  label: "I want to",
                  options: ["Attend", "Book a stall", "Pitch on stage", "Speak"],
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </section>
      <PageExtras page="events" />
    </main>
  );
}

export function EventCard({ e }: { e: EventItem }) {
  const d = new Date(e.date);
  return (
    <Link
      to={`/events/${e.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-maroon/10 bg-ivory"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {e.image && (
          <img
            src={e.image}
            alt={e.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute left-4 top-4 rounded-xl bg-maroon px-3 py-2 text-center text-ivory">
          <div className="font-display text-2xl leading-none">{d.getDate()}</div>
          <div className="text-[10px] uppercase tracking-widest">
            {d.toLocaleString("en-IN", { month: "short" })}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
          {e.category}
        </span>
        <h3 className="mt-2 mb-2 font-display text-2xl text-maroon group-hover:text-gold">
          {e.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-maroon/60">{e.description}</p>
        <p className="mt-auto flex items-center gap-2 text-xs text-maroon/50">
          <MapPin size={14} /> {e.city}
          {e.time && ` · ${e.time}`}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-maroon">
          View details{" "}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
