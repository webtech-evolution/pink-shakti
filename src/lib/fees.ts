import { getMerchantById } from "@/lib/memberships-api";

// Razorpay standard domestic card/UPI fee (2%) + 18% GST on the fee.
export const RAZORPAY_FEE_PERCENT = 2;
export const RAZORPAY_GST_PERCENT = 18;
export const EFFECTIVE_GATEWAY_PERCENT = RAZORPAY_FEE_PERCENT * (1 + RAZORPAY_GST_PERCENT / 100); // 2.36

// Fallback when the merchant/plan document isn't readable publicly.
export const DEFAULT_COMMISSION_PERCENT = 0;

// Only successful lookups are cached, so a permission blip doesn't stick at 0.
const cache = new Map<string, number>();
/** Merchant billing is calculated monthly from sales volume, never from a membership plan. */
export async function commissionPercentFor(merchantId: string): Promise<number> {
  if (cache.has(merchantId)) return cache.get(merchantId)!;
  try {
    await getMerchantById(merchantId);
  } catch (err) {
    console.warn(
      `[fees] Could not read merchant ${merchantId} (check read permission on the merchants collection)`,
      err,
    );
  }
  cache.set(merchantId, DEFAULT_COMMISSION_PERCENT);
  return DEFAULT_COMMISSION_PERCENT;
}

/**
 * Customer pays the platform commission and the payment-gateway charges on top
 * of goods + delivery. The gateway fee is grossed up so that the net amount
 * received after Razorpay's cut still covers commission + merchant payout.
 */
export function grossUpGatewayFee(baseAmount: number) {
  const gross = baseAmount / (1 - EFFECTIVE_GATEWAY_PERCENT / 100);
  return Math.round(gross - baseAmount);
}
