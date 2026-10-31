import { Client, Account, Databases, Functions, Storage, ID, Query, OAuthProvider } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";

export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "pinkshakti",
  eventsCollectionId: import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID || "events",
  tiersCollectionId: import.meta.env.VITE_APPWRITE_TIERS_COLLECTION_ID || "ticket_tiers",
  registrationsCollectionId:
    import.meta.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID || "registrations",
  membershipPlansCollectionId:
    import.meta.env.VITE_APPWRITE_MEMBERSHIP_PLANS_COLLECTION_ID || "membership_plans",
  merchantsCollectionId: import.meta.env.VITE_APPWRITE_MERCHANTS_COLLECTION_ID || "merchants",
  productsCollectionId: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || "products",
  ordersCollectionId: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || "orders",
  testimonialsCollectionId:
    import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID || "testimonials",
  partnersCollectionId: import.meta.env.VITE_APPWRITE_PARTNERS_COLLECTION_ID || "partners",
  galleryCollectionId: import.meta.env.VITE_APPWRITE_GALLERY_COLLECTION_ID || "gallery",
  communityCollectionId:
    import.meta.env.VITE_APPWRITE_COMMUNITY_COLLECTION_ID || "community_members",
  membersCollectionId: import.meta.env.VITE_APPWRITE_MEMBERS_COLLECTION_ID || "members",
  subscriptionsCollectionId:
    import.meta.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID || "subscriptions",
  nominationsCollectionId: import.meta.env.VITE_APPWRITE_NOMINATIONS_COLLECTION_ID || "nominations",
  leadsCollectionId: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID || "leads",
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID || "event_images",
  adminTeamId: import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID || "admins",
  referralFunctionId: import.meta.env.VITE_APPWRITE_REFERRAL_FUNCTION_ID || "pinkshakti-referrals",
};

export const isAppwriteConfigured = Boolean(projectId);

export const client = new Client().setEndpoint(endpoint).setProject(projectId || "placeholder");

/**
 * Sessions are kept as a secret in localStorage and sent as the
 * `X-Appwrite-Session` header instead of relying on third-party cookies.
 * This keeps sign-in working in browsers/extensions that block cookies
 * (Brave shields, Safari ITP, uBlock, incognito, etc.).
 */
const SESSION_KEY = "pinkshakti_session";

export function persistSession(secret?: string | null) {
  if (typeof window === "undefined" || !secret) return;
  try {
    window.localStorage.setItem(SESSION_KEY, secret);
  } catch {
    /* storage unavailable */
  }
  client.setSession(secret);
}

export function clearPersistedSession() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem("cookieFallback");
    } catch {
      /* storage unavailable */
    }
  }
  client.setSession("");
}

export function restorePersistedSession() {
  if (typeof window === "undefined") return null;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(SESSION_KEY);
  } catch {
    stored = null;
  }
  if (stored) client.setSession(stored);
  return stored;
}

restorePersistedSession();

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export { ID, Query, OAuthProvider };
