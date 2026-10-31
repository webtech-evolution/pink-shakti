import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import { listEvents } from "@/lib/events-api";
import { isAppwriteConfigured } from "@/lib/appwrite";
import type { EventDoc } from "@/lib/types";

export default function EventsPage() {
  usePageMeta(
    "Pink Shakti Events | Summits, Meet-ups & Workshops",
    "Join Pink Shakti for women's summits, city meet-ups and workshops. Learn, connect and find opportunities to showcase your work.",
  );
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isAppwriteConfigured) {
      setErr("Events backend is not connected yet.");
      setLoading(false);
      return;
    }
    listEvents({ publishedOnly: true })
      .then(setEvents)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-24 bg-ivory">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
            Learn, Connect and Be Seen
          </span>
          <h1 className="font-display text-5xl lg:text-6xl text-maroon mb-4">
            Events Where Women Get Seen
          </h1>
          <p className="text-maroon/60 leading-relaxed">
            Join us for summits, city meet-ups, workshops and awareness drives. Come to learn,
            connect with the community or showcase your business.
          </p>
        </div>

        {loading && <p className="text-center text-maroon/40">Loading events…</p>}
        {err && (
          <div className="max-w-xl mx-auto text-center text-maroon/60 border border-maroon/10 rounded-xl p-6 bg-white">
            {err}
          </div>
        )}
        {!loading && !err && events.length === 0 && (
          <div className="text-center text-maroon/50">
            Our next event is being planned. Join free to receive the first invite.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <motion.div
              key={e.$id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-sm hover:shadow-xl transition-all"
            >
              <Link to={`/events/${e.slug || e.$id}`} className="block">
                <div className="relative h-52 overflow-hidden bg-blush/20">
                  {e.coverImage ? (
                    <img
                      src={e.coverImage}
                      alt={e.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-maroon/20 font-display text-4xl">
                      Pink Shakti
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-maroon text-ivory rounded-lg px-3 py-2 text-center">
                    <div className="font-display text-xl leading-none">
                      {new Date(e.startDate).getDate()}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest mt-0.5">
                      {new Date(e.startDate).toLocaleString("en-IN", { month: "short" })}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {e.category && (
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                      {e.category}
                    </span>
                  )}
                  <h3 className="font-display text-xl text-maroon mt-1 mb-2 group-hover:text-gold transition-colors">
                    {e.title}
                  </h3>
                  <p className="text-maroon/60 text-sm mb-3 line-clamp-2">{e.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-maroon/40 mb-4">
                    <MapPin size={12} /> {e.location}
                  </div>
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-maroon group-hover:text-gold">
                    View & Register <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
