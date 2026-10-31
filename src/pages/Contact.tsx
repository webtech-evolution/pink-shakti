import { useState } from "react";
import { Mail, Instagram, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { submitLead } from "@/lib/content-api";

export default function ContactPage() {
  usePageMeta(
    "Contact Pink Shakti | Get in Touch",
    "Contact the Pink Shakti team about joining, events, partnerships or general enquiries.",
  );

  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const field =
    "w-full px-4 py-3 rounded-xl border border-maroon/15 bg-white text-sm text-maroon placeholder:text-maroon/35 focus:outline-none focus:border-gold";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      toast.error("Please add your email and a message.");
      return;
    }
    setSending(true);
    try {
      await submitLead({ type: "contact", ...form });
      toast.success("Message received. We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Could not send right now. Please email hello@pinkshakti.com.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main>
      <PageHero
        eyebrow="Questions or ideas? Talk to our team"
        title={
          <>
            Contact <span className="italic text-gold">Us</span>
          </>
        }
        subtitle="Contact us about joining Pink Shakti, attending an event or working together."
      />

      <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <Mail className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Email</h2>
              <a
                href="mailto:pinkshakti360@gmail.com"
                className="text-sm text-maroon/60 hover:text-gold transition-colors"
              >
                pinkshakti360@gmail.com
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <Instagram className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Instagram</h2>
              <a
                href="https://instagram.com/pinkshaktiofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-maroon/60 hover:text-gold transition-colors"
              >
                @pinkshaktiofficial
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <MapPin className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Based In</h2>
              <p className="text-sm text-maroon/60">
                Ahmedabad, Gujarat — connecting women across India.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-gold/10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className={`${field} min-w-0`}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className={`${field} min-w-0`}
                type="tel"
                autoComplete="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <input
              className={`${field} min-w-0`}
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              className={`${field} min-w-0 min-h-40`}
              placeholder="How can we help? *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-gold hover:text-maroon transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
