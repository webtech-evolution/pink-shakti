import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarDays,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { api, tokens, inr, fmtDate, type EventItem, type Plan } from "@/lib/api";
import { usePageMeta } from "@/lib/use-page-meta";

const input =
  "w-full rounded-lg border border-maroon/15 bg-white px-3 py-2 text-sm text-maroon focus:border-gold focus:outline-none";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-5 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold hover:text-maroon disabled:opacity-50";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-maroon/20 px-4 py-1.5 text-xs font-semibold text-maroon hover:bg-maroon hover:text-ivory";

function useLoad<T>(path: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    api<T>(path, { as: "admin" })
      .then(setData)
      .catch((e) => toast.error(e.message));
  }, [path, tick]);
  return [data, () => setTick((t) => t + 1)] as const;
}

function Table({ head, rows, empty }: { head: string[]; rows: ReactNode[][]; empty: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-maroon/10 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-ivory text-left text-xs uppercase tracking-wider text-maroon/60">
          <tr>
            {head.map((h) => (
              <th key={h} className="p-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={head.length} className="p-6 text-center text-maroon/50">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-t border-maroon/10 align-top">
                {r.map((c, j) => (
                  <td key={j} className="p-3 text-maroon/80">
                    {c}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const Badge = ({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "green" | "gold" | "gray" | "red";
}) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
      {
        green: "bg-green-100 text-green-800",
        gold: "bg-amber-100 text-amber-800",
        gray: "bg-maroon/5 text-maroon/60",
        red: "bg-red-100 text-red-700",
      }[tone]
    }`}
  >
    {children}
  </span>
);

// ---------------- login / first-time setup ----------------
function AdminLogin({ onIn }: { onIn: () => void }) {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    api<{ needsSetup: boolean }>("/admin/status")
      .then((r) => setNeedsSetup(r.needsSetup))
      .catch(() => setNeedsSetup(false));
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const r = await api<{ token: string }>(needsSetup ? "/admin/setup" : "/admin/login", {
        body: { email, password },
      });
      tokens.set("admin", r.token);
      onIn();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-sm"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
          Pink Shakti Admin
        </p>
        <h1 className="font-display text-3xl text-maroon">
          {needsSetup ? "Create admin account" : "Admin login"}
        </h1>
        {needsSetup && (
          <p className="text-sm text-maroon/60">
            First time here. Choose the email and password you'll use to manage the site.
          </p>
        )}
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={input}
          type="password"
          placeholder={needsSetup ? "Password (min 10 characters)" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={`${btn} w-full py-3`} disabled={needsSetup === null}>
          {needsSetup ? "Create account" : "Log in"}
        </button>
        <Link to="/" className="block text-center text-xs text-maroon/50 hover:text-maroon">
          ← Back to website
        </Link>
      </form>
    </div>
  );
}

// ---------------- tabs ----------------
function Dashboard() {
  const [s] = useLoad("/admin/summary", {
    newLeads: 0,
    members: 0,
    activePaid: 0,
    revenue: 0,
    upcomingEvents: 0,
  });
  const cards: [string, string | number][] = [
    ["New enquiries", s.newLeads],
    ["Members", s.members],
    ["Active paid members", s.activePaid],
    ["Total revenue", inr(s.revenue)],
    ["Upcoming events", s.upcomingEvents],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([l, v]) => (
        <div key={l} className="rounded-2xl bg-white p-5 border border-maroon/10">
          <p className="text-xs uppercase tracking-wider text-maroon/50">{l}</p>
          <p className="mt-2 font-display text-3xl text-maroon">{v}</p>
        </div>
      ))}
    </div>
  );
}

type Lead = {
  id: string;
  subject: string;
  fields: Record<string, string>;
  status: string;
  createdAt: string;
};
function Leads() {
  const [leads, reload] = useLoad<Lead[]>("/admin/leads", []);
  const [q, setQ] = useState("");
  const shown = leads.filter((l) => JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));
  const setStatus = (l: Lead, status: string) =>
    api(`/admin/leads/${l.id}`, { method: "PATCH", body: { status }, as: "admin" }).then(reload);
  const remove = (l: Lead) =>
    confirm("Delete this enquiry?") &&
    api(`/admin/leads/${l.id}`, { method: "DELETE", as: "admin" }).then(reload);
  const exportCsv = () => {
    const keys = [...new Set(leads.flatMap((l) => Object.keys(l.fields)))];
    const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      ["Date", "Form", "Status", ...keys].map(cell).join(","),
      ...leads.map((l) =>
        [fmtDate(l.createdAt), l.subject, l.status, ...keys.map((k) => l.fields[k])]
          .map(cell)
          .join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "pink-shakti-enquiries.csv";
    a.click();
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className={`${input} max-w-xs`}
          placeholder="Search name, phone, city…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={btnGhost} onClick={exportCsv}>
          Download CSV
        </button>
      </div>
      <Table
        head={["Date", "Form", "Details", "Status", ""]}
        empty="No enquiries yet. Submissions from every form on the website appear here."
        rows={shown.map((l) => [
          fmtDate(l.createdAt),
          <span className="font-semibold">{l.subject}</span>,
          <div className="space-y-0.5">
            {Object.entries(l.fields).map(([k, v]) => (
              <div key={k}>
                <span className="text-maroon/50">{k}:</span> {v}
              </div>
            ))}
          </div>,
          <select className={input} value={l.status} onChange={(e) => setStatus(l, e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>,
          <button className="text-xs text-red-600" onClick={() => remove(l)}>
            Delete
          </button>,
        ])}
      />
    </div>
  );
}

const emptyEvent = {
  title: "",
  category: "",
  date: "",
  time: "",
  city: "",
  venue: "",
  image: "",
  description: "",
  ticket: "",
  status: "published" as const,
};
function Events() {
  const [events, reload] = useLoad<EventItem[]>("/admin/events", []);
  const [cats, setCats] = useState<string[]>([]);
  const [editing, setEditing] = useState<Partial<EventItem> | null>(null);
  useEffect(() => {
    api<{ categories: string[] }>("/config").then((c) => setCats(c.categories));
  }, []);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api(editing?.id ? `/admin/events/${editing.id}` : "/admin/events", {
        method: editing?.id ? "PUT" : "POST",
        body: editing,
        as: "admin",
      });
      toast.success("Event saved. Members interested in this category have been notified.");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  const remove = (ev: EventItem) =>
    confirm(`Delete "${ev.title}"?`) &&
    api(`/admin/events/${ev.id}`, { method: "DELETE", as: "admin" }).then(reload);
  const f = (k: keyof EventItem) => ({
    value: (editing?.[k] as string) ?? "",
    onChange: (e: { target: { value: string } }) => setEditing({ ...editing, [k]: e.target.value }),
  });
  return (
    <div className="space-y-4">
      <button className={btn} onClick={() => setEditing({ ...emptyEvent, category: cats[0] })}>
        + Add event
      </button>
      {editing && (
        <form
          onSubmit={save}
          className="grid gap-3 rounded-2xl border border-gold/30 bg-white p-5 sm:grid-cols-2"
        >
          <h3 className="sm:col-span-2 font-display text-2xl text-maroon">
            {editing.id ? "Edit event" : "New event"}
          </h3>
          <label className="text-xs text-maroon/60 sm:col-span-2">
            Title *<input className={input} required {...f("title")} />
          </label>
          <label className="text-xs text-maroon/60">
            Category (members interested in it get an alert)
            <select className={input} {...f("category")}>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-maroon/60">
            Date *<input className={input} type="date" required {...f("date")} />
          </label>
          <label className="text-xs text-maroon/60">
            Time
            <input className={input} placeholder="10:00 AM – 6:00 PM" {...f("time")} />
          </label>
          <label className="text-xs text-maroon/60">
            City
            <input className={input} {...f("city")} />
          </label>
          <label className="text-xs text-maroon/60">
            Venue
            <input className={input} {...f("venue")} />
          </label>
          <label className="text-xs text-maroon/60">
            Ticket / price note
            <input className={input} placeholder="Free for members" {...f("ticket")} />
          </label>
          <label className="text-xs text-maroon/60 sm:col-span-2">
            Image URL
            <input className={input} placeholder="https://…" {...f("image")} />
          </label>
          <label className="text-xs text-maroon/60 sm:col-span-2">
            Description
            <textarea className={input} rows={4} {...f("description")} />
          </label>
          <label className="text-xs text-maroon/60">
            Status
            <select className={input} {...f("status")}>
              <option value="published">Published (visible)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button className={btn}>Save event</button>
            <button type="button" className={btnGhost} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <Table
        head={["Date", "Event", "Category", "City", "Status", ""]}
        empty="No events yet."
        rows={events.map((ev) => [
          fmtDate(ev.date),
          <div>
            <span className="font-semibold">{ev.title}</span>
            {ev.sample && (
              <>
                {" "}
                <Badge tone="gold">Sample</Badge>
              </>
            )}
          </div>,
          ev.category,
          ev.city,
          <Badge tone={ev.status === "published" ? "green" : "gray"}>{ev.status}</Badge>,
          <div className="flex gap-3 text-xs">
            <button className="text-maroon underline" onClick={() => setEditing(ev)}>
              Edit
            </button>
            <button className="text-red-600" onClick={() => remove(ev)}>
              Delete
            </button>
          </div>,
        ])}
      />
    </div>
  );
}

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  interests: string[];
  plan: string;
  planEnd: string | null;
  totalPaid: number;
  createdAt: string;
};
function Members() {
  const [rows] = useLoad<Member[]>("/admin/members", []);
  return (
    <Table
      head={["Joined", "Name", "Contact", "Plan", "Valid till", "Paid", "Interests"]}
      empty="No members yet."
      rows={rows.map((m) => [
        fmtDate(m.createdAt),
        <span className="font-semibold">{m.name}</span>,
        <div>
          {m.email}
          <br />
          {m.phone} {m.city && `· ${m.city}`}
        </div>,
        m.plan,
        fmtDate(m.planEnd),
        inr(m.totalPaid),
        <span className="text-xs">{m.interests.join(", ")}</span>,
      ])}
    />
  );
}

type Sub = {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  startDate: string;
  endDate: string | null;
  status: string;
};
function Subscriptions() {
  const [rows, reload] = useLoad<Sub[]>("/admin/subscriptions", []);
  const daysLeft = (d: string | null) =>
    d ? Math.ceil((new Date(d).getTime() - Date.now()) / 864e5) : null;
  return (
    <div className="space-y-4">
      <button
        className={btnGhost}
        onClick={() =>
          api("/admin/run-reminders", { body: {}, as: "admin" }).then(() => {
            toast.success("Renewal reminders checked.");
            reload();
          })
        }
      >
        Send due renewal reminders now
      </button>
      <Table
        head={["Member", "Plan", "Started", "Ends", "Status"]}
        empty="No memberships yet."
        rows={rows.map((s) => {
          const left = daysLeft(s.endDate);
          return [
            <div>
              <span className="font-semibold">{s.userName}</span>
              <br />
              <span className="text-xs">{s.userEmail}</span>
            </div>,
            s.planName,
            fmtDate(s.startDate),
            s.endDate ? (
              <div>
                {fmtDate(s.endDate)}
                {s.status === "active" && left !== null && left <= 15 && (
                  <>
                    {" "}
                    <Badge tone="gold">{left} days left</Badge>
                  </>
                )}
              </div>
            ) : (
              "Lifetime"
            ),
            <Badge tone={s.status === "active" ? "green" : s.status === "expired" ? "red" : "gray"}>
              {s.status}
            </Badge>,
          ];
        })}
      />
    </div>
  );
}

type Pay = {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
  paidAt?: string;
};
function Transactions() {
  const [rows] = useLoad<Pay[]>("/admin/payments", []);
  return (
    <Table
      head={["Date", "Member", "Plan", "Amount", "Status", "Razorpay IDs"]}
      empty="No transactions yet."
      rows={rows.map((p) => [
        fmtDate(p.paidAt || p.createdAt),
        <div>
          <span className="font-semibold">{p.userName}</span>
          <br />
          <span className="text-xs">{p.userEmail}</span>
        </div>,
        p.planName,
        inr(p.amount),
        <Badge tone={p.status === "paid" ? "green" : p.status === "failed" ? "red" : "gray"}>
          {p.status === "created" ? "not completed" : p.status}
        </Badge>,
        <span className="text-xs">
          {p.razorpayOrderId}
          <br />
          {p.razorpayPaymentId}
        </span>,
      ])}
    />
  );
}

function Plans() {
  const [plans, reload] = useLoad<Plan[]>("/admin/plans", []);
  const [draft, setDraft] = useState<Record<string, Plan>>({});
  const get = (p: Plan) => draft[p.key] ?? p;
  const set = (p: Plan, patch: Partial<Plan>) =>
    setDraft({ ...draft, [p.key]: { ...get(p), ...patch } });
  const save = async (p: Plan) => {
    try {
      await api(`/admin/plans/${p.key}`, { method: "PUT", body: get(p), as: "admin" });
      toast.success(`${get(p).name} saved`);
      reload();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {plans.map((p) => (
        <div key={p.key} className="space-y-3 rounded-2xl border border-maroon/10 bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-maroon/60">
              Name
              <input
                className={input}
                value={get(p).name}
                onChange={(e) => set(p, { name: e.target.value })}
              />
            </label>
            <label className="text-xs text-maroon/60">
              Price per year (₹)
              <input
                className={input}
                type="number"
                min={0}
                disabled={p.key === "aarambh"}
                value={get(p).price}
                onChange={(e) => set(p, { price: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="block text-xs text-maroon/60">
            Tagline
            <input
              className={input}
              value={get(p).meaning}
              onChange={(e) => set(p, { meaning: e.target.value })}
            />
          </label>
          <label className="block text-xs text-maroon/60">
            Features (one per line)
            <textarea
              className={input}
              rows={6}
              value={get(p).features.join("\n")}
              onChange={(e) => set(p, { features: e.target.value.split("\n") })}
            />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-maroon">
              <input
                type="checkbox"
                checked={get(p).active}
                onChange={(e) => set(p, { active: e.target.checked })}
              />{" "}
              Show on website
            </label>
            <button className={btn} onClick={() => save(p)}>
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

type SettingsT = {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  adminEmail: string;
  reminderDays: number[];
};
function SettingsTab() {
  const [s, setS] = useState<SettingsT | null>(null);
  useEffect(() => {
    api<SettingsT>("/admin/settings", { as: "admin" })
      .then(setS)
      .catch((e) => toast.error(e.message));
  }, []);
  if (!s) return null;
  const f = (k: keyof SettingsT) => ({
    value: String(s[k] ?? ""),
    onChange: (e: { target: { value: string } }) => setS({ ...s, [k]: e.target.value }),
  });
  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api("/admin/settings", {
        method: "PUT",
        body: { ...s, reminderDays: String(s.reminderDays).split(",").map(Number) },
        as: "admin",
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  const test = () =>
    api<{ to: string }>("/admin/test-email", { body: {}, as: "admin" })
      .then((r) => toast.success(`Test email sent to ${r.to}`))
      .catch((e) => toast.error(e.message));
  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <fieldset className="space-y-3 rounded-2xl border border-maroon/10 bg-white p-5">
        <legend className="px-2 font-display text-xl text-maroon">Razorpay</legend>
        <p className="text-xs text-maroon/60">
          Razorpay Dashboard → Account & Settings → API Keys. Use <b>test</b> keys (rzp_test_…)
          first, then switch to live keys.
        </p>
        <label className="block text-xs text-maroon/60">
          Key ID
          <input className={input} placeholder="rzp_test_…" {...f("razorpayKeyId")} />
        </label>
        <label className="block text-xs text-maroon/60">
          Key Secret (stored on the server only, never shown on the website)
          <input className={input} type="password" {...f("razorpayKeySecret")} />
        </label>
      </fieldset>
      <fieldset className="space-y-3 rounded-2xl border border-maroon/10 bg-white p-5">
        <legend className="px-2 font-display text-xl text-maroon">Email (Gmail)</legend>
        <p className="text-xs text-maroon/60">
          Turn on 2-Step Verification for the Gmail account, then create an App Password at
          myaccount.google.com/apppasswords and paste the 16 characters here.
        </p>
        <label className="block text-xs text-maroon/60">
          Gmail address
          <input
            className={input}
            type="email"
            placeholder="pinkshakti360@gmail.com"
            {...f("smtpUser")}
          />
        </label>
        <label className="block text-xs text-maroon/60">
          App password
          <input className={input} type="password" {...f("smtpPass")} />
        </label>
        <label className="block text-xs text-maroon/60">
          Sender name
          <input className={input} {...f("fromName")} />
        </label>
        <label className="block text-xs text-maroon/60">
          Send new-enquiry alerts to
          <input className={input} type="email" {...f("adminEmail")} />
        </label>
        <label className="block text-xs text-maroon/60">
          Renewal reminders (days before expiry, comma separated)
          <input className={input} {...f("reminderDays")} />
        </label>
        <button type="button" className={btnGhost} onClick={test}>
          Send test email
        </button>
      </fieldset>
      <button className={btn}>Save settings</button>
    </form>
  );
}

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, el: <Dashboard /> },
  { key: "leads", label: "Enquiries", icon: Inbox, el: <Leads /> },
  { key: "events", label: "Events", icon: CalendarDays, el: <Events /> },
  { key: "members", label: "Members", icon: Users, el: <Members /> },
  { key: "subscriptions", label: "Memberships", icon: CreditCard, el: <Subscriptions /> },
  { key: "payments", label: "Transactions", icon: Receipt, el: <Transactions /> },
  { key: "plans", label: "Plans", icon: Tags, el: <Plans /> },
  { key: "settings", label: "Settings", icon: Settings, el: <SettingsTab /> },
];

export default function AdminPage() {
  usePageMeta("Admin | Pink Shakti");
  const [loggedIn, setLoggedIn] = useState(() => !!tokens.get("admin"));
  const [tab, setTab] = useState("dashboard");
  if (!loggedIn) return <AdminLogin onIn={() => setLoggedIn(true)} />;
  const logout = () => {
    api("/admin/logout", { body: {}, as: "admin" }).catch(() => {});
    tokens.set("admin", "");
    setLoggedIn(false);
  };
  const current = TABS.find((t) => t.key === tab)!;
  return (
    <div className="min-h-screen bg-ivory lg:flex">
      <meta name="robots" content="noindex" />
      <aside className="bg-maroon text-ivory lg:w-60 lg:min-h-screen p-4">
        <p className="font-display text-xl">Pink Shakti</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6">Admin</p>
        <nav className="flex flex-wrap gap-1 lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${tab === t.key ? "bg-ivory/15 text-gold" : "hover:bg-ivory/10"}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ivory/10 lg:mt-6"
          >
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-8">
        <h1 className="mb-6 font-display text-3xl text-maroon">{current.label}</h1>
        {/* key forces a fresh load each time a tab is opened */}
        <div key={tab}>{current.el}</div>
      </main>
    </div>
  );
}
