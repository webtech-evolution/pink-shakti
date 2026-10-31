import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listOrders, parseItems, setOrderStatus } from "@/lib/orders-api";
import { formatINR } from "@/lib/products-api";
import { downloadReceipt } from "@/lib/receipt";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["placed", "processing", "shipped", "delivered", "cancelled"];

export default function MerchantOrders() {
  const { merchant } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    listOrders({ merchantId: merchant.$id })
      .then(setOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [merchant?.$id]);

  const change = async (o: Order, status: OrderStatus) => {
    try {
      await setOrderStatus(o.$id, status);
      setOrders((prev) => prev.map((x) => (x.$id === o.$id ? { ...x, orderStatus: status } : x)));
      toast.success("Order updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!merchant) return null;

  return (
    <div>
      <h1 className="font-display text-3xl text-maroon mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-maroon/40" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gold/10 rounded-xl p-10 text-center">
          <ShoppingCart className="mx-auto text-maroon/30 mb-3" size={30} />
          <p className="font-display text-2xl text-maroon">No orders yet</p>
          <p className="text-sm text-maroon/50 mt-2">Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.$id} className="bg-white border border-gold/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-maroon">{o.orderNumber}</p>
                  <p className="text-xs text-maroon/50">
                    {o.$createdAt ? new Date(o.$createdAt).toLocaleString("en-IN") : ""} ·{" "}
                    {o.paymentStatus}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-maroon">{formatINR(o.total)}</span>
                  <button
                    onClick={() => downloadReceipt(o)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-maroon hover:border-gold"
                  >
                    <Download size={12} /> Receipt
                  </button>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => change(o, e.target.value as OrderStatus)}
                    className="rounded-full border border-maroon/15 px-4 py-2 text-xs text-maroon"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-maroon/70">
                {parseItems(o).map((it) => (
                  <p key={it.productId}>
                    {it.title} × {it.qty} — {formatINR(it.rate * it.qty)}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-xs text-maroon/50">
                {o.fullName} · {o.phone} · {o.email}
                <br />
                {o.address}, {o.city}, {o.state} — {o.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
