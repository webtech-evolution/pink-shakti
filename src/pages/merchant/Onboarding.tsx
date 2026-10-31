import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { updateMerchant } from "@/lib/memberships-api";
import { ImageUploader } from "@/components/admin/ImageUploader";

/**
 * Post-payment onboarding form. The merchant record was created (status=pending_payment)
 * during checkout; here we collect business/bank/KYC details and flip to pending_review.
 */
export default function MerchantOnboarding() {
  const { merchant, user, refreshMerchant } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: merchant?.fullName || user?.name || "",
    phone: merchant?.phone || "",
    businessName: merchant?.businessName || "",
    gstNumber: merchant?.gstNumber || "",
    address: merchant?.address || "",
    city: merchant?.city || "",
    state: merchant?.state || "",
    pincode: merchant?.pincode || "",
    bankAccountName: merchant?.bankAccountName || "",
    bankAccountNumber: merchant?.bankAccountNumber || "",
    ifsc: merchant?.ifsc || "",
    kycDocUrl: merchant?.kycDocUrl || "",
  });

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
        <div className="max-w-md text-center bg-white p-10 rounded-2xl border border-gold/10">
          <h1 className="font-display text-2xl text-maroon mb-3">No membership yet</h1>
          <p className="text-sm text-maroon/60 mb-6">
            Choose a plan first to start your merchant onboarding.
          </p>
          <button onClick={() => navigate("/membership")}
            className="bg-maroon text-ivory rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon">
            View plans
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMerchant(merchant.$id, {
        ...form,
        status: "pending_review",
      });
      await refreshMerchant();
      toast.success("Onboarding submitted — our team will review within 24–48 hours.");
      navigate("/merchant");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory p-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Merchant onboarding</p>
        <h1 className="font-display text-4xl text-maroon">Let's set up your store</h1>
        <p className="text-maroon/60 text-sm mt-2">Step {step} of 3</p>

        <div className="flex gap-2 mt-4 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-gold" : "bg-maroon/10"}`} />
          ))}
        </div>

        <form onSubmit={submit} className="bg-white border border-gold/10 rounded-2xl p-8 space-y-5">
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl text-maroon">Business details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Contact name" required>
                  <input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </Field>
                <Field label="Phone" required>
                  <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Business name" required>
                  <input required className="input" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
                </Field>
                <Field label="GST number (optional)">
                  <input className="input" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Address" required>
                    <input required className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </Field>
                </div>
                <Field label="City" required>
                  <input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </Field>
                <Field label="State" required>
                  <input required className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </Field>
                <Field label="Pincode" required>
                  <input required className="input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-2xl text-maroon">Bank details</h2>
              <p className="text-xs text-maroon/50">Payouts will be sent to this account after commission.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Account holder name" required>
                    <input required className="input" value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} />
                  </Field>
                </div>
                <Field label="Account number" required>
                  <input required className="input" value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
                </Field>
                <Field label="IFSC" required>
                  <input required className="input" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-2xl text-maroon">KYC document</h2>
              <p className="text-xs text-maroon/50">
                Upload a scan of your PAN card, Aadhaar, or business license.
              </p>
              <ImageUploader
                label="KYC document"
                value={form.kycDocUrl}
                onChange={(url) => setForm({ ...form, kycDocUrl: url })}
                aspect="video"
              />
            </>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-maroon/10">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((s) => (s - 1) as any)}
                className="text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold">
                ← Back
              </button>
            ) : <span />}

            {step < 3 ? (
              <button type="button" onClick={() => setStep((s) => (s + 1) as any)}
                className="px-6 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon">
                Continue →
              </button>
            ) : (
              <button type="submit" disabled={saving}
                className="px-6 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon disabled:opacity-50">
                {saving ? "Submitting…" : "Submit for review"}
              </button>
            )}
          </div>
        </form>

        <style>{`.input{border:1px solid rgba(180,13,74,0.15);border-radius:0.5rem;padding:0.65rem 0.85rem;font-size:0.875rem;width:100%;background:white;}
        .input:focus{outline:none;border-color:#c5a059;}`}</style>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-maroon/60">{label}{required && " *"}</span>
      {children}
    </label>
  );
}
