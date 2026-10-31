import { createHmac, timingSafeEqual } from "node:crypto";

export function isPaidMembershipPlan(plan) {
  return Boolean(
    plan &&
      plan.status === "active" &&
      Number.isInteger(plan.price) &&
      plan.price > 0 &&
      ["monthly", "yearly", "lifetime"].includes(plan.duration),
  );
}

export function calculateMembershipDiscount(price, settings) {
  if (!settings.discountEnabled || !Number.isInteger(price) || price <= 0) return 0;
  let discount =
    settings.discountType === "percent"
      ? Math.floor((price * settings.discountValue) / 100)
      : settings.discountValue;
  if (settings.discountType === "percent" && settings.maxDiscount > 0) {
    discount = Math.min(discount, settings.maxDiscount);
  }
  return Math.max(0, Math.min(price, discount));
}

export function referralPointsForPlan(planId, settings, useLegacyPlanRules = false) {
  if (!settings.pointsEnabled) return 0;
  if (Object.hasOwn(settings.pointsByPlan || {}, planId)) {
    return settings.pointsByPlan[planId];
  }
  if (
    useLegacyPlanRules &&
    settings.pointsPerPurchase > 0 &&
    (!settings.pointsPlanIds.length || settings.pointsPlanIds.includes(planId))
  ) {
    return settings.pointsPerPurchase;
  }
  return 0;
}

export function normalizeDateTime(value) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function calculateWalletBalance(transactions) {
  return transactions
    .filter(
      (item) =>
        item.status === "posted" || (item.status === "pending" && item.type === "debit"),
    )
    .reduce((sum, item) => sum + (item.type === "debit" ? -item.points : item.points), 0);
}

export function verifyHexSignature(expected, actual) {
  if (typeof actual !== "string" || !/^[a-f0-9]+$/i.test(actual) || expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export function hmacSha256(secret, message) {
  return createHmac("sha256", secret).update(message).digest("hex");
}
