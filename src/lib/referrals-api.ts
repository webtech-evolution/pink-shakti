import { appwriteConfig, functions } from "@/lib/appwrite";
import { ExecutionMethod } from "appwrite";
import type { Subscription } from "@/lib/types";

export interface ReferralSettings {
  version?: number;
  programEnabled: boolean;
  pointsEnabled: boolean;
  pointsPerPurchase: number;
  pointsPlanIds: string[];
  pointsByPlan: Record<string, number>;
  discountEnabled: boolean;
  discountType: "percent" | "fixed";
  discountValue: number;
  maxDiscount: number;
  eligiblePlanIds: string[];
  minimumPurchase: number;
  validFrom: string;
  validUntil: string;
  allowStacking: boolean;
  discountUseLimit: number;
  refundPolicy: "reverse" | "retain";
  redemptionsEnabled: boolean;
  redemptionPoints: number;
  redemptionDiscount: number;
  redemptionExpiryDays: number;
}

export interface ReferralWallet {
  code: string;
  referralUrl: string;
  availablePoints: number;
  totalEarned: number;
  totalRedeemed: number;
  pendingReferrals: number;
  transactions: Array<{
    $id: string;
    type: string;
    points: number;
    description: string;
    createdAt: string;
  }>;
  referrals: Array<{
    $id: string;
    status: string;
    planName: string;
    createdAt: string;
    pointsAwarded: number;
  }>;
  redemptions: Array<{
    $id: string;
    token: string;
    points: number;
    discount: number;
    status: string;
    expiresAt: string;
  }>;
}

export interface ReferralQuote {
  valid: boolean;
  discount: number;
  finalAmount: number;
  message?: string;
}

async function execute<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const requestKey = JSON.stringify([action, payload]);
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) return existingRequest as Promise<T>;

  const request = executeOnce<T>(action, payload).finally(() => {
    inFlightRequests.delete(requestKey);
  });
  inFlightRequests.set(requestKey, request);
  return request;
}

const inFlightRequests = new Map<string, Promise<unknown>>();

async function executeOnce<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const execution = await functions.createExecution(
    appwriteConfig.referralFunctionId,
    JSON.stringify({ action, ...payload }),
    false,
    "/",
    ExecutionMethod.POST,
  );
  let result: { ok?: boolean; data?: T; error?: string };
  try {
    result = JSON.parse(execution.responseBody || "{}") as typeof result;
  } catch {
    throw new Error("Referral service returned an invalid response.");
  }
  if (execution.responseStatusCode >= 400 || !result.ok) {
    throw new Error(result.error || "Referral service request failed.");
  }
  return result.data as T;
}

export const getReferralWallet = () => execute<ReferralWallet>("wallet");
export const getMemberSubscription = () => execute<Subscription | null>("memberSubscription");
export const getReferralSettings = () => execute<ReferralSettings>("getSettings");
export const saveReferralSettings = (settings: ReferralSettings) =>
  execute<ReferralSettings>("saveSettings", { settings });
export const getReferralQuote = (planId: string, code: string) =>
  execute<ReferralQuote>("quote", { planId, code });
export const validateReferralCode = (code: string) =>
  execute<{ valid: boolean; code: string }>("validateReferralCode", { code });
export const createMembershipOrder = (planId: string, code: string) =>
  execute<{ orderId: string; amount: number; currency: string; discount: number }>(
    "createMembershipOrder",
    { planId, code },
  );
export const verifyMembershipPayment = (payment: {
  planId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}) => execute<{ subscriptionId: string }>("verifyMembershipPayment", payment);
export const createFreeMembershipSubscription = (planId: string, referralCode = "") =>
  execute<{ subscriptionId: string }>("createFreeSubscription", { planId, referralCode });
export const createBazaarRedemption = () =>
  execute<{ token: string; points: number; discount: number; expiresAt: string }>(
    "createRedemption",
  );
export interface ReferralAdminOverview {
  settings: ReferralSettings;
  referrals: Array<Record<string, unknown>>;
  transactions: Array<Record<string, unknown>>;
  redemptions: Array<Record<string, unknown>>;
}

export const getReferralAdminOverview = () =>
  execute<ReferralAdminOverview>("adminOverview");
export const adjustReferralPoints = (memberId: string, points: number, reason: string) =>
  execute("adjustPoints", { memberId, points, reason });
export const setReferralRedemptionStatus = (
  redemptionId: string,
  status: "cancelled",
  reason?: string,
) => execute("setRedemptionStatus", { redemptionId, status, reason });
