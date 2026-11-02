// Small fetch wrapper for the Pink Shakti API (server/app.js).
const keyFor = (kind: "admin" | "user") => `ps_${kind}_token`;

export const tokens = {
  get: (kind: "admin" | "user") => {
    try {
      return localStorage.getItem(keyFor(kind)) || "";
    } catch {
      return "";
    }
  },
  set: (kind: "admin" | "user", t: string) => {
    try {
      if (t) localStorage.setItem(keyFor(kind), t);
      else localStorage.removeItem(keyFor(kind));
    } catch {
      /* storage blocked: session lasts until reload */
    }
  },
};

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; as?: "admin" | "user" } = {},
): Promise<T> {
  const token = opts.as ? tokens.get(opts.as) : "";
  const res = await fetch(`/api${path}`, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && opts.as) tokens.set(opts.as, "");
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

export const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  image: string;
  description: string;
  ticket: string;
  status: "published" | "draft";
  sample?: boolean;
};

export type Plan = {
  key: string;
  name: string;
  meaning: string;
  price: number;
  durationMonths: number;
  features: string[];
  order: number;
  active: boolean;
};
