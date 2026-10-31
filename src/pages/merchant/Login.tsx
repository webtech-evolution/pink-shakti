import { FormEvent, useState } from "react";
import { Link, useNavigate, useLocation, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function MerchantLogin() {
  const { login, user, merchant, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    const from = (location.state as any)?.from?.pathname || (merchant ? "/merchant" : "/merchant/onboarding");
    return <Navigate to={from} replace />;
  }

  const planParam = params.get("plan");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate(planParam ? `/merchant/checkout?plan=${planParam}` : "/merchant");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gold/10 shadow-xl p-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Merchant</p>
        <h1 className="font-display text-3xl text-maroon mb-8">Merchant sign in</h1>
        {!configured && (
          <div className="mb-6 rounded-lg bg-maroon/5 border border-maroon/10 p-4 text-xs text-maroon/70">
            Backend not configured. See <code>APPWRITE_SETUP.md</code>.
          </div>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none" />
          </label>
          <button type="submit" disabled={loading || !configured}
            className="mt-2 bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-maroon/60 text-center mt-6">
          Don't have an account?{" "}
          <Link to={planParam ? `/merchant/register?plan=${planParam}` : "/membership"} className="text-gold font-semibold">
            View plans
          </Link>
        </p>
      </div>
    </div>
  );
}
