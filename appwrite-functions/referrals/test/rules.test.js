import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateMembershipDiscount,
  calculateWalletBalance,
  hmacSha256,
  isPaidMembershipPlan,
  normalizeDateTime,
  referralPointsForPlan,
  verifyHexSignature,
} from "../src/rules.js";

test("percentage referral discounts honor maximum and purchase price", () => {
  assert.equal(
    calculateMembershipDiscount(2000, {
      discountEnabled: true,
      discountType: "percent",
      discountValue: 25,
      maxDiscount: 400,
    }),
    400,
  );
  assert.equal(
    calculateMembershipDiscount(200, {
      discountEnabled: true,
      discountType: "percent",
      discountValue: 100,
      maxDiscount: 0,
    }),
    200,
  );
});

test("fixed discounts cannot reduce membership price below zero", () => {
  assert.equal(
    calculateMembershipDiscount(500, {
      discountEnabled: true,
      discountType: "fixed",
      discountValue: 800,
      maxDiscount: 0,
    }),
    500,
  );
  assert.equal(
    calculateMembershipDiscount(500, {
      discountEnabled: false,
      discountType: "fixed",
      discountValue: 100,
      maxDiscount: 0,
    }),
    0,
  );
});

test("only active paid membership plans qualify for payment checkout", () => {
  assert.equal(isPaidMembershipPlan({ status: "active", price: 1499, duration: "yearly" }), true);
  assert.equal(
    isPaidMembershipPlan({ status: "coming_soon", price: 1499, duration: "yearly" }),
    false,
  );
  assert.equal(isPaidMembershipPlan({ status: "active", price: 0, duration: "yearly" }), false);
  assert.equal(isPaidMembershipPlan({ status: "active", price: 1499, duration: "unknown" }), false);
});

test("referral points use per-plan amounts and do not reward unconfigured plans", () => {
  assert.equal(
    referralPointsForPlan("plan-a", {
      pointsEnabled: true,
      pointsByPlan: { "plan-a": 75 },
    }),
    75,
  );
  assert.equal(
    referralPointsForPlan("plan-b", {
      pointsEnabled: true,
      pointsByPlan: { "plan-a": 75 },
    }),
    0,
  );
  assert.equal(
    referralPointsForPlan("plan-a", {
      pointsEnabled: false,
      pointsByPlan: { "plan-a": 75 },
    }),
    0,
  );
  assert.equal(
    referralPointsForPlan(
      "plan-a",
      { pointsEnabled: true, pointsPerPurchase: 25, pointsPlanIds: [] },
      true,
    ),
    25,
  );
  assert.equal(
    referralPointsForPlan(
      "plan-a",
      { pointsEnabled: true, pointsPerPurchase: 25, pointsPlanIds: [], pointsByPlan: { "plan-a": 0 } },
      true,
    ),
    0,
  );
});

test("wallet balance includes signed adjustments, reversals, and debits", () => {
  assert.equal(
    calculateWalletBalance([
      { type: "credit", points: 50, status: "posted" },
      { type: "debit", points: 10, status: "posted" },
      { type: "reversal", points: 5, status: "posted" },
      { type: "reversal", points: -20, status: "posted" },
      { type: "credit", points: 100, status: "pending" },
      { type: "debit", points: 15, status: "pending" },
    ]),
    10,
  );
});

test("Razorpay signature matching is exact and case-insensitive hex", () => {
  const valid = hmacSha256("secret", "order|payment");
  assert.equal(verifyHexSignature(valid, valid), true);
  assert.equal(verifyHexSignature(valid, valid.toUpperCase()), true);
  assert.equal(verifyHexSignature(valid, `${valid.slice(1)}0`), false);
});

test("date normalization accepts date-only and ISO values and ignores invalid optional dates", () => {
  assert.equal(normalizeDateTime("1990-04-21"), "1990-04-21T00:00:00.000Z");
  assert.equal(normalizeDateTime("1990-04-21T08:30:00.000Z"), "1990-04-21T08:30:00.000Z");
  assert.equal(normalizeDateTime("not-a-date"), undefined);
  assert.equal(normalizeDateTime(""), undefined);
});
