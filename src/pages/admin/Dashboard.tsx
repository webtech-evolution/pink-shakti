import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listEvents, listRegistrations } from "@/lib/events-api";
import type { EventDoc, Registration } from "@/lib/types";
import { CalendarDays, Users, IndianRupee, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listEvents(), listRegistrations()])
      .then(([e, r]) => {
        setEvents(e);
        setRegs(r);
      })
      .catch((e) => setErr(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const paid = regs.filter((r) => r.paymentStatus === "paid");
  const revenue = paid.reduce((s, r) => s + (r.amount || 0), 0);

  const cards = [
    { label: "Events", value: events.length, icon: CalendarDays },
    { label: "Registrations", value: regs.length, icon: Users },
    { label: "Paid tickets", value: paid.length, icon: TrendingUp },
    { label: "Revenue (INR)", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-maroon">Dashboard</h1>
          <p className="text-maroon/50 text-sm mt-1">Overview of events and registrations</p>
        </div>
        <Link
          to="/admin/events/new"
          className="px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
        >
          + New event
        </Link>
      </div>

      {err && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-gold/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-maroon/40">
                {c.label}
              </span>
              <c.icon size={16} className="text-gold" />
            </div>
            <p className="font-display text-3xl text-maroon">
              {loading ? "…" : c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gold/10 rounded-xl p-6">
        <h2 className="font-display text-xl text-maroon mb-4">Recent registrations</h2>
        {regs.length === 0 && !loading ? (
          <p className="text-sm text-maroon/50">No registrations yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {regs.slice(0, 8).map((r) => (
                <tr key={r.$id} className="border-b border-maroon/5">
                  <td className="py-3">{r.fullName}</td>
                  <td className="text-maroon/60">{r.email}</td>
                  <td>{r.quantity}</td>
                  <td>₹{r.amount.toLocaleString("en-IN")}</td>
                  <td>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                        r.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : r.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.paymentStatus}
                    </span>
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
