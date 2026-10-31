import { appwriteConfig, databases, ID, Query } from "@/lib/appwrite";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

const { databaseId, ordersCollectionId } = appwriteConfig;

export function encodeItems(items: OrderItem[]): string[] {
  return items.map((i) => JSON.stringify(i));
}

export function parseItems(order: Order): OrderItem[] {
  const raw = order.items as unknown;
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (typeof entry !== "string") return entry as OrderItem;
        try {
          return JSON.parse(entry) as OrderItem;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as OrderItem[];
  }
  try {
    return JSON.parse((raw as string) || "[]") as OrderItem[];
  } catch {
    return [];
  }
}

export function makeOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  return `PS-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export interface ListOrdersOpts {
  merchantId?: string;
  email?: string;
  paymentStatus?: Order["paymentStatus"];
  limit?: number;
}

export async function listOrders(opts: ListOrdersOpts = {}) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(opts.limit ?? 100)];
  if (opts.merchantId) queries.push(Query.equal("merchantId", opts.merchantId));
  if (opts.email) queries.push(Query.equal("email", opts.email));
  if (opts.paymentStatus) queries.push(Query.equal("paymentStatus", opts.paymentStatus));
  const res = await databases.listDocuments(databaseId, ordersCollectionId, queries);
  return res.documents as unknown as Order[];
}

export async function getOrder(id: string) {
  return (await databases.getDocument(databaseId, ordersCollectionId, id)) as unknown as Order;
}

export async function createOrder(data: Omit<Order, "$id" | "$createdAt">) {
  return (await databases.createDocument(
    databaseId,
    ordersCollectionId,
    ID.unique(),
    data,
  )) as unknown as Order;
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    ordersCollectionId,
    id,
    rest,
  )) as unknown as Order;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  return updateOrder(id, { orderStatus: status });
}
