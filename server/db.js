// Tiny JSON-file database.
// shortcut: whole DB lives in one JSON file rewritten on every change; fine for hundreds of members, move to Postgres/SQLite before thousands.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { seedEvents, seedPlans } from "./seed.js";

const DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "server/data");
const FILE = path.join(DIR, "db.json");

const empty = () => ({
  admins: [],
  users: [],
  sessions: [],
  leads: [],
  events: seedEvents(),
  plans: seedPlans(),
  subscriptions: [],
  payments: [],
  notifications: [],
  settings: {
    razorpayKeyId: "",
    razorpayKeySecret: "",
    smtpUser: "",
    smtpPass: "",
    fromName: "Pink Shakti",
    adminEmail: "",
    reminderDays: [7, 1],
  },
});

let data;

export function db() {
  if (!data) {
    fs.mkdirSync(DIR, { recursive: true });
    data = fs.existsSync(FILE) ? { ...empty(), ...JSON.parse(fs.readFileSync(FILE, "utf8")) } : empty();
    if (!fs.existsSync(FILE)) save();
  }
  return data;
}

export function save() {
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE); // atomic replace so a crash never leaves a half-written file
}

export const id = () => crypto.randomUUID();
export const now = () => new Date().toISOString();

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(pw, salt, 64).toString("hex")}`;
}

export function checkPassword(pw, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = crypto.scryptSync(pw, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
