import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HeartHandshake, Stethoscope, GraduationCap, Scale, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";

const programmes = [
  {
    icon: Stethoscope,
    title: "Health & Cancer Awareness",
    text: "Free screening camps, menstrual health drives and mental wellness sessions in schools, colleges and rural clusters.",
  },
  {
    icon: GraduationCap,
    title: "Skill & Livelihood",
    text: "Digital literacy, financial literacy and entrepreneurship bootcamps that turn homemakers into earners.",
  },
  {
    icon: Scale,
    title: "Rights & Safety",
    text: "Legal-aid clinics, self-defence workshops and awareness on POSH, domestic safety and cyber protection.",
  },
  {
    icon: HeartHandshake,
    title: "Adopt-a-Woman-Entrepreneur",
    text: "Corporates fund a seller's marketplace onboarding, inventory and mentorship for a full year.",
  },
];

export default function CSRPage() {
  usePageMeta(
    "CSR & Social Impact | PINK SHAKTI",
    "Fund measurable women-focused CSR programmes with PINK SHAKTI 360° — health, skilling, safety and entrepreneurship.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Social Impact"
        title={
          <>
            CSR With <span className="italic text-gold">Purpose</span>
          </>
        }
        subtitle="Deploy your CSR budget into women-first programmes with clear reporting, on-ground delivery and stories you can stand behind."
      />

      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {programmes.map((p, i) => (
            <motion.div
              key={p.title}
              className="bg-white rounded-3xl p-8 border border-gold/10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <p.icon className="size-8 text-gold mb-5" />
              <h2 className="font-display text-2xl text-maroon mb-3">{p.title}</h2>
              <p className="text-maroon/60 text-sm leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-maroon text-ivory">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl mb-5">
            Every rupee is tied to a woman's outcome
          </h2>
          <p className="text-ivory/65 leading-relaxed mb-8">
            We share programme design, beneficiary counts, media coverage and impact documentation for
            every collaboration — so your board sees exactly what changed.
          </p>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-maroon text-[11px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-ivory transition-all"
          >
            Start a CSR Conversation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
