import { api } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Razorpay. Check your internet connection."));
    document.body.appendChild(s);
  });
}

// Creates a Razorpay order on our server, opens Razorpay Checkout, then has the server verify the signature.
export async function buyPlan(planKey: string): Promise<boolean> {
  const order = await api<{
    orderId: string;
    amount: number;
    keyId: string;
    planName: string;
    prefill: Record<string, string>;
  }>("/pay/order", { body: { planKey }, as: "user" });
  await loadCheckout();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: "INR",
      order_id: order.orderId,
      name: "Pink Shakti",
      description: `${order.planName} membership (1 year)`,
      prefill: order.prefill,
      theme: { color: "#5c1a2e" },
      handler: (r: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) =>
        api("/pay/verify", {
          body: {
            orderId: r.razorpay_order_id,
            paymentId: r.razorpay_payment_id,
            signature: r.razorpay_signature,
          },
          as: "user",
        }).then(() => resolve(true), reject),
      modal: { ondismiss: () => resolve(false) },
    });
    rzp.open();
  });
}
