import { motion } from "framer-motion";
import {
  Heart,
  Crown,
  TrendingUp,
  GraduationCap,
  Scale,
  Globe2,
  Mic,
  Award,
  Subtitles,
} from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Health & Wellness",
    subtitle: "Stronger Body. Stronger You",
  },
  {
    icon: Crown,
    title: "Leadership & Power",
    subtitle: "Confident. Fearless. Unstoppable",
  },
  {
    icon: TrendingUp,
    title: "Wealth & Entrepreneurship",
    subtitle: "Limitless Possibilities",
  },
  {
    icon: GraduationCap,
    title: "Education & Future",
    subtitle: "Learn. Innovate. Lead",
  },
  {
    icon: Scale,
    title: "Rights, Safety & Justice",
    subtitle: "Safe. Aware. Equal",
  },
  {
    icon: Globe2,
    title: "Society, Culture & Environment",
    subtitle: "Rooted. Responsible. Rising",
  },
  {
    icon: Mic,
    title: "Media & Global Connect",
    subtitle: "Voice. Reach. Influence",
  },
  {
    icon: Award,
    title: "Inspiration & Recognition",
    subtitle: "Celebrate. Honour. Inspire",
  },
];

export function PillarsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="page-label mb-4">Our Ecosystem</span>
          <h2 className="font-display text-4xl lg:text-5xl text-maroon mb-6">
            Eight Pillars. One <span className="italic text-gold">360° Movement</span>
          </h2>
          <p className="text-maroon/50 max-w-2xl mx-auto">
            Whatever your skill or ambition, find a place to learn, connect and move forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="group min-w-0"
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="min-h-64 sm:min-h-72 lg:min-h-80 rounded-t-full bg-blush-soft/30 border border-gold/20 flex flex-col items-center justify-center px-3 py-8 sm:p-5 text-center group-hover:bg-gold group-hover:border-gold transition-all duration-500 relative overflow-hidden">
                <div className="size-11 sm:size-14 shrink-0 rounded-full border border-maroon/10 flex items-center justify-center mb-4 group-hover:border-ivory/30 group-hover:bg-ivory/10 transition-all">
                  <pillar.icon
                    className="size-5 sm:size-6 text-maroon group-hover:text-ivory transition-colors"
                    strokeWidth={1.2}
                  />
                </div>
                <h3 className="font-display text-xs sm:text-base lg:text-xl uppercase leading-snug mb-2 max-w-full [overflow-wrap:normal] [word-break:normal] group-hover:text-ivory transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] uppercase leading-relaxed tracking-widest text-maroon/50 max-w-full break-words group-hover:text-ivory/80 transition-colors">
                  {pillar.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
