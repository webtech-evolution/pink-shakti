import { appwriteConfig, databases, ID, Query } from "@/lib/appwrite";
import type { Product } from "@/lib/types";

const { databaseId, productsCollectionId } = appwriteConfig;

export interface ListProductsOpts {
  merchantId?: string;
  activeOnly?: boolean;
  category?: string;
  search?: string;
  limit?: number;
}

export async function listProducts(opts: ListProductsOpts = {}) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(opts.limit ?? 100)];
  if (opts.merchantId) queries.push(Query.equal("merchantId", opts.merchantId));
  if (opts.activeOnly) queries.push(Query.equal("status", "active"));
  if (opts.category) queries.push(Query.equal("category", opts.category));
  if (opts.search) queries.push(Query.search("title", opts.search));
  const res = await databases.listDocuments(databaseId, productsCollectionId, queries);
  return res.documents as unknown as Product[];
}

export async function getProduct(id: string) {
  return (await databases.getDocument(
    databaseId,
    productsCollectionId,
    id,
  )) as unknown as Product;
}

export async function countMerchantProducts(merchantId: string) {
  const res = await databases.listDocuments(databaseId, productsCollectionId, [
    Query.equal("merchantId", merchantId),
    Query.limit(1),
  ]);
  return res.total;
}

export async function createProduct(data: Omit<Product, "$id" | "$createdAt">) {
  return (await databases.createDocument(
    databaseId,
    productsCollectionId,
    ID.unique(),
    data,
  )) as unknown as Product;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    productsCollectionId,
    id,
    rest,
  )) as unknown as Product;
}

export async function deleteProduct(id: string) {
  await databases.deleteDocument(databaseId, productsCollectionId, id);
}

export function formatINR(n: number) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}
