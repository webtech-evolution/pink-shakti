import { getOrder, listOrders } from "@/lib/orders-api";
import type { Order } from "@/lib/types";

/**
 * Guest order tracking.
 *
 * Guests have no account, so every order they place is remembered locally
 * (full snapshot) and refreshed from the backend when possible. This keeps a
 * persistent order history even if the collection is not publicly readable.
 */
const KEY = "ps_guest_orders_v1";

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  email: string;
  createdAt: string;
  /** Last known state of the order. */
  snapshot: Order;
}

function safeRead(): TrackedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as TrackedOrder[]) : [];
    return Array.isArray(arr) ? arr.filter((t) => t && t.id && t.snapshot) : [];
  } catch {
    return [];
  }
}

function write(list: TrackedOrder[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
  } catch {
    /* storage full / disabled — tracking is best-effort */
  }
  window.dispatchEvent(new Event("ps-guest-orders-updated"));
}

function toTracked(order: Order): TrackedOrder {
  return {
    id: order.$id,
    orderNumber: order.orderNumber,
    email: order.email,
    createdAt: order.$createdAt || new Date().toISOString(),
    snapshot: order,
  };
}

function sortNewestFirst(list: TrackedOrder[]) {
  return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Persist (or update) one or more orders in the guest history. */
export function rememberOrders(orders: Order[]): TrackedOrder[] {
  const existing = safeRead();
  const map = new Map(existing.map((t) => [t.id, t]));
  orders.forEach((o) => {
    if (!o?.$id) return;
    const prev = map.get(o.$id);
    map.set(o.$id, { ...toTracked(o), createdAt: prev?.createdAt || toTracked(o).createdAt });
  });
  const next = sortNewestFirst(Array.from(map.values()));
  write(next);
  return next;
}

export function listTrackedOrders(): TrackedOrder[] {
  return sortNewestFirst(safeRead());
}

export function forgetOrder(id: string) {
  write(safeRead().filter((t) => t.id !== id));
}

export function clearTrackedOrders() {
  write([]);
}

/** Re-fetches every tracked order so statuses stay current. Failures keep the snapshot. */
export async function refreshTrackedOrders(): Promise<TrackedOrder[]> {
  const tracked = listTrackedOrders();
  if (tracked.length === 0) return tracked;
  const fresh = await Promise.all(
    tracked.map(async (t) => {
      try {
        return await getOrder(t.id);
      } catch {
        return null;
      }
    }),
  );
  const ok = fresh.filter(Boolean) as Order[];
  if (ok.length === 0) return tracked;
  return rememberOrders(ok);
}

/** Recovers orders placed on another device/browser using the checkout email. */
export async function lookupOrdersByEmail(email: string): Promise<Order[]> {
  const found = await listOrders({ email: email.trim().toLowerCase() });
  const alt = found.length ? found : await listOrders({ email: email.trim() });
  if (alt.length) rememberOrders(alt);
  return alt;
}
