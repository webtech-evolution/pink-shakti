import jsPDF from "jspdf";
import logoUrl from "@/assets/logo.jpeg";
import { parseItems } from "@/lib/orders-api";
import { EFFECTIVE_GATEWAY_PERCENT } from "@/lib/fees";
import type { Order } from "@/lib/types";

const MAROON: [number, number, number] = [37, 8, 15];
const GOLD: [number, number, number] = [197, 160, 89];
const GREY: [number, number, number] = [110, 100, 100];

const inr = (n: number) =>
  `Rs. ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function receiptFileName(order: Order) {
  return `PinkShakti-Receipt-${order.orderNumber}.pdf`;
}

/** Builds a computer-generated receipt for a placed order. */
export async function buildReceipt(order: Order): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 44;
  const logo = await loadLogo();

  // Header band
  doc.setFillColor(...MAROON);
  doc.rect(0, 0, W, 96, "F");
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", M, 22, 52, 52);
    } catch {
      /* ignore unsupported image */
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("PINK SHAKTI 360", M + (logo ? 66 : 0), 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("India's Premium Women Ecosystem  |  pinkshakti.com", M + (logo ? 66 : 0), 62);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Computer generated receipt", M + (logo ? 66 : 0), 76);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("RECEIPT", W - M, 46, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Order ID: ${order.orderNumber}`, W - M, 62, { align: "right" });
  const dt = order.$createdAt ? new Date(order.$createdAt) : new Date();
  doc.text(`Date: ${dt.toLocaleString("en-IN")}`, W - M, 76, { align: "right" });

  let y = 128;

  // Parties
  doc.setTextColor(...MAROON);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SOLD BY (VENDOR)", M, y);
  doc.text("BILLED / SHIPPED TO", W / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.setFontSize(9.5);
  const vendor = [order.storeName || "-", "Fulfilled via Pink Shakti Marketplace"];
  vendor.forEach((l, i) => doc.text(l, M, y + 15 + i * 13));
  const buyer = [
    order.fullName,
    order.email,
    order.phone,
    ...doc.splitTextToSize(order.address || "", W / 2 - M - 10),
    `${order.city}, ${order.state} - ${order.pincode}`,
  ];
  buyer.forEach((l, i) => doc.text(String(l), W / 2, y + 15 + i * 13));

  y = y + 15 + Math.max(vendor.length, buyer.length) * 13 + 18;

  // Items table
  const colQty = W - M - 210;
  const colRate = W - M - 130;
  const colAmt = W - M;
  doc.setFillColor(...MAROON);
  doc.rect(M, y, W - M * 2, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PRODUCT", M + 10, y + 15);
  doc.text("QTY", colQty, y + 15, { align: "right" });
  doc.text("RATE", colRate, y + 15, { align: "right" });
  doc.text("AMOUNT", colAmt - 10, y + 15, { align: "right" });
  y += 22;

  const items = parseItems(order);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  items.forEach((it, idx) => {
    const nameLines = doc.splitTextToSize(it.title || "Item", colQty - M - 30);
    const h = Math.max(24, nameLines.length * 12 + 12);
    if (idx % 2 === 1) {
      doc.setFillColor(250, 246, 242);
      doc.rect(M, y, W - M * 2, h, "F");
    }
    doc.setTextColor(...MAROON);
    nameLines.forEach((l: string, i: number) => doc.text(l, M + 10, y + 16 + i * 12));
    doc.setTextColor(...GREY);
    doc.text(String(it.qty), colQty, y + 16, { align: "right" });
    doc.text(inr(it.rate), colRate, y + 16, { align: "right" });
    doc.setTextColor(...MAROON);
    doc.text(inr(it.rate * it.qty), colAmt - 10, y + 16, { align: "right" });
    y += h;
  });

  doc.setDrawColor(...GOLD);
  doc.line(M, y, W - M, y);
  y += 22;

  // Totals
  const commission = order.commissionAmount ?? 0;
  const gateway = Math.max(
    0,
    Math.round((order.total ?? 0) - (order.subtotal ?? 0) - (order.deliveryCharge ?? 0) - commission),
  );
  const rows: [string, string][] = [
    ["Subtotal", inr(order.subtotal)],
    [`Delivery charges (${order.state})`, inr(order.deliveryCharge)],
    [
      `Platform commission${order.commissionPercent ? ` (${order.commissionPercent}%)` : ""}`,
      inr(commission),
    ],
    [
      `Payment gateway charges (${EFFECTIVE_GATEWAY_PERCENT.toFixed(2)}%, incl. GST)`,
      inr(gateway),
    ],
  ];
  doc.setFontSize(9.5);
  rows.forEach(([label, val]) => {
    doc.setTextColor(...GREY);
    doc.text(label, colRate, y, { align: "right" });
    doc.setTextColor(...MAROON);
    doc.text(val, colAmt - 10, y, { align: "right" });
    y += 16;
  });

  y += 6;
  doc.setFillColor(...MAROON);
  doc.rect(colRate - 170, y, W - M - (colRate - 170), 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL PAID", colRate - 158, y + 20);
  doc.text(inr(order.total), colAmt - 10, y + 20, { align: "right" });
  y += 48;

  // Payment / status
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MAROON);
  doc.text(`Payment status: ${order.paymentStatus.toUpperCase()}`, M, y);
  doc.text(`Order status: ${order.orderStatus.toUpperCase()}`, M, y + 14);
  if (order.razorpayPaymentId)
    doc.text(`Razorpay payment ID: ${order.razorpayPaymentId}`, M, y + 28);
  if (order.notes) doc.text(`Notes: ${order.notes}`, M, y + 42);

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 58;
  doc.setDrawColor(...GOLD);
  doc.line(M, fy - 14, W - M, fy - 14);
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(
    "This is a computer generated receipt and does not require a signature.",
    W / 2,
    fy,
    { align: "center" },
  );
  doc.text(
    "Payments are collected by Pink Shakti 360 and settled to the vendor after platform commission. For support: support@pinkshakti.com",
    W / 2,
    fy + 12,
    { align: "center", maxWidth: W - M * 2 },
  );

  return doc;
}

export async function downloadReceipt(order: Order) {
  const doc = await buildReceipt(order);
  doc.save(receiptFileName(order));
}
