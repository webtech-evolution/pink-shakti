export interface AttributeSpec {
  key: string;
  type: string;
  size: string;
  required: boolean;
  notes?: string;
}

export interface CollectionSpec {
  id: string;
  title: string;
  envVar: string;
  purpose: string;
  permissions: string;
  indexes: string[];
  attributes: AttributeSpec[];
}

export const membershipPlansSpec: CollectionSpec = {
  id: "membership_plans",
  title: "Membership plans",
  envVar: "VITE_APPWRITE_MEMBERSHIP_PLANS_COLLECTION_ID",
  purpose: "The plans shown on /membership. One document per tier (Aarambh, Udaan, Pragati, Shikhar).",
  permissions: "Read = Any · Create/Update/Delete = Team:admins",
  indexes: ["slug — unique (key)", "order — ascending (key)", "status — key"],
  attributes: [
    { key: "name", type: "string", size: "100", required: true, notes: "Display name, e.g. Aarambh" },
    { key: "slug", type: "string", size: "100", required: true, notes: "URL-safe, unique" },
    { key: "price", type: "integer", size: "min 0", required: true, notes: "INR, 0 for free plan" },
    { key: "duration", type: "enum", size: "monthly, yearly, lifetime", required: true },
    { key: "productLimit", type: "integer", size: "-1 = unlimited", required: true },
    { key: "commissionPercent", type: "integer", size: "0–100", required: true },
    { key: "features", type: "string[]", size: "300 each", required: false, notes: "Bullet points on the card" },
    { key: "coverImage", type: "string", size: "2000", required: false, notes: "Storage file URL" },
    { key: "status", type: "enum", size: "active, hidden", required: true },
    { key: "order", type: "integer", size: "", required: false, notes: "Lower shows first" },
    { key: "tagline", type: "string", size: "100", required: false, notes: 'Badge text, e.g. "Most popular"' },
  ],
};

export const subscriptionsSpec: CollectionSpec = {
  id: "subscriptions",
  title: "Subscriptions",
  envVar: "VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID",
  purpose:
    "One document per member who takes a plan. Records who subscribed, to which plan, when it started/expires and the payment result.",
  permissions:
    "Read/Create/Update/Delete = Team:admins · Members read their own subscription via the authorized Appwrite Function",
  indexes: [
    "memberId — key",
    "email — key",
    "userId — key",
    "planId — key",
    "memberId + status",
    "memberId + planId",
    "status — key",
    "expiresAt — key (for expiry sweeps)",
    "razorpayPaymentId — key",
  ],
  attributes: [
    { key: "memberId", type: "string", size: "64", required: true, notes: "members document ID" },
    { key: "userId", type: "string", size: "64", required: false, notes: "Appwrite account ID" },
    { key: "memberName", type: "string", size: "200", required: true },
    { key: "email", type: "string", size: "200", required: true },
    { key: "phone", type: "string", size: "30", required: true },
    { key: "occupation", type: "string", size: "150", required: false },
    { key: "dob", type: "datetime", size: "", required: false },
    { key: "address", type: "string", size: "500", required: false },
    { key: "city", type: "string", size: "100", required: false },
    { key: "state", type: "string", size: "100", required: false },
    { key: "planId", type: "string", size: "64", required: true, notes: "membership_plans document ID" },
    { key: "planName", type: "string", size: "100", required: true, notes: "Copied plan name" },
    { key: "planSlug", type: "string", size: "100", required: false },
    { key: "duration", type: "enum", size: "monthly, yearly, lifetime", required: true },
    { key: "amount", type: "integer", size: "INR", required: true, notes: "0 for the free tier" },
    { key: "currency", type: "string", size: "8", required: true, notes: "Use INR" },
    { key: "startedAt", type: "datetime", size: "", required: true },
    { key: "expiresAt", type: "datetime", size: "", required: false, notes: "Empty for lifetime" },
    { key: "startsAt", type: "datetime", size: "", required: true },
    { key: "endsAt", type: "datetime", size: "", required: false },
    { key: "tier", type: "string", size: "50", required: false, notes: "Legacy plan-name field" },
    { key: "status", type: "enum", size: "pending, active, expired, cancelled", required: true },
    { key: "paymentStatus", type: "enum", size: "free, pending, paid, failed, refunded", required: true },
    { key: "razorpayOrderId", type: "string", size: "100", required: false },
    { key: "razorpayPaymentId", type: "string", size: "100", required: false },
    { key: "referralCode", type: "string", size: "30", required: false },
    { key: "referrerMemberId", type: "string", size: "64", required: false },
    { key: "referralPointsAwarded", type: "integer", size: "min 0", required: false },
    { key: "paymentReference", type: "string", size: "200", required: false },
    { key: "interests", type: "string[]", size: "100 each", required: false },
    { key: "notes", type: "string", size: "1000", required: false },
  ],
};

