import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Megaphone, Trophy, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { listPartners, submitLead } from "@/lib/content-api";
import type { Partner } from "@/lib/types";

const fallbackPartners = [
  "Femina",
  "Mid-Day",
  "Radio Mirchi",
  "Odoo",
  "Connplex",
  "She The People",
  "ZCAD",
  "Hindustan Times",
];

const opportunities = [
  {
    icon: Trophy,
    title: "Title & Presenting Sponsor",
    text: "Own the stage at our flagship summits and award nights with headline branding across all campaign assets.",
  },
  {
    icon: Megaphone,
    title: "Media & Broadcast Partner",
    text: "Co-create stories, interviews and features that travel across print, radio, digital and social platforms.",
  },
  {
    icon: Users,
    title: "Knowledge & CSR Partner",
    text: "Power masterclasses, health camps and skill programmes that reach women in tier 2 and tier 3 India.",
  },
  {
    icon: Handshake,
    title: "Ecosystem & Retail Partner",
    text: "Reach our marketplace of women-led brands with products, services and distribution support.",
  },
];

export default function PartnersPage() {
  usePageMeta(
    "Partner With Us | PINK SHAKTI",
    "Partner with PINK SHAKTI 360° — sponsorship, media, CSR and ecosystem collaborations that empower women across India.",
  );

  const [partners, setPartners] = useState<Partner[]>([]);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    listPartners(true)
      .then(setPartners)
      .catch(() => setPartners([]));
  }, []);

  const names = partners.length ? partners.map((p) => p.name) : fallbackPartners;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please share your name and email.");
      return;
    }
    setSending(true);
    try {
      await submitLead({ type: "partner", ...form });
      toast.success("Thank you! Our partnerships team will reach out shortly.");
      setForm({ name: "", organisation: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Could not send right now. Please email us at hello@pinkshakti.com.");
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full px-4 py-3 rounded-xl border border-maroon/15 bg-white text-sm text-maroon placeholder:text-maroon/35 focus:outline-none focus:border-gold";

  return (
    <main>
      <PageHero
        eyebrow="Collaborate With Us"
        title={
          <>
            Partner With <span className="italic text-gold">PINK SHAKTI</span>
          </>
        }
        subtitle="Join the brands, institutions and media houses building India's premium women ecosystem alongside us."
      />

      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((o, i) => (
              <motion.div
                key={o.title}
                className="bg-white rounded-3xl p-8 border border-gold/10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <o.icon className="size-8 text-gold mb-5" />
                <h2 className="font-display text-2xl text-maroon mb-3">{o.title}</h2>
                <p className="text-maroon/60 text-sm leading-relaxed">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-maroon/30 mb-12 font-semibold">
            Our Esteemed Partners
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-center">
            {names.map((name) => (
              <span
                key={name}
                className="font-display text-xl lg:text-2xl text-maroon/25 hover:text-maroon/60 transition-colors tracking-tight"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold block mb-3">
              Enquiry
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-maroon">
              Let's build something meaningful
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 border border-gold/10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className={field}
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className={field}
                placeholder="Organisation"
                value={form.organisation}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              />
              <input
                className={field}
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className={field}
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <textarea
              className={`${field} min-h-32`}
              placeholder="Tell us how you'd like to partner"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-gold hover:text-maroon transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              Send Enquiry
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
