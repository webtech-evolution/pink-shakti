import express from "express";
import crypto from "node:crypto";
import { db, save, id, now, hashPassword, checkPassword } from "./db.js";
import { sendMail, mails } from "./mail.js";
import { CATEGORIES } from "./seed.js";

export const app = express();
app.use(express.json({ limit: "200kb" }));

const SESSION_DAYS = 30;
const str = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const publicUser = ({ passwordHash, ...u }) => u;
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ---------- sessions ----------
function newSession(kind, subjectId) {
  const token = crypto.randomBytes(32).toString("hex");
  const d = db();
  d.sessions = d.sessions.filter((s) => new Date(s.expiresAt) > new Date());
  d.sessions.push({ token, kind, subjectId, expiresAt: new Date(Date.now() + SESSION_DAYS * 864e5).toISOString() });
  save();
  return token;
}
const auth = (kind) => (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const s = token && db().sessions.find((x) => x.token === token && x.kind === kind && new Date(x.expiresAt) > new Date());
  if (!s) return bad(res, "Please log in again.", 401);
  req.subjectId = s.subjectId;
  req.token = token;
  next();
};
const logout = (req, res) => {
  db().sessions = db().sessions.filter((s) => s.token !== req.token);
  save();
  res.json({ ok: true });
};

// ---------- helpers ----------
const plan = (key) => db().plans.find((p) => p.key === key);
const activeSub = (userId) =>
  db()
    .subscriptions.filter((s) => s.userId === userId && s.status === "active")
    .sort((a, b) => (plan(b.planKey)?.order ?? 0) - (plan(a.planKey)?.order ?? 0))[0];
const addMonths = (date, m) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d.toISOString();
};
function notify(userId, title, body, link = "") {
  db().notifications.push({ id: id(), userId, title, body, link, read: false, createdAt: now() });
}
const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "event";

// ---------- public ----------
app.get("/api/config", (req, res) => res.json({ razorpayKeyId: db().settings.razorpayKeyId, categories: CATEGORIES }));

app.get("/api/events", (req, res) =>
  res.json(db().events.filter((e) => e.status === "published").sort((a, b) => a.date.localeCompare(b.date))),
);
app.get("/api/events/:slug", (req, res) => {
  const e = db().events.find((x) => x.slug === req.params.slug && x.status === "published");
  return e ? res.json(e) : bad(res, "Event not found", 404);
});
app.get("/api/plans", (req, res) => res.json(db().plans.filter((p) => p.active).sort((a, b) => a.order - b.order)));

app.post("/api/leads", wrap(async (req, res) => {
  const subject = str(req.body?.subject, 200);
  const raw = req.body?.fields;
  if (!subject || !raw || typeof raw !== "object") return bad(res, "Missing form details.");
  const fields = Object.fromEntries(Object.entries(raw).slice(0, 20).map(([k, v]) => [str(k, 100), str(v, 3000)]));
  const lead = { id: id(), subject, fields, page: str(req.body?.page, 200), status: "new", createdAt: now() };
  db().leads.unshift(lead);
  save();
  const admin = db().settings.adminEmail || db().settings.smtpUser;
  if (admin) sendMail(admin, ...mails.leadToAdmin(lead));
  res.json({ ok: true });
}));

// ---------- customer auth ----------
app.post("/api/auth/register", wrap(async (req, res) => {
  const name = str(req.body?.name, 100);
  const email = str(req.body?.email, 200).toLowerCase();
  const password = String(req.body?.password || "");
  if (!name || !emailOk(email)) return bad(res, "Please enter your name and a valid email.");
  if (password.length < 8) return bad(res, "Password must be at least 8 characters.");
  const d = db();
  if (d.users.some((u) => u.email === email)) return bad(res, "An account with this email already exists. Please log in.");
  const user = {
    id: id(), name, email, phone: str(req.body?.phone, 20), city: str(req.body?.city, 60),
    interests: [], passwordHash: hashPassword(password), createdAt: now(),
  };
  d.users.push(user);
  d.subscriptions.push({ id: id(), userId: user.id, planKey: "aarambh", startDate: now(), endDate: null, status: "active", remindersSent: [] });
  notify(user.id, "Welcome to Pink Shakti!", "Choose your favourite event categories in your profile to get alerts for new events.");
  save();
  sendMail(user.email, ...mails.welcome(user));
  res.json({ token: newSession("user", user.id) });
}));

app.post("/api/auth/login", (req, res) => {
  const email = str(req.body?.email, 200).toLowerCase();
  const user = db().users.find((u) => u.email === email);
  if (!user || !checkPassword(String(req.body?.password || ""), user.passwordHash)) return bad(res, "Wrong email or password.", 401);
  res.json({ token: newSession("user", user.id) });
});
app.post("/api/auth/logout", auth("user"), logout);

