import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createPlan, getPlan, updatePlan } from "@/lib/memberships-api";
import type { MembershipPlan } from "@/lib/types";

const empty: Omit<MembershipPlan, "$id" | "$createdAt"> = {
  name: "",
  slug: "",
  meaning: "",
  price: 0,
  currency: "INR",
  duration: "yearly",
  features: [],
  status: "active",
  order: 0,
  tagline: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminMembershipForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Omit<MembershipPlan, "$id" | "$createdAt">>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getPlan(id!)
      .then((p) => {
        const { $id, $createdAt, ...rest } = p as any;
        setPlan(rest);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...plan,
        slug: plan.slug || slugify(plan.name),
        features: plan.features.filter((f) => f.trim().length > 0),
      };
      if (isNew) {
        const created = await createPlan(payload);
        toast.success("Plan created");
        navigate(`/admin/memberships/${created.$id}`);
      } else {
        await updatePlan(id!, payload);
        toast.success("Plan saved");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const setFeature = (i: number, v: string) => {
    const next = [...plan.features];
    next[i] = v;
    setPlan({ ...plan, features: next });
  };
  const addFeature = () => setPlan({ ...plan, features: [...plan.features, ""] });
  const removeFeature = (i: number) =>
    setPlan({ ...plan, features: plan.features.filter((_, idx) => idx !== i) });

  if (loading) return <div className="p-10 text-maroon/50">Loading…</div>;

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/memberships"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold mb-6"
      >
        <ArrowLeft size={14} /> Back to memberships
      </Link>
      <h1 className="font-display text-4xl text-maroon mb-8">{isNew ? "New plan" : "Edit plan"}</h1>

      <form onSubmit={onSubmit} className="bg-white border border-gold/10 rounded-xl p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Name" required>
            <input
              required
              className="input"
              value={plan.name}
              onChange={(e) =>
                setPlan({
                  ...plan,
                  name: e.target.value,
                  slug: plan.slug || slugify(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slug">
            <input
              className="input"
              value={plan.slug}
              onChange={(e) => setPlan({ ...plan, slug: slugify(e.target.value) })}
            />
          </Field>
          <Field label="Meaning" required>
            <input
              required
              className="input"
              value={plan.meaning}
              onChange={(e) => setPlan({ ...plan, meaning: e.target.value })}
            />
          </Field>
          <Field label="Tagline (optional badge)">
            <input
              className="input"
              placeholder="Most popular"
              value={plan.tagline || ""}
              onChange={(e) => setPlan({ ...plan, tagline: e.target.value })}
            />
          </Field>
          <Field label="Order (lower = first)">
            <input
              type="number"
              className="input"
              value={plan.order || 0}
              onChange={(e) => setPlan({ ...plan, order: Number(e.target.value) })}
            />
          </Field>

          <Field label="Price (₹)" required>
            <input
              type="number"
              min={0}
              required
              className="input"
              value={plan.price}
              onChange={(e) => setPlan({ ...plan, price: Number(e.target.value) })}
            />
          </Field>
          <Field label="Duration" required>
            <select
              className="input"
              value={plan.duration}
              onChange={(e) => setPlan({ ...plan, duration: e.target.value as any })}
            >
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </Field>

          <Field label="Status">
            <select
              className="input"
              value={plan.status}
              onChange={(e) => setPlan({ ...plan, status: e.target.value as any })}
            >
              <option value="active">Active</option>
              <option value="coming_soon">Coming soon</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Features</span>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-maroon hover:text-gold"
            >
              <Plus size={12} /> Add feature
            </button>
          </div>
          {plan.features.length === 0 && (
            <p className="text-xs text-maroon/40 py-2">No features yet.</p>
          )}
          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  value={f}
                  onChange={(e) => setFeature(i, e.target.value)}
                  placeholder="e.g. Priority listing on marketplace"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-maroon/50 hover:text-red-600 p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-maroon/10">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create plan" : "Save changes"}
          </button>
        </div>
      </form>

      <style>{`.input{border:1px solid rgba(180,13,74,0.15);border-radius:0.5rem;padding:0.65rem 0.85rem;font-size:0.875rem;width:100%;background:white;}
      .input:focus{outline:none;border-color:#c5a059;}`}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-maroon/60">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}
