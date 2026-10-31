import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function VisionSection() {
  return (
    <section className="py-24 bg-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className=" gap-16 items-center"
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="page-label mb-4">Learn, Connect, Showcase, Grow</span>
            <h2 className="font-display text-4xl lg:text-5xl text-maroon mb-8 leading-tight">
              A community where women can <span className="italic text-gold">grow together</span>
            </h2>
            <p className="text-maroon/60 leading-relaxed mb-6">
              Learn through workshops, connect with women who share your goals, showcase your work
              at events and build the confidence to take your next step.
            </p>
            <p className="text-maroon/60 leading-relaxed mb-8">
              Across health, leadership, entrepreneurship, education, rights, culture, media and
              recognition, Pink Shakti brings women's ambitions into one community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-maroon/20 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-maroon hover:text-ivory transition-all group"
              >
                Know More About Us
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          {/* <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://loremflickr.com/800/600/women,empowerment,community"
                alt="PINK SHAKTI Movement"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
