import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Bell, Check, CreditCard, LogOut, UserRound } from "lucide-react";
import { api, tokens, inr, fmtDate, type Plan } from "@/lib/api";
import { usePageMeta } from "@/lib/use-page-meta";
import { cityOptions } from "@/components/EnquiryForm";

const input =
  "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-maroon focus:border-gold focus:outline-none";
const btn =
  "inline-flex items-center justify-center gap-2 px-7 py-3 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all disabled:opacity-60";

type Me = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    interests: string[];
    createdAt: string;
  };
  subscription: { planKey: string; startDate: string; endDate: string | null; plan: Plan } | null;
  subscriptions: {
    id: string;
    planName: string;
    startDate: string;
    endDate: string | null;
    status: string;
  }[];
  payments: {
    id: string;
    planName: string;
    amount: number;
    razorpayPaymentId: string;
    paidAt: string;
  }[];
  notifications: {
    id: string;
    title: string;
    body: string;
    link: string;
    read: boolean;
    createdAt: string;
  }[];
};

// Login / register form; also used on the Join page.
export function AuthForm({
  initial = "register",
  onDone,
}: {
  initial?: "login" | "register";
  onDone: () => void;
}) {
  const [mode, setMode] = useState(initial);
  const [v, setV] = useState({ name: "", email: "", phone: "", city: "", password: "" });
  const [busy, setBusy] = useState(false);
  const f = (k: keyof typeof v) => ({
    value: v[k],
    onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }),
  });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api<{ token: string }>(mode === "login" ? "/auth/login" : "/auth/register", {
        body: v,
      });
      tokens.set("user", r.token);
      if (mode === "register") toast.success("Welcome to Pink Shakti! You're now a Pink Saathi.");
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex gap-2 rounded-full bg-ivory p-1">
        {(["register", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === m ? "bg-maroon text-ivory" : "text-maroon/60"}`}
          >
            {m === "register" ? "Join free" : "Log in"}
          </button>
        ))}
      </div>
      {mode === "register" && (
        <>
          <input className={input} placeholder="Full name *" required {...f("name")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={input} type="tel" placeholder="Mobile (WhatsApp)" {...f("phone")} />
            <select className={input} {...f("city")}>
              <option value="">City</option>
              {cityOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <input
        className={input}
        type="email"
        placeholder="Email *"
        required
        autoComplete="email"
        {...f("email")}
      />
      <input
        className={input}
        type="password"
        placeholder={mode === "register" ? "Create password (min 8 characters) *" : "Password *"}
        required
        minLength={mode === "register" ? 8 : undefined}
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        {...f("password")}
      />
      <button className={`${btn} w-full`} disabled={busy}>
        {mode === "register" ? "Create my free account" : "Log in"}
      </button>
      {mode === "register" && (
        <p className="text-xs text-maroon/50">
          You start on the free Aarambh plan. Upgrade any time.
        </p>
      )}
    </form>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [me, setMe] = useState<Me | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    city: "",
    interests: [] as string[],
  });
  const load = () =>
    api<Me>("/me", { as: "user" })
      .then((m) => {
        setMe(m);
        setProfile({
          name: m.user.name,
          phone: m.user.phone,
          city: m.user.city,
          interests: m.user.interests,
        });
      })
      .catch((e) => {
        toast.error(e.message);
        if (!tokens.get("user")) onLogout();
      });
  useEffect(() => {
    load();
    api<{ categories: string[] }>("/config").then((c) => setCats(c.categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!me) return <p className="py-24 text-center text-maroon/50">Loading your dashboard…</p>;

  const sub = me.subscription;
  const daysLeft = sub?.endDate
    ? Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 864e5)
    : null;
  const unread = me.notifications.filter((n) => !n.read).length;
  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api("/me", { method: "PUT", body: profile, as: "user" });
      toast.success("Profile saved");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  const toggle = (c: string) =>
    setProfile({
      ...profile,
      interests: profile.interests.includes(c)
        ? profile.interests.filter((x) => x !== c)
        : [...profile.interests, c],
    });
  const markRead = () => api("/me/notifications/read", { body: {}, as: "user" }).then(load);
  const card = "rounded-3xl bg-white border border-maroon/10 p-6";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="page-label mb-2">My Pink Shakti</p>
          <h1 className="font-display text-4xl text-maroon">
            Namaste, {me.user.name.split(" ")[0]}!
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-sm text-maroon/60 hover:text-maroon"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl p-6 lg:col-span-2 bg-maroon text-ivory">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
            Your membership
          </p>
          <h2 className="mt-2 font-display text-4xl">{sub?.plan?.name ?? "No active plan"}</h2>
          {sub?.endDate ? (
            <p className="mt-2 text-ivory/70">
              Valid till {fmtDate(sub.endDate)}
              {daysLeft !== null && daysLeft <= 15 && (
                <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-maroon">
                  {daysLeft} days left
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 text-ivory/70">
              Free for life. Upgrade for workshops, stage time, stall discounts and selling on Sakhi
              Bazaar.
            </p>
          )}
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-ivory/80">
            {sub?.plan?.features.slice(0, 6).map((f) => (
              <li key={f} className="flex gap-2">
                <Check size={16} className="text-gold shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link
            to="/membership"
            className="mt-6 inline-flex px-6 py-3 bg-gold text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory"
          >
            {sub?.endDate ? "Renew or upgrade" : "Upgrade my plan"}
          </Link>
        </section>

        <section className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-display text-2xl text-maroon">
              <Bell size={18} className="text-gold" /> Notifications{" "}
              {unread > 0 && (
                <span className="rounded-full bg-gold px-2 text-xs text-maroon">{unread}</span>
              )}
            </h2>
            {unread > 0 && (
              <button onClick={markRead} className="text-xs text-maroon/60 underline">
                Mark all read
              </button>
            )}
          </div>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {me.notifications.length === 0 && (
              <li className="text-sm text-maroon/50">No notifications yet.</li>
            )}
            {me.notifications.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl p-3 text-sm ${n.read ? "bg-ivory/60" : "bg-ivory border-l-4 border-gold"}`}
              >
                <p className="font-semibold text-maroon">
                  {n.link ? (
                    <Link to={n.link} className="hover:underline">
                      {n.title}
                    </Link>
                  ) : (
                    n.title
                  )}
                </p>
                <p className="text-maroon/60">{n.body}</p>
                <p className="mt-1 text-[11px] text-maroon/40">{fmtDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={card}>
        <h2 className="flex items-center gap-2 font-display text-2xl text-maroon mb-4">
          <CreditCard size={18} className="text-gold" /> Payment history
        </h2>
        {me.payments.length === 0 ? (
          <p className="text-sm text-maroon/50">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-maroon/50">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {me.payments.map((p) => (
                  <tr key={p.id} className="border-t border-maroon/10 text-maroon/80">
                    <td className="py-3">{fmtDate(p.paidAt)}</td>
                    <td>{p.planName}</td>
                    <td>{inr(p.amount)}</td>
                    <td className="text-xs">{p.razorpayPaymentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {me.subscriptions.length > 1 && (
          <p className="mt-4 text-xs text-maroon/50">
            Membership history:{" "}
            {me.subscriptions
              .map(
                (s) =>
                  `${s.planName} (${fmtDate(s.startDate)}${s.endDate ? ` – ${fmtDate(s.endDate)}` : ""}, ${s.status})`,
              )
              .join(" · ")}
          </p>
        )}
      </section>

      <form onSubmit={saveProfile} className={card}>
        <h2 className="flex items-center gap-2 font-display text-2xl text-maroon mb-4">
          <UserRound size={18} className="text-gold" /> My profile & event alerts
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input
            className={input}
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            className={input}
            placeholder="Mobile"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
          <select
            className={input}
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          >
            <option value="">City</option>
            {cityOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <p className="mt-6 mb-3 text-sm text-maroon/70">
          Which events would you like to hear about? We'll email you and notify you here when a new
          one is added.
        </p>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => toggle(c)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${profile.interests.includes(c) ? "border-maroon bg-maroon text-ivory" : "border-maroon/20 text-maroon"}`}
            >
              {profile.interests.includes(c) && "✓ "}
              {c}
            </button>
          ))}
        </div>
        <button className={`${btn} mt-6`}>Save profile</button>
        <p className="mt-3 text-xs text-maroon/40">
          Email: {me.user.email} · Member since {fmtDate(me.user.createdAt)}
        </p>
      </form>
    </div>
  );
}

export default function AccountPage() {
  usePageMeta("My Account | Pink Shakti");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(() => !!tokens.get("user"));
  const logout = () => {
    api("/auth/logout", { body: {}, as: "user" }).catch(() => {});
    tokens.set("user", "");
    setLoggedIn(false);
  };
  const done = () => {
    const next = params.get("next");
    if (next?.startsWith("/")) navigate(next);
    else setLoggedIn(true);
  };
  return (
    <main className="min-h-screen bg-ivory">
      <meta name="robots" content="noindex" />
      {loggedIn ? (
        <Dashboard onLogout={logout} />
      ) : (
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="page-label mb-4">Pink Saathi</p>
            <h1 className="font-display text-4xl lg:text-5xl text-maroon leading-tight">
              Your space in the <span className="italic text-gold">sisterhood</span>
            </h1>
            <p className="mt-5 text-maroon/60 leading-relaxed">
              Join free or log in to see your membership, payments and renewal dates, and get alerts
              for events in the categories you love.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-gold/10">
            <AuthForm initial={params.get("next") ? "login" : "register"} onDone={done} />
          </div>
        </div>
      )}
    </main>
  );
}
