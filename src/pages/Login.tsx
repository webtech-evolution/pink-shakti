import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogle, completeOAuthLogin, register, user, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const exchanged = useRef(false);
  const destination =
    params.get("from") || (location.state as { from?: string } | null)?.from || "/profile";

  const oauthUserId = params.get("userId");
  const oauthSecret = params.get("secret");
  const oauthFailed = params.get("oauth") === "failed";

  useEffect(() => {
    if (oauthFailed) toast.error("Google sign in was cancelled or failed.");
  }, [oauthFailed]);

  // Finish the Google token flow: exchange userId + secret for a session
  // stored in this browser, so no third-party cookies are needed.
  useEffect(() => {
    if (!oauthUserId || !oauthSecret || exchanged.current) return;
    exchanged.current = true;
    setBusy(true);
    completeOAuthLogin(oauthUserId, oauthSecret)
      .then(() => {
        const next = new URLSearchParams(params);
        next.delete("userId");
        next.delete("secret");
        setParams(next, { replace: true });
        navigate(destination, { replace: true });
      })
      .catch((error: any) => toast.error(error?.message || "Google sign in failed"))
      .finally(() => setBusy(false));
  }, [oauthUserId, oauthSecret, completeOAuthLogin, destination, navigate, params, setParams]);

  if (user) return <Navigate to={destination} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "register" && form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else {
        await register(form.email, form.password, form.name);
        (window as Window & { psTrackSignup?: (plan?: string) => void }).psTrackSignup?.("aarambh");
      }
      navigate(destination);
    } catch (error: any) {
      toast.error(error?.message || "Could not complete that request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gold/10 shadow-xl p-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">
          PINK SHAKTI
        </p>
        <h1 className="font-display text-3xl text-maroon mb-8">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        {!configured && (
          <p className="mb-6 rounded-lg bg-maroon/5 p-4 text-xs text-maroon/70">
            Add Appwrite credentials to use your account.
          </p>
        )}
        <form onSubmit={submit} className="flex flex-col gap-4">
          {mode === "register" && (
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
          <input
            required
            type="password"
            minLength={mode === "register" ? 8 : undefined}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-maroon/15 rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
          <button
            disabled={busy || !configured}
            className="mt-2 bg-maroon text-ivory rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="relative my-6 border-t border-maroon/10">
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-3 text-[10px] uppercase tracking-widest text-maroon/40">
            or
          </span>
        </div>
        <button
          type="button"
          disabled={!configured || busy}
          onClick={() =>
            loginWithGoogle(destination).catch((error: any) =>
              toast.error(error?.message || "Google sign in failed"),
            )
          }
          className="w-full border border-maroon/20 text-maroon rounded-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-xs text-gold font-semibold text-center mt-6"
        >
          {mode === "login" ? "Create an account" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="block text-center text-xs text-maroon/45 mt-4">
          Return home
        </Link>
      </div>
    </div>
  );
}
