import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Check, Loader2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { submitNomination } from "@/lib/content-api";

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
    "Awards Nomination | PINK SHAKTI",
    "Nominate extraordinary women for the PINK SHAKTI 360° Awards. Celebrating excellence in leadership, wellness, wealth, rights, culture and social impact.",
  );

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    category: categories[0],
    nomineeName: "",
    nomineeEmail: "",
    nomineePhone: "",
    city: "",
    linkedin: "",
    achievements: "",
    nominatedBy: "",
    nominatorEmail: "",
  });

  const field =
    "w-full px-4 py-3 rounded-xl border border-maroon/15 bg-white text-sm text-maroon placeholder:text-maroon/35 focus:outline-none focus:border-gold";

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomineeName || !form.achievements || !form.nominatedBy || !form.nominatorEmail) {
      toast.error("Nominee name, achievements and your contact details are required.");
      return;
    }
    setSending(true);
    try {
      await submitNomination(form);
      setDone(true);
      toast.success("Nomination submitted. Our jury team will be in touch.");
    } catch (err: any) {
      toast.error(err?.message || "Could not submit the nomination. Please try again.");
    } finally {
      setSending(false);
    }
  };

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
            {done ? (
              <div className="text-center py-10">
                <div className="size-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
                  <Check className="size-6 text-gold" />
                </div>
                <h3 className="font-display text-2xl text-maroon mb-3">Nomination received</h3>
                <p className="text-maroon/55 text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you for putting excellence forward. Our jury team reviews every entry and
                  will reach out if additional information is needed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="size-5 text-gold" />
                  <h3 className="font-display text-2xl text-maroon">Submit a nomination</h3>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-maroon/45 mb-2">
                    Category
                  </label>
                  <select value={form.category} onChange={set("category")} className={field}>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  className={field}
                  placeholder="Nominee full name *"
                  value={form.nomineeName}
                  onChange={set("nomineeName")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={field}
                    placeholder="Nominee email"
                    value={form.nomineeEmail}
                    onChange={set("nomineeEmail")}
                  />
                  <input
                    className={field}
                    placeholder="Nominee phone"
                    value={form.nomineePhone}
                    onChange={set("nomineePhone")}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={field}
                    placeholder="City"
                    value={form.city}
                    onChange={set("city")}
                  />
                  <input
                    className={field}
                    placeholder="LinkedIn / portfolio link"
                    value={form.linkedin}
                    onChange={set("linkedin")}
                  />
                </div>
                <textarea
                  className={`${field} min-h-32`}
                  placeholder="Key achievements and impact *"
                  value={form.achievements}
                  onChange={set("achievements")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={field}
                    placeholder="Your name *"
                    value={form.nominatedBy}
                    onChange={set("nominatedBy")}
                  />
                  <input
                    className={field}
                    placeholder="Your email *"
                    value={form.nominatorEmail}
                    onChange={set("nominatorEmail")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={true}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-60"
                >
                  {sending && <Loader2 size={14} className="animate-spin" />}
                  {sending ? "Submitting" : "Coming Soon..."}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
