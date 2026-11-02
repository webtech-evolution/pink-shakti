import nodemailer from "nodemailer";
import { db } from "./db.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Branded wrapper; body is trusted HTML built by us, dynamic values go through esc().
const layout = (title, body) => `
<div style="font-family:Georgia,serif;background:#faf6f1;padding:24px">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;padding:32px;color:#4a1525">
    <p style="color:#c5a059;letter-spacing:3px;font-size:11px;font-weight:bold;margin:0">PINK SHAKTI</p>
    <h1 style="font-size:24px;margin:8px 0 16px">${esc(title)}</h1>
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#5a3a44">${body}</div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin-top:32px">Pink Shakti · Ahmedabad, Gujarat · India's 360° women's ecosystem</p>
  </div>
</div>`;

export async function sendMail(to, title, bodyHtml) {
  const s = db().settings;
  if (!s.smtpUser || !s.smtpPass || !to) {
    console.log(`[mail skipped: SMTP not configured] to=${to} subject=${title}`);
    return false;
  }
  try {
    const t = nodemailer.createTransport({ service: "gmail", auth: { user: s.smtpUser, pass: s.smtpPass } });
    await t.sendMail({ from: `"${s.fromName || "Pink Shakti"}" <${s.smtpUser}>`, to, subject: title, html: layout(title, bodyHtml) });
    return true;
  } catch (e) {
    console.error("[mail failed]", e.message);
    return false;
  }
}

export const mails = {
  welcome: (u) => [`Welcome to Pink Shakti, ${u.name}!`, `<p>Hi ${esc(u.name)},</p><p>You're now a Pink Saathi. Log in to your dashboard to choose the event categories you care about, and we'll tell you when something new is planned.</p>`],
  receipt: (u, plan, pay, sub) => [
    `Payment received: ${plan.name} membership`,
    `<p>Hi ${esc(u.name)},</p><p>Thank you! Your <b>${esc(plan.name)}</b> membership is active.</p>
     <table style="width:100%;border-collapse:collapse">
       <tr><td>Amount</td><td><b>₹${pay.amount.toLocaleString("en-IN")}</b></td></tr>
       <tr><td>Payment ID</td><td>${esc(pay.razorpayPaymentId)}</td></tr>
       <tr><td>Valid till</td><td>${new Date(sub.endDate).toDateString()}</td></tr>
     </table><p>You can see all your payments in your Pink Shakti dashboard.</p>`,
  ],
  reminder: (u, plan, sub, days) => [
    `Your ${plan.name} membership renews in ${days} day${days === 1 ? "" : "s"}`,
    `<p>Hi ${esc(u.name)},</p><p>Your <b>${esc(plan.name)}</b> membership ends on <b>${new Date(sub.endDate).toDateString()}</b>. Renew from your dashboard to keep your workshops, stage time and member benefits.</p>`,
  ],
  event: (u, ev) => [
    `New event: ${ev.title}`,
    `<p>Hi ${esc(u.name)},</p><p>A new <b>${esc(ev.category)}</b> event you might love:</p>
     <p><b>${esc(ev.title)}</b><br>${esc(new Date(ev.date).toDateString())} · ${esc(ev.time)}<br>${esc(ev.city)}${ev.venue ? ", " + esc(ev.venue) : ""}</p>
     <p>${esc(ev.description)}</p>`,
  ],
  leadToAdmin: (lead) => [
    `New website enquiry: ${lead.subject}`,
    `<table>${Object.entries(lead.fields).map(([k, v]) => `<tr><td style="padding-right:12px"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>`,
  ],
};
