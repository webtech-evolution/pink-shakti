import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listRegistrations, listEvents } from "@/lib/events-api";
import type { EventDoc, Registration } from "@/lib/types";
import { toast } from "sonner";

export default function AdminRegistrations() {
  const [params, setParams] = useSearchParams();
  const eventId = params.get("event") || "";
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEvents().then(setEvents).catch((e) => toast.error(e.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    listRegistrations(eventId || undefined)
      .then(setRegs)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  const eventMap = Object.fromEntries(events.map((e) => [e.$id, e]));

  const exportCsv = () => {
    const rows = [
      ["Date", "Event", "Name", "Email", "Phone", "Quantity", "Amount", "Status", "Payment ID"],
      ...regs.map((r) => [
        r.$createdAt || "",
        eventMap[r.eventId]?.title || r.eventId,
        r.fullName,
        r.email,
        r.phone,
        String(r.quantity),
        String(r.amount),
        r.paymentStatus,
        r.razorpayPaymentId || "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl text-maroon">Registrations</h1>
          <p className="text-maroon/50 text-sm mt-1">All ticket purchases and RSVPs</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={eventId}
            onChange={(e) =>
              setParams(e.target.value ? { event: e.target.value } : {})
            }
            className="border border-maroon/15 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All events</option>
            {events.map((e) => (
              <option key={e.$id} value={e.$id}>
                {e.title}
              </option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="px-4 py-2 border border-maroon/20 rounded-full text-[11px] uppercase tracking-widest text-maroon hover:bg-maroon hover:text-ivory transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-maroon/50">Loading…</div>
        ) : regs.length === 0 ? (
          <div className="p-10 text-center text-maroon/50">No registrations.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                <th className="p-4">Date</th>
                <th>Event</th>
                <th>Attendee</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r.$id} className="border-b border-maroon/5">
                  <td className="p-4 text-maroon/60 text-xs">
                    {r.$createdAt
                      ? new Date(r.$createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                  <td className="text-maroon/80">{eventMap[r.eventId]?.title || "—"}</td>
                  <td>
                    <div className="font-semibold text-maroon">{r.fullName}</div>
                    <div className="text-[11px] text-maroon/50">{r.email}</div>
                    <div className="text-[11px] text-maroon/50">{r.phone}</div>
                  </td>
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
                  <td className="text-[10px] text-maroon/50 font-mono">
                    {r.razorpayPaymentId || "—"}
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