// ---------- customer dashboard ----------
app.get("/api/me", auth("user"), (req, res) => {
  const d = db();
  const user = d.users.find((u) => u.id === req.subjectId);
  if (!user) return bad(res, "Account not found", 404);
  const sub = activeSub(user.id);
  res.json({
    user: publicUser(user),
    subscription: sub ? { ...sub, plan: plan(sub.planKey) } : null,
    subscriptions: d.subscriptions.filter((s) => s.userId === user.id).map((s) => ({ ...s, planName: plan(s.planKey)?.name })).reverse(),
    payments: d.payments.filter((p) => p.userId === user.id && p.status === "paid").reverse(),
    notifications: d.notifications.filter((n) => n.userId === user.id).slice(-50).reverse(),
  });
});
app.put("/api/me", auth("user"), (req, res) => {
  const user = db().users.find((u) => u.id === req.subjectId);
  if (!user) return bad(res, "Account not found", 404);
  if (req.body.name !== undefined) user.name = str(req.body.name, 100) || user.name;
  if (req.body.phone !== undefined) user.phone = str(req.body.phone, 20);
  if (req.body.city !== undefined) user.city = str(req.body.city, 60);
  if (Array.isArray(req.body.interests)) user.interests = req.body.interests.filter((c) => CATEGORIES.includes(c));
  save();
  res.json({ user: publicUser(user) });
});
app.post("/api/me/notifications/read", auth("user"), (req, res) => {
  db().notifications.forEach((n) => n.userId === req.subjectId && (n.read = true));
  save();
  res.json({ ok: true });
});

// ---------- payments (Razorpay) ----------
app.post("/api/pay/order", auth("user"), wrap(async (req, res) => {
  const { razorpayKeyId, razorpayKeySecret } = db().settings;
  if (!razorpayKeyId || !razorpayKeySecret) return bad(res, "Online payment is not set up yet. Please contact the Pink Shakti team.");
  const p = plan(str(req.body?.planKey, 40));
  if (!p || !p.active || !p.price) return bad(res, "Please choose a paid plan.");
  const amount = Math.round(p.price * 100); // price always comes from our DB, never from the browser
  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64") },
    body: JSON.stringify({ amount, currency: "INR", receipt: `ps_${Date.now()}`, notes: { plan: p.key, userId: req.subjectId } }),
  });
  const order = await r.json();
  if (!r.ok) return bad(res, order?.error?.description || "Could not start payment.", 502);
  db().payments.push({
    id: id(), userId: req.subjectId, planKey: p.key, planName: p.name, amount: p.price, currency: "INR",
    razorpayOrderId: order.id, razorpayPaymentId: "", status: "created", createdAt: now(),
  });
  save();
  const user = db().users.find((u) => u.id === req.subjectId);
  res.json({ orderId: order.id, amount, keyId: razorpayKeyId, planName: p.name, prefill: { name: user.name, email: user.email, contact: user.phone } });
}));

app.post("/api/pay/verify", auth("user"), wrap(async (req, res) => {
  const d = db();
  const orderId = str(req.body?.orderId, 100);
  const paymentId = str(req.body?.paymentId, 100);
  const signature = str(req.body?.signature, 200);
  const pay = d.payments.find((p) => p.razorpayOrderId === orderId && p.userId === req.subjectId);
  if (!pay) return bad(res, "Payment not found.", 404);
  if (pay.status === "paid") return res.json({ ok: true });
  const expected = crypto.createHmac("sha256", d.settings.razorpayKeySecret).update(`${orderId}|${paymentId}`).digest("hex");
  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    pay.status = "failed";
    save();
    return bad(res, "Payment could not be verified. If money was deducted, contact us with your payment ID.");
  }
  const p = plan(pay.planKey);
  pay.status = "paid";
  pay.razorpayPaymentId = paymentId;
  pay.paidAt = now();

  // Renewing the same plan extends it; a different plan replaces the current one from today.
  const current = activeSub(pay.userId);
  let sub;
  if (current && current.planKey === p.key && current.endDate && new Date(current.endDate) > new Date()) {
    current.endDate = addMonths(current.endDate, p.durationMonths || 12);
    current.remindersSent = [];
    sub = current;
  } else {
    d.subscriptions.forEach((s) => s.userId === pay.userId && s.status === "active" && (s.status = "replaced"));
    sub = { id: id(), userId: pay.userId, planKey: p.key, startDate: now(), endDate: addMonths(now(), p.durationMonths || 12), status: "active", remindersSent: [] };
    d.subscriptions.push(sub);
  }
  pay.subscriptionId = sub.id;
  notify(pay.userId, `${p.name} membership active`, `Payment of ₹${pay.amount.toLocaleString("en-IN")} received. Valid till ${new Date(sub.endDate).toDateString()}.`);
  save();
  const user = d.users.find((u) => u.id === pay.userId);
  sendMail(user.email, ...mails.receipt(user, p, pay, sub));
  res.json({ ok: true });
}));

