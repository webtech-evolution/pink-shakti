import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/products-api";
import { createOrder, encodeItems, makeOrderNumber } from "@/lib/orders-api";
import { rememberOrders } from "@/lib/guest-orders";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { commissionPercentFor, grossUpGatewayFee, EFFECTIVE_GATEWAY_PERCENT } from "@/lib/fees";
import { usePageMeta } from "@/lib/use-page-meta";
import type { Order, OrderItem } from "@/lib/types";

const STATES = [
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Madhya Pradesh",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other",
];

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFor, byMerchant, clear } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  usePageMeta(
    "Checkout | PINK SHAKTI 360°",
    "Securely complete your Pink Shakti marketplace order with delivery and payment details.",
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Gujarat",
    pincode: "",
    notes: "",
  });

  const delivery = useMemo(() => deliveryFor(form.state), [form.state, deliveryFor]);

  // Commission % per merchant (from their membership plan).
  const [percents, setPercents] = useState<Record<string, number>>({});
  const merchantIds = useMemo(() => Array.from(new Set(lines.map((l) => l.merchantId))), [lines]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const entries = await Promise.all(
        merchantIds.map(async (id) => [id, await commissionPercentFor(id)] as const),
      );
      if (alive) setPercents(Object.fromEntries(entries));
    })();
    return () => {
      alive = false;
    };
  }, [merchantIds]);

  const gujarat = form.state.trim().toLowerCase() === "gujarat";

  // Per-merchant breakdown used for both the summary and order creation.
  const breakdown = useMemo(() => {
    const groups = byMerchant();
    return Object.entries(groups).map(([merchantId, g]) => {
      const sub = g.reduce((n, l) => n + l.rate * l.qty, 0);
      const ship = Math.max(
        ...g.map((l) => (gujarat ? l.deliveryChargeGujarat : l.deliveryChargeOther)),
      );
      const commissionPercent = percents[merchantId] ?? 0;
      const commissionAmount = Math.round((sub * commissionPercent) / 100);
      return { merchantId, lines: g, sub, ship, commissionPercent, commissionAmount };
    });
  }, [byMerchant, gujarat, percents]);

  const commission = breakdown.reduce((n, b) => n + b.commissionAmount, 0);
  const gatewayFee = grossUpGatewayFee(subtotal + delivery + commission);
  const total = subtotal + delivery + commission + gatewayFee;

  const set = (k: keyof typeof form) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrders = async (paymentId?: string) => {
    const created: string[] = [];
    const createdOrders: Order[] = [];

    for (const b of breakdown) {
      const items: OrderItem[] = b.lines.map((l) => ({
        productId: l.productId,
        title: l.title,
        rate: l.rate,
        qty: l.qty,
        coverImage: l.coverImage,
      }));
      // Gateway charge is apportioned per merchant order so the sum matches
      // what the customer paid.
      const share = grossUpGatewayFee(b.sub + b.ship + b.commissionAmount);
      const order = await createOrder({
        orderNumber: makeOrderNumber(),
        merchantId: b.merchantId,
        storeName: b.lines[0].storeName,
        items: encodeItems(items),
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        subtotal: b.sub,
        deliveryCharge: b.ship,
        total: b.sub + b.ship + b.commissionAmount + share,
        commissionPercent: b.commissionPercent,
        commissionAmount: b.commissionAmount,
        // Customer pays commission + gateway charges, so the merchant receives
        // the full goods + delivery amount.
        payoutAmount: b.sub + b.ship,
        paymentStatus: paymentId ? "paid" : "pending",
        orderStatus: "placed",
        razorpayPaymentId: paymentId,
        notes: form.notes || undefined,
      });
      created.push(order.$id);
      createdOrders.push(order);
    }

    // Persist the order history locally so guests can always track their orders.
    rememberOrders(createdOrders);

    clear();
    navigate(`/order/${created[0]}`, { state: { order: createdOrders[0] } });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setPaying(true);
    try {
      await openRazorpayCheckout({
        amount: total,
        name: "PINK SHAKTI 360°",
        description: `Marketplace order — ${lines.length} item(s)`,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        onSuccess: async (resp) => {
          try {
            await placeOrders(resp.razorpay_payment_id);
            toast.success("Payment successful — order placed!");
          } catch (err: any) {
            toast.error(err.message || "Order could not be saved. Contact support.");
          } finally {
            setPaying(false);
          }
        },
        onDismiss: () => setPaying(false),
      });
    } catch (err: any) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl text-maroon mb-3">Your cart is empty</h1>
          <Link to="/shop" className="text-gold text-sm uppercase tracking-widest">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-maroon focus:outline-none focus:border-gold";

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="max-w-5xl mx-auto px-6 pt-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-3">Checkout</p>
        <h1 className="font-display text-4xl lg:text-5xl text-maroon leading-tight">
          Delivery & payment
        </h1>

        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10 items-start">
          <div className="bg-white border border-gold/15 rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
            <label className="sm:col-span-2 text-xs uppercase tracking-widest text-maroon/50">
              Full name
              <input
                required
                value={form.fullName}
                onChange={set("fullName")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              Phone
              <input
                required
                value={form.phone}
                onChange={set("phone")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="sm:col-span-2 text-xs uppercase tracking-widest text-maroon/50">
              Address
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={set("address")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              City
              <input
                required
                value={form.city}
                onChange={set("city")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              State
              <select value={form.state} onChange={set("state")} className={`${input} mt-1.5`}>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              Pincode
              <input
                required
                value={form.pincode}
                onChange={set("pincode")}
                className={`${input} mt-1.5`}
              />
            </label>
            <label className="text-xs uppercase tracking-widest text-maroon/50">
              Order notes (optional)
              <input value={form.notes} onChange={set("notes")} className={`${input} mt-1.5`} />
            </label>
          </div>

          <aside className="bg-white border border-gold/15 rounded-2xl p-6">
            <h2 className="font-display text-2xl text-maroon mb-4">Order summary</h2>
            <div className="space-y-2 mb-4">
              {lines.map((l) => (
                <div key={l.productId} className="flex justify-between text-sm text-maroon/70">
                  <span className="truncate pr-2">
                    {l.title} × {l.qty}
                  </span>
                  <span>{formatINR(l.rate * l.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-maroon/10 pt-3 flex justify-between text-sm text-maroon/70">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-maroon/70 mt-1">
              <span>Delivery ({form.state})</span>
              <span>{formatINR(delivery)}</span>
            </div>
            <div className="flex justify-between text-sm text-maroon/70 mt-1">
              <span>
                Platform commission
                {breakdown.length === 1 && breakdown[0].commissionPercent > 0
                  ? ` (${breakdown[0].commissionPercent}%)`
                  : ""}
              </span>
              <span>{formatINR(commission)}</span>
            </div>

            <div className="flex justify-between text-sm text-maroon/70 mt-1">
              <span>Payment gateway charges ({EFFECTIVE_GATEWAY_PERCENT.toFixed(2)}%)</span>
              <span>{formatINR(gatewayFee)}</span>
            </div>
            <div className="flex justify-between font-display text-2xl text-maroon mt-4">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
            <button
              type="submit"
              disabled={paying}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-60"
            >
              {paying ? <Loader2 className="animate-spin" size={15} /> : <ShieldCheck size={15} />}
              Pay {formatINR(total)}
            </button>
            <p className="text-[11px] text-maroon/40 mt-3 text-center">
              Secured by Razorpay. Payouts to merchants are settled by Pink Shakti.
            </p>
          </aside>
        </form>
      </section>
    </div>
  );
}
