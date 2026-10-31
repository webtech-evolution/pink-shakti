import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Tag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { createMember } from "@/lib/content-api";
import {
  createFreeMembershipSubscription,
  validateReferralCode,
} from "@/lib/referrals-api";
import { useAuth } from "@/context/AuthContext";
import { getCommunityPlan } from "@/lib/community-membership";

const interestOptions = [
  "Health & Wellness",
  "Leadership & Power",
  "Wealth & Entrepreneurship",
  "Education & Future",
  "Rights & Justice",
  "Society & Culture",
  "Media & Global Connect",
  "Awards & Recognition",
];

const benefits = [
  "Invitations to PINK SHAKTI summits, retreats and city meet-ups",
  "Access to masterclasses on health, wealth, leadership and rights",
  "Introductions within a pan-India sisterhood of women achievers",
  "Priority consideration for awards, panels and media features",
];

export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [appliedReferralCode, setAppliedReferralCode] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  usePageMeta(
    "Join the Community | PINK SHAKTI",
    "Join the free PINK SHAKTI 360° women's community for events, masterclasses, mentorship and a pan-India sisterhood.",
  );

  const { user, member, loading: authLoading, refreshMember } = useAuth();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    occupation: "",
    dob: "",
    address: "",
  });

  useEffect(() => {
    if (user)
      setForm((current) => ({ ...current, fullName: user.name || "", email: user.email || "" }));
  }, [user]);

  useEffect(() => {
    const queryReferralCode = searchParams.get("ref") || "";
    setReferralCode(queryReferralCode);
    setAppliedReferralCode("");
  }, [searchParams]);

  useEffect(() => {
    if (!user || !member) return;
    createFreeMembershipSubscription(getCommunityPlan("aarambh").id, referralCode).catch((error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not confirm your membership. Please retry from your profile.",
      );
    });
  }, [member, user, referralCode]);

  const field =
    "w-full px-4 py-3 rounded-xl border border-maroon/15 bg-white text-sm text-maroon placeholder:text-maroon/35 focus:outline-none focus:border-gold";

  const toggle = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const applyCode = async () => {
    const code = referralCode.trim();
    if (!code) {
      setAppliedReferralCode("");
      toast.info("Enter a referral code first.");
      return;
    }
    setApplyingReferral(true);
    try {
      const result = await validateReferralCode(code);
      setReferralCode(result.code);
      setAppliedReferralCode(result.code);
      toast.success("Referral code applied.");
    } catch (error) {
      setAppliedReferralCode("");
      toast.error(error instanceof Error ? error.message : "Could not validate the referral code.");
    } finally {
      setApplyingReferral(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (member) {
      toast.info("You already have a PINK SHAKTI member profile.");
      return;
    }
    if (
      !form.fullName ||
      !form.phone ||
      !form.email ||
      !form.occupation ||
      !form.dob ||
      !form.address
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }
    setSending(true);
    try {
      const appliedCode = referralCode.trim()
        ? (await validateReferralCode(referralCode.trim())).code
        : "";
      await createMember({ ...form, userId: user.$id, interests });
      await createFreeMembershipSubscription(getCommunityPlan("aarambh").id, appliedCode);
      await refreshMember();
      setDone(true);
      toast.success("Welcome to PINK SHAKTI! We'll be in touch soon.");
    } catch (error) {
      console.error("Community registration failed", error);
      toast.error(
        error instanceof Error ? error.message : "Could not submit right now. Please try again.",
      );
      await refreshMember();
    } finally {
      setSending(false);
    }
  };

  if (authLoading) return <LoadingScreen />;

  return (
    <main>
      <PageHero
        eyebrow="Free Pink Saathi"
        title={
          <>
            Join the <span className="italic text-gold">Sisterhood</span>
          </>
        }
        subtitle="Become part of India's premium women ecosystem. No fee — just an intent to grow, contribute and lift others."
      />

      <section className="py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gold/10">
              <h2 className="font-display text-2xl text-maroon mb-5">What you get</h2>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-maroon/65 leading-relaxed">
                    <Check className="size-4 text-gold shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-maroon rounded-3xl p-8 text-ivory">
              <h3 className="font-display text-xl mb-2">Aarambh — free for now</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                Our higher Pink Saathi tiers open soon. Start with Aarambh today and you'll be first
                in line when they launch.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {authLoading ? (
              <div className="bg-white rounded-3xl p-12 text-center text-sm text-maroon/60">
                Checking your account…
              </div>
            ) : !user ? (
              <div className="bg-white rounded-3xl p-10 border border-gold/10 text-center">
                <h2 className="font-display text-3xl text-maroon mb-3">Sign in to join</h2>
                <p className="text-sm text-maroon/60 mb-6">
                  A member profile belongs to your account, so you can access and share your card
                  anytime.
                </p>
                <Link
                  to="/login?from=/join"
                  className="inline-flex px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-gold hover:text-maroon transition-all"
                >
                  Sign in or create account
                </Link>
              </div>
            ) : member ? (
              <div className="bg-white rounded-3xl p-10 border border-gold/10 text-center">
                <div className="size-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                  <Check className="size-7 text-gold" />
                </div>
                <h2 className="font-display text-3xl text-maroon mb-3">You’re already a member</h2>
                <p className="text-maroon/60 text-sm mb-6">
                  Your digital member card is ready in your profile.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.25em] rounded-full"
                >
                  View member card
                </Link>
              </div>
            ) : done ? (
              <motion.div
                className="bg-white rounded-3xl p-12 border border-gold/10 text-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="size-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                  <Check className="size-7 text-gold" />
                </div>
                <h2 className="font-display text-3xl text-maroon mb-3">You're in</h2>
                <p className="text-maroon/60 text-sm leading-relaxed">
                  Your application has been received. Our community team will contact you with your
                  welcome details and upcoming invitations.
                </p>
                {searchParams.get("ref") && (
                  <Link
                    to={`/membership?ref=${encodeURIComponent(searchParams.get("ref") || "")}`}
                    className="inline-flex mt-6 px-7 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-widest"
                  >
                    Continue membership checkout
                  </Link>
                )}
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 border border-gold/10 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={field}
                    placeholder="Full name *"
                    readOnly
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                  <input
                    className={field}
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <input
                    className={field}
                    type="email"
                    placeholder="Email address *"
                    readOnly
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    className={field}
                    placeholder="Occupation *"
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-maroon/50 font-bold mb-2">
                      Date of birth *
                    </label>
                    <input
                      className={field}
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    />
                  </div>
                </div>

                <textarea
                  className={`${field} min-h-24`}
                  placeholder="Full address *"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />

                <div className="rounded-2xl border border-gold/20 bg-ivory/70 p-4">
                  <label
                    htmlFor="free-referral-code"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-maroon/55"
                  >
                    Referral code <span className="font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="free-referral-code"
                      autoComplete="off"
                      value={referralCode}
                      onChange={(event) => {
                        setReferralCode(event.target.value.toUpperCase());
                        setAppliedReferralCode("");
                      }}
                      placeholder="Enter your Pink Saathi referral code"
                      className={`${field} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={applyCode}
                      disabled={applyingReferral || !referralCode.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-maroon/20 px-5 py-3 text-xs font-semibold text-maroon transition-colors hover:border-gold disabled:opacity-50"
                    >
                      {applyingReferral ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Tag size={14} />
                      )}
                      Apply code
                    </button>
                  </div>
                  {appliedReferralCode && (
                    <p className="mt-2 text-xs font-medium text-green-700">
                      Referral code {appliedReferralCode} applied to your free registration.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-maroon/45">
                    If the referral program is active, your referrer may earn points when your
                    membership is created.
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-maroon/50 font-bold mb-3">
                    Areas of interest
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => toggle(i)}
                        className={`px-4 py-2 rounded-full text-[11px] font-semibold border transition-colors ${
                          interests.includes(i)
                            ? "bg-maroon text-ivory border-maroon"
                            : "border-maroon/15 text-maroon/60 hover:border-gold"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-gold hover:text-maroon transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sending && <Loader2 className="size-4 animate-spin" />}
                  Join the Community
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center text-maroon/60 text-sm">
        <Loader2 className="size-7 animate-spin text-gold mx-auto mb-3" />
        Loading your account...
      </div>
    </div>
  );
}
