import { appwriteConfig, databases, ID, Query } from "@/lib/appwrite";
import type { MembershipPlan, Merchant } from "@/lib/types";

const { databaseId, membershipPlansCollectionId, merchantsCollectionId } = appwriteConfig;

// ---------- Plans ----------
export async function listPlans(opts: { activeOnly?: boolean } = {}) {
  const queries = [Query.orderAsc("order"), Query.limit(100)];
  if (opts.activeOnly) queries.push(Query.equal("status", "active"));
  const res = await databases.listDocuments(databaseId, membershipPlansCollectionId, queries);
  // Appwrite string[] attribute — features already an array. Ensure defaults.
  return (res.documents as unknown as MembershipPlan[]).map((p) => ({
    ...p,
    features: Array.isArray(p.features) ? p.features : [],
  }));
}

export async function getPlan(id: string) {
  const doc = await databases.getDocument(databaseId, membershipPlansCollectionId, id);
  const p = doc as unknown as MembershipPlan;
  return { ...p, features: Array.isArray(p.features) ? p.features : [] };
}

export async function createPlan(data: Omit<MembershipPlan, "$id" | "$createdAt">) {
  return (await databases.createDocument(
    databaseId,
    membershipPlansCollectionId,
    ID.unique(),
    data,
  )) as unknown as MembershipPlan;
}

export async function updatePlan(id: string, data: Partial<MembershipPlan>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    membershipPlansCollectionId,
    id,
    rest,
  )) as unknown as MembershipPlan;
}

export async function deletePlan(id: string) {
  await databases.deleteDocument(databaseId, membershipPlansCollectionId, id);
}

// ---------- Merchants ----------
export async function listMerchants(status?: Merchant["status"]) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(200)];
  if (status) queries.push(Query.equal("status", status));
  const res = await databases.listDocuments(databaseId, merchantsCollectionId, queries);
  return res.documents as unknown as Merchant[];
}

export async function getMerchantById(id: string) {
  return (await databases.getDocument(
    databaseId,
    merchantsCollectionId,
    id,
  )) as unknown as Merchant;
}

export async function getMerchantByUserId(userId: string): Promise<Merchant | null> {
  const res = await databases.listDocuments(databaseId, merchantsCollectionId, [
    Query.equal("userId", userId),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as Merchant) || null;
}

export async function createMerchant(data: Omit<Merchant, "$id" | "$createdAt">) {
  return (await databases.createDocument(
    databaseId,
    merchantsCollectionId,
    ID.unique(),
    data,
  )) as unknown as Merchant;
}

export async function updateMerchant(id: string, data: Partial<Merchant>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    merchantsCollectionId,
    id,
    rest,
  )) as unknown as Merchant;
}

export function planDurationLabel(d: MembershipPlan["duration"]) {
  return d === "yearly" ? "/yr" : " · lifetime";
}
