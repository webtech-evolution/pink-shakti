import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { api, fmtDate, type EventItem } from "@/lib/api";
import { usePageMeta, useStructuredData } from "@/lib/use-page-meta";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";
import NotFoundPage from "@/pages/NotFound";

export default function EventDetailPage() {
  const { slug = "" } = useParams();
  const [ev, setEv] = useState<EventItem | null | undefined>(undefined);
  useEffect(() => {
    api<EventItem>(`/events/${encodeURIComponent(slug)}`)
      .then(setEv)
      .catch(() => setEv(null));
  }, [slug]);
  usePageMeta(
    ev ? `${ev.title} | Pink Shakti Events` : "Event | Pink Shakti",
    ev?.description.slice(0, 155),
  );
  useStructuredData(
    "event",
    ev
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: ev.title,
          startDate: ev.date,
          description: ev.description,
          image: ev.image || undefined,
          eventAttendanceMode:
            ev.city === "Online"
              ? "https://schema.org/OnlineEventAttendanceMode"
              : "https://schema.org/OfflineEventAttendanceMode",
          location:
            ev.city === "Online"
              ? { "@type": "VirtualLocation", url: window.location.href }
              : {
                  "@type": "Place",
                  name: ev.venue || ev.city,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: ev.city,
                    addressCountry: "IN",
                  },
                },
          organizer: {
            "@type": "Organization",
            name: "Pink Shakti",
            url: "https://www.pinkshakti.com/",
          },
        }
      : null,
  );
  if (ev === null) return <NotFoundPage />;
  if (!ev) return <p className="py-40 text-center text-maroon/50">Loading event…</p>;
  const facts = [
    [CalendarDays, fmtDate(ev.date)],
    [Clock, ev.time],
    [MapPin, [ev.venue, ev.city].filter(Boolean).join(", ")],
    [Ticket, ev.ticket],
  ] as const;
  return (
    <main className="bg-ivory">
      <section className="relative">
        {ev.image && <img src={ev.image} alt={ev.title} className="h-[45vh] w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 to-maroon/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-10 text-ivory">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            {ev.category}
          </span>
          <h1 className="mt-2 font-display text-4xl lg:text-6xl leading-tight">{ev.title}</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[3fr_2fr]">
        <div>
          <h2 className="font-display text-3xl text-maroon mb-4">About this event</h2>
          <p className="whitespace-pre-line leading-relaxed text-maroon/70">{ev.description}</p>
          <Link to="/events" className="mt-8 inline-block text-sm text-maroon underline">
            ← All events
          </Link>
        </div>
        <aside className="space-y-4">
          <ul className="space-y-3 rounded-3xl bg-white p-6 border border-maroon/10">
            {facts
              .filter(([, v]) => v)
              .map(([Icon, v]) => (
                <li key={String(v)} className="flex items-start gap-3 text-sm text-maroon/80">
                  <Icon size={18} className="shrink-0 text-gold" /> {v}
                </li>
              ))}
          </ul>
          <div className="rounded-3xl bg-white p-6 border border-gold/20">
            <h2 className="font-display text-2xl text-maroon mb-4">Register for this event</h2>
            <EnquiryForm
              subject={`Event registration: ${ev.title}`}
              button="Register"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "city", label: "City", options: cityOptions },
                {
                  name: "want",
                  label: "I want to",
                  options: ["Attend", "Book a stall", "Pitch on stage", "Speak"],
                  required: true,
                },
              ]}
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
