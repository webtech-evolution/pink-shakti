import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { listPlans } from "@/lib/memberships-api";
import type { MembershipPlan } from "@/lib/types";
import {
  adjustReferralPoints,
  getReferralAdminOverview,
  saveReferralSettings,
  setReferralRedemptionStatus,
  type ReferralSettings,
  type ReferralAdminOverview,
} from "@/lib/referrals-api";

const emptySettings: ReferralSettings = {
  programEnabled: false,
  pointsEnabled: false,
  pointsPerPurchase: 0,
  pointsPlanIds: [],
  pointsByPlan: {},
  discountEnabled: false,
  discountType: "percent",
  discountValue: 0,
  maxDiscount: 0,
  eligiblePlanIds: [],
  minimumPurchase: 0,
  validFrom: "",
  validUntil: "",
  allowStacking: false,
  discountUseLimit: 1,
  refundPolicy: "reverse",
  redemptionsEnabled: false,
  redemptionPoints: 0,
  redemptionDiscount: 0,
  redemptionExpiryDays: 30,
};

export default function ReferralRewardsAdmin() {
  const [settings, setSettings] = useState<ReferralSettings>(emptySettings);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [data, setData] = useState<ReferralAdminOverview>({
    settings: emptySettings,
    referrals: [],
    transactions: [],
    redemptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const [overview, nextPlans] = await Promise.all([
        getReferralAdminOverview(),
        listPlans(),
      ]);
      const visiblePlans = nextPlans.filter((plan) => plan.status !== "hidden");
      const pointsByPlan = { ...overview.settings.pointsByPlan };
      for (const plan of visiblePlans) {
        if (!Object.hasOwn(pointsByPlan, plan.$id)) {
          const legacyEligible =
            plan.price > 0 &&
            overview.settings.pointsPerPurchase > 0 &&
            (!overview.settings.pointsPlanIds.length ||
              overview.settings.pointsPlanIds.includes(plan.$id));
          pointsByPlan[plan.$id] = legacyEligible ? overview.settings.pointsPerPurchase : 0;
        }
      }
      setSettings({ ...overview.settings, pointsByPlan });
      setData(overview);
      setPlans(visiblePlans);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load referral management.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      setSettings(await saveReferralSettings({
        ...settings,
        pointsPerPurchase: 0,
        pointsPlanIds: [],
      }));
      toast.success("Referral settings saved.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save referral settings.");
    } finally {
      setSaving(false);
    }
  };

  const adjustPoints = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await adjustReferralPoints(memberId.trim(), Number(adjustment), reason.trim());
      setAdjustment("");
      setReason("");
      toast.success("Points adjustment recorded.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not record points adjustment.");
    }
  };

  const updateRedemption = async (id: string) => {
    const reason = window.prompt("Reason for cancelling this reward?");
    if (!reason?.trim()) return;
    try {
      await setReferralRedemptionStatus(id, "cancelled", reason.trim());
      toast.success("Redemption cancelled and points returned.");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update redemption.");
    }
  };

  const togglePlan = (key: "eligiblePlanIds" | "pointsPlanIds", id: string) => {
    setSettings((current) => ({
      ...current,
      [key]: current[key].includes(id)
        ? current[key].filter((planId) => planId !== id)
        : [...current[key], id],
    }));
  };

  const field =
    "w-full rounded-lg border border-maroon/15 bg-white px-3 py-2.5 text-sm text-maroon focus:outline-none focus:border-gold";

  return (
    <div className="max-w-6xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">
        Membership referrals
      </p>
      <h1 className="font-display text-4xl text-maroon">Referral & rewards</h1>
      <p className="mt-2 mb-8 text-sm text-maroon/60">
        Configure member-only discounts and points. Values are disabled until explicitly enabled.
      </p>

      {loading ? (
        <div className="flex items-center gap-3 py-12 text-sm text-maroon/60">
          <Loader2 className="size-5 animate-spin" /> Loading referral records...
        </div>
      ) : (
        <>
          <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            <Stat label="Membership referrals" value={data.referrals.length} />
            <Stat
              label="Qualified purchases"
              value={data.referrals.filter((item) => item.status === "qualified").length}
            />
            <Stat
              label="Points credited"
              value={data.transactions
                .filter((item) => item.type === "credit" && item.status === "posted")
                .reduce((sum, item) => sum + Number(item.points || 0), 0)}
            />
            <Stat
              label="Referral discounts (INR)"
              value={data.referrals
                .filter((item) => item.status === "qualified" || item.status === "refunded")
                .reduce((sum, item) => sum + Number(item.discountAmount || 0), 0)}
            />
            <Stat
              label="Points redeemed"
              value={data.redemptions
                .filter((item) => item.status === "redeemed")
                .reduce((sum, item) => sum + Number(item.points || 0), 0)}
            />
            <Stat label="Bazaar redemptions" value={data.redemptions.length} />
          </section>

          <form onSubmit={save} className="space-y-8">
            <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8">
              <h2 className="font-display text-2xl text-maroon mb-5">Program & membership discounts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <CheckField
                  label="Enable referral program"
                  checked={settings.programEnabled}
                  onChange={(programEnabled) => setSettings({ ...settings, programEnabled })}
                />
                <CheckField
                  label="Enable membership discounts"
                  checked={settings.discountEnabled}
                  onChange={(discountEnabled) => setSettings({ ...settings, discountEnabled })}
                />
                <CheckField
                  label="Allow stacking with other offers"
                  checked={settings.allowStacking}
                  onChange={(allowStacking) => setSettings({ ...settings, allowStacking })}
                />
                <Field label="Discount type">
                  <select
                    className={field}
                    value={settings.discountType}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        discountType: event.target.value as ReferralSettings["discountType"],
                      })
                    }
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed amount (INR)</option>
                  </select>
                </Field>
                <Field label="Discount value">
                  <input
                    required
                    min="0"
                    max={settings.discountType === "percent" ? 100 : undefined}
                    type="number"
                    className={field}
                    value={settings.discountValue}
                    onChange={(event) =>
                      setSettings({ ...settings, discountValue: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Maximum percentage discount (INR; 0 = uncapped)">
                  <input
                    min="0"
                    type="number"
                    className={field}
                    value={settings.maxDiscount}
                    onChange={(event) =>
                      setSettings({ ...settings, maxDiscount: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Minimum eligible purchase (INR)">
                  <input
                    min="0"
                    type="number"
                    className={field}
                    value={settings.minimumPurchase}
                    onChange={(event) =>
                      setSettings({ ...settings, minimumPurchase: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Use limit per referred member (0 = unlimited)">
                  <input
                    min="0"
                    type="number"
                    className={field}
                    value={settings.discountUseLimit}
                    onChange={(event) =>
                      setSettings({ ...settings, discountUseLimit: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Offer starts (optional)">
                  <input
                    type="datetime-local"
                    className={field}
                    value={settings.validFrom ? settings.validFrom.slice(0, 16) : ""}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        validFrom: event.target.value ? new Date(event.target.value).toISOString() : "",
                      })
                    }
                  />
                </Field>
                <Field label="Offer ends (optional)">
                  <input
                    type="datetime-local"
                    className={field}
                    value={settings.validUntil ? settings.validUntil.slice(0, 16) : ""}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        validUntil: event.target.value
                          ? new Date(event.target.value).toISOString()
                          : "",
                      })
                    }
                  />
                </Field>
                <Field label="Refund / cancellation policy">
                  <select
                    className={field}
                    value={settings.refundPolicy}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        refundPolicy: event.target.value as ReferralSettings["refundPolicy"],
                      })
                    }
                  >
                    <option value="reverse">Reverse reward points</option>
                    <option value="retain">Retain awarded points</option>
                  </select>
                </Field>
              </div>
              <PlanChoices
                label="Plans eligible for a discount (none selected means all paid plans)"
                plans={plans}
                selected={settings.eligiblePlanIds}
                onToggle={(id) => togglePlan("eligiblePlanIds", id)}
              />
            </section>

            <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8">
              <h2 className="font-display text-2xl text-maroon mb-5">Referral points</h2>
              <CheckField
                label="Enable referral points"
                checked={settings.pointsEnabled}
                onChange={(pointsEnabled) => setSettings({ ...settings, pointsEnabled })}
              />
              <fieldset className="mt-6">
                <legend className="text-xs font-semibold text-maroon/60 mb-3">
                  Points awarded for each referred subscription (set 0 to disable a plan)
                </legend>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const legacyEligible =
                      plan.price > 0 &&
                      settings.pointsPerPurchase > 0 &&
                      (!settings.pointsPlanIds.length ||
                        settings.pointsPlanIds.includes(plan.$id));
                    const points = settings.pointsByPlan[plan.$id] ?? (
                      legacyEligible ? settings.pointsPerPurchase : 0
                    );
                    return (
                      <Field key={plan.$id} label={`${plan.name}${plan.price === 0 ? " (free)" : ""}`}>
                        <input
                          min="0"
                          type="number"
                          className={field}
                          value={points}
                          onChange={(event) =>
                            setSettings((current) => ({
                              ...current,
                              pointsByPlan: {
                                ...current.pointsByPlan,
                                [plan.$id]: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </Field>
                    );
                  })}
                  {!plans.length && (
                    <p className="text-xs text-maroon/50">
                      No membership plans found. Add plans before configuring referral points.
                    </p>
                  )}
                </div>
              </fieldset>
              <p className="text-xs text-maroon/50 mt-3">
                Points are awarded once when a referred member gets that plan. Free Aarambh
                registrations qualify too. The referral code must be used during registration.
              </p>
            </section>

            <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8">
              <h2 className="font-display text-2xl text-maroon mb-5">Sakhi Bazaar redemption</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <CheckField
                  label="Enable Bazaar redemptions"
                  checked={settings.redemptionsEnabled}
                  onChange={(redemptionsEnabled) => setSettings({ ...settings, redemptionsEnabled })}
                />
                <Field label="Points per redemption">
                  <input
                    min="0"
                    type="number"
                    className={field}
                    value={settings.redemptionPoints}
                    onChange={(event) =>
                      setSettings({ ...settings, redemptionPoints: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Discount value (INR)">
                  <input
                    min="0"
                    type="number"
                    className={field}
                    value={settings.redemptionDiscount}
                    onChange={(event) =>
                      setSettings({ ...settings, redemptionDiscount: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Token validity (days)">
                  <input
                    min="1"
                    max="365"
                    type="number"
                    className={field}
                    value={settings.redemptionExpiryDays}
                    onChange={(event) =>
                      setSettings({ ...settings, redemptionExpiryDays: Number(event.target.value) })
                    }
                  />
                </Field>
              </div>
              <p className="text-xs text-maroon/50 mt-4">
                Redemption codes are issued and points reserved here. They cannot be consumed at Bazaar
                checkout until that separate checkout is integrated with the Appwrite function.
              </p>
            </section>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-maroon px-7 py-3 text-xs font-bold uppercase tracking-widest text-ivory hover:bg-gold hover:text-maroon disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save settings
            </button>
          </form>

          <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8 mt-8">
            <h2 className="font-display text-2xl text-maroon mb-5">Manual points adjustment</h2>
            <form onSubmit={adjustPoints} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                required
                className={field}
                placeholder="Member document ID"
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
              />
              <input
                required
                type="number"
                className={field}
                placeholder="Points (+/-)"
                value={adjustment}
                onChange={(event) => setAdjustment(event.target.value)}
              />
              <input
                required
                minLength={5}
                className={field}
                placeholder="Reason (required)"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
              <button className="rounded-full bg-maroon px-5 py-3 text-xs font-bold uppercase tracking-widest text-ivory hover:bg-gold hover:text-maroon">
                Record adjustment
              </button>
            </form>
          </section>

          <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8 mt-8 overflow-x-auto">
            <h2 className="font-display text-2xl text-maroon mb-5">Recent membership referrals</h2>
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-xs text-maroon/50">
                <tr>
                  <th className="p-3">Referral code</th>
                  <th className="p-3">Referrer</th>
                  <th className="p-3">Referred member</th>
                  <th className="p-3">Membership order</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Points</th>
                </tr>
              </thead>
              <tbody>
                {data.referrals.map((item) => (
                  <tr key={String(item.$id)} className="border-t border-maroon/5">
                    <td className="p-3">{String(item.referralCode || "—")}</td>
                    <td className="p-3">{String(item.referrerMemberId || "—")}</td>
                    <td className="p-3">{String(item.referredMemberId || "—")}</td>
                    <td className="p-3">{String(item.membershipOrderId || "—")}</td>
                    <td className="p-3">{String(item.planName || "—")}</td>
                    <td className="p-3">{String(item.status || "—")}</td>
                    <td className="p-3">{Number(item.pointsAwarded || 0)}</td>
                  </tr>
                ))}
                {!data.referrals.length && (
                  <tr><td className="p-3 text-maroon/50" colSpan={7}>No referrals yet.</td></tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8 mt-8 overflow-x-auto">
            <h2 className="font-display text-2xl text-maroon mb-5">Sakhi Bazaar redemption codes</h2>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="text-xs text-maroon/50">
                <tr>
                  <th className="p-3">Token</th>
                  <th className="p-3">Member</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.redemptions.map((item) => (
                  <tr key={String(item.$id)} className="border-t border-maroon/5">
                    <td className="p-3 font-mono">{String(item.token || "—")}</td>
                    <td className="p-3">{String(item.memberId || "—")}</td>
                    <td className="p-3">{Number(item.points || 0)}</td>
                    <td className="p-3">₹{Number(item.discount || 0).toLocaleString("en-IN")}</td>
                    <td className="p-3">{String(item.status || "—")}</td>
                    <td className="p-3">
                      {item.status === "issued" && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => void updateRedemption(String(item.$id))}
                            className="text-xs font-semibold text-red-700"
                          >
                            Cancel & return points
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!data.redemptions.length && (
                  <tr><td className="p-3 text-maroon/50" colSpan={6}>No Bazaar redemptions yet.</td></tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="bg-white border border-gold/15 rounded-2xl p-5 sm:p-8 mt-8 overflow-x-auto">
            <h2 className="font-display text-2xl text-maroon mb-5">Points ledger</h2>
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="text-xs text-maroon/50">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.filter((item) => item.type !== "lock").map((item) => (
                  <tr key={String(item.$id)} className="border-t border-maroon/5">
                    <td className="p-3">{String(item.memberId || "—")}</td>
                    <td className="p-3">{String(item.type || "—")}</td>
                    <td className="p-3">{Number(item.points || 0)}</td>
                    <td className="p-3">{String(item.membershipOrderId || item.redemptionId || "—")}</td>
                    <td className="p-3">{String(item.description || "—")}</td>
                  </tr>
                ))}
                {!data.transactions.some((item) => item.type !== "lock") && (
                  <tr><td className="p-3 text-maroon/50" colSpan={5}>No points activity yet.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gold/15 bg-white p-5">
      <p className="text-xs text-maroon/50">{label}</p>
      <p className="font-display text-3xl text-maroon mt-2">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold text-maroon/60">
      {label}
      {children}
    </label>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-maroon">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-[#5b0b2b]"
      />
      {label}
    </label>
  );
}

function PlanChoices({
  label,
  plans,
  selected,
  onToggle,
}: {
  label: string;
  plans: MembershipPlan[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-xs font-semibold text-maroon/60 mb-3">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {plans.filter((plan) => plan.price > 0).map((plan) => (
          <label key={plan.$id} className="inline-flex items-center gap-2 rounded-full border border-maroon/10 px-3 py-2 text-xs text-maroon">
            <input
              type="checkbox"
              checked={selected.includes(plan.$id)}
              onChange={() => onToggle(plan.$id)}
              className="accent-[#5b0b2b]"
            />
            {plan.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
