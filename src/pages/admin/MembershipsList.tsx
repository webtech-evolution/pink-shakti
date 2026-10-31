import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { listPlans, deletePlan, planDurationLabel } from "@/lib/memberships-api";
import type { MembershipPlan } from "@/lib/types";

export default function AdminMembershipsList() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    listPlans()
      .then(setPlans)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this community membership plan?")) return;
    try {
      await deletePlan(id);
      toast.success("Plan deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-maroon">Memberships</h1>
          <p className="text-maroon/50 text-sm mt-1">Community membership plans</p>
        </div>
        <Link
          to="/admin/memberships/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
        >
          <Plus size={14} /> New plan
        </Link>
      </div>

      <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-maroon/50 text-sm">Loading…</div>
        ) : plans.length === 0 ? (
          <div className="p-10 text-center text-maroon/50 text-sm">No plans yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                <th className="p-4">Name</th>
                <th>Price</th>
                <th>Meaning</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.$id} className="border-b border-maroon/5 hover:bg-ivory/40">
                  <td className="p-4">
                    <div className="font-semibold text-maroon">{p.name}</div>
                    <div className="text-[11px] text-maroon/40">{p.slug}</div>
                  </td>
                  <td className="text-maroon/70">
                    ₹{p.price.toLocaleString("en-IN")}
                    {planDurationLabel(p.duration)}
                  </td>
                  <td className="text-maroon/70">{p.meaning}</td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                        p.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status === "active" ? <Eye size={10} /> : <EyeOff size={10} />} {p.status}
                    </span>
                  </td>
                  <td className="text-right pr-4">
                    <div className="inline-flex items-center gap-3 text-maroon/60">
                      <Link
                        to={`/admin/memberships/${p.$id}`}
                        className="hover:text-gold"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => onDelete(p.$id)}
                        className="hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
