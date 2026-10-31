import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function MerchantRegister() {
  const { register, user, configured } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planParam = params.get("plan");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user)
    return (
      <Navigate to={planParam ? `/merchant/checkout?plan=${planParam}` : "/merchant"} replace />
    );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      (window as Window & { psTrackSignup?: (plan?: string) => void }).psTrackSignup?.(
        planParam || "aarambh",
      );
      toast.success("Account created");
      navigate("/merchant");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gold/10 shadow-xl p-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Merchant</p>
        <h1 className="font-display text-3xl text-maroon mb-8">Create your account</h1>
        {!configured && (
          <div className="mb-6 rounded-lg bg-maroon/5 border border-maroon/10 p-4 text-xs text-maroon/70">
            Backend not configured. See <code>APPWRITE_SETUP.md</code>.
          </div>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-maroon/60">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !configured}
            className="mt-2 bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-maroon/60 text-center mt-6">
          Already registered?{" "}
          <Link
            to={planParam ? `/merchant/login?plan=${planParam}` : "/merchant/login"}
            className="text-gold font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
