import { motion } from "framer-motion";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

/** Shared luxury page header used across the secondary public pages. */
export function PageHero({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative pt-32 pb-16 bg-maroon overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(197,160,89,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <motion.div
        className="relative max-w-4xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {eyebrow && (
          <span className="block text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-4xl lg:text-6xl text-ivory leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-ivory/65 leading-relaxed mt-6 max-w-2xl mx-auto">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </section>
  );
}
