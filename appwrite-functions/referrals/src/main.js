import { createHmac, randomBytes, createHash } from "node:crypto";
import { Client, Databases, ID, Query, Users } from "node-appwrite";
import {
  calculateMembershipDiscount,
  calculateWalletBalance,
  hmacSha256,
  isPaidMembershipPlan,
  normalizeDateTime,
  referralPointsForPlan,
  verifyHexSignature,
} from "./rules.js";

const env = process.env;
const databaseId = required("APPWRITE_DATABASE_ID");
const ids = {
  members: required("MEMBERS_COLLECTION_ID"),
  plans: required("MEMBERSHIP_PLANS_COLLECTION_ID"),
  orders: required("MEMBERSHIP_ORDERS_COLLECTION_ID"),
  subscriptions: required("SUBSCRIPTIONS_COLLECTION_ID"),
  codes: required("REFERRAL_CODES_COLLECTION_ID"),
  referrals: required("REFERRALS_COLLECTION_ID"),
  settings: required("REFERRAL_SETTINGS_COLLECTION_ID"),
  transactions: required("POINTS_TRANSACTIONS_COLLECTION_ID"),
  redemptions: required("BAZAAR_REDEMPTIONS_COLLECTION_ID"),
  audit: required("REFERRAL_AUDIT_COLLECTION_ID"),
};
const client = new Client()
  .setEndpoint(required("APPWRITE_ENDPOINT"))
  .setProject(required("APPWRITE_PROJECT_ID"))
  .setKey(required("APPWRITE_API_KEY"));
const db = new Databases(client);
const users = new Users(client);

function required(key) {
  const value = env[key];
  if (!value) throw new Error(`Missing required function variable: ${key}`);
  return value;
}

