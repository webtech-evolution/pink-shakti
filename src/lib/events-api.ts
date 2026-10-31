import { appwriteConfig, databases, ID, Query } from "@/lib/appwrite";
import type { EventDoc, TicketTier, Registration } from "@/lib/types";

const { databaseId, eventsCollectionId, tiersCollectionId, registrationsCollectionId } =
  appwriteConfig;

// ---------- Events ----------
export async function listEvents(opts: { publishedOnly?: boolean } = {}) {
  const queries = [Query.orderDesc("startDate"), Query.limit(100)];
  if (opts.publishedOnly) queries.push(Query.equal("status", "published"));
  const res = await databases.listDocuments(databaseId, eventsCollectionId, queries);
  return res.documents as unknown as EventDoc[];
}

export async function getEvent(id: string) {
  const doc = await databases.getDocument(databaseId, eventsCollectionId, id);
  return doc as unknown as EventDoc;
}

export async function getEventBySlug(slug: string) {
  const res = await databases.listDocuments(databaseId, eventsCollectionId, [
    Query.equal("slug", slug),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as EventDoc) || null;
}

export async function createEvent(data: Omit<EventDoc, "$id">) {
  return (await databases.createDocument(
    databaseId,
    eventsCollectionId,
    ID.unique(),
    data,
  )) as unknown as EventDoc;
}

export async function updateEvent(id: string, data: Partial<EventDoc>) {
  const { $id, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    eventsCollectionId,
    id,
    rest,
  )) as unknown as EventDoc;
}

export async function deleteEvent(id: string) {
  await databases.deleteDocument(databaseId, eventsCollectionId, id);
}

// ---------- Ticket Tiers ----------
export async function listTiers(eventId: string) {
  const res = await databases.listDocuments(databaseId, tiersCollectionId, [
    Query.equal("eventId", eventId),
    Query.orderAsc("order"),
    Query.limit(50),
  ]);
  return res.documents as unknown as TicketTier[];
}

export async function createTier(data: Omit<TicketTier, "$id" | "sold">) {
  return (await databases.createDocument(databaseId, tiersCollectionId, ID.unique(), {
    ...data,
    sold: 0,
  })) as unknown as TicketTier;
}

export async function updateTier(id: string, data: Partial<TicketTier>) {
  const { $id, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    tiersCollectionId,
    id,
    rest,
  )) as unknown as TicketTier;
}

export async function deleteTier(id: string) {
  await databases.deleteDocument(databaseId, tiersCollectionId, id);
}

// ---------- Registrations ----------
export async function createRegistration(data: Omit<Registration, "$id" | "$createdAt">) {
  return (await databases.createDocument(
    databaseId,
    registrationsCollectionId,
    ID.unique(),
    data,
  )) as unknown as Registration;
}

export async function updateRegistration(id: string, data: Partial<Registration>) {
  const { $id, $createdAt, ...rest } = data as any;
  return (await databases.updateDocument(
    databaseId,
    registrationsCollectionId,
    id,
    rest,
  )) as unknown as Registration;
}

export async function listRegistrations(eventId?: string) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(200)];
  if (eventId) queries.push(Query.equal("eventId", eventId));
  const res = await databases.listDocuments(databaseId, registrationsCollectionId, queries);
  return res.documents as unknown as Registration[];
}
