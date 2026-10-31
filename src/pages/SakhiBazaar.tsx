import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import mandala from "@/assets/mandala.png";

export default function SakhiBazaarPage() {
  usePageMeta(
    "Sakhi Bazaar | Products Made by Women | Pink Shakti",
    "Discover Sakhi Bazaar by Pink Shakti, a curated marketplace for women-led brands and makers. Launching soon; follow along for updates.",
  );

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-ivory">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.16),transparent_65%)]" />
      <img
        src={mandala}
        alt=""
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[620px] opacity-[0.07] animate-spin-slow"
      />
      <img
        src={mandala}
        alt=""
        className="absolute -left-24 bottom-0 w-[380px] opacity-[0.05] animate-spin-slow-reverse"
      />

      <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.span
          className="page-label inline-flex justify-center items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Launching Soon
        </motion.span>

        <motion.h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-maroon leading-[1.05] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Sakhi Bazaar: <span className="italic text-gold">made by women, bought with purpose</span>
        </motion.h1>

        <motion.p
          className="text-maroon/60 leading-relaxed max-w-l mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We are preparing a curated marketplace for products made by Pink Shakti women. It will
          bring together handmade, homemade, designed and crafted goods, with honest pricing and a
          community that buys with purpose.
        </motion.p>

        <motion.div
          className="relative h-px w-56 mx-auto mb-10 overflow-hidden bg-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gold"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all group"
          >
            Join the Movement
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