// ---------- renewal reminders ----------
export function runReminders() {
  const d = db();
  const days = d.settings.reminderDays?.length ? d.settings.reminderDays : [7, 1];
  let changed = false;
  for (const s of d.subscriptions) {
    if (s.status !== "active" || !s.endDate) continue;
    const left = Math.ceil((new Date(s.endDate) - Date.now()) / 864e5);
    if (left <= 0) {
      s.status = "expired";
      notify(s.userId, "Membership expired", `Your ${plan(s.planKey)?.name} membership has ended. Renew any time from your dashboard.`);
      changed = true;
      continue;
    }
    const due = days.find((n) => left <= n && !s.remindersSent.includes(n));
    if (due === undefined) continue;
    s.remindersSent.push(...days.filter((n) => n >= left));
    const user = d.users.find((u) => u.id === s.userId);
    const p = plan(s.planKey);
    if (user && p) {
      notify(user.id, `Renewal reminder: ${left} day${left === 1 ? "" : "s"} left`, `Your ${p.name} membership ends on ${new Date(s.endDate).toDateString()}.`, "/membership");
      sendMail(user.email, ...mails.reminder(user, p, s, left));
    }
    changed = true;
  }
  if (changed) save();
}

// ---------- event alerts ----------
function announceEvent(ev) {
  if (ev.status !== "published" || ev.announcedAt) return;
  ev.announcedAt = now();
  for (const u of db().users.filter((x) => x.interests?.includes(ev.category))) {
    notify(u.id, `New event: ${ev.title}`, `${new Date(ev.date).toDateString()} · ${ev.city}`, `/events/${ev.slug}`);
    sendMail(u.email, ...mails.event(u, ev));
  }
}

// ---------- admin ----------
app.get("/api/admin/status", (req, res) => res.json({ needsSetup: db().admins.length === 0 }));
app.post("/api/admin/setup", (req, res) => {
  const d = db();
  if (d.admins.length) return bad(res, "Admin already set up.", 403);
  const email = str(req.body?.email, 200).toLowerCase();
  const password = String(req.body?.password || "");
  if (!emailOk(email) || password.length < 10) return bad(res, "Use a valid email and a password of at least 10 characters.");
  const admin = { id: id(), email, passwordHash: hashPassword(password), createdAt: now() };
  d.admins.push(admin);
  if (!d.settings.adminEmail) d.settings.adminEmail = email;
  save();
  res.json({ token: newSession("admin", admin.id) });
});
app.post("/api/admin/login", (req, res) => {
  const a = db().admins.find((x) => x.email === str(req.body?.email, 200).toLowerCase());
  if (!a || !checkPassword(String(req.body?.password || ""), a.passwordHash)) return bad(res, "Wrong email or password.", 401);
  res.json({ token: newSession("admin", a.id) });
});

const admin = express.Router();
admin.use(auth("admin"));
app.use("/api/admin", admin);

admin.post("/logout", logout);
admin.get("/summary", (req, res) => {
  const d = db();
  const paid = d.payments.filter((p) => p.status === "paid");
  res.json({
    newLeads: d.leads.filter((l) => l.status === "new").length,
    members: d.users.length,
    activePaid: d.subscriptions.filter((s) => s.status === "active" && plan(s.planKey)?.price).length,
    revenue: paid.reduce((t, p) => t + p.amount, 0),
    upcomingEvents: d.events.filter((e) => e.status === "published" && e.date >= now().slice(0, 10)).length,
  });
});

admin.get("/leads", (req, res) => res.json(db().leads));
admin.patch("/leads/:id", (req, res) => {
  const l = db().leads.find((x) => x.id === req.params.id);
  if (!l) return bad(res, "Not found", 404);
  l.status = ["new", "contacted", "closed"].includes(req.body?.status) ? req.body.status : l.status;
  save();
  res.json(l);
});
admin.delete("/leads/:id", (req, res) => {
  db().leads = db().leads.filter((x) => x.id !== req.params.id);
  save();
  res.json({ ok: true });
});