function docId(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function membershipExpiry(duration, startDate) {
  const end = new Date(startDate);
  if (duration === "monthly") end.setUTCMonth(end.getUTCMonth() + 1);
  else if (duration === "yearly") end.setUTCFullYear(end.getUTCFullYear() + 1);
  else if (duration !== "lifetime") throw new Error("Unsupported membership duration.");
  return duration === "lifetime" ? undefined : end.toISOString();
}

function response(res, status, body) {
  return res.json(body, status);
}

function userIdFromRequest(req) {
  return req.headers["x-appwrite-user-id"] || "";
}

function validateSettings(value) {
  const settings = value || {};
  const number = (key, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const n = Number(settings[key] ?? 0);
    if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid ${key}.`);
    return Math.floor(n);
  };
  const stringArray = (key) => {
    const result = settings[key] ?? [];
    if (!Array.isArray(result) || result.some((item) => typeof item !== "string")) {
      throw new Error(`Invalid ${key}.`);
    }
    return result;
  };
  let storedPointsByPlan = settings.pointsByPlan ?? {};
  if (typeof storedPointsByPlan === "string") {
    try {
      storedPointsByPlan = storedPointsByPlan ? JSON.parse(storedPointsByPlan) : {};
    } catch {
      throw new Error("Invalid pointsByPlan settings.");
    }
  }
  if (
    !storedPointsByPlan ||
    typeof storedPointsByPlan !== "object" ||
    Array.isArray(storedPointsByPlan)
  ) {
    throw new Error("Invalid pointsByPlan settings.");
  }
  const pointsByPlan = {};
  for (const [planId, value] of Object.entries(storedPointsByPlan)) {
    const points = Number(value);
    if (!planId || planId.length > 64 || !Number.isInteger(points) || points < 0) {
      throw new Error("Invalid pointsByPlan settings.");
    }
    pointsByPlan[planId] = points;
  }
  if (!["percent", "fixed"].includes(settings.discountType)) {
    throw new Error("Invalid discount type.");
  }
  if (settings.discountType === "percent" && Number(settings.discountValue) > 100) {
    throw new Error("Percentage discounts cannot exceed 100%.");
  }
  if (!["reverse", "retain"].includes(settings.refundPolicy)) {
    throw new Error("Invalid refund policy.");
  }
  return {
    programEnabled: Boolean(settings.programEnabled),
    pointsEnabled: Boolean(settings.pointsEnabled),
    pointsPerPurchase: number("pointsPerPurchase"),
    pointsPlanIds: stringArray("pointsPlanIds"),
    pointsByPlan,
    discountEnabled: Boolean(settings.discountEnabled),
    discountType: settings.discountType,
    discountValue: number("discountValue"),
    maxDiscount: number("maxDiscount"),
    eligiblePlanIds: stringArray("eligiblePlanIds"),
    minimumPurchase: number("minimumPurchase"),
    validFrom: String(settings.validFrom || ""),
    validUntil: String(settings.validUntil || ""),
    allowStacking: Boolean(settings.allowStacking),
    discountUseLimit: number("discountUseLimit"),
    refundPolicy: settings.refundPolicy,
    redemptionsEnabled: Boolean(settings.redemptionsEnabled),
    redemptionPoints: number("redemptionPoints"),
    redemptionDiscount: number("redemptionDiscount"),
    redemptionExpiryDays: number("redemptionExpiryDays", 1, 365),
  };
}

async function getDoc(collection, id) {
  try {
    return await db.getDocument(databaseId, collection, id);
  } catch (error) {
    if (error.code === 404) return null;
    throw error;
  }
}

async function getMembershipPlan(idOrSlug) {
  try {
    return await db.getDocument(databaseId, ids.plans, idOrSlug);
  } catch (error) {
    if (error.code !== 404) throw error;
  }

  const result = await db.listDocuments(databaseId, ids.plans, [
    Query.equal("slug", idOrSlug),
    Query.limit(1),
  ]);
  if (result.documents[0]) return result.documents[0];
  throw new Error(`Membership plan "${idOrSlug}" was not found by document ID or slug.`);
}

async function maybeSingle(collection, queries) {
  const result = await db.listDocuments(databaseId, collection, [...queries, Query.limit(1)]);
  return result.documents[0] || null;
}

async function getSettings() {
  const doc = await getDoc(ids.settings, "default");
  if (!doc) {
    return {
      ...validateSettings({
      programEnabled: false,
      pointsEnabled: false,
      pointsPerPurchase: 0,
      pointsPlanIds: [],
      pointsByPlan: {},
      discountEnabled: false,
      discountType: "percent",
      discountValue: 0,
      maxDiscount: 0,
      eligiblePlanIds: [],
      minimumPurchase: 0,
      validFrom: "",
      validUntil: "",
      allowStacking: false,
      refundPolicy: "reverse",
      discountUseLimit: 1,
      redemptionsEnabled: false,
      redemptionPoints: 0,
      redemptionDiscount: 0,
      redemptionExpiryDays: 30,
      }),
      version: 0,
    };
  }
  return { ...validateSettings(doc), version: Number(doc.version || 0) };
}

async function requireMember(userId) {
  if (!userId) throw new Error("Sign in is required.");
  const member = await maybeSingle(ids.members, [Query.equal("userId", userId)]);
  if (!member || member.status !== "active") throw new Error("An active Pink Saathi profile is required.");
  return member;
}

async function requireAdmin(userId) {
  if (!userId) throw new Error("Sign in is required.");
  const user = await users.get(userId);
  const allowlist = (env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase());
  if (!allowlist.includes(user.email.toLowerCase())) throw new Error("Administrator access required.");
  return user;
}

async function getOrCreateReferralCode(member) {
  const found = await maybeSingle(ids.codes, [
    Query.equal("memberId", member.$id),
    Query.equal("status", "active"),
  ]);
  if (found) return found;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `PS-${randomBytes(4).toString("hex").toUpperCase()}`;
    const duplicate = await maybeSingle(ids.codes, [Query.equal("code", code)]);
    if (duplicate) continue;
    try {
      return await db.createDocument(databaseId, ids.codes, ID.unique(), {
        memberId: member.$id,
        userId: member.userId,
        code,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error.code === 409) {
        const raced = await maybeSingle(ids.codes, [
          Query.equal("memberId", member.$id),
          Query.equal("status", "active"),
        ]);
        if (raced) return raced;
        continue;
      }
      throw error;
    }
  }
  throw new Error("Could not allocate a unique referral code. Please retry.");
}

async function referralQuote(userId, planId, code) {
  const plan = await db.getDocument(databaseId, ids.plans, planId);
  const config = await getSettings();
  if (!isPaidMembershipPlan(plan)) {
    throw new Error("This plan is not available for paid membership checkout.");
  }
  let referrer = null;
  let discount = 0;
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (normalizedCode) {
    if (!config.programEnabled) throw new Error("The referral program is not currently active.");
    const codeDoc = await maybeSingle(ids.codes, [
      Query.equal("code", normalizedCode),
      Query.equal("status", "active"),
    ]);
    if (!codeDoc) throw new Error("Referral code is invalid or inactive.");
    if (codeDoc.userId === userId) throw new Error("You cannot use your own referral code.");
    if (config.discountEnabled) {
      if (config.eligiblePlanIds.length && !config.eligiblePlanIds.includes(planId)) {
        throw new Error("This referral offer is not available for this plan.");
      }
      const now = Date.now();
      if (config.validFrom && now < Date.parse(config.validFrom)) throw new Error("This referral offer is not active yet.");
      if (config.validUntil && now > Date.parse(config.validUntil)) throw new Error("This referral offer has expired.");
      if (plan.price < config.minimumPurchase) throw new Error("This plan does not meet the referral offer minimum.");
    }
    if (config.discountEnabled && config.discountUseLimit > 0) {
      const [qualified, pendingOrders, paidOrders] = await Promise.all([
        db.listDocuments(databaseId, ids.referrals, [Query.equal("referredUserId", userId), Query.limit(100)]),
        db.listDocuments(databaseId, ids.orders, [
            Query.equal("userId", userId),
            Query.equal("paymentStatus", "pending"),
            Query.limit(100),
          ]),
          db.listDocuments(databaseId, ids.orders, [
            Query.equal("userId", userId),
            Query.equal("paymentStatus", "paid"),
            Query.limit(100),
        ]),
      ]);
      const completed = qualified.documents.filter(
        (item) => item.status === "qualified" && Number(item.discountAmount) > 0,
      ).length;
      const reserved = [...pendingOrders.documents, ...paidOrders.documents].filter(
        (item) => Number(item.discountAmount) > 0,
      ).length;
      if (completed + reserved >= config.discountUseLimit) {
        throw new Error("This account has reached the referral offer usage limit.");
      }
    }
    referrer = codeDoc;
    if (config.discountEnabled) {
      discount = calculateMembershipDiscount(plan.price, config);
    }
  }
  return { plan, config, referrer, discount, code: normalizedCode };
}

async function createMembershipOrder(userId, member, planId, code) {
  return withMemberLock(member.$id, async () => {
    const quote = await referralQuote(userId, planId, code);
    const amount = Math.max(0, quote.plan.price - quote.discount);
    if (amount <= 0) throw new Error("A paid membership checkout must have a positive final amount.");
    const priorOrders = await db.listDocuments(databaseId, ids.orders, [
      Query.equal("userId", userId),
      Query.equal("planId", planId),
      Query.equal("paymentStatus", "pending"),
      Query.limit(100),
    ]);
    const existing = priorOrders.documents.find((item) => item.referralCode === quote.code);
    if (existing) {
      return {
        orderId: existing.razorpayOrderId,
        amount: existing.finalAmount,
        currency: existing.currency,
        discount: existing.discountAmount,
        orderRecordId: existing.$id,
      };
    }
    const razorpayKey = required("RAZORPAY_KEY_ID");
    const razorpaySecret = required("RAZORPAY_KEY_SECRET");
    const receipt = `ps_${randomBytes(12).toString("hex")}`;
    const payload = {
      amount: amount * 100,
      currency: quote.plan.currency || "INR",
      receipt,
      notes: { planId, userId, memberId: member.$id },
    };
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Razorpay order creation failed (${response.status}).`);
    const razorpayOrder = await response.json();
    const order = await db.createDocument(databaseId, ids.orders, ID.unique(), {
      userId,
      memberId: member.$id,
      planId,
      planName: quote.plan.name,
      planDuration: quote.plan.duration,
      originalAmount: quote.plan.price,
      discountAmount: quote.discount,
      finalAmount: amount,
      currency: quote.plan.currency || "INR",
      referralCode: quote.code,
      referrerMemberId: quote.referrer?.memberId || "",
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
      referralConfig: JSON.stringify(quote.config),
      createdAt: new Date().toISOString(),
    });
    if (quote.referrer) {
      const referralId = docId(`referral:${order.$id}`);
      if (!(await getDoc(ids.referrals, referralId))) {
        await db.createDocument(databaseId, ids.referrals, referralId, {
          referrerMemberId: quote.referrer.memberId,
          referredUserId: userId,
          referredMemberId: member.$id,
          referralCode: quote.code,
          membershipOrderId: order.$id,
          planId,
          planName: quote.plan.name,
          discountAmount: quote.discount,
          status: "pending",
          pointsAwarded: 0,
          createdAt: new Date().toISOString(),
        });
      }
    }
    return { orderId: razorpayOrder.id, amount, currency: quote.plan.currency || "INR", discount: quote.discount, orderRecordId: order.$id };
  });
}

