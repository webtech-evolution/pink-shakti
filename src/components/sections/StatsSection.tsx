import { motion } from "framer-motion";
import { Users, Calendar, Award, Globe, Building2, HeartHandshake } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Women Impacted" },
  { icon: Building2, value: "100+", label: "Corporate Partners" },
  { icon: Calendar, value: "250+", label: "Events Conducted" },
  { icon: Award, value: "25+", label: "Awards Conferred" },
  { icon: Globe, value: "5+", label: "Countries Reached" },
  { icon: HeartHandshake, value: "10+", label: "Communities" },
];

export function StatsSection() {
  return (
    <section className="bg-maroon text-ivory py-12 relative overflow-hidden">
      <div className="absolute inset-1.5 opacity-5">
        <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(197,160,89,0.3) 1.5%, transparent 1.5%), radial-gradient(circle at 80% 50%, rgba(197,160,89,0.3) 1.5%, transparent 1.5%)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <stat.icon className="size-6 mx-auto mb-3 text-gold" strokeWidth={1.5} />
              <div className="font-display text-3xl lg:text-4xl text-gold leading-none">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-ivory/50 mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
