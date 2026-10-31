import { Link } from "react-router-dom";

export default function MerchantCheckout() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="max-w-md bg-white border border-gold/10 rounded-2xl p-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3">
          Seller billing
        </p>
        <h1 className="font-display text-3xl text-maroon mb-4">No seller membership plans</h1>
        <p className="text-sm text-maroon/60 leading-relaxed mb-6">
          Sellers are billed monthly according to their sales volume. Community membership plans do
          not apply to merchant accounts.
        </p>
        <Link
          to="/merchant"
          className="inline-flex bg-maroon text-ivory rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-widest"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