function safeEqualHex(expected, actual) {
  return verifyHexSignature(expected, actual);
}

async function verifyMembershipPayment(userId, member, { planId, orderId, paymentId, signature }) {
  return withMemberLock(member.$id, async () => {
  const order = await maybeSingle(ids.orders, [Query.equal("razorpayOrderId", orderId)]);
  if (!order || order.userId !== userId || order.memberId !== member.$id || order.planId !== planId) {
    throw new Error("Membership order was not found for this account.");
  }
  if (order.paymentStatus === "refunded") throw new Error("This membership order has been refunded.");
  const expected = hmacSha256(required("RAZORPAY_KEY_SECRET"), `${orderId}|${paymentId}`);
  if (!safeEqualHex(expected, String(signature || ""))) throw new Error("Payment signature verification failed.");
  if (order.paymentStatus === "paid") {
    if (order.razorpayPaymentId !== paymentId) throw new Error("Payment does not match the completed order.");
  } else {
    const keyId = required("RAZORPAY_KEY_ID");
    const secret = required("RAZORPAY_KEY_SECRET");
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}` },
    });
    if (!paymentResponse.ok) throw new Error("Could not verify payment with Razorpay.");
    const payment = await paymentResponse.json();
    if (payment.order_id !== orderId || payment.status !== "captured" || payment.amount !== order.finalAmount * 100) {
      throw new Error("Payment is not captured for the expected membership amount.");
    }
  }
  const subscriptionKey = docId(`subscription:${order.$id}`);
  let subscription = await getDoc(ids.subscriptions, subscriptionKey);
  if (!subscription) {
    const now = new Date();
    const expiry = membershipExpiry(order.planDuration, now);
    subscription = await db.createDocument(databaseId, ids.subscriptions, subscriptionKey, {
      memberId: member.$id,
      userId,
      memberName: member.fullName,
      email: member.email,
      phone: member.phone,
      occupation: member.occupation,
      dob: normalizeDateTime(member.dob),
      address: member.address,
      city: member.city || "",
      state: member.state || "",
      planId,
      tier: order.planName,
      planName: order.planName,
      planSlug: "",
      duration: order.planDuration,
      amount: order.finalAmount,
      currency: order.currency,
      startsAt: now.toISOString(),
      endsAt: expiry,
      startedAt: now.toISOString(),
      expiresAt: expiry,
      status: "active",
      paymentStatus: "paid",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      paymentReference: orderId,
    });
  }
  if (order.paymentStatus !== "paid") {
    await db.updateDocument(databaseId, ids.orders, order.$id, {
      paymentStatus: "paid",
      razorpayPaymentId: paymentId,
      subscriptionId: subscription.$id,
      paidAt: new Date().toISOString(),
    });
  }
  if (order.referrerMemberId) {
    const referralId = docId(`referral:${order.$id}`);
    const referral = await getDoc(ids.referrals, referralId);
    if (!referral) {
      await db.createDocument(databaseId, ids.referrals, referralId, {
        referrerMemberId: order.referrerMemberId,
        referredUserId: userId,
        referredMemberId: member.$id,
        referralCode: order.referralCode,
        membershipOrderId: order.$id,
        planId,
        planName: order.planName,
        discountAmount: order.discountAmount,
        status: "qualified",
        pointsAwarded: 0,
        createdAt: new Date().toISOString(),
        qualifiedAt: new Date().toISOString(),
      });
    }
    await db.updateDocument(databaseId, ids.referrals, referralId, {
      status: "qualified",
      qualifiedAt: new Date().toISOString(),
    });
    const config = JSON.parse(order.referralConfig || "{}");
    const points = referralPointsForPlan(planId, config, true);
    if (points > 0) {
      const transactionId = docId(`credit:${order.$id}`);
      if (!(await getDoc(ids.transactions, transactionId))) {
        await db.createDocument(databaseId, ids.transactions, transactionId, {
          memberId: order.referrerMemberId,
          type: "credit",
          points,
          status: "posted",
          membershipOrderId: order.$id,
          idempotencyKey: `membership:${order.$id}`,
          description: `Referral reward for ${order.planName} membership`,
          createdAt: new Date().toISOString(),
        });
      }
      await db.updateDocument(databaseId, ids.referrals, referralId, { pointsAwarded: points });
    }
  }
  return { subscriptionId: subscription.$id };
  });
}

async function validateFreeReferralCode(userId, code) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) return { code: "", config: null };
  const config = await getSettings();
  if (!config.programEnabled) throw new Error("The referral program is not currently active.");
  const referralCode = await maybeSingle(ids.codes, [
    Query.equal("code", normalizedCode),
    Query.equal("status", "active"),
  ]);
  if (!referralCode) throw new Error("Referral code is invalid or inactive.");
  if (referralCode.userId === userId) throw new Error("You cannot use your own referral code.");
  const referrer = await db.getDocument(databaseId, ids.members, referralCode.memberId);
  if (referrer.status !== "active") throw new Error("This referral code is not active.");
  return { code: normalizedCode, config, referralCode };
}

async function awardFreeSubscriptionReferral(subscription, plan) {
  if (!subscription.referralCode) return;
  const referralId = docId(`free-referral:${subscription.$id}`);
  let referral = await getDoc(ids.referrals, referralId);
  if (!referral) {
    const points = Number(subscription.referralPointsAwarded || 0);
    try {
      referral = await db.createDocument(databaseId, ids.referrals, referralId, {
        referrerMemberId: subscription.referrerMemberId,
        referredUserId: subscription.userId,
        referredMemberId: subscription.memberId,
        referralCode: subscription.referralCode,
        membershipOrderId: subscription.$id,
        planId: plan.$id,
        planName: plan.name,
        discountAmount: 0,
        status: "qualified",
        pointsAwarded: points,
        createdAt: new Date().toISOString(),
        qualifiedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error.code !== 409) throw error;
      referral = await getDoc(ids.referrals, referralId);
      if (!referral) throw error;
    }
  }
  const points = Number(referral.pointsAwarded || 0);
  if (points <= 0) return;
  const transactionId = docId(`credit:${referralId}`);
  if (!(await getDoc(ids.transactions, transactionId))) {
    try {
      await db.createDocument(databaseId, ids.transactions, transactionId, {
        memberId: referral.referrerMemberId,
        type: "credit",
        points,
        status: "posted",
        membershipOrderId: subscription.$id,
        idempotencyKey: `free-referral:${subscription.$id}`,
        description: `Referral reward for ${plan.name} membership`,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error.code !== 409) throw error;
    }
  }
}

async function listAllDocuments(collection, queries) {
  const documents = [];
  for (let offset = 0; ; offset += 100) {
    const page = await db.listDocuments(databaseId, collection, [
      ...queries,
      Query.orderDesc("createdAt"),
      Query.limit(100),
      Query.offset(offset),
    ]);
    documents.push(...page.documents);
    if (page.documents.length < 100) return documents;
  }
}

async function listLedger(memberId) {
  const [transactions, referrals, redemptions] = await Promise.all([
    listAllDocuments(ids.transactions, [Query.equal("memberId", memberId)]),
    listAllDocuments(ids.referrals, [Query.equal("referrerMemberId", memberId)]),
    listAllDocuments(ids.redemptions, [Query.equal("memberId", memberId)]),
  ]);
  const availablePoints = calculateWalletBalance(transactions);
  const totalEarned = transactions
    .filter((item) => item.status === "posted" && item.type === "credit")
    .reduce((sum, item) => sum + item.points, 0);
  const totalRedeemed = redemptions
    .filter((item) => item.status === "redeemed")
    .reduce((sum, item) => sum + item.points, 0);
  const pendingReferrals = referrals.filter((item) => item.status === "pending").length;
  return {
    transactions,
    referrals,
    redemptions,
    availablePoints,
    totalEarned,
    totalRedeemed,
    pendingReferrals,
  };
}

async function withMemberLock(memberId, operation) {
  const lockId = docId(`wallet-lock:${memberId}`);
  let lock;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      lock = await db.createDocument(databaseId, ids.transactions, lockId, {
        memberId,
        type: "lock",
        points: 0,
        status: "locked",
        description: "Wallet operation lock",
        createdAt: new Date().toISOString(),
      });
      break;
    } catch (error) {
      if (error.code !== 409) throw error;
      const existing = await getDoc(ids.transactions, lockId);
      if (!existing || Date.now() - Date.parse(existing.createdAt) < 120000) {
        throw new Error("A wallet operation is already in progress. Please retry shortly.");
      }
      await db.deleteDocument(databaseId, ids.transactions, lockId);
    }
  }
  if (!lock) throw new Error("Could not acquire the wallet operation lock.");
  try {
    return await operation();
  } finally {
    await db.deleteDocument(databaseId, ids.transactions, lockId);
  }
}

async function expireRedemptions(memberId) {
  await recoverPendingRedemptions(memberId);
  const [issued, reserved] = await Promise.all([
    listAllDocuments(ids.redemptions, [
      Query.equal("memberId", memberId),
      Query.equal("status", "issued"),
    ]),
    listAllDocuments(ids.redemptions, [
      Query.equal("memberId", memberId),
      Query.equal("status", "reserved"),
    ]),
  ]);
  const now = Date.now();
  for (const redemption of [...issued, ...reserved]) {
    const reservationExpired =
      redemption.status === "reserved" && Date.parse(redemption.reserveExpiresAt) <= now;
    if (redemption.status === "reserved" && !reservationExpired) continue;
    if (reservationExpired && Date.parse(redemption.expiresAt) > now) {
      await db.updateDocument(databaseId, ids.redemptions, redemption.$id, {
        status: "issued",
        externalOrderId: "",
        reserveExpiresAt: undefined,
      });
      continue;
    }
    if (Date.parse(redemption.expiresAt) > now) continue;
    const reversalId = docId(`redemption-expiry:${redemption.$id}`);
    if (!(await getDoc(ids.transactions, reversalId))) {
      await db.createDocument(databaseId, ids.transactions, reversalId, {
        memberId,
        type: "reversal",
        points: redemption.points,
        status: "posted",
        redemptionId: redemption.$id,
        idempotencyKey: `redemption-expiry:${redemption.$id}`,
        description: "Points returned for expired Sakhi Bazaar reward",
        createdAt: new Date().toISOString(),
      });
    }
    await db.updateDocument(databaseId, ids.redemptions, redemption.$id, { status: "expired" });
  }
}

async function recoverPendingRedemptions(memberId) {
  const pending = await listAllDocuments(ids.redemptions, [
    Query.equal("memberId", memberId),
    Query.equal("status", "pending"),
  ]);
  for (const redemption of pending) {
    const debitId = docId(`debit:${redemption.$id}`);
    const debit = await getDoc(ids.transactions, debitId);
    if (!debit) {
      await db.updateDocument(databaseId, ids.redemptions, redemption.$id, { status: "cancelled" });
      continue;
    }
    if (debit.status === "pending") {
      await db.updateDocument(databaseId, ids.transactions, debit.$id, { status: "posted" });
    }
    const expired = Date.parse(redemption.expiresAt) <= Date.now();
    await db.updateDocument(databaseId, ids.redemptions, redemption.$id, {
      status: expired ? "expired" : "issued",
    });
    if (expired) await returnRedemptionPoints(redemption, "redemption-expiry");
  }
}

async function createRedemption(member) {
  const config = await getSettings();
  if (!config.programEnabled || !config.redemptionsEnabled || config.redemptionPoints <= 0 || config.redemptionDiscount <= 0) {
    throw new Error("Sakhi Bazaar redemptions are not currently available.");
  }
  return withMemberLock(member.$id, async () => {
    await expireRedemptions(member.$id);
    const ledger = await listLedger(member.$id);
    if (ledger.availablePoints < config.redemptionPoints) throw new Error("You do not have enough points.");
    const token = randomBytes(18).toString("hex").toUpperCase();
    const redemptionId = docId(`redemption:${token}`);
    const redemption = await db.createDocument(databaseId, ids.redemptions, redemptionId, {
      memberId: member.$id,
      token,
      points: config.redemptionPoints,
      discount: config.redemptionDiscount,
      status: "pending",
      expiresAt: new Date(Date.now() + config.redemptionExpiryDays * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    });
    try {
      await db.createDocument(databaseId, ids.transactions, docId(`debit:${redemption.$id}`), {
        memberId: member.$id,
        type: "debit",
        points: config.redemptionPoints,
        status: "pending",
        redemptionId: redemption.$id,
        idempotencyKey: `redemption:${redemption.$id}`,
        description: "Sakhi Bazaar reward redemption",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (!(await getDoc(ids.transactions, docId(`debit:${redemption.$id}`)))) {
        await db.updateDocument(databaseId, ids.redemptions, redemption.$id, { status: "cancelled" });
      }
      throw error;
    }
    await db.updateDocument(databaseId, ids.transactions, docId(`debit:${redemption.$id}`), {
      status: "posted",
    });
    await db.updateDocument(databaseId, ids.redemptions, redemption.$id, { status: "issued" });
    return { token, points: config.redemptionPoints, discount: config.redemptionDiscount, expiresAt: redemption.expiresAt };
  });
}

async function handleAction(req) {
  const userId = userIdFromRequest(req);
  const body = req.bodyJson || {};
  const action = body.action;
  if (req.path === "/webhook") return handleRazorpayWebhook(req);
  if (action === "webhook") return handleRazorpayWebhook(req);
  if (["reserveRedemption", "consumeRedemption", "cancelBazaarOrder"].includes(action)) {
    if (!env.BAZAAR_INTEGRATION_SECRET || req.headers["x-bazaar-secret"] !== env.BAZAAR_INTEGRATION_SECRET) {
      throw new Error("Sakhi Bazaar integration authentication failed.");
    }
    return handleBazaarAction(action, body);
  }
  if (action === "getSettings") {
    await requireAdmin(userId);
    return getSettings();
  }
  if (action === "validateReferralCode") {
    const result = await validateFreeReferralCode(userId, body.code);
    if (!result.referralCode) throw new Error("Enter a referral code to apply.");
    return { valid: true, code: result.code };
  }
  if (action === "adminOverview") {
    await requireAdmin(userId);
    const [settings, referrals, transactions, redemptions] = await Promise.all([
      getSettings(),
      db.listDocuments(databaseId, ids.referrals, [
        Query.orderDesc("createdAt"),
        Query.limit(500),
      ]),
      db.listDocuments(databaseId, ids.transactions, [
        Query.orderDesc("createdAt"),
        Query.limit(500),
      ]),
      db.listDocuments(databaseId, ids.redemptions, [
        Query.orderDesc("createdAt"),
        Query.limit(500),
      ]),
    ]);
    return {
      settings,
      referrals: referrals.documents,
      transactions: transactions.documents,
      redemptions: redemptions.documents,
    };
  }
  if (action === "saveSettings") {
    const admin = await requireAdmin(userId);
    const settings = validateSettings(body.settings);
    const storedSettings = {
      ...settings,
      pointsByPlan: JSON.stringify(settings.pointsByPlan),
    };
    await db.createDocument(databaseId, ids.settings, "default", {
      ...storedSettings,
      version: Date.now(),
      updatedBy: admin.$id,
      updatedAt: new Date().toISOString(),
    }).catch(async (error) => {
      if (error.code !== 409) throw error;
      return db.updateDocument(databaseId, ids.settings, "default", {
        ...storedSettings,
        version: Date.now(),
        updatedBy: admin.$id,
        updatedAt: new Date().toISOString(),
      });
    });
    await db.createDocument(databaseId, ids.audit, ID.unique(), {
      actorId: admin.$id,
      action: "settings.updated",
      entity: "referral_settings",
      details: JSON.stringify(settings),
      reason: "Admin configuration update",
      createdAt: new Date().toISOString(),
    });
    return settings;
  }
  if (action === "adminData" || action === "adjustPoints") {
    await requireAdmin(userId);
    if (action === "adminData") {
      const [referrals, transactions, redemptions] = await Promise.all([
        db.listDocuments(databaseId, ids.referrals, [Query.orderDesc("createdAt"), Query.limit(500)]),
        db.listDocuments(databaseId, ids.transactions, [Query.orderDesc("createdAt"), Query.limit(500)]),
        db.listDocuments(databaseId, ids.redemptions, [Query.orderDesc("createdAt"), Query.limit(500)]),
      ]);
      return { referrals: referrals.documents, transactions: transactions.documents, redemptions: redemptions.documents };
    }
    const points = Number(body.points);
    const reason = String(body.reason || "").trim();
    if (!Number.isInteger(points) || points === 0 || Math.abs(points) > 100000 || reason.length < 5 || reason.length > 500) {
      throw new Error("Enter a non-zero whole number of points and a reason (5–500 characters).");
    }
    const target = await db.getDocument(databaseId, ids.members, String(body.memberId || ""));
    const transaction = await withMemberLock(target.$id, async () => {
      if (points < 0) {
        const ledger = await listLedger(target.$id);
        if (ledger.availablePoints < Math.abs(points)) throw new Error("Adjustment cannot make the wallet balance negative.");
      }
      return db.createDocument(databaseId, ids.transactions, ID.unique(), {
        memberId: target.$id,
        type: "adjustment",
        points,
        status: "posted",
        description: reason,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      });
    });
    await db.createDocument(databaseId, ids.audit, ID.unique(), {
      actorId: userId,
      action: "points.adjusted",
      entity: target.$id,
      details: JSON.stringify({ transactionId: transaction.$id, points }),
      reason,
      createdAt: new Date().toISOString(),
    });
    return { transactionId: transaction.$id };
  }
  if (action === "setRedemptionStatus") {
    const admin = await requireAdmin(userId);
    const redemption = await db.getDocument(databaseId, ids.redemptions, String(body.redemptionId || ""));
    const nextStatus = String(body.status || "");
    const reason = String(body.reason || "").trim();
    if (nextStatus !== "cancelled" || redemption.status !== "issued") {
      throw new Error("Only issued redemption codes can be cancelled by an administrator.");
    }
    if (reason.length < 5 || reason.length > 500) {
      throw new Error("A cancellation reason of 5–500 characters is required.");
    }
    await withMemberLock(redemption.memberId, async () => {
      const refundId = docId(`redemption-reversal:${redemption.$id}`);
      if (!(await getDoc(ids.transactions, refundId))) {
        await db.createDocument(databaseId, ids.transactions, refundId, {
          memberId: redemption.memberId,
          type: "reversal",
          points: redemption.points,
          status: "posted",
          redemptionId: redemption.$id,
          idempotencyKey: `redemption-cancel:${redemption.$id}`,
          description: "Points returned for cancelled Sakhi Bazaar redemption",
          createdAt: new Date().toISOString(),
        });
      }
      await db.updateDocument(databaseId, ids.redemptions, redemption.$id, { status: nextStatus });
    });
    await db.createDocument(databaseId, ids.audit, ID.unique(), {
      actorId: admin.$id,
      action: `redemption.${nextStatus}`,
      entity: redemption.$id,
      details: JSON.stringify({ memberId: redemption.memberId }),
      reason: reason || `Redemption marked ${nextStatus}`,
      createdAt: new Date().toISOString(),
    });
    return { redemptionId: redemption.$id, status: nextStatus };
  }
  const member = await requireMember(userId);
  if (action === "wallet") {
    const code = await getOrCreateReferralCode(member);
    await withMemberLock(member.$id, () => expireRedemptions(member.$id));
    const refreshedLedger = await listLedger(member.$id);
    const referralUrl = `${env.PUBLIC_SITE_URL || "https://pinkshakti.com"}/membership?ref=${encodeURIComponent(code.code)}`;
    return { code: code.code, referralUrl, ...refreshedLedger };
  }
  if (action === "memberSubscription") {
    const result = await db.listDocuments(databaseId, ids.subscriptions, [
      Query.equal("memberId", member.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }
  if (action === "quote") {
    const quote = await referralQuote(userId, String(body.planId || ""), String(body.code || ""));
    return {
      valid: true,
      discount: quote.discount,
      finalAmount: Math.max(0, quote.plan.price - quote.discount),
      message: quote.discount ? "Referral discount applied." : "No referral discount applies.",
    };
  }
  if (action === "createFreeSubscription") {
    const planIdOrSlug = String(body.planId || "");
    const plan = await getMembershipPlan(planIdOrSlug);
    const planId = plan.$id;
    if (plan.status !== "active" || Number(plan.price) !== 0) {
      throw new Error("Only an active free membership plan can be registered without payment.");
    }
    return withMemberLock(member.$id, async () => {
      const active = await maybeSingle(ids.subscriptions, [
        Query.equal("memberId", member.$id),
        Query.equal("status", "active"),
      ]);
      if (active) {
        await awardFreeSubscriptionReferral(active, plan);
        return { subscriptionId: active.$id };
      }
      const existing = await maybeSingle(ids.subscriptions, [
        Query.equal("memberId", member.$id),
        Query.equal("planId", planId),
      ]);
      if (existing) {
        await awardFreeSubscriptionReferral(existing, plan);
        return { subscriptionId: existing.$id };
      }

      const attribution = await validateFreeReferralCode(userId, body.referralCode);
      const now = new Date().toISOString();
      const expiry = membershipExpiry(plan.duration, now);
      const subscriptionId = docId(`free-subscription:${member.$id}:${planId}`);
      const referralPointsAwarded = attribution.referralCode
        ? referralPointsForPlan(planId, attribution.config)
        : 0;
      let subscription;
      try {
        subscription = await db.createDocument(databaseId, ids.subscriptions, subscriptionId, {
          memberId: member.$id,
          userId,
          memberName: member.fullName,
          email: member.email,
          phone: member.phone,
          occupation: member.occupation,
          dob: normalizeDateTime(member.dob),
          address: member.address,
          city: member.city || "",
          state: member.state || "",
          planId,
          tier: plan.name,
          planName: plan.name,
          planSlug: plan.slug,
          duration: plan.duration,
          amount: 0,
          currency: plan.currency || "INR",
          startsAt: now,
          endsAt: expiry,
          startedAt: now,
          expiresAt: expiry,
          status: "active",
          paymentStatus: "free",
          referralCode: attribution.code || undefined,
          referrerMemberId: attribution.referralCode?.memberId || undefined,
          referralPointsAwarded,
        });
      } catch (error) {
        if (error.code !== 409) throw error;
        subscription = await getDoc(ids.subscriptions, subscriptionId);
        if (!subscription) throw error;
      }
      await awardFreeSubscriptionReferral(subscription, plan);
      return { subscriptionId: subscription.$id };
    });
  }
  if (action === "createMembershipOrder") {
    return createMembershipOrder(userId, member, String(body.planId || ""), String(body.code || ""));
  }
  if (action === "verifyMembershipPayment") return verifyMembershipPayment(userId, member, body);
  if (action === "createRedemption") return createRedemption(member);
  throw new Error("Unsupported referral operation.");
}

async function handleBazaarAction(action, body) {
  const token = String(body.token || "").trim().toUpperCase();
  if (!token) throw new Error("Redemption token is required.");
  const redemption = await maybeSingle(ids.redemptions, [Query.equal("token", token)]);
  if (!redemption) throw new Error("Redemption code was not found.");
  const externalOrderId = String(body.externalOrderId || "").trim();
  if (!externalOrderId || externalOrderId.length > 100) {
    throw new Error("A valid Sakhi Bazaar order reference is required.");
  }
  return withMemberLock(redemption.memberId, async () => {
    const latest = await db.getDocument(databaseId, ids.redemptions, redemption.$id);
    if (latest.externalOrderId === externalOrderId && latest.status === "redeemed" && action === "consumeRedemption") {
      return { redemptionId: latest.$id, status: latest.status };
    }
    if (latest.status === "reserved" && latest.externalOrderId === externalOrderId && action === "reserveRedemption") {
      return { valid: true, discount: latest.discount, redemptionId: latest.$id };
    }
    if (action === "reserveRedemption") {
      if (latest.status !== "issued" || Date.parse(latest.expiresAt) <= Date.now()) {
        throw new Error("Redemption code is expired or already reserved.");
      }
      await db.updateDocument(databaseId, ids.redemptions, latest.$id, {
        status: "reserved",
        externalOrderId,
        reserveExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });
      return { valid: true, discount: latest.discount, redemptionId: latest.$id };
    }
    if (
      action === "cancelBazaarOrder" &&
      latest.status === "reserved" &&
      latest.externalOrderId === externalOrderId
    ) {
      const expired = Date.parse(latest.expiresAt) <= Date.now();
      await db.updateDocument(databaseId, ids.redemptions, latest.$id, {
        status: expired ? "expired" : "issued",
        reserveExpiresAt: undefined,
      });
      if (expired) await returnRedemptionPoints(latest, "redemption-expiry");
      return { redemptionId: latest.$id, status: expired ? "expired" : "issued" };
    }
    if (
      action === "cancelBazaarOrder" &&
      latest.status === "issued" &&
      latest.externalOrderId === externalOrderId
    ) {
      return { redemptionId: latest.$id, status: "issued" };
    }
    if (action === "consumeRedemption") {
      return finalizeReservedRedemption(latest, externalOrderId);
    }
    if (
      action === "cancelBazaarOrder" &&
      latest.status === "redeemed" &&
      latest.externalOrderId === externalOrderId
    ) {
      await db.updateDocument(databaseId, ids.redemptions, latest.$id, { status: "cancelled" });
      await returnRedemptionPoints(latest, "bazaar-cancel");
      return { redemptionId: latest.$id, status: "cancelled" };
    }
    if (action === "cancelBazaarOrder" && latest.status === "cancelled" && latest.externalOrderId === externalOrderId) {
      return { redemptionId: latest.$id, status: "cancelled" };
    }
    throw new Error("Redemption is expired, used, or reserved for another order.");
  });
}

async function finalizeReservedRedemption(redemption, externalOrderId) {
  const latest = await db.getDocument(databaseId, ids.redemptions, redemption.$id);
  if (latest.status !== "reserved" || latest.externalOrderId !== externalOrderId) {
    throw new Error("Redemption is not reserved for this Sakhi Bazaar order.");
  }
  if (Date.parse(latest.reserveExpiresAt) <= Date.now()) {
    throw new Error("The redemption reservation expired. Reserve it again before completing checkout.");
  }
  await db.updateDocument(databaseId, ids.redemptions, latest.$id, {
    status: "redeemed",
    redeemedAt: new Date().toISOString(),
  });
  return { redemptionId: latest.$id, status: "redeemed" };
}

async function returnRedemptionPoints(redemption, reason) {
  const reversalId = docId(`${reason}:${redemption.$id}`);
  if (!(await getDoc(ids.transactions, reversalId))) {
    await db.createDocument(databaseId, ids.transactions, reversalId, {
      memberId: redemption.memberId,
      type: "reversal",
      points: redemption.points,
      status: "posted",
      redemptionId: redemption.$id,
      idempotencyKey: `${reason}:${redemption.$id}`,
      description: "Points returned for cancelled Sakhi Bazaar order",
      createdAt: new Date().toISOString(),
    });
  }
}

async function handleRazorpayWebhook(req) {
  const rawBody =
    [req.bodyRaw, req.bodyText, req.body].find((value) => typeof value === "string") || "";
  if (!rawBody) throw new Error("Razorpay webhook raw request body is unavailable.");
  const signature = req.headers["x-razorpay-signature"];
  const expected = createHmac("sha256", required("RAZORPAY_WEBHOOK_SECRET")).update(rawBody).digest("hex");
  if (!signature || !safeEqualHex(expected, String(signature))) {
    throw new Error("Invalid Razorpay webhook signature.");
  }
  const event = typeof rawBody === "string" ? JSON.parse(rawBody) : req.bodyJson || {};
  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (payment?.id && payment?.order_id) {
      const order = await maybeSingle(ids.orders, [Query.equal("razorpayOrderId", payment.order_id)]);
      if (order && order.paymentStatus !== "paid" && payment.amount === order.finalAmount * 100) {
        const member = await db.getDocument(databaseId, ids.members, order.memberId);
        const orderSignature = createHmac("sha256", required("RAZORPAY_KEY_SECRET"))
          .update(`${payment.order_id}|${payment.id}`)
          .digest("hex");
        await verifyMembershipPayment(order.userId, member, {
          planId: order.planId,
          orderId: payment.order_id,
          paymentId: payment.id,
          signature: orderSignature,
        });
      }
    }
  }
  if (event.event === "payment.failed") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      const order = await maybeSingle(ids.orders, [Query.equal("razorpayOrderId", payment.order_id)]);
      if (order && order.paymentStatus === "pending") {
        await db.updateDocument(databaseId, ids.orders, order.$id, { paymentStatus: "failed" });
        if (order.referrerMemberId) {
          const referral = await getDoc(ids.referrals, docId(`referral:${order.$id}`));
          if (referral && referral.status === "pending") {
            await db.updateDocument(databaseId, ids.referrals, referral.$id, { status: "failed" });
          }
        }
      }
    }
  }
  if (event.event === "refund.processed") {
    const payment = event.payload?.payment?.entity;
    const refund = event.payload?.refund?.entity;
    if (payment?.id) {
      const order = await maybeSingle(ids.orders, [Query.equal("razorpayPaymentId", payment.id)]);
      if (order && refund?.amount >= order.finalAmount * 100) {
        await withMemberLock(order.memberId, async () => {
          const currentOrder = await db.getDocument(databaseId, ids.orders, order.$id);
          if (currentOrder.paymentStatus === "paid") {
            await db.updateDocument(databaseId, ids.orders, currentOrder.$id, {
              paymentStatus: "refunded",
            });
            const subscription = currentOrder.subscriptionId
              ? await getDoc(ids.subscriptions, currentOrder.subscriptionId)
              : null;
            if (subscription) {
              await db.updateDocument(databaseId, ids.subscriptions, subscription.$id, {
                paymentStatus: "refunded",
                status: "cancelled",
              });
            }
            const referral = await getDoc(ids.referrals, docId(`referral:${currentOrder.$id}`));
            const config = JSON.parse(currentOrder.referralConfig || "{}");
            if (referral) {
              await db.updateDocument(databaseId, ids.referrals, referral.$id, {
                status: "refunded",
              });
              if (config.refundPolicy === "reverse" && Number(referral.pointsAwarded) > 0) {
                const reversalId = docId(`refund-reversal:${currentOrder.$id}`);
                if (!(await getDoc(ids.transactions, reversalId))) {
                  await db.createDocument(databaseId, ids.transactions, reversalId, {
                    memberId: referral.referrerMemberId,
                    type: "reversal",
                    points: -Number(referral.pointsAwarded),
                    status: "posted",
                    membershipOrderId: currentOrder.$id,
                    idempotencyKey: `refund:${currentOrder.$id}`,
                    description: "Referral points reversed after membership refund",
                    createdAt: new Date().toISOString(),
                  });
                }
              }
            }
          }
        });
      }
    }
  }
  return { received: true };
}

export default async ({ req, res, log, error }) => {
  try {
    return response(res, 200, { ok: true, data: await handleAction(req) });
  } catch (caught) {
    error(caught?.stack || String(caught));
    const status = /required|invalid|cannot|not available|not found|already|must|expired|active/i.test(caught.message) ? 400 : 500;
    return response(res, status, { ok: false, error: caught.message || "Referral operation failed." });
  }
};
