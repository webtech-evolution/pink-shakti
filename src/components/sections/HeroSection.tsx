import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroWomen from "@/assets/hero-women.jpg";
import mandala from "@/assets/mandala.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 pb-16">
      {/* Background mandalas */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-[0.07]">
        <img src={mandala} alt="" className="w-full h-full animate-spin-slow" loading="lazy" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] -z-10 opacity-[0.05]">
        <img
          src={mandala}
          alt=""
          className="w-full h-full animate-spin-slow-reverse"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left content */}
        <motion.div
          className="lg:col-span-6 z-10"
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="page-label mb-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            India's Premium Women Ecosystem
          </motion.span>

          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl leading-[1.05] text-maroon mb-6 text-balance">
            Your skill deserves a stage. Your business deserves clients.
          </h1>

          <p className="text-lg lg:text-xl text-maroon/70 mb-10 max-w-lg leading-relaxed">
            Pink Shakti helps women build skills, share their work, meet clients and grow through
            workshops, events, community and Sakhi Bazaar.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all duration-300 group"
            >
              Join Free
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {/* <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 border border-maroon/20 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-maroon hover:text-ivory transition-all duration-300 group"
            >
              Explore Initiatives
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link> */}
          </div>
        </motion.div>

        {/* Right - Hero Image */}
        <motion.div
          className="lg:col-span-6 relative flex justify-center lg:justify-end px-4"
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative max-w-full">
            <div className="absolute -inset-4 sm:-inset-8 border border-gold/20 rounded-full animate-pulse-glow pointer-events-none" />
            <div className="absolute -inset-8 sm:-inset-16 border border-gold/10 rounded-full animate-spin-slow pointer-events-none" />

            <div className="w-[260px] h-[340px] sm:w-[340px] sm:h-[450px] lg:w-[420px] lg:h-[540px] rounded-3xl overflow-hidden border-[6px] border-[#faf7f2] shadow-2xl relative z-10">
              <img
                src={heroWomen}
                alt="Women of PINK SHAKTI across health, leadership, education, law, media and recognition"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
