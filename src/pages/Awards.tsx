import { motion } from "framer-motion";
import { Award, Sparkles, Trophy } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";
import { PageExtras } from "@/components/PageExtras";

const categories = [
  "Woman Entrepreneur of the Year",
  "Corporate Leadership Excellence",
  "Health & Wellness Changemaker",
  "Wealth & Finance Trailblazer",
  "Education & Mentorship Icon",
  "Rights & Justice Advocate",
  "Arts, Culture & Media Excellence",
  "Young Achiever (Under 25)",
  "Social Impact & CSR Leadership",
  "Lifetime Contribution to Women Empowerment",
];

const journey = [
  {
    step: "01",
    title: "Nominate",
    copy: "Submit a nomination for yourself or an extraordinary woman you admire.",
  },
  {
    step: "02",
    title: "Jury Review",
    copy: "An independent jury of industry leaders evaluates impact, scale and integrity.",
  },
  {
    step: "03",
    title: "Finalists",
    copy: "Shortlisted nominees are announced and invited to the awards gala.",
  },
  {
    step: "04",
    title: "Celebration",
    copy: "Winners are honoured on stage with national media coverage.",
  },
];

export default function AwardsPage() {
  usePageMeta(
    "PINK SHAKTI Awards | Nominate Inspiring Women Achievers",
    "Nominate extraordinary women for the PINK SHAKTI 360° Awards. Celebrating excellence in leadership, wellness, wealth, rights, culture and social impact.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Recognition & Honour"
        title={
          <>
            The PINK SHAKTI <span className="italic text-gold">Awards</span>
          </>
        }
        subtitle="Honouring women who are shaping India's future across health, power, wealth, education, rights, culture and media. Nominations are open, and every entry is reviewed by an independent jury."
      />

      {/* Journey */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {journey.map((j, i) => (
              <motion.div
                key={j.step}
                className="bg-white rounded-2xl p-7 border border-gold/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <span className="font-display text-3xl text-gold/40">{j.step}</span>
                <h3 className="font-display text-xl text-maroon mt-3 mb-2">{j.title}</h3>
                <p className="text-maroon/55 text-sm leading-relaxed">{j.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4 block">
              Award Categories
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-maroon mb-8">
              Ten honours, one <span className="italic text-gold">standard</span> of excellence
            </h2>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-maroon/70">
                  <Trophy size={15} className="text-gold mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-10 bg-ivory rounded-2xl p-6 border border-gold/10">
              <Sparkles className="size-5 text-gold mb-3" />
              <p className="text-maroon/60 text-sm leading-relaxed">
                Self-nominations are welcome. There is no fee to nominate — shortlisted nominees are
                contacted for supporting documents before the jury round.
              </p>
            </div>
          </div>

          <div className="bg-ivory rounded-3xl p-8 lg:p-10 border border-gold/10">
            <div className="flex items-center gap-3 mb-6">
              <Award className="size-5 text-gold" />
              <h3 className="font-display text-2xl text-maroon">Submit a nomination</h3>
            </div>
            <EnquiryForm
              subject="PINK SHAKTI Awards nomination"
              button="Submit nomination"
              fields={[
                { name: "category", label: "Award category", options: categories, required: true },
                { name: "nominee", label: "Nominee name", required: true },
                { name: "nomineePhone", label: "Nominee mobile", type: "tel" },
                { name: "city", label: "City", options: cityOptions },
                { name: "link", label: "LinkedIn / Instagram / website" },
                { name: "by", label: "Your name", required: true },
                { name: "byContact", label: "Your mobile or email", required: true },
                {
                  name: "achievements",
                  label: "Her achievements and impact",
                  type: "textarea",
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </section>
      <PageExtras page="awards" />
    </main>
  );
}
