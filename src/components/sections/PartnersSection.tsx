import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listPartners } from "@/lib/content-api";
import type { Partner } from "@/lib/types";

const fallbackPartners = [
  "Femina", "Mid-Day", "Radio Mirchi", "Odoo", "Connplex", "She The People", "ZCAD", "Hindustan Times",
];

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    listPartners()
      .then(setPartners)
      .catch(() => {});
  }, []);

  const names = partners.length ? partners.map((p) => p.name) : fallbackPartners;
  const logos = partners.filter((p) => p.logo);

  return (
    <section className="py-16 border-t border-gold/10 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          className="text-center text-[10px] uppercase tracking-[0.4em] text-maroon/30 mb-12 font-semibold"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Esteemed Partners
        </motion.p>

        {logos.length ? (
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 items-center">
            {logos.map((p) => (
              <img
                key={p.$id}
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-10 lg:h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-center">
            {names.map((name) => (
              <span
                key={name}
                className="font-display text-xl lg:text-2xl text-maroon/20 hover:text-maroon/60 transition-colors cursor-default tracking-tight"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