const protectedCollection = (
  id: string,
  title: string,
  purpose: string,
  indexes: string[],
  attributes: AttributeSpec[],
): CollectionSpec => ({
  id,
  title,
  envVar: `${id.toUpperCase()}_COLLECTION_ID`,
  purpose,
  permissions: "No direct client access · Function API key only (admins use authorized Appwrite Function actions)",
  indexes,
  attributes,
});

export const referralCollectionsSpec: CollectionSpec[] = [
  protectedCollection("membership_orders", "Membership orders", "Server-created payment and referral attribution snapshots.", ["userId", "memberId", "planId", "razorpayOrderId — unique", "paymentStatus", "createdAt", "userId + paymentStatus", "userId + planId + paymentStatus"], [
    { key: "userId", type: "string", size: "64", required: true },
    { key: "memberId", type: "string", size: "64", required: true },
    { key: "planId", type: "string", size: "64", required: true },
    { key: "planName", type: "string", size: "100", required: true },
    { key: "planDuration", type: "enum", size: "monthly, yearly, lifetime", required: true },
    { key: "originalAmount", type: "integer", size: "INR", required: true },
    { key: "discountAmount", type: "integer", size: "INR", required: true },
    { key: "finalAmount", type: "integer", size: "INR", required: true },
    { key: "currency", type: "string", size: "8", required: true },
    { key: "referralCode", type: "string", size: "30", required: false },
    { key: "referrerMemberId", type: "string", size: "64", required: false },
    { key: "razorpayOrderId", type: "string", size: "100", required: true },
    { key: "razorpayPaymentId", type: "string", size: "100", required: false },
    { key: "paymentStatus", type: "enum", size: "pending, paid, failed, refunded", required: true },
    { key: "subscriptionId", type: "string", size: "64", required: false },
    { key: "referralConfig", type: "string", size: "3000", required: false, notes: "Configuration snapshot" },
    { key: "createdAt", type: "datetime", size: "", required: true },
    { key: "paidAt", type: "datetime", size: "", required: false },
  ]),
  protectedCollection("referral_codes", "Referral codes", "Unique share codes assigned to active Pink Saathi members.", ["code — unique", "memberId — unique", "userId", "status", "memberId + status", "code + status"], [
    { key: "memberId", type: "string", size: "64", required: true },
    { key: "userId", type: "string", size: "64", required: true },
    { key: "code", type: "string", size: "30", required: true },
    { key: "status", type: "enum", size: "active, disabled", required: true },
    { key: "createdAt", type: "datetime", size: "", required: true },
  ]),
  protectedCollection("referrals", "Qualified referrals", "Pending attribution is qualified only when a paid membership payment is verified.", ["referrerMemberId", "referredUserId", "membershipOrderId — unique", "status", "createdAt", "referrerMemberId + createdAt", "referredUserId + createdAt"], [
    { key: "referrerMemberId", type: "string", size: "64", required: true },
    { key: "referredUserId", type: "string", size: "64", required: true },
    { key: "referredMemberId", type: "string", size: "64", required: true },
    { key: "referralCode", type: "string", size: "30", required: true },
    { key: "membershipOrderId", type: "string", size: "64", required: true },
    { key: "planId", type: "string", size: "64", required: true },
    { key: "planName", type: "string", size: "100", required: true },
    { key: "discountAmount", type: "integer", size: "INR", required: true },
    { key: "status", type: "enum", size: "pending, qualified, failed, refunded", required: true },
    { key: "pointsAwarded", type: "integer", size: "min 0", required: true },
    { key: "createdAt", type: "datetime", size: "", required: true },
    { key: "qualifiedAt", type: "datetime", size: "", required: false },
  ]),
  protectedCollection("referral_settings", "Referral settings", "Single document with the active versioned discount, points, and redemption rules.", ["updatedAt", "updatedBy"], [
    { key: "programEnabled", type: "boolean", size: "", required: true },
    { key: "pointsEnabled", type: "boolean", size: "", required: true },
    { key: "pointsPerPurchase", type: "integer", size: "min 0", required: true },
    { key: "pointsPlanIds", type: "string[]", size: "64 each", required: true },
    { key: "pointsByPlan", type: "string", size: "4000; JSON plan ID to points map", required: false },
    { key: "discountEnabled", type: "boolean", size: "", required: true },
    { key: "discountType", type: "enum", size: "percent, fixed", required: true },
    { key: "discountValue", type: "integer", size: "percent 0–100 or INR", required: true },
    { key: "maxDiscount", type: "integer", size: "INR", required: true },
    { key: "eligiblePlanIds", type: "string[]", size: "64 each", required: true },
    { key: "minimumPurchase", type: "integer", size: "INR", required: true },
    { key: "validFrom", type: "string", size: "40", required: false },
    { key: "validUntil", type: "string", size: "40", required: false },
    { key: "allowStacking", type: "boolean", size: "", required: true },
    { key: "discountUseLimit", type: "integer", size: "0 = unlimited", required: true },
    { key: "refundPolicy", type: "enum", size: "reverse, retain", required: true },
    { key: "redemptionsEnabled", type: "boolean", size: "", required: true },
    { key: "redemptionPoints", type: "integer", size: "min 0", required: true },
    { key: "redemptionDiscount", type: "integer", size: "INR", required: true },
    { key: "redemptionExpiryDays", type: "integer", size: "1–365", required: true },
    { key: "version", type: "integer", size: "", required: true },
    { key: "updatedBy", type: "string", size: "64", required: true },
    { key: "updatedAt", type: "datetime", size: "", required: true },
  ]),
  protectedCollection("points_transactions", "Points ledger", "Append-only credits, debits, adjustments, and reversals; no mutable balance field.", ["memberId + createdAt", "idempotencyKey — unique", "membershipOrderId", "redemptionId", "status"], [
    { key: "memberId", type: "string", size: "64", required: true },
    { key: "type", type: "enum", size: "credit, debit, reversal, adjustment, lock", required: true },
    { key: "points", type: "integer", size: "signed", required: true },
    { key: "status", type: "enum", size: "posted, pending, locked", required: true },
    { key: "membershipOrderId", type: "string", size: "64", required: false },
    { key: "redemptionId", type: "string", size: "64", required: false },
    { key: "idempotencyKey", type: "string", size: "100", required: false },
    { key: "description", type: "string", size: "500", required: true },
    { key: "createdBy", type: "string", size: "64", required: false },
    { key: "createdAt", type: "datetime", size: "", required: true },
  ]),
  protectedCollection("bazaar_redemptions", "Sakhi Bazaar redemptions", "Point reservation and one-time store token; checkout validates and consumes via server function.", ["token — unique", "memberId + status", "status", "expiresAt", "externalOrderId", "memberId + createdAt", "memberId + status + createdAt"], [
    { key: "memberId", type: "string", size: "64", required: true },
    { key: "token", type: "string", size: "40", required: true },
    { key: "points", type: "integer", size: "min 1", required: true },
    { key: "discount", type: "integer", size: "INR", required: true },
    { key: "status", type: "enum", size: "pending, issued, reserved, redeemed, cancelled, expired", required: true },
    { key: "expiresAt", type: "datetime", size: "", required: true },
    { key: "createdAt", type: "datetime", size: "", required: true },
    { key: "redeemedAt", type: "datetime", size: "", required: false },
    { key: "reserveExpiresAt", type: "datetime", size: "", required: false },
    { key: "externalOrderId", type: "string", size: "100", required: false },
  ]),
  protectedCollection("referral_audit", "Referral audit log", "Audit history for administrative settings and points changes.", ["actorId", "entity", "action", "createdAt"], [
    { key: "actorId", type: "string", size: "64", required: true },
    { key: "action", type: "string", size: "100", required: true },
    { key: "entity", type: "string", size: "100", required: true },
    { key: "details", type: "string", size: "3000", required: true },
    { key: "reason", type: "string", size: "500", required: true },
    { key: "createdAt", type: "datetime", size: "", required: true },
  ]),
];

export const schemaReference: CollectionSpec[] = [
  membershipPlansSpec,
  subscriptionsSpec,
  ...referralCollectionsSpec,
];
