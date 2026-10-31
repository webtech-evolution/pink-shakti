import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { listOrders, parseItems } from "@/lib/orders-api";
import { formatINR } from "@/lib/products-api";
import { downloadReceipt } from "@/lib/receipt";
import type { Order } from "@/lib/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOrders({ limit: 200 })
      .then(setOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const rows = [
      ["Date", "Order", "Store", "Customer", "Email", "Phone", "State", "Total", "Payment", "Status"],
      ...orders.map((o) => [
        o.$createdAt || "",
        o.orderNumber,
        o.storeName,
        o.fullName,
        o.email,
        o.phone,
        o.state,
        String(o.total),
        o.paymentStatus,
        o.orderStatus,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4">
        <h1 className="font-display text-3xl text-maroon">Orders</h1>
        {orders.length > 0 && (
          <button
            onClick={exportCsv}
            className="px-5 py-2.5 rounded-full border border-maroon/20 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon hover:bg-maroon hover:text-ivory transition-colors"
          >
            Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-maroon/40" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gold/10 rounded-xl p-10 text-center text-maroon/60">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white border border-gold/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-maroon/5 text-maroon/60 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Store</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.$id} className="border-t border-maroon/5 text-maroon/80">
                  <td className="px-4 py-3">
                    {o.orderNumber}
                    <br />
                    <span className="text-xs text-maroon/40">
                      {o.$createdAt ? new Date(o.$createdAt).toLocaleDateString("en-IN") : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">{o.storeName}</td>
                  <td className="px-4 py-3">
                    {o.fullName}
                    <br />
                    <span className="text-xs text-maroon/40">
                      {o.city}, {o.state}
                    </span>
                  </td>
                  <td className="px-4 py-3">{parseItems(o).length}</td>
                  <td className="px-4 py-3">{formatINR(o.total)}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">{o.orderStatus}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => downloadReceipt(o)}
                      aria-label={`Download receipt for ${o.orderNumber}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-maroon hover:border-gold"
                    >
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
