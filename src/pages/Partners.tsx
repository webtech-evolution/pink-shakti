import { motion } from "framer-motion";
import { Handshake, Megaphone, Trophy, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageExtras } from "@/components/PageExtras";

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
    "Partner with Pink Shakti | Sponsorship, Media & CSR",
    "Partner with PINK SHAKTI 360° — sponsorship, media, CSR and ecosystem collaborations that empower women across India.",
  );

  const names = fallbackPartners;

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
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-gold/10">
            <EnquiryForm
              subject="Pink Shakti partnership enquiry"
              button="Start the conversation"
              fields={[
                { name: "name", label: "Your name", required: true },
                { name: "org", label: "Organisation", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                {
                  name: "interest",
                  label: "Interested in",
                  options: [
                    "Title / presenting sponsor",
                    "Media partner",
                    "Knowledge / CSR partner",
                    "Ecosystem / retail partner",
                    "Other",
                  ],
                },
                { name: "message", label: "Message", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
      <PageExtras page="partners" />
    </main>
  );
}
