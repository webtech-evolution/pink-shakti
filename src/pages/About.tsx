import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Crown,
  Sparkles,
  Users,
  Globe2,
  Target,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

const values = [
  { icon: Heart, title: "Respect", desc: "Every woman deserves dignity, equality and respect." },
  {
    icon: Crown,
    title: "Empowerment",
    desc: "We create opportunities that help women become confident and self-reliant.",
  },
  {
    icon: Users,
    title: "Inclusion",
    desc: "We welcome women from every community, profession, age group and background.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "We work with honesty, transparency and accountability.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    desc: "Meaningful change happens through partnerships.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    desc: "We encourage new ideas, technology and creative solutions.",
  },
  {
    icon: Target,
    title: "Excellence",
    desc: "We strive for the highest standards in every initiative.",
  },
  {
    icon: Globe2,
    title: "Social Impact",
    desc: "Every project should create measurable and meaningful change.",
  },
];

const milestones = [
  {
    year: "",
    title: "The Spark",
    desc: "PINK SHAKTI is founded with a vision for a women-first 360° ecosystem.",
  },
  {
    year: "",
    title: "First Summit",
    desc: "Inaugural Women Leadership Summit gathers 1,200+ founders and changemakers.",
  },
  {
    year: "",
    title: "Eight Pillars",
    desc: "Launched the eight-pillar framework spanning Health to Recognition.",
  },
  {
    year: "",
    title: "National Reach",
    desc: "Expanded to 8 cities; 50,000+ women touched through events, drives, and programmes.",
  },
  {
    year: "",
    title: "Global Stage",
    desc: "PINK SHAKTI Awards goes international — partnerships across 5 countries.",
  },
  {
    year: "",
    title: "Vision",
    desc: "Chapters across every Indian state and a globally recognised platform originating from India.",
  },
];

export default function AboutPage() {
  usePageMeta(
    "About Pink Shakti | A Women-First Community",
    "Meet Pink Shakti, a women-first community connecting learning, health, leadership, entrepreneurship and opportunity across eight pillars.",
  );

  return (
    <main className="bg-background">
      {/* HERO */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush-soft/30 via-ivory to-background" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.span
            className="page-label mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About PINK SHAKTI
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-maroon leading-[1.05] mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            A place for women to <span className="italic text-gold">learn, lead and grow</span>
          </motion.h1>
          <motion.p
            className="text-base lg:text-lg text-maroon/60 max-w-2xl mx-auto leading-relaxed text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Pink Shakti brings women together around health, leadership, entrepreneurship,
            education, rights, culture, media and recognition. Its eight-pillar vision creates space
            for learning, connection and women's voices.
          </motion.p>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-16 lg:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 lg:p-12 border border-gold/10 shadow-sm"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
              Our Mission
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-maroon mb-5 leading-tight">
              A community built around women's goals
            </h2>
            <p className="text-maroon/60 leading-relaxed">
              We bring women together to learn, share experience and explore opportunities across
              eight areas of life, work and community. From health and education to business, rights
              and recognition, each pillar reflects a different part of a woman's journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-maroon text-ivory rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 size-48 rounded-full border border-gold/20" />
            <div className="absolute -bottom-16 -left-8 size-40 rounded-full border border-gold/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block relative">
              Our Vision
            </span>
            <h2 className="font-display text-3xl lg:text-4xl mb-5 leading-tight relative max-w-xl">
              <span className="text-gold">Every woman has room to shape her own future</span>
            </h2>
            <p className="text-ivory/70 leading-relaxed relative">
              We envision a future where women can access knowledge, build confidence, find
              meaningful connections and take part in shaping their communities, professions and
              businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOUNDING BELIEF */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
              Our Belief
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-maroon mb-6 leading-tight">
              When women rise, entire <span className="italic text-gold">societies transform</span>
            </h2>
            <p className="text-maroon/60 leading-relaxed mb-8">
              Women thrive when knowledge, opportunity and supportive connections are within reach.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 text-left italic font-display text-lg lg:text-xl text-maroon/80 max-w-2xl mx-auto">
              "Empowering women is not charity. It's the most strategic, most enduring investment a
              nation can make in itself."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 lg:py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
              What We Stand For
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-maroon">
              Our Core <span className="italic text-gold">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="group bg-white rounded-2xl p-7 border border-gold/10 hover:border-gold/40 hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div className="size-12 rounded-full bg-blush-soft/40 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <v.icon
                    className="size-5 text-maroon group-hover:text-gold transition-colors"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="font-display text-xl text-maroon mb-2">{v.title}</h3>
                <p className="text-maroon/55 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY / TIMELINE */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
              Our Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-maroon">
              From a Spark to a <span className="italic text-gold">Movement</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  className={`relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 items-center ${
                    i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <div
                    className={`pl-12 sm:pl-0 ${i % 2 === 0 ? "sm:text-right sm:pr-10" : "sm:pl-10"}`}
                  >
                    <div className="font-display text-3xl lg:text-4xl text-gold mb-1">{m.year}</div>
                    <h3 className="font-display text-xl text-maroon mb-2">{m.title}</h3>
                    <p className="text-maroon/55 text-sm leading-relaxed">
                      {m.title === "Eight Pillars" ? (
                        <>
                          Launched the eight-pillar framework spanning Health <br />
                          to Recognition.
                        </>
                      ) : (
                        m.desc
                      )}
                    </p>
                  </div>
                  <div className="hidden sm:block" />
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 size-3 rounded-full bg-blush ring-4 ring-ivory" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-maroon relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(197,160,89,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <motion.h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory mb-5 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Be part of the <span className="italic text-gold">sisterhood</span>
          </motion.h2>
          <p className="text-ivory/60 mb-8 leading-relaxed">
            Whether you lead, learn, or lift others — there's a seat for you in PINK SHAKTI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory transition-all group"
            >
              Join the Movement
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pillars"
              className="inline-flex items-center gap-2 px-8 py-4 border border-ivory/20 text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory hover:text-maroon transition-all"
            >
              Explore Our Pillars
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
