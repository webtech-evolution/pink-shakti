import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Sparkles, Loader2, Tag } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import { listPlans } from "@/lib/memberships-api";
import type { MembershipPlan } from "@/lib/types";
import { submitLead } from "@/lib/content-api";
import { useAuth } from "@/context/AuthContext";
import {
  createMembershipOrder,
  getReferralQuote,
  verifyMembershipPayment,
  type ReferralQuote,
} from "@/lib/referrals-api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatINR } from "@/lib/products-api";
import { toast } from "sonner";
import { useEffect, useState, type FormEvent } from "react";

export default function MembershipPage() {
  const { user, member } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const membershipReturnPath = searchParams.get("ref")
    ? `/membership?ref=${encodeURIComponent(searchParams.get("ref") || "")}`
    : "/membership";
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [purchasePlan, setPurchasePlan] = useState<MembershipPlan | null>(null);
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [appliedCode, setAppliedCode] = useState("");
  const [quote, setQuote] = useState<ReferralQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [sending, setSending] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", city: "", businessType: "" });

  useEffect(() => {
    listPlans({ activeOnly: false })
      .then((items) => setPlans(items.filter((plan) => plan.status !== "hidden")))
      .catch((error) => toast.error(error.message || "Could not load membership plans"))
      .finally(() => setLoading(false));
  }, []);
  usePageMeta(
    "Pink Saathi | PINK SHAKTI",
    "Join Pink Saathi, the PINK SHAKTI 360° women's community. Aarambh is free — Udaan, Pragati and Shikhar tiers launching soon.",
  );

  const submitInterest = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPlan) return;
    setSending(true);
    try {
      await submitLead({
        type: "contact",
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        organisation: lead.businessType,
        message: `Plan: ${selectedPlan.name}; City: ${lead.city}; Business type: ${lead.businessType}`,
      });
      toast.success("Thanks! We'll let you know when this plan opens.");
      setLead({ name: "", email: "", phone: "", city: "", businessType: "" });
      setSelectedPlan(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your interest. Try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const applyReferralCode = async () => {
    if (!purchasePlan) return;
    setQuoting(true);
    try {
      const result = await getReferralQuote(purchasePlan.$id, referralCode.trim());
      setQuote(result);
      setAppliedCode(referralCode.trim());
      toast.success(result.discount ? "Referral discount applied." : "No discount applies to this code.");
    } catch (error) {
      setQuote(null);
      setAppliedCode("");
      toast.error(error instanceof Error ? error.message : "Could not validate that referral code.");
    } finally {
      setQuoting(false);
    }
  };

  const purchaseMembership = async (event: FormEvent) => {
    event.preventDefault();
    if (!purchasePlan || !user || !member) return;
    setPurchasing(true);
    try {
      const order = await createMembershipOrder(purchasePlan.$id, appliedCode);
      await openRazorpayCheckout({
        amount: order.amount,
        currency: order.currency,
        orderId: order.orderId,
        name: "PINK SHAKTI 360°",
        description: `${purchasePlan.name} Pink Saathi membership`,
        prefill: { name: member.fullName, email: member.email, contact: member.phone },
        onSuccess: async (payment) => {
          try {
            await verifyMembershipPayment({
              planId: purchasePlan.$id,
              orderId: order.orderId,
              paymentId: payment.razorpay_payment_id,
              signature: payment.razorpay_signature || "",
            });
            toast.success("Membership payment verified. Welcome to Pink Saathi!");
            navigate("/profile");
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Payment received, but membership activation needs support.",
            );
          } finally {
            setPurchasing(false);
          }
        },
        onDismiss: () => setPurchasing(false),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start membership checkout.");
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="relative pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.15),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
            Pink Saathi
          </p>
          <h1 className="font-display text-5xl lg:text-6xl text-maroon leading-tight">
            Become a <span className="text-gold">Pink Saathi</span>
          </h1>
          <p className="mt-6 text-maroon/70 max-w-2xl mx-auto leading-relaxed">
            Pink Saathi is for women who want to grow with us — through events, learning, mentorship
            and recognition. Start free with Aarambh or explore paid plans when they are available.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {loading ? (
            <p className="col-span-full text-center text-sm text-maroon/50">
              Loading Pink Saathi plans...
            </p>
          ) : (
            plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative bg-white border rounded-2xl p-8 flex flex-col shadow-sm transition-all ${
                  plan.status === "active"
                    ? "border-gold/40 hover:shadow-lg"
                    : "border-maroon/10 opacity-90 hover:opacity-100"
                }`}
              >
                {plan.tagline && (
                  <div className="absolute -top-3 right-6 bg-gold text-maroon text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> {plan.tagline}
                  </div>
                )}
                <h2 className="font-display text-2xl text-maroon">{plan.name}</h2>
                <p className="text-[10px] uppercase tracking-[0.25em] text-maroon/40 mt-1">
                  {plan.meaning}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-maroon">
                    {plan.price === 0
                      ? "Free"
                      : `${plan.currency === "INR" ? "₹" : plan.currency} ${plan.price.toLocaleString("en-IN")}`}
                  </span>
                  <span className="text-sm text-maroon/50">
                    / {plan.duration === "lifetime" ? "lifetime" : "per year"}
                  </span>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-maroon/70 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="text-gold shrink-0 mt-0.5" size={14} />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.status === "active" && plan.price === 0 ? (
                  <Link
                    to={`/join${searchParams.get("ref") ? `?ref=${encodeURIComponent(searchParams.get("ref") || "")}` : ""}`}
                    className="mt-8 w-full text-center bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
                  >
                    Join Free
                  </Link>
                ) : plan.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPurchasePlan(plan);
                      setSelectedPlan(null);
                      setReferralCode(searchParams.get("ref") || "");
                      setAppliedCode("");
                      setQuote(null);
                    }}
                    className="mt-8 w-full text-center bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
                  >
                    Choose plan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className="mt-8 w-full rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] border border-maroon/20 text-maroon hover:border-gold hover:bg-gold hover:text-maroon transition-colors flex items-center justify-center gap-2"
                  >
                    Notify me
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>

        {purchasePlan && (
          <section
            aria-labelledby="purchase-heading"
            className="mt-12 max-w-3xl mx-auto bg-white border border-gold/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                  Pink Saathi membership
                </p>
                <h2 id="purchase-heading" className="font-display text-2xl text-maroon mt-1">
                  {purchasePlan.name} checkout
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPurchasePlan(null)}
                className="text-xs font-semibold text-maroon/60 hover:text-maroon"
              >
                Cancel
              </button>
            </div>
            {!user ? (
              <p className="text-sm text-maroon/70">
                Sign in or create an account to continue.{" "}
                <Link
                  className="font-semibold text-gold"
                  to={`/login?from=${encodeURIComponent(membershipReturnPath)}`}
                >
                  Sign in
                </Link>
              </p>
            ) : !member ? (
              <p className="text-sm text-maroon/70">
                Create your Pink Saathi member profile before purchasing a plan.{" "}
                <Link
                  className="font-semibold text-gold"
                  to={`/join${searchParams.get("ref") ? `?ref=${encodeURIComponent(searchParams.get("ref") || "")}` : ""}`}
                >
                  Join the community
                </Link>
              </p>
            ) : (
              <form onSubmit={purchaseMembership} className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="sr-only" htmlFor="referral-code">
                    Referral code
                  </label>
                  <input
                    id="referral-code"
                    value={referralCode}
                    onChange={(event) => {
                      setReferralCode(event.target.value.toUpperCase());
                      setAppliedCode("");
                      setQuote(null);
                    }}
                    placeholder="Referral code (optional)"
                    className="min-w-0 flex-1 border border-maroon/15 rounded-xl px-4 py-3 text-sm text-maroon focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={applyReferralCode}
                    disabled={quoting || !referralCode.trim()}
                    className="inline-flex items-center justify-center gap-2 border border-maroon/20 rounded-xl px-5 py-3 text-xs font-semibold text-maroon hover:border-gold disabled:opacity-50"
                  >
                    {quoting ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
                    Apply code
                  </button>
                </div>
                <div className="rounded-xl bg-ivory p-4 text-sm text-maroon/70 space-y-1">
                  <p>Plan price: {formatINR(purchasePlan.price)}</p>
                  <p>Referral discount: {formatINR(quote?.discount || 0)}</p>
                  <p className="font-semibold text-maroon">
                    Due today: {formatINR(quote?.finalAmount ?? purchasePlan.price)}
                  </p>
                  {appliedCode && <p className="text-xs text-maroon/50">Code: {appliedCode}</p>}
                </div>
                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {purchasing && <Loader2 size={14} className="animate-spin" />}
                  {purchasing ? "Starting secure checkout..." : "Continue to secure payment"}
                </button>
                <p className="text-xs text-maroon/45">
                  Final pricing and payment status are verified by the Pink Shakti server.
                </p>
              </form>
            )}
          </section>
        )}

        {selectedPlan && (
          <section
            id="notify-form"
            aria-labelledby="notify-heading"
            className="mt-12 max-w-3xl mx-auto bg-white border border-gold/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                  {selectedPlan.name}
                </p>
                <h2 id="notify-heading" className="font-display text-2xl text-maroon mt-1">
                  Get launch updates
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="text-xs font-semibold text-maroon/60 hover:text-maroon"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={submitInterest} className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-xs text-maroon/70">
                Full name
                <input
                  required
                  autoFocus
                  value={lead.name}
                  onChange={(event) => setLead({ ...lead, name: event.target.value })}
                  className="border border-maroon/15 rounded-lg px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-maroon/70">
                Email
                <input
                  required
                  type="email"
                  value={lead.email}
                  onChange={(event) => setLead({ ...lead, email: event.target.value })}
                  className="border border-maroon/15 rounded-lg px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-maroon/70">
                Phone
                <input
                  required
                  type="tel"
                  value={lead.phone}
                  onChange={(event) => setLead({ ...lead, phone: event.target.value })}
                  className="border border-maroon/15 rounded-lg px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-maroon/70">
                City
                <input
                  required
                  value={lead.city}
                  onChange={(event) => setLead({ ...lead, city: event.target.value })}
                  className="border border-maroon/15 rounded-lg px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-maroon/70 sm:col-span-2">
                Business type
                <input
                  required
                  value={lead.businessType}
                  onChange={(event) => setLead({ ...lead, businessType: event.target.value })}
                  className="border border-maroon/15 rounded-lg px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold"
                />
              </label>
              <button
                type="submit"
                disabled={sending}
                className="sm:col-span-2 w-full bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sending && <Loader2 className="size-4 animate-spin" />}
                {sending ? "Sending..." : "Notify me"}
              </button>
            </form>
          </section>
        )}

        <div className="mt-16 text-center text-xs text-maroon/50 max-w-xl mx-auto">
          {/* Aarambh members are welcomed by our community team within 24–48 hours of registration. */}
        </div>
      </section>
    </div>
  );
}
