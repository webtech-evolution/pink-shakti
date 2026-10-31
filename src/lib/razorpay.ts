// Razorpay client-side helper.
//
// NOTE ON PRODUCTION USE:
// Razorpay production checkout requires a server-side "order" created via the
// Orders API using your Key Secret. For a static app (no backend), this must
// live in an Appwrite Function or similar. This file uses the frontend-only
// "Standard Checkout without order_id" flow, which works in TEST MODE for
// scaffolding and demos. Before going live, create an Appwrite Function that:
//   1. Accepts { amount, currency, receipt }
//   2. Calls Razorpay Orders API with your KEY_SECRET
//   3. Returns { order_id }
// Then pass that order_id into the checkout options below.

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return scriptPromise;
}

export interface CheckoutParams {
  amount: number; // rupees
  currency?: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  orderId?: string; // pass from server in production
  onSuccess: (resp: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(params: CheckoutParams) {
  const ok = await loadRazorpay();
  if (!ok) throw new Error("Razorpay SDK failed to load. Check network.");

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error(
      "VITE_RAZORPAY_KEY_ID is not set. Add your Razorpay Test Key ID to env vars.",
    );
  }

  const options: any = {
    key: keyId,
    amount: Math.round(params.amount * 100), // paise
    currency: params.currency || "INR",
    name: params.name,
    description: params.description,
    prefill: params.prefill,
    notes: params.notes,
    theme: { color: "#b40d4a" },
    handler: (response: any) => params.onSuccess(response),
    modal: { ondismiss: () => params.onDismiss?.() },
  };
  if (params.orderId) options.order_id = params.orderId;

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
