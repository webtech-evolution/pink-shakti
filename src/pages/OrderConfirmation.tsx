import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Download, Loader2, Package } from "lucide-react";
import { getOrder, parseItems } from "@/lib/orders-api";
import { formatINR } from "@/lib/products-api";
import type { Order } from "@/lib/types";
import { downloadReceipt } from "@/lib/receipt";
import { rememberOrders } from "@/lib/guest-orders";
import { usePageMeta } from "@/lib/use-page-meta";

export default function OrderConfirmationPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const passed = (location.state as { order?: Order } | null)?.order ?? null;
  const [order, setOrder] = useState<Order | null>(passed);
  const [loading, setLoading] = useState(!passed);

  usePageMeta(
    "Order Confirmed | PINK SHAKTI 360°",
    "Your Pink Shakti marketplace order has been placed successfully.",
  );

  useEffect(() => {
    if (passed) rememberOrders([passed]);
  }, [passed]);

  useEffect(() => {
    if (!id || passed) return;
    let active = true;
    getOrder(id)
      .then((o) => {
        if (!active) return;
        setOrder(o);
        rememberOrders([o]);
      })
      .catch((err) => {
        console.error("Failed to load order", id, err);
        if (active) setOrder(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, passed]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-maroon/40" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl text-maroon mb-3">Order not found</h1>
          <Link to="/shop" className="text-gold text-sm uppercase tracking-widest">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  // Keep the guest history in sync whenever this page renders a fresh order.
  const items = parseItems(order);

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="max-w-2xl mx-auto px-6 pt-16 text-center">
        <CheckCircle2 className="mx-auto text-gold mb-4" size={44} />
        <h1 className="font-display text-4xl text-maroon">Thank you!</h1>
        <p className="text-maroon/60 mt-3 text-sm">
          Order <strong className="text-maroon">{order.orderNumber}</strong> is confirmed. A
          confirmation has been recorded for {order.email}.
        </p>

        <div className="bg-white border border-gold/15 rounded-2xl p-6 mt-8 text-left">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-3">
            {order.storeName}
          </p>
          {items.map((it) => (
            <div key={it.productId} className="flex justify-between text-sm text-maroon/70 py-1">
              <span>
                {it.title} × {it.qty}
              </span>
              <span>{formatINR(it.rate * it.qty)}</span>
            </div>
          ))}
          <div className="border-t border-maroon/10 mt-3 pt-3 flex justify-between text-sm text-maroon/70">
            <span>Delivery</span>
            <span>{formatINR(order.deliveryCharge)}</span>
          </div>
          <div className="flex justify-between font-display text-xl text-maroon mt-2">
            <span>Total paid</span>
            <span>{formatINR(order.total)}</span>
          </div>
          <p className="text-xs text-maroon/50 mt-4 flex items-center gap-2">
            <Package size={13} /> Status: {order.orderStatus} · Payment: {order.paymentStatus}
          </p>
          <p className="text-xs text-maroon/50 mt-3">
            Shipping to: {order.address}, {order.city}, {order.state} — {order.pincode}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={() => downloadReceipt(order)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
          >
            <Download size={14} /> Download receipt
          </button>
          <Link
            to="/my-orders"
            className="px-7 py-3 rounded-full border border-maroon/20 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] hover:border-gold"
          >
            Track my orders
          </Link>
          <Link
            to="/shop"
            className="px-7 py-3 rounded-full border border-maroon/20 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] hover:border-gold"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
