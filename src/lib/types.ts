export interface EventDoc {
  $id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  category?: string;
}

export interface TicketTier {
  $id: string;
  eventId: string;
  name: string;
  price: number;
  currency: string;
  capacity: number;
  sold: number;
  description?: string;
  order?: number;
}

export interface Registration {
  $id: string;
  eventId: string;
  tierId: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  amount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  $createdAt?: string;
}

export type PlanDuration = "monthly" | "yearly" | "lifetime";
export type PlanStatus = "active" | "coming_soon" | "hidden";

export interface MembershipPlan {
  $id: string;
  name: string;
  slug: string;
  meaning: string;
  price: number; // INR
  currency: string;
  duration: "yearly" | "lifetime";
  features: string[]; // bullet points
  /** Legacy seller fields retained only for old documents during migration. */
  productLimit?: number;
  commissionPercent?: number;
  coverImage?: string;
  status: PlanStatus;
  order?: number;
  tagline?: string;
  $createdAt?: string;
}

export type MemberStatus = "pending" | "active" | "suspended";

export interface Member {
  $id: string;
  userId: string;
  memberNumber: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  dob: string;
  address: string;
  city?: string;
  state?: string;
  interests: string[];
  about?: string;
  status: MemberStatus;
  joinedAt?: string;
  $createdAt?: string;
}

export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";
export type SubscriptionPaymentStatus = "free" | "pending" | "paid" | "failed" | "refunded";

export interface Subscription {
  $id: string;
  memberName?: string;
  email?: string;
  phone?: string;
  userId?: string;
  memberId?: string;
  occupation?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  planId: string;
  planName?: string;
  planSlug?: string;
  tier?: string;
  duration?: "monthly" | "yearly" | "lifetime";
  amount: number;
  currency?: string;
  startedAt?: string;
  expiresAt?: string;
  startsAt?: string;
  endsAt?: string;
  status: SubscriptionStatus;
  paymentStatus?: SubscriptionPaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentReference?: string;
  interests?: string[];
  notes?: string;
  $createdAt?: string;
}

export type MerchantStatus =
  | "pending_payment"
  | "pending_onboarding"
  | "pending_review"
  | "approved"
  | "rejected"
  | "suspended";

export type ProductStatus = "active" | "draft" | "out_of_stock";

export interface Product {
  $id: string;
  merchantId: string;
  storeName: string;
  title: string;
  slug: string;
  description: string;
  rate: number; // INR
  deliveryChargeGujarat: number;
  deliveryChargeOther: number;
  coverImage?: string;
  gallery?: string[];
  stock: number;
  category?: string;
  status: ProductStatus;
  $createdAt?: string;
}

export interface Merchant {
  $id: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  businessName: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bankAccountName: string;
  bankAccountNumber: string;
  ifsc: string;
  razorpayAccountId?: string;
  planId: string;
  planPurchasedAt?: string;
  planExpiresAt?: string;
  status: MerchantStatus;
  rejectionReason?: string;
  kycDocUrl?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  $createdAt?: string;
}

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  title: string;
  rate: number;
  qty: number;
  coverImage?: string;
}

export interface Order {
  $id: string;
  orderNumber: string;
  merchantId: string;
  storeName: string;
  items: string[]; // Appwrite string[] of JSON-encoded OrderItem
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  commissionPercent?: number;
  commissionAmount?: number;
  payoutAmount?: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  notes?: string;
  $createdAt?: string;
}

// ---------- Editable site content ----------
export interface Testimonial {
  $id: string;
  quote: string;
  name: string;
  role?: string;
  image?: string;
  status: "active" | "hidden";
  order?: number;
}

export interface Partner {
  $id: string;
  name: string;
  logo?: string;
  website?: string;
  category?: string;
  description?: string;
  status: "active" | "hidden";
  order?: number;
}

export interface GalleryItem {
  $id: string;
  title: string;
  image: string;
  caption?: string;
  eventName?: string;
  status: "active" | "hidden";
  order?: number;
}
