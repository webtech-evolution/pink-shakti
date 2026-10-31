import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import {
  listSubscriptions,
  updateSubscription,
  deleteSubscription,
} from "@/lib/subscriptions-api";
import type { Subscription } from "@/lib/types";

const statuses: Subscription["status"][] = ["pending", "active", "expired", "cancelled"];

const badge = (s: string) =>
  s === "active" || s === "paid"
    ? "bg-green-100 text-green-700"
    : s === "pending"
      ? "bg-amber-100 text-amber-700"
      : s === "failed" || s === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

export default function AdminSubscriptions() {
  const [rows, setRows] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Subscription["status"]>("all");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    listSubscriptions()
      .then((r) => {
        setRows(r);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const totals = useMemo(() => {
    const active = rows.filter((r) => r.status === "active").length;
    const revenue = rows
      .filter((r) => r.paymentStatus === "paid")
      .reduce((s, r) => s + (r.amount || 0), 0);
    return { active, revenue, total: rows.length };
  }, [rows]);

  const setStatus = async (r: Subscription, status: Subscription["status"]) => {
    try {
      await updateSubscription(r.$id, { status });
      setRows((prev) => prev.map((x) => (x.$id === r.$id ? { ...x, status } : x)));
      toast.success("Subscription updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this subscription record?")) return;
    try {
      await deleteSubscription(id);
      setRows((prev) => prev.filter((x) => x.$id !== id));
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const exportCsv = () => {
    const head = [
      "Name",
      "Email",
      "Phone",
      "Plan",
      "Duration",
      "Amount",
      "Started",
      "Expires",
      "Status",
      "Payment",
    ];
    const lines = visible.map((r) =>
      [
        r.memberName,
        r.email,
        r.phone,
        r.planName,
        r.duration,
        r.amount,
        r.startedAt,
        r.expiresAt || "",
        r.status,
        r.paymentStatus,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subscriptions.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-maroon">Subscriptions</h1>
          <p className="text-maroon/50 text-sm mt-1">Members who joined a membership plan</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-3 border border-maroon/15 rounded-full text-[11px] uppercase tracking-widest text-maroon hover:border-gold"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Total subscriptions" value={String(totals.total)} />
        <Stat label="Active" value={String(totals.active)} />
        <Stat label="Collected" value={`₹${totals.revenue.toLocaleString("en-IN")}`} />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", ...statuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest ${
              filter === s ? "bg-maroon text-ivory" : "border border-maroon/15 text-maroon/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-maroon/50 text-sm">Loading…</div>
        ) : error ? (
          <div className="p-10 text-center text-sm">
            <p className="text-maroon/70 mb-2">Couldn't load subscriptions.</p>
            <p className="text-maroon/40 text-xs">{error}</p>
            <p className="text-maroon/40 text-xs mt-3">
              If the collection doesn't exist yet, create it using the Schema page.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center text-maroon/50 text-sm">No subscriptions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                  <th className="p-4">Member</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.$id} className="border-b border-maroon/5 hover:bg-ivory/40">
                    <td className="p-4">
                      <div className="font-semibold text-maroon">{r.memberName}</div>
                      <div className="text-[11px] text-maroon/40">{r.email}</div>
                      <div className="text-[11px] text-maroon/40">{r.phone}</div>
                    </td>
                    <td className="text-maroon/70">
                      {r.planName}
                      <div className="text-[11px] text-maroon/40">{r.duration}</div>
                    </td>
                    <td className="text-maroon/70">₹{(r.amount || 0).toLocaleString("en-IN")}</td>
                    <td className="text-maroon/60 text-[12px]">
                      {r.startedAt ? new Date(r.startedAt).toLocaleDateString("en-IN") : "—"}
                      {" → "}
                      {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-IN") : "Lifetime"}
                    </td>
                    <td>
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${badge(r.paymentStatus || r.status)}`}
                      >
                        {r.paymentStatus || (r.amount === 0 ? "free" : "—")}
                      </span>
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => setStatus(r, e.target.value as Subscription["status"])}
                        className="text-[11px] uppercase tracking-widest border border-maroon/15 rounded-full px-3 py-1.5 bg-white text-maroon"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-right pr-4">
                      <button
                        onClick={() => onDelete(r.$id)}
                        className="text-maroon/50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gold/10 rounded-xl p-6">
      <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">{label}</p>
      <p className="font-display text-3xl text-maroon">{value}</p>
    </div>
  );
}
