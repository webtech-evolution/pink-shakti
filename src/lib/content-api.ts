import { appwriteConfig, databases, ID, Query, isAppwriteConfigured } from "@/lib/appwrite";
import type { Member, Partner, GalleryItem, Subscription, Testimonial } from "@/lib/types";

const {
  databaseId,
  testimonialsCollectionId,
  partnersCollectionId,
  galleryCollectionId,
  communityCollectionId,
  membersCollectionId,
  subscriptionsCollectionId,
  nominationsCollectionId,
  leadsCollectionId,
} = appwriteConfig;

async function list<T>(collectionId: string, publicOnly: boolean): Promise<T[]> {
  if (!isAppwriteConfigured) return [];
  const queries = [Query.orderAsc("order"), Query.limit(100)];
  if (publicOnly) queries.push(Query.equal("status", "active"));
  try {
    const res = await databases.listDocuments(databaseId, collectionId, queries);
    return res.documents as unknown as T[];
  } catch {
    // Collection missing or not readable yet — fall back to built-in content.
    return [];
  }
}

function create<T>(collectionId: string, data: Record<string, unknown>): Promise<T> {
  return databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    data,
  ) as unknown as Promise<T>;
}

function update<T>(collectionId: string, id: string, data: Record<string, unknown>): Promise<T> {
  const clean = { ...data };
  delete (clean as any).$id;
  delete (clean as any).$createdAt;
  delete (clean as any).$updatedAt;
  delete (clean as any).$permissions;
  delete (clean as any).$databaseId;
  delete (clean as any).$collectionId;
  return databases.updateDocument(databaseId, collectionId, id, clean) as unknown as Promise<T>;
}

function remove(collectionId: string, id: string) {
  return databases.deleteDocument(databaseId, collectionId, id);
}

// ---------- Testimonials ----------
export const listTestimonials = (publicOnly = true) =>
  list<Testimonial>(testimonialsCollectionId, publicOnly);
export const createTestimonial = (d: Omit<Testimonial, "$id">) =>
  create<Testimonial>(testimonialsCollectionId, d);
export const updateTestimonial = (id: string, d: Partial<Testimonial>) =>
  update<Testimonial>(testimonialsCollectionId, id, d);
export const deleteTestimonial = (id: string) => remove(testimonialsCollectionId, id);

// ---------- Partners ----------
export const listPartners = (publicOnly = true) => list<Partner>(partnersCollectionId, publicOnly);
export const createPartner = (d: Omit<Partner, "$id">) => create<Partner>(partnersCollectionId, d);
export const updatePartner = (id: string, d: Partial<Partner>) =>
  update<Partner>(partnersCollectionId, id, d);
export const deletePartner = (id: string) => remove(partnersCollectionId, id);

// ---------- Media gallery ----------
export const listGallery = (publicOnly = true) =>
  list<GalleryItem>(galleryCollectionId, publicOnly);
export const createGalleryItem = (d: Omit<GalleryItem, "$id">) =>
  create<GalleryItem>(galleryCollectionId, d);
export const updateGalleryItem = (id: string, d: Partial<GalleryItem>) =>
  update<GalleryItem>(galleryCollectionId, id, d);
export const deleteGalleryItem = (id: string) => remove(galleryCollectionId, id);

// ---------- Community members (free Pink Shakti community) ----------
export interface CommunityJoinInput {
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  dob: string;
  address: string;
  city?: string;
  state?: string;
  interests?: string[];
  about?: string;
}

export const joinCommunity = (d: CommunityJoinInput) =>
  create(communityCollectionId, { ...d, status: "pending" });

// ---------- Authenticated community members ----------
export interface MemberInput {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  dob: string;
  address: string;
  city?: string;
  state?: string;
  interests?: string[];
  about?: string;
}

export async function getMemberByUserId(userId: string): Promise<Member | null> {
  if (!isAppwriteConfigured) return null;
  const res = await databases.listDocuments(databaseId, membersCollectionId, [
    Query.equal("userId", userId),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as Member) || null;
}

export async function createMember(input: MemberInput): Promise<Member> {
  const memberNumber = `PS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return create<Member>(membersCollectionId, {
    ...input,
    memberNumber,
    interests: input.interests || [],
    status: "active",
    joinedAt: new Date().toISOString(),
  });
}

export const updateMember = (id: string, data: Partial<Member>) =>
  update<Member>(membersCollectionId, id, data);

export async function listMembers(): Promise<Member[]> {
  if (!isAppwriteConfigured) return [];
  const res = await databases.listDocuments(databaseId, membersCollectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(200),
  ]);
  return res.documents as unknown as Member[];
}

export async function listSubscriptions(): Promise<Subscription[]> {
  if (!isAppwriteConfigured) return [];
  const res = await databases.listDocuments(databaseId, subscriptionsCollectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(200),
  ]);
  return res.documents as unknown as Subscription[];
}

// ---------- Award nominations ----------
export interface NominationInput {
  category: string;
  nomineeName: string;
  nomineeEmail?: string;
  nomineePhone?: string;
  achievements: string;
  nominatedBy: string;
  nominatorEmail: string;
  city?: string;
  linkedin?: string;
}

export const submitNomination = (d: NominationInput) =>
  create(nominationsCollectionId, { ...d, status: "received" });

// ---------- Leads (partner enquiries, CSR, newsletter, contact) ----------
export type LeadType = "partner" | "csr" | "newsletter" | "contact";

export interface Lead {
  $id: string;
  type: LeadType;
  name?: string;
  email: string;
  phone?: string;
  organisation?: string;
  message?: string;
  status: string;
  $createdAt?: string;
}

export type LeadStatus = "new" | "contacted";

export const submitLead = (d: {
  type: LeadType;
  name?: string;
  email: string;
  phone?: string;
  organisation?: string;
  message?: string;
}) => create(leadsCollectionId, { ...d, status: "new" });

export async function listLeads(): Promise<Lead[]> {
  if (!isAppwriteConfigured) return [];
  const res = await databases.listDocuments(databaseId, leadsCollectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ]);
  return res.documents as unknown as Lead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return update<Lead>(leadsCollectionId, id, { status });
}