admin.get("/events", (req, res) => res.json([...db().events].sort((a, b) => b.date.localeCompare(a.date))));
function readEvent(body, existing = {}) {
  const e = {
    title: str(body.title, 200), category: CATEGORIES.includes(body.category) ? body.category : CATEGORIES[0],
    date: str(body.date, 10), time: str(body.time, 60), city: str(body.city, 80), venue: str(body.venue, 200),
    image: str(body.image, 1000), description: str(body.description, 5000), ticket: str(body.ticket, 120),
    status: body.status === "draft" ? "draft" : "published",
  };
  if (!e.title || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return null;
  return { ...existing, ...e, sample: false };
}
admin.post("/events", (req, res) => {
  const e = readEvent(req.body || {});
  if (!e) return bad(res, "Title and date are required.");
  let slug = slugify(e.title);
  while (db().events.some((x) => x.slug === slug)) slug += "-" + crypto.randomBytes(2).toString("hex");
  const ev = { id: id(), slug, createdAt: now(), ...e };
  db().events.push(ev);
  announceEvent(ev);
  save();
  res.json(ev);
});
admin.put("/events/:id", (req, res) => {
  const d = db();
  const i = d.events.findIndex((x) => x.id === req.params.id);
  if (i < 0) return bad(res, "Not found", 404);
  const e = readEvent(req.body || {}, d.events[i]);
  if (!e) return bad(res, "Title and date are required.");
  d.events[i] = e;
  announceEvent(e);
  save();
  res.json(e);
});
admin.delete("/events/:id", (req, res) => {
  db().events = db().events.filter((x) => x.id !== req.params.id);
  save();
  res.json({ ok: true });
});

admin.get("/members", (req, res) => {
  const d = db();
  res.json(d.users.map((u) => {
    const s = activeSub(u.id);
    return { ...publicUser(u), plan: s ? plan(s.planKey)?.name : "", planEnd: s?.endDate || null, totalPaid: d.payments.filter((p) => p.userId === u.id && p.status === "paid").reduce((t, p) => t + p.amount, 0) };
  }).reverse());
});
admin.get("/subscriptions", (req, res) => {
  const d = db();
  res.json(d.subscriptions.map((s) => {
    const u = d.users.find((x) => x.id === s.userId);
    return { ...s, planName: plan(s.planKey)?.name, userName: u?.name, userEmail: u?.email };
  }).reverse());
});
admin.get("/payments", (req, res) => {
  const d = db();
  res.json(d.payments.map((p) => {
    const u = d.users.find((x) => x.id === p.userId);
    return { ...p, userName: u?.name, userEmail: u?.email };
  }).reverse());
});

admin.get("/plans", (req, res) => res.json(db().plans));
admin.put("/plans/:key", (req, res) => {
  const p = plan(req.params.key);
  if (!p) return bad(res, "Not found", 404);
  if (req.body.name !== undefined) p.name = str(req.body.name, 60) || p.name;
  if (req.body.meaning !== undefined) p.meaning = str(req.body.meaning, 60);
  if (req.body.price !== undefined && p.key !== "aarambh") p.price = Math.max(0, Math.round(Number(req.body.price) || 0));
  if (Array.isArray(req.body.features)) p.features = req.body.features.map((f) => str(f, 200)).filter(Boolean).slice(0, 20);
  if (req.body.active !== undefined) p.active = !!req.body.active;
  save();
  res.json(p);
});

admin.get("/settings", (req, res) => {
  const s = db().settings;
  res.json({ ...s, razorpayKeySecret: s.razorpayKeySecret ? "••••••••" : "", smtpPass: s.smtpPass ? "••••••••" : "" });
});
admin.put("/settings", (req, res) => {
  const s = db().settings;
  for (const k of ["razorpayKeyId", "smtpUser", "fromName", "adminEmail"]) if (req.body[k] !== undefined) s[k] = str(req.body[k], 200);
  // Masked or empty secrets mean "keep the saved one".
  for (const k of ["razorpayKeySecret", "smtpPass"]) if (req.body[k] && !String(req.body[k]).includes("•")) s[k] = str(req.body[k], 200).replace(/\s/g, "");
  if (Array.isArray(req.body.reminderDays)) s.reminderDays = req.body.reminderDays.map(Number).filter((n) => n > 0 && n < 90);
  save();
  res.json({ ok: true });
});
admin.post("/test-email", wrap(async (req, res) => {
  const to = db().settings.adminEmail || db().settings.smtpUser;
  const ok = await sendMail(to, "Test email from Pink Shakti", "<p>Your Gmail settings work. 🎉</p>");
  return ok ? res.json({ ok: true, to }) : bad(res, "Email failed. Check the Gmail address and 16-character app password.");
}));
admin.post("/run-reminders", (req, res) => {
  runReminders();
  res.json({ ok: true });
});

app.use("/api", (req, res) => bad(res, "Not found", 404));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});
