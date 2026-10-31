import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Download, Loader2, Package, RefreshCw, Search, Trash2 } from "lucide-react";
import { parseItems } from "@/lib/orders-api";
import { formatINR } from "@/lib/products-api";
import { downloadReceipt } from "@/lib/receipt";
import {
  forgetOrder,
  listTrackedOrders,
  lookupOrdersByEmail,
  refreshTrackedOrders,
  type TrackedOrder,
} from "@/lib/guest-orders";
import { usePageMeta } from "@/lib/use-page-meta";

const statusTone: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<TrackedOrder[]>(() => listTrackedOrders());
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState("");
  const [looking, setLooking] = useState(false);

  usePageMeta(
    "Track My Orders | PINK SHAKTI 360°",
    "Track your Pink Shakti marketplace orders, view order history and download receipts.",
  );

  useEffect(() => {
    let alive = true;
    setRefreshing(true);
    refreshTrackedOrders()
      .then((list) => alive && setOrders(list))
      .catch(() => {})
      .finally(() => alive && setRefreshing(false));
    return () => {
      alive = false;
    };
  }, []);

  const manualRefresh = async () => {
    setRefreshing(true);
    try {
      setOrders(await refreshTrackedOrders());
      toast.success("Order status updated");
    } finally {
      setRefreshing(false);
    }
  };

  const lookup = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLooking(true);
    try {
      const found = await lookupOrdersByEmail(email);
      setOrders(listTrackedOrders());
      toast[found.length ? "success" : "error"](
        found.length ? `Recovered ${found.length} order(s)` : "No orders found for that email",
      );
    } catch (err: any) {
      toast.error(err?.message || "Lookup failed");
    } finally {
      setLooking(false);
    }
  };

  const remove = (id: string) => {
    forgetOrder(id);
    setOrders(listTrackedOrders());
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="max-w-4xl mx-auto px-6 pt-28 lg:pt-32">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-3">
          Order tracking
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl lg:text-5xl text-maroon leading-tight">My orders</h1>
          <button
            onClick={manualRefresh}
            disabled={refreshing || orders.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-maroon/20 text-[10px] font-bold uppercase tracking-[0.2em] text-maroon hover:border-gold disabled:opacity-40"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh status
          </button>
        </div>

        <form
          onSubmit={lookup}
          className="mt-8 bg-white border border-gold/15 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-maroon/50 mb-1.5">
              Placed an order on another device? Find it by email
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-maroon focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={looking}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-maroon text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon disabled:opacity-50"
          >
            {looking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Find
          </button>
        </form>

        {orders.length === 0 ? (
          <div className="bg-white border border-gold/15 rounded-2xl p-12 text-center mt-8">
            <Package className="mx-auto text-maroon/25 mb-3" size={32} />
            <p className="font-display text-2xl text-maroon">No orders tracked yet</p>
            <p className="text-sm text-maroon/50 mt-2">
              Orders you place are saved on this device so you can track them anytime.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 px-7 py-3 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            {orders.map(({ snapshot: o, id }) => (
              <div key={id} className="bg-white border border-gold/15 rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl text-maroon">{o.orderNumber}</p>
                    <p className="text-xs text-maroon/50 mt-0.5">
                      {o.$createdAt ? new Date(o.$createdAt).toLocaleString("en-IN") : ""} ·{" "}
                      {o.storeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        statusTone[o.orderStatus] || "bg-maroon/10 text-maroon"
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold/15 text-maroon">
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  {parseItems(o).map((it) => (
                    <div key={it.productId} className="flex justify-between text-sm text-maroon/70">
                      <span className="truncate pr-3">
                        {it.title} × {it.qty}
                      </span>
                      <span>{formatINR(it.rate * it.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-maroon/10 mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-maroon/60">
                    Total paid{" "}
                    <strong className="font-display text-lg text-maroon">
                      {formatINR(o.total)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/order/${id}`}
                      state={{ order: o }}
                      className="px-4 py-2 rounded-full border border-maroon/20 text-[10px] font-bold uppercase tracking-[0.2em] text-maroon hover:border-gold"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => downloadReceipt(o)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maroon text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
                    >
                      <Download size={12} /> Receipt
                    </button>
                    <button
                      onClick={() => remove(id)}
                      aria-label="Remove from this device"
                      className="p-2 text-maroon/35 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-maroon/45 mt-3">
                  Shipping to: {o.address}, {o.city}, {o.state} — {o.pincode}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
