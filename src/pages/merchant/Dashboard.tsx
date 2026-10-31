import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { countMerchantProducts, formatINR } from "@/lib/products-api";
import { listOrders, parseItems } from "@/lib/orders-api";
import type { Order } from "@/lib/types";
import type { MerchantStatus } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Package,
  Store,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

const statusStyles: Record<
  MerchantStatus,
  { color: string; icon: any; label: string; message: string }
> = {
  pending_payment: {
    color: "text-yellow-700 bg-yellow-100",
    icon: Clock,
    label: "Pending payment",
    message: "Complete your membership payment to continue.",
  },
  pending_onboarding: {
    color: "text-amber-700 bg-amber-100",
    icon: Clock,
    label: "Payment received",
    message: "Your membership payment is confirmed. Complete your onboarding details next.",
  },
  pending_review: {
    color: "text-blue-700 bg-blue-100",
    icon: Clock,
    label: "Under review",
    message: "Our team is reviewing your onboarding. This usually takes 24–48 hours.",
  },
  approved: {
    color: "text-green-700 bg-green-100",
    icon: CheckCircle2,
    label: "Approved",
    message: "Your store is live. Start adding products.",
  },
  rejected: {
    color: "text-red-700 bg-red-100",
    icon: XCircle,
    label: "Rejected",
    message: "Please contact support to resolve.",
  },
  suspended: {
    color: "text-gray-700 bg-gray-100",
    icon: AlertCircle,
    label: "Suspended",
    message: "Your store is temporarily suspended.",
  },
};

interface Analytics {
  orderCount: number;
  paidCount: number;
  revenue: number;
  payout: number;
  commission: number;
  unitsSold: number;
  aov: number;
  last30Revenue: number;
  prev30Revenue: number;
  statusCounts: Record<string, number>;
  topProducts: { title: string; qty: number; revenue: number }[];
  daily: { label: string; value: number }[];
  recent: Order[];
}

function buildAnalytics(orders: Order[]): Analytics {
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const live = orders.filter((o) => o.orderStatus !== "cancelled");
  const revenue = live.reduce((n, o) => n + (o.total || 0), 0);
  const payout = live.reduce(
    (n, o) => n + (o.payoutAmount ?? (o.subtotal || 0) + (o.deliveryCharge || 0)),
    0,
  );
  const commission = live.reduce((n, o) => n + (o.commissionAmount || 0), 0);

  const now = Date.now();
  const day = 86_400_000;
  const at = (o: Order) => (o.$createdAt ? new Date(o.$createdAt).getTime() : now);
  const last30Revenue = live
    .filter((o) => now - at(o) <= 30 * day)
    .reduce((n, o) => n + o.total, 0);
  const prev30Revenue = live
    .filter((o) => now - at(o) > 30 * day && now - at(o) <= 60 * day)
    .reduce((n, o) => n + o.total, 0);

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });

  const productMap = new Map<string, { title: string; qty: number; revenue: number }>();
  let unitsSold = 0;
  live.forEach((o) =>
    parseItems(o).forEach((it) => {
      unitsSold += it.qty;
      const key = it.productId || it.title;
      const prev = productMap.get(key) || { title: it.title, qty: 0, revenue: 0 };
      productMap.set(key, {
        title: it.title,
        qty: prev.qty + it.qty,
        revenue: prev.revenue + it.rate * it.qty,
      });
    }),
  );

  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * day);
    const key = d.toDateString();
    const value = live
      .filter((o) => new Date(at(o)).toDateString() === key)
      .reduce((n, o) => n + o.total, 0);
    return { label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), value };
  });

  return {
    orderCount: orders.length,
    paidCount: paid.length,
    revenue,
    payout,
    commission,
    unitsSold,
    aov: live.length ? Math.round(revenue / live.length) : 0,
    last30Revenue,
    prev30Revenue,
    statusCounts,
    topProducts: Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    daily,
    recent: orders.slice(0, 5),
  };
}

const STATUS_LABELS = ["placed", "processing", "shipped", "delivered", "cancelled"] as const;

