import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
const eventSummit = "https://loremflickr.com/600/400/conference,women,leadership";
const eventCancer = "https://loremflickr.com/600/400/health,awareness,pink";
const eventAwards = "https://loremflickr.com/600/400/award,gala,celebration";

const events = [
  {
    date: "25",
    month: "MAY",
    title: "PINK SHAKTI Women Leadership Summit",
    location: "Ahmedabad, Gujarat",
    image: eventSummit,
    desc: "A Grand Confluence of Visionary Women & Leaders",
  },
  {
    date: "15",
    month: "JUN",
    title: "Cancer Awareness Drive",
    location: "Mumbai, Maharashtra",
    image: eventCancer,
    desc: "Stronger Together for a Healthier Tomorrow",
  },
  {
    date: "20",
    month: "JUL",
    title: "PINK SHAKTI Awards 2025",
    location: "Grand Hyatt, Mumbai",
    image: eventAwards,
    desc: "Honoring Women. Celebrating Excellence.",
  },
];

export function EventsSection() {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2 block">
              Upcoming
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-maroon">Signature Events</h2>
          </div>
          <Link
            to="/events"
            className="text-[11px] uppercase tracking-[0.2em] text-maroon border-b border-maroon/20 pb-1 hover:text-gold hover:border-gold transition-colors flex items-center gap-2"
          >
            View All Events <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              className="group bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-sm hover:shadow-xl transition-all duration-500"
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-maroon text-ivory rounded-lg px-3 py-2 text-center">
                  <div className="font-display text-xl leading-none">{event.date}</div>
                  <div className="text-[9px] uppercase tracking-widest mt-0.5">{event.month}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-maroon mb-2 group-hover:text-gold transition-colors">
                  {event.title}
                </h3>
                <p className="text-maroon/50 text-sm mb-3">{event.desc}</p>
                <div className="flex items-center gap-4 text-[11px] text-maroon/40">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {event.location}
                  </span>
                </div>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-maroon group-hover:text-gold transition-colors"
                >
                  Register Now <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
