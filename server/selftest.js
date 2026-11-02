// Quick API self-check: `node server/selftest.js` (uses a throwaway data folder).
import assert from "node:assert/strict";
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "ps-"));
const { app, runReminders } = await import("./app.js");
const { db, save } = await import("./db.js");

const srv = app.listen(0);
const base = `http://127.0.0.1:${srv.address().port}/api`;
const call = async (method, url, body, token) => {
  const r = await fetch(base + url, { method, headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
  return { status: r.status, json: await r.json() };
};

try {
  assert.equal((await call("GET", "/events")).json.length, 6, "6 sample events");
  assert.equal((await call("GET", "/admin/status")).json.needsSetup, true);
  const admin = (await call("POST", "/admin/setup", { email: "a@b.com", password: "longpassword1" })).json.token;
  assert.ok(admin);
  assert.equal((await call("POST", "/admin/setup", { email: "x@b.com", password: "longpassword1" })).status, 403, "second setup blocked");
  assert.equal((await call("GET", "/admin/leads")).status, 401, "admin route needs login");

  assert.ok((await call("POST", "/leads", { subject: "Hi", fields: { Name: "Riya" } })).json.ok);
  assert.equal((await call("GET", "/admin/leads", null, admin)).json[0].fields.Name, "Riya");

  const user = (await call("POST", "/auth/register", { name: "Riya", email: "r@x.com", password: "password123" })).json.token;
  assert.equal((await call("GET", "/admin/leads", null, user)).status, 401, "user token can't reach admin");
  await call("PUT", "/me", { interests: ["Health & Wellness", "bogus"] }, user);
  let me = (await call("GET", "/me", null, user)).json;
  assert.deepEqual(me.user.interests, ["Health & Wellness"]);
  assert.equal(me.subscription.planKey, "aarambh");
  assert.equal(me.user.passwordHash, undefined, "hash never sent");

  await call("POST", "/admin/events", { title: "Yoga Day", date: "2027-06-21", category: "Health & Wellness" }, admin);
  me = (await call("GET", "/me", null, user)).json;
  assert.ok(me.notifications.some((n) => n.title.includes("Yoga Day")), "interest alert sent");

  assert.equal((await call("POST", "/pay/order", { planKey: "udaan" }, user)).status, 400, "no keys -> clear error");
  await call("PUT", "/admin/settings", { razorpayKeyId: "rzp_test_x", razorpayKeySecret: "sekret" }, admin);
  assert.equal((await call("GET", "/admin/settings", null, admin)).json.razorpayKeySecret, "••••••••", "secret masked");
  await call("PUT", "/admin/settings", { razorpayKeySecret: "••••••••" }, admin);
  assert.equal(db().settings.razorpayKeySecret, "sekret", "masked value keeps secret");

  // Simulate a created order, then verify with a forged and a real signature.
  const uid = db().users[0].id;
  db().payments.push({ id: "p1", userId: uid, planKey: "udaan", planName: "Udaan", amount: 1499, razorpayOrderId: "order_1", status: "created" });
  save();
  assert.equal((await call("POST", "/pay/verify", { orderId: "order_1", paymentId: "pay_1", signature: "f".repeat(64) }, user)).status, 400, "forged signature rejected");
  db().payments.find((p) => p.id === "p1").status = "created";
  const sig = crypto.createHmac("sha256", "sekret").update("order_1|pay_1").digest("hex");
  assert.ok((await call("POST", "/pay/verify", { orderId: "order_1", paymentId: "pay_1", signature: sig }, user)).json.ok);
  me = (await call("GET", "/me", null, user)).json;
  assert.equal(me.subscription.planKey, "udaan");
  assert.equal(me.payments.length, 1);

  // Renewal reminder fires once at 7 days.
  const sub = db().subscriptions.find((s) => s.planKey === "udaan");
  sub.endDate = new Date(Date.now() + 6.5 * 864e5).toISOString();
  runReminders();
  runReminders();
  me = (await call("GET", "/me", null, user)).json;
  assert.equal(me.notifications.filter((n) => n.title.startsWith("Renewal reminder")).length, 1, "one reminder");

  const sum = (await call("GET", "/admin/summary", null, admin)).json;
  assert.equal(sum.revenue, 1499);
  console.log("selftest passed");
} finally {
  srv.close();
}
