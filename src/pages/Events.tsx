import { CalendarHeart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { PageExtras } from "@/components/PageExtras";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";

export default function EventsPage() {
  usePageMeta(
    "Women's Events in Ahmedabad & Gujarat | Pink Shakti Summits & Meet-ups",
    "Join Pink Shakti for women's summits, city meet-ups and workshops. Learn, connect and find opportunities to showcase your work.",
  );
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
      <section className="py-16 bg-ivory" aria-labelledby="next-event">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-white p-6 sm:p-10 border border-gold/10 shadow-sm">
            <span className="page-label mb-4 inline-flex items-center gap-2">
              <CalendarHeart size={14} /> Coming up next
            </span>
            <h2 id="next-event" className="font-display text-3xl lg:text-4xl text-maroon mb-3">
              Our next Gujarat meet-up is being planned
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
