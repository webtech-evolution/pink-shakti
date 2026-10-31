import { appwriteConfig, databases, Query, isAppwriteConfigured } from "@/lib/appwrite";
import type { Subscription } from "@/lib/types";

const { databaseId, subscriptionsCollectionId } = appwriteConfig;

export async function listSubscriptions(status?: Subscription["status"]) {
  if (!isAppwriteConfigured) return [];
  const queries = [Query.orderDesc("$createdAt"), Query.limit(300)];
  if (status) queries.push(Query.equal("status", status));
  const res = await databases.listDocuments(databaseId, subscriptionsCollectionId, queries);
  return res.documents as unknown as Subscription[];
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    subscriptionsCollectionId,
    id,
    rest,
  )) as unknown as Subscription;
}

export async function deleteSubscription(id: string) {
  await databases.deleteDocument(databaseId, subscriptionsCollectionId, id);
}
