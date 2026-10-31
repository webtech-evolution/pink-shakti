import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import {
  getEvent,
  getEventBySlug,
  listTiers,
  createRegistration,
  updateRegistration,
  updateTier,
} from "@/lib/events-api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import type { EventDoc, TicketTier } from "@/lib/types";
import { usePageMeta, useStructuredData } from "@/lib/use-page-meta";

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  usePageMeta(event ? `${event.title} | PINK SHAKTI` : "Event | PINK SHAKTI", event?.description);
  useStructuredData(
    "event",
    event
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description,
          startDate: event.startDate,
          ...(event.endDate ? { endDate: event.endDate } : {}),
          eventStatus:
            new Date(event.startDate).getTime() < Date.now()
              ? "https://schema.org/EventCompleted"
              : "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: event.venue || event.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.location,
              addressCountry: "IN",
            },
          },
          ...(event.coverImage ? { image: [event.coverImage] } : {}),
          organizer: {
            "@type": "Organization",
            name: "Pink Shakti",
            url: "https://www.pinkshakti.com/",
          },
          url: `${window.location.origin}/events/${event.slug || event.$id}`,
        }
      : null,
  );

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        // Try slug first, then fall back to $id
        const e = (await getEventBySlug(slug)) || (await getEvent(slug).catch(() => null));
        if (!e) throw new Error("Event not found");
        setEvent(e);
        const t = await listTiers(e.$id);
        setTiers(t);
        if (t[0]) setSelectedTier(t[0].$id);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const tier = useMemo(() => tiers.find((t) => t.$id === selectedTier), [tiers, selectedTier]);
  const total = (tier?.price || 0) * quantity;
  const available = tier ? tier.capacity - tier.sold : 0;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event || !tier) return;
    if (quantity > available) {
      toast.error(`Only ${available} tickets left in this tier.`);
      return;
    }
    setSubmitting(true);
    try {
      // 1. Create a pending registration record
      const reg = await createRegistration({
        eventId: event.$id,
        tierId: tier.$id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        quantity,
        amount: total,
        paymentStatus: total === 0 ? "paid" : "pending",
        notes: form.notes,
      });

      // 2. Free ticket — done
      if (total === 0) {
        await updateTier(tier.$id, { sold: tier.sold + quantity });
        toast.success("You're registered! We'll email you the details.");
        setForm({ fullName: "", email: "", phone: "", notes: "" });
        setQuantity(1);
        return;
      }

      // 3. Paid — launch Razorpay checkout
      await openRazorpayCheckout({
        amount: total,
        name: "PINK SHAKTI",
        description: `${event.title} — ${tier.name} × ${quantity}`,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        notes: { registrationId: reg.$id, eventId: event.$id, tierId: tier.$id },
        onSuccess: async (resp) => {
          try {
            await updateRegistration(reg.$id, {
              paymentStatus: "paid",
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpayOrderId: resp.razorpay_order_id,
              razorpaySignature: resp.razorpay_signature,
            });
            await updateTier(tier.$id, { sold: tier.sold + quantity });
            toast.success("Payment successful — see you at the event!");
            setForm({ fullName: "", email: "", phone: "", notes: "" });
            setQuantity(1);
          } catch (err: any) {
            toast.error(`Payment received but record update failed: ${err.message}`);
          }
        },
        onDismiss: async () => {
          await updateRegistration(reg.$id, { paymentStatus: "failed" }).catch(() => {});
          toast.message("Payment cancelled.");
        },
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center text-maroon/40">Loading…</div>;
  if (!event)
    return (
      <div className="min-h-screen pt-24 text-center">
        <p className="text-maroon/60 mb-4">Event not found.</p>
        <Link to="/events" className="text-gold underline">
          Back to events
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen pb-24 bg-ivory">
      <div
        className="relative h-[45vh] bg-maroon"
        style={
          event.coverImage
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(37,8,15,0.4), rgba(37,8,15,0.85)), url(${event.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-ivory/70 hover:text-gold mb-6"
          >
            <ArrowLeft size={14} /> All events
          </Link>
          {event.category && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">
              {event.category}
            </span>
          )}
          <h1 className="font-display text-4xl lg:text-6xl text-ivory">{event.title}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-ivory/70 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} />
              {new Date(event.startDate).toLocaleString("en-IN", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} />
              {event.venue ? `${event.venue}, ` : ""}
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gold/10 rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl text-maroon mb-4">About this event</h2>
            <p className="text-maroon/70 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </motion.div>

          {tiers.length > 0 && (
            <div className="bg-white border border-gold/10 rounded-2xl p-8">
              <h2 className="font-display text-2xl text-maroon mb-4">Choose your ticket</h2>
              <div className="space-y-3">
                {tiers.map((t) => {
                  const soldOut = t.sold >= t.capacity;
                  const active = selectedTier === t.$id;
                  return (
                    <button
                      key={t.$id}
                      type="button"
                      disabled={soldOut}
                      onClick={() => setSelectedTier(t.$id)}
                      className={`w-full text-left border rounded-xl p-5 transition-all ${
                        active ? "border-gold bg-gold/5" : "border-maroon/10 hover:border-maroon/30"
                      } ${soldOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg text-maroon">{t.name}</span>
                            {active && <Check size={14} className="text-gold" />}
                          </div>
                          {t.description && (
                            <p className="text-sm text-maroon/60 mt-1">{t.description}</p>
                          )}
                          <p className="text-[11px] text-maroon/40 mt-2 uppercase tracking-widest">
                            {soldOut ? "Sold out" : `${t.capacity - t.sold} of ${t.capacity} left`}
                          </p>
                        </div>
                        <div className="font-display text-2xl text-maroon">
                          {t.price === 0 ? "Free" : `₹${t.price.toLocaleString("en-IN")}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gold/10 rounded-2xl p-6 lg:sticky lg:top-32">
            <h3 className="font-display text-xl text-maroon mb-4">Register</h3>

            {tiers.length === 0 ? (
              <p className="text-sm text-maroon/50">
                Registration will open soon. Check back shortly.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <Field label="Full name">
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full border border-maroon/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-maroon/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-maroon/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </Field>
                <Field label="Quantity">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, available)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-maroon/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </Field>

                <div className="flex items-center justify-between border-t border-maroon/10 pt-4 mt-4">
                  <span className="text-[11px] uppercase tracking-widest text-maroon/60">
                    Total
                  </span>
                  <span className="font-display text-2xl text-maroon">
                    {total === 0 ? "Free" : `₹${total.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !tier || available <= 0}
                  className="w-full bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Processing…"
                    : total === 0
                      ? "Confirm registration"
                      : "Pay with Razorpay"}
                </button>
                <p className="text-[10px] text-maroon/40 text-center mt-2">
                  Secure checkout powered by Razorpay
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-maroon/60 block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