export default function MerchantDashboard() {
  const { merchant } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (merchant?.$id)
      countMerchantProducts(merchant.$id)
        .then(setProductCount)
        .catch(() => setProductCount(null));
  }, [merchant?.$id]);

  useEffect(() => {
    if (!merchant?.$id) return;
    listOrders({ merchantId: merchant.$id, limit: 200 })
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [merchant?.$id]);

  if (!merchant) return null;
  const s = statusStyles[merchant.status];
  const a = orders ? buildAnalytics(orders) : null;
  const growth =
    a && a.prev30Revenue > 0
      ? Math.round(((a.last30Revenue - a.prev30Revenue) / a.prev30Revenue) * 100)
      : null;
  const peak = a ? Math.max(1, ...a.daily.map((d) => d.value)) : 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-maroon">
          Welcome, {merchant.fullName || merchant.email}
        </h1>
        <p className="text-maroon/50 text-sm mt-1">
          {merchant.businessName || "Merchant dashboard"}
        </p>
      </div>

      <div
        className={`rounded-xl p-5 mb-6 border border-current/10 ${s.color} flex items-start gap-3`}
      >
        <s.icon size={20} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">{s.label}</p>
          <p className="text-xs mt-1 opacity-80">{s.message}</p>
          {merchant.status === "rejected" && merchant.rejectionReason && (
            <p className="text-xs mt-2 italic">Reason: {merchant.rejectionReason}</p>
          )}
          {merchant.status === "pending_onboarding" && (
            <Link
              to="/merchant/onboarding"
              className="inline-block mt-3 px-4 py-2 bg-maroon text-ivory rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
            >
              Complete onboarding
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gold/10 rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Billing</p>
          <p className="font-display text-2xl text-maroon">Monthly</p>
          <p className="text-xs text-maroon/50 mt-1">Based on sales volume</p>
        </div>
        <div className="bg-white border border-gold/10 rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Product limit</p>
          <p className="font-display text-2xl text-maroon">Unlimited</p>
        </div>
        <div className="bg-white border border-gold/10 rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Products live</p>
          <p className="font-display text-2xl text-maroon">{productCount ?? "—"}</p>
        </div>
        <div className="bg-white border border-gold/10 rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Commission</p>
          <p className="font-display text-2xl text-maroon">
            {a ? formatINR(a.last30Revenue) : "—"}
          </p>
          <p className="text-xs text-maroon/50 mt-1">Last 30 days sales</p>
        </div>
      </div>

      {a && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              {
                label: "Gross sales",
                value: formatINR(a.revenue),
                sub: `${a.orderCount} order${a.orderCount === 1 ? "" : "s"} · ${a.paidCount} paid`,
                icon: IndianRupee,
              },
              {
                label: "Your payout",
                value: formatINR(a.payout),
                sub: `Commission retained ${formatINR(a.commission)}`,
                icon: Wallet,
              },
              {
                label: "Average order value",
                value: formatINR(a.aov),
                sub: `${a.unitsSold} unit${a.unitsSold === 1 ? "" : "s"} sold`,
                icon: ShoppingCart,
              },
              {
                label: "Last 30 days",
                value: formatINR(a.last30Revenue),
                sub:
                  growth === null
                    ? "No prior period to compare"
                    : `${growth >= 0 ? "+" : ""}${growth}% vs previous 30 days`,
                icon: TrendingUp,
              },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-gold/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-maroon/40">
                    {card.label}
                  </p>
                  <card.icon size={15} className="text-gold" />
                </div>
                <p className="font-display text-2xl text-maroon">{card.value}</p>
                <p className="text-xs text-maroon/50 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-white border border-gold/10 rounded-xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-5">
                Sales · last 14 days
              </p>
              <div className="flex items-end gap-1.5 h-40">
                {a.daily.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                  >
                    <span className="text-[9px] text-maroon/50 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.value ? formatINR(d.value) : ""}
                    </span>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-maroon to-gold/70 min-h-[2px]"
                      style={{ height: `${(d.value / peak) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-maroon/40 mt-2">
                <span>{a.daily[0]?.label}</span>
                <span>{a.daily[a.daily.length - 1]?.label}</span>
              </div>
            </div>

            <div className="bg-white border border-gold/10 rounded-xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-4">
                Fulfilment status
              </p>
              <div className="space-y-2.5">
                {STATUS_LABELS.map((st) => {
                  const n = a.statusCounts[st] || 0;
                  const pct = a.orderCount ? (n / a.orderCount) * 100 : 0;
                  return (
                    <div key={st}>
                      <div className="flex justify-between text-xs text-maroon/60 capitalize">
                        <span>{st}</span>
                        <span>{n}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-maroon/5 mt-1">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-gold/10 rounded-xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-4">
                Best selling products
              </p>
              {a.topProducts.length === 0 ? (
                <p className="text-sm text-maroon/45">No sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {a.topProducts.map((p) => (
                    <div key={p.title} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-maroon/75 truncate">{p.title}</span>
                      <span className="text-maroon/50 whitespace-nowrap text-xs">
                        {p.qty} sold · {formatINR(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gold/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-widest text-maroon/40">
                  Recent orders
                </p>
                <Link
                  to="/merchant/orders"
                  className="text-[10px] uppercase tracking-widest text-gold"
                >
                  View all
                </Link>
              </div>
              {a.recent.length === 0 ? (
                <p className="text-sm text-maroon/45">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {a.recent.map((o) => (
                    <div key={o.$id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-maroon/75">
                        {o.orderNumber}
                        <span className="block text-[11px] text-maroon/40">
                          {o.$createdAt ? new Date(o.$createdAt).toLocaleDateString("en-IN") : ""} ·{" "}
                          {o.orderStatus}
                        </span>
                      </span>
                      <span className="text-maroon/70 whitespace-nowrap">{formatINR(o.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="bg-white border border-gold/10 rounded-xl p-8 text-center">
        <Package size={32} className="text-maroon/30 mx-auto mb-3" />
        {merchant.status === "approved" ? (
          <>
            <p className="font-display text-xl text-maroon">Manage your catalog</p>
            <p className="text-sm text-maroon/50 mt-1 max-w-md mx-auto">
              Add products, set delivery charges for Gujarat and other states, and track stock.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-5">
              <Link
                to="/merchant/products"
                className="px-5 py-2.5 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
              >
                My products
              </Link>
              <Link
                to={`/store/${merchant.$id}`}
                className="px-5 py-2.5 border border-maroon/20 text-maroon rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:border-gold flex items-center gap-2"
              >
                <Store size={13} /> View storefront
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="font-display text-xl text-maroon">Products locked</p>
            <p className="text-sm text-maroon/50 mt-1 max-w-md mx-auto">
              Once your account is approved, you'll be able to list products, set inventory, and
              manage orders here.
            </p>
            {merchant.status === "pending_payment" && (
              <Link
                to="/membership"
                className="inline-block mt-4 px-5 py-2.5 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
              >
                Complete payment
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
