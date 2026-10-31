import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-maroon relative overflow-hidden">
      <div className="absolute inset-1.5 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(197,160,89,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
            Your next step starts here
          </span>
          <h2 className="font-display text-4xl lg:text-6xl text-ivory mb-6 leading-tight">
            Grow with a <span className="italic text-gold">sisterhood</span> behind you
          </h2>
          <p className="text-ivory/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Start with the community, then find the learning, connections and opportunities that
            match your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory transition-all group"
            >
              Join Free
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-ivory/20 text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory hover:text-maroon transition-all"
            >
              Partner With Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
