# PINK SHAKTI 360

PINK SHAKTI 360 is a React/Vite website for Pink Shakti. It includes public content pages, events and registrations, membership, a merchant/product marketplace, orders, and an Appwrite-backed admin area. Appwrite provides authentication, database, file storage, and the referral/membership backend function. Razorpay handles payments.

## Technology

- React 19, TypeScript, Vite 7, Tailwind CSS 4
- Appwrite (Web SDK in the client; Node SDK in the referrals function)
- Razorpay Checkout and Orders API
- Bun lockfile for the web app; Node.js for the Appwrite Function
- Firebase Hosting and Vercel configuration are included

## Local setup

Prerequisites:

- Bun installed for the web application. There is no `engines` declaration; use a current Bun release compatible with the lockfile and Vite 7.
- Node.js compatible with the Appwrite Function runtime (Node 18 or newer) to run its tests and locally install its dependencies.
- An Appwrite project and Razorpay account for backend, authentication, and payment functionality.

1. Clone the repository and install dependencies:

   ```sh
   bun install
   ```

2. Create `.env.local` in the repository root and set the frontend variables listed in [Environment variables](#environment-variables). Vite reads `VITE_` variables at build time.

3. Configure the Appwrite project as described in [Appwrite setup](#appwrite-setup).

4. Start the frontend:

   ```sh
   bun run dev
   ```

   Vite serves the app on port `8080`.

5. To build and serve the production bundle locally:

   ```sh
   bun run build
   bun run preview
   ```

   A production build prerenders the configured static routes. If the four event-prerender variables are set, Vite also queries published events and prerenders their slugs. If that optional query fails, the build logs a warning and continues with the static routes.

6. Run the Appwrite Function tests:

   ```sh
   cd appwrite-functions/referrals
   npm install
   npm test
   ```

   The test suite covers the function's pure business rules and does not need live Appwrite or Razorpay credentials.

Useful root scripts:

| Command | Purpose |
|---|---|
| `bun run dev` | Start the local Vite development server |
| `bun run build` | Create the production build and prerendered pages |
| `bun run build:dev` | Build using Vite's development mode |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |

## Environment variables

The browser bundle must contain no secrets. **Every `VITE_` variable is public** and can be read by website visitors. Keep Appwrite API keys, Razorpay secrets, and integration secrets only in Appwrite Function environment settings.

### Frontend and build variables

Set these in `.env.local` for local work and in the hosting provider's build environment for production.

| Variable | Required | Default | Description |
|---|---:|---|---|
| `VITE_APPWRITE_ENDPOINT` | No | `https://cloud.appwrite.io/v1` | Appwrite API endpoint. Set this for self-hosted Appwrite. |
| `VITE_APPWRITE_PROJECT_ID` | Yes for Appwrite features | empty | Appwrite project ID. The app considers Appwrite configured when this is non-empty. |
| `VITE_APPWRITE_DATABASE_ID` | No | `pinkshakti` | Database containing the collections below. |
| `VITE_APPWRITE_EVENTS_COLLECTION_ID` | No | `events` | Events collection. Also used for build-time event prerendering. |
| `VITE_APPWRITE_TIERS_COLLECTION_ID` | No | `ticket_tiers` | Event ticket tiers. |
| `VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID` | No | `registrations` | Event registrations. |
| `VITE_APPWRITE_MEMBERSHIP_PLANS_COLLECTION_ID` | No | `membership_plans` | Membership plan catalogue. |
| `VITE_APPWRITE_MERCHANTS_COLLECTION_ID` | No | `merchants` | Merchant profiles and onboarding. |
| `VITE_APPWRITE_PRODUCTS_COLLECTION_ID` | No | `products` | Marketplace products. |
| `VITE_APPWRITE_ORDERS_COLLECTION_ID` | No | `orders` | Marketplace orders. |
| `VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID` | No | `testimonials` | Editable testimonials. |
| `VITE_APPWRITE_PARTNERS_COLLECTION_ID` | No | `partners` | Editable partners. |
| `VITE_APPWRITE_GALLERY_COLLECTION_ID` | No | `gallery` | Editable media gallery. |
| `VITE_APPWRITE_COMMUNITY_COLLECTION_ID` | No | `community_members` | Public community join submissions. |
| `VITE_APPWRITE_MEMBERS_COLLECTION_ID` | No | `members` | Authenticated member profiles. |
| `VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID` | No | `subscriptions` | Membership subscriptions. |
| `VITE_APPWRITE_NOMINATIONS_COLLECTION_ID` | No | `nominations` | Award nominations. |
| `VITE_APPWRITE_LEADS_COLLECTION_ID` | No | `leads` | Contact, partner, CSR, and newsletter leads. |
| `VITE_APPWRITE_BUCKET_ID` | No | `event_images` | Appwrite Storage bucket used for uploaded images and documents. |
| `VITE_APPWRITE_ADMIN_TEAM_ID` | No | `admins` | Appwrite Team ID used by the admin UI/configuration. Create the Team with this ID if using the default. |
| `VITE_APPWRITE_REFERRAL_FUNCTION_ID` | No | `pinkshakti-referrals` | Deployed Appwrite Function ID invoked by membership/referral features. |
| `VITE_RAZORPAY_KEY_ID` | Required for browser-based Razorpay checkout | none | Public Razorpay Key ID. Use a test key for local and staging environments. |

The application code supplies defaults for collection, database, bucket, team, and function IDs. Either create Appwrite resources using those IDs or override the corresponding variables consistently in the frontend and function configuration. Changing an ID does not create or rename a resource.

### Referrals Appwrite Function variables

Configure these in the Appwrite Function's environment variables. They are read from `process.env` by `appwrite-functions/referrals/src/main.js`.

| Variable | Required | Description |
|---|---:|---|
| `APPWRITE_ENDPOINT` | Yes | Appwrite API endpoint for the server SDK. |
| `APPWRITE_PROJECT_ID` | Yes | Appwrite project ID. |
| `APPWRITE_API_KEY` | Yes | Server-only API key with only the permissions the function needs: database document access for its listed collections and user lookup for admin checks. Never expose this to the browser. |
| `APPWRITE_DATABASE_ID` | Yes | Appwrite database ID; must match the frontend database. |
| `MEMBERS_COLLECTION_ID` | Yes | Members collection. |
| `MEMBERSHIP_PLANS_COLLECTION_ID` | Yes | Membership plans collection. |
| `MEMBERSHIP_ORDERS_COLLECTION_ID` | Yes | Function-managed payment/referral order records. |
| `SUBSCRIPTIONS_COLLECTION_ID` | Yes | Subscriptions collection. |
| `REFERRAL_CODES_COLLECTION_ID` | Yes | Referral codes collection. |
| `REFERRALS_COLLECTION_ID` | Yes | Qualified referral records. |
| `REFERRAL_SETTINGS_COLLECTION_ID` | Yes | Referral program settings collection. |
| `POINTS_TRANSACTIONS_COLLECTION_ID` | Yes | Points ledger collection. |
| `BAZAAR_REDEMPTIONS_COLLECTION_ID` | Yes | Bazaar redemption collection. |
| `REFERRAL_AUDIT_COLLECTION_ID` | Yes | Referral administration audit collection. |
| `RAZORPAY_KEY_ID` | Required for paid membership checkout | Server-side Razorpay Key ID. |
| `RAZORPAY_KEY_SECRET` | Required for paid membership checkout and payment verification | Secret used to create Razorpay orders and verify payments. |
| `RAZORPAY_WEBHOOK_SECRET` | Required for webhook verification | Secret configured for the Razorpay webhook endpoint. |
| `ADMIN_EMAILS` | Required for function admin actions | Comma-separated admin email allowlist; comparisons are case-insensitive. |
| `BAZAAR_INTEGRATION_SECRET` | Required only when using the external Bazaar integration endpoint | Shared secret checked against the `x-bazaar-secret` request header. Keep it secret. |
| `PUBLIC_SITE_URL` | No | Public site base URL used when constructing referral URLs; defaults to `https://pinkshakti.com`. |

The browser and Function share the database and several collection IDs, but use different variable names. Ensure each mapping points to the same actual Appwrite resource. For example, `VITE_APPWRITE_MEMBERS_COLLECTION_ID` and `MEMBERS_COLLECTION_ID` should both resolve to the members collection.

### Example local `.env.local`

```dotenv
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_APPWRITE_DATABASE_ID=pinkshakti
VITE_RAZORPAY_KEY_ID=rzp_test_your_public_key

# These are optional when using the default resource IDs:
# VITE_APPWRITE_EVENTS_COLLECTION_ID=events
# VITE_APPWRITE_BUCKET_ID=event_images
# VITE_APPWRITE_REFERRAL_FUNCTION_ID=pinkshakti-referrals
```

Do not commit real `.env.local` values or function secrets. Vite's `VERCEL` variable is only used internally to choose the Chromium binary for prerendering on Vercel Linux; Vercel supplies it automatically and it should not be manually configured.

## Appwrite setup

1. Create an Appwrite project and a database (default ID: `pinkshakti`).
2. Create the collections listed in [Database collections and schemas](#database-collections-and-schemas), or use the IDs you configure in both frontend and Function settings.
3. Add attributes and indexes before using the app. Appwrite query indexes are needed for fields queried or sorted in the client and function. At minimum index:
   - Equality filters: `status`, `slug`, `eventId`, `userId`, `memberId`, `merchantId`, `email`, `planId`, `paymentStatus`, `code`, and `razorpayOrderId` as applicable to each collection.
   - Sort fields: `order`, `startDate`, and any timestamp fields queried with order.
   - Add composite indexes for query combinations shown in the schemas below. Use unique indexes for IDs/codes explicitly called out as unique.
4. Configure collection permissions carefully:
   - Public pages need read access to published events and active public content.
   - Public forms need create permission for submissions; do not grant public update/delete permission.
   - Authenticated user documents should only be writable by their owner where appropriate.
   - Restrict administrative collection writes to the admin group/users.
   - Referral-service collections should not permit direct public/client writes; the Function uses its API key.
   - Do not assume a `status` field makes a collection secure. Appwrite permissions govern access.
5. Enable Appwrite Account email/password authentication. The app also uses Appwrite account sessions for protected member/admin/merchant areas.
6. Create the `admins` Appwrite Team if using the default team ID, and add authorized admin users. Set `ADMIN_EMAILS` in the referrals Function as a separate allowlist for its admin actions.
7. Create the Storage bucket `event_images` (or configure `VITE_APPWRITE_BUCKET_ID`). Grant the signed-in users who upload content the necessary create/read/delete permissions; allow public reads if uploaded images are intended to be public.
8. Deploy the referrals Function described below and set its environment variables. Configure its execute permissions so signed-in users can call member actions, and restrict administrator/external integration actions as appropriate.
9. In Razorpay, configure the webhook to call the deployed Function's `/webhook` endpoint, using the same secret as `RAZORPAY_WEBHOOK_SECRET`. Enable the payment events required by the membership flow. Test with Razorpay test credentials before production.

The application includes an admin database-schema page, but its inline reference currently documents only membership plans, subscriptions, and the referral collections. The broader frontend collection definitions below are derived from the TypeScript interfaces and API usage.

## Database collections and schemas

Create these as Appwrite Database **collections** in the configured database. The application data attributes below exclude Appwrite-managed metadata (`$id`, `$createdAt`, `$updatedAt`, `$permissions`, and similar system fields). In the compact notation, `?` means the application treats the field as optional; enum values are shown in braces. Add indexes to match filters/orderings in the application and Appwrite index limits. Where attribute sizes are not stated, choose limits suitable for the data and keep them large enough for the values described.

### Frontend collections

| Collection ID (default) | Data attributes |
|---|---|
| `events` | `title:string`, `slug:string`, `description:string`, `location:string`, `venue?:string`, `startDate:datetime`, `endDate?:datetime`, `coverImage?:string`, `status:enum{draft,published,archived}`, `featured?:boolean`, `category?:string`. Index `slug` (unique), `status`, `startDate` (for lookups/sorting). |
| `ticket_tiers` | `eventId:string`, `name:string`, `price:integer` (INR), `currency:string`, `capacity:integer`, `sold:integer`, `description?:string`, `order?:integer`. Index `eventId` and `eventId + order`. |
| `registrations` | `eventId:string`, `tierId:string`, `fullName:string`, `email:string`, `phone:string`, `quantity:integer`, `amount:integer` (INR), `paymentStatus:enum{pending,paid,failed,refunded}`, `razorpayOrderId?:string`, `razorpayPaymentId?:string`, `razorpaySignature?:string`, `notes?:string`. Index `eventId`, `paymentStatus`, `razorpayOrderId`. |
| `membership_plans` | `name:string`, `slug:string`, `meaning:string`, `price:integer` (INR), `currency:string`, `duration:enum{monthly,yearly,lifetime}`, `features:string[]`, `productLimit?:integer` (legacy), `commissionPercent?:integer` (legacy), `coverImage?:string`, `status:enum{active,coming_soon,hidden}`, `order?:integer`, `tagline?:string`. The schema-reference file describes `name`, `slug`, `price`, `duration`, `productLimit`, `commissionPercent`, `features`, `coverImage`, `status`, `order`, and `tagline`; the live frontend also reads/writes `meaning` and `currency`. Use `slug` unique and index `order` and `status`. |
| `members` | `userId:string`, `memberNumber:string`, `fullName:string`, `email:string`, `phone:string`, `occupation:string`, `dob:string` (date input, normally `YYYY-MM-DD`), `address:string`, `city?:string`, `state?:string`, `interests:string[]`, `about?:string`, `status:enum{pending,active,suspended}`, `joinedAt?:datetime`. Index `userId` (unique), `memberNumber` (unique), `email`, and `status`. |
| `subscriptions` | `memberId:string`, `userId?:string`, `memberName?:string`, `email?:string`, `phone?:string`, `occupation?:string`, `dob?:datetime`, `address?:string`, `city?:string`, `state?:string`, `planId:string`, `planName?:string`, `planSlug?:string`, `tier?:string` (legacy), `duration?:enum{monthly,yearly,lifetime}`, `amount:integer` (INR), `currency?:string`, `startedAt?:datetime`, `expiresAt?:datetime`, `startsAt?:datetime`, `endsAt?:datetime`, `status:enum{pending,active,expired,cancelled}`, `paymentStatus?:enum{free,pending,paid,failed,refunded}`, `razorpayOrderId?:string`, `razorpayPaymentId?:string`, `paymentReference?:string`, `referralCode?:string`, `referrerMemberId?:string`, `referralPointsAwarded?:integer`, `interests?:string[]`, `notes?:string`. The schema-reference calls the name, email, phone, plan, dates, status, payment status, payment IDs, and referral fields required for its documented subscription setup; keep the additional fields optional to support legacy records. Index `memberId`, `email`, `userId`, `planId`, `status`, `expiresAt`, and `razorpayPaymentId`; add `memberId + status` and `memberId + planId`. |
| `merchants` | `userId:string`, `email:string`, `fullName:string`, `phone:string`, `businessName:string`, `gstNumber?:string`, `address:string`, `city:string`, `state:string`, `pincode:string`, `bankAccountName:string`, `bankAccountNumber:string`, `ifsc:string`, `razorpayAccountId?:string`, `planId:string`, `planPurchasedAt?:datetime`, `planExpiresAt?:datetime`, `status:enum{pending_payment,pending_onboarding,pending_review,approved,rejected,suspended}`, `rejectionReason?:string`, `kycDocUrl?:string`, `razorpayOrderId?:string`, `razorpayPaymentId?:string`. Index `userId` (unique), `email`, and `status`. Treat KYC and bank details as sensitive. |
| `products` | `merchantId:string`, `storeName:string`, `title:string`, `slug:string`, `description:string`, `rate:integer` (INR), `deliveryChargeGujarat:integer`, `deliveryChargeOther:integer`, `coverImage?:string`, `gallery?:string[]`, `stock:integer`, `category?:string`, `status:enum{active,draft,out_of_stock}`. Index `merchantId`, `status`, `category`, and `slug` (unique); enable full-text search for `title` if using the product search UI. |
| `orders` | `orderNumber:string`, `merchantId:string`, `storeName:string`, `items:string[]` (JSON-encoded `OrderItem` objects with `productId`, `title`, `rate`, `qty`, optional `coverImage`), `fullName:string`, `email:string`, `phone:string`, `address:string`, `city:string`, `state:string`, `pincode:string`, `subtotal:integer`, `deliveryCharge:integer`, `total:integer` (INR), `commissionPercent?:integer`, `commissionAmount?:integer`, `payoutAmount?:integer`, `paymentStatus:enum{pending,paid,failed,refunded}`, `orderStatus:enum{placed,processing,shipped,delivered,cancelled}`, `razorpayPaymentId?:string`, `razorpayOrderId?:string`, `notes?:string`. Index `orderNumber` (unique), `merchantId`, `email`, `paymentStatus`, and `$createdAt`. |
| `testimonials` | `quote:string`, `name:string`, `role?:string`, `image?:string`, `status:enum{active,hidden}`, `order?:integer`. Index `status` and `order`. |
| `partners` | `name:string`, `logo?:string`, `website?:string`, `category?:string`, `description?:string`, `status:enum{active,hidden}`, `order?:integer`. Index `status` and `order`. |
| `gallery` | `title:string`, `image:string`, `caption?:string`, `eventName?:string`, `status:enum{active,hidden}`, `order?:integer`. Index `status` and `order`. |
| `community_members` | `fullName:string`, `phone:string`, `email:string`, `occupation:string`, `dob:string` (the public join form submits text), `address:string`, `city?:string`, `state?:string`, `interests?:string[]`, `about?:string`, `status:string` (created as `pending`). Index `email` and `status`. |
| `nominations` | `category:string`, `nomineeName:string`, `nomineeEmail?:string`, `nomineePhone?:string`, `achievements:string`, `nominatedBy:string`, `nominatorEmail:string`, `city?:string`, `linkedin?:string`, `status:string` (created as `received`). Index `status` and `nominatorEmail`. |
| `leads` | `type:enum{partner,csr,newsletter,contact}`, `name?:string`, `email:string`, `phone?:string`, `organisation?:string`, `message?:string`, `status:string` (created as `new`, admin may set `contacted`). Index `type`, `status`, `email`, and `$createdAt`. |

`$id` and `$createdAt` are supplied by Appwrite; do not create them as custom attributes. For enum attributes, configure the listed values exactly. Currency is stored in integer rupees unless otherwise specified; Razorpay API amounts are converted to paise by the Function.

### Referrals Function collections

These are server-managed collections. All seven use no direct public/client writes; allow the Appwrite Function API key to perform required access. The default collection IDs are the lower-case names in this table and the Function environment variable is shown.

| Collection ID | Function variable | Attributes and indexes |
|---|---|---|
| `membership_orders` | `MEMBERSHIP_ORDERS_COLLECTION_ID` | Required: `userId:string(64)`, `memberId:string(64)`, `planId:string(64)`, `planName:string(100)`, `planDuration:enum{monthly,yearly,lifetime}`, `originalAmount:integer`, `discountAmount:integer`, `finalAmount:integer`, `currency:string(8)`, `razorpayOrderId:string(100)`, `paymentStatus:enum{pending,paid,failed,refunded}`, `createdAt:datetime`. Optional: `referralCode:string(30)`, `referrerMemberId:string(64)`, `razorpayPaymentId:string(100)`, `subscriptionId:string(64)`, `referralConfig:string(3000; JSON snapshot)`, `paidAt:datetime`. Index `userId`, `memberId`, `planId`, `paymentStatus`, `createdAt`, `razorpayOrderId` (unique), `userId + paymentStatus`, `userId + planId + paymentStatus`. |
| `referral_codes` | `REFERRAL_CODES_COLLECTION_ID` | Required: `memberId:string(64)`, `userId:string(64)`, `code:string(30)`, `status:enum{active,disabled}`, `createdAt:datetime`. Index `code` (unique), `memberId` (unique), `userId`, `status`, `memberId + status`, `code + status`. |
| `referrals` | `REFERRALS_COLLECTION_ID` | Required: `referrerMemberId:string(64)`, `referredUserId:string(64)`, `referredMemberId:string(64)`, `referralCode:string(30)`, `membershipOrderId:string(64)`, `planId:string(64)`, `planName:string(100)`, `discountAmount:integer`, `status:enum{pending,qualified,failed,refunded}`, `pointsAwarded:integer`, `createdAt:datetime`. Optional: `qualifiedAt:datetime`. Index `referrerMemberId`, `referredUserId`, `membershipOrderId` (unique), `status`, `createdAt`, `referrerMemberId + createdAt`, `referredUserId + createdAt`. |
| `referral_settings` | `REFERRAL_SETTINGS_COLLECTION_ID` | Required: `programEnabled:boolean`, `pointsEnabled:boolean`, `pointsPerPurchase:integer`, `pointsPlanIds:string[]`, `discountEnabled:boolean`, `discountType:enum{percent,fixed}`, `discountValue:integer`, `maxDiscount:integer`, `eligiblePlanIds:string[]`, `minimumPurchase:integer`, `allowStacking:boolean`, `discountUseLimit:integer` (`0` means unlimited), `refundPolicy:enum{reverse,retain}`, `redemptionsEnabled:boolean`, `redemptionPoints:integer`, `redemptionDiscount:integer`, `redemptionExpiryDays:integer`, `version:integer`, `updatedBy:string(64)`, `updatedAt:datetime`. Optional: `pointsByPlan:string(4000; JSON plan-ID-to-points map)`, `validFrom:string(40)`, `validUntil:string(40)`. Use document ID `default`; index `updatedAt` and `updatedBy`. |
| `points_transactions` | `POINTS_TRANSACTIONS_COLLECTION_ID` | Required: `memberId:string(64)`, `type:enum{credit,debit,reversal,adjustment,lock}`, `points:integer` (signed), `status:enum{posted,pending,locked}`, `description:string(500)`, `createdAt:datetime`. Optional: `membershipOrderId:string(64)`, `redemptionId:string(64)`, `idempotencyKey:string(100)`, `createdBy:string(64)`. Index `memberId + createdAt`, `idempotencyKey` (unique), `membershipOrderId`, `redemptionId`, `status`. Keep this as an append-only ledger; do not store a mutable balance. |
| `bazaar_redemptions` | `BAZAAR_REDEMPTIONS_COLLECTION_ID` | Required: `memberId:string(64)`, `token:string(40)`, `points:integer`, `discount:integer`, `status:enum{pending,issued,reserved,redeemed,cancelled,expired}`, `expiresAt:datetime`, `createdAt:datetime`. Optional: `redeemedAt:datetime`, `reserveExpiresAt:datetime`, `externalOrderId:string(100)`. Index `token` (unique), `memberId + status`, `status`, `expiresAt`, `externalOrderId`, `memberId + createdAt`, `memberId + status + createdAt`. |
| `referral_audit` | `REFERRAL_AUDIT_COLLECTION_ID` | Required: `actorId:string(64)`, `action:string(100)`, `entity:string(100)`, `details:string(3000)`, `reason:string(500)`, `createdAt:datetime`. Index `actorId`, `entity`, `action`, and `createdAt`. |

The full membership plan/subscription/referral schema reference is also defined in `src/lib/schema-reference.ts`; keep that reference and this document aligned when changing these collections.

## Appwrite referrals Function

Source is in `appwrite-functions/referrals/`. Deploy it as an Appwrite Function with the Node.js runtime and the entry point `index.js` (which re-exports `src/main.js`). The deployment must:

- Use the Function ID configured by `VITE_APPWRITE_REFERRAL_FUNCTION_ID`.
- Install the Function's dependencies from `appwrite-functions/referrals/package.json` (`node-appwrite`).
- Configure all required Function environment variables above, and enable the required Function scopes/API key access.
- Permit `POST` execution requests from the frontend for authenticated member actions. The function routes actions by JSON request body; Razorpay sends webhooks to `/webhook`.
- Set the Razorpay webhook signing secret and `PUBLIC_SITE_URL` for the deployed environment.

The Function supports membership checkout/payment verification, free membership subscription creation, referral codes/quotes/wallets, admin referral settings and points management, Bazaar redemption, and Razorpay webhook handling. Do not put its API key, Razorpay secret, webhook secret, or Bazaar shared secret in frontend variables.

## Hosting and deployment

### Vercel

`vercel.json` maps known prerendered routes to their generated HTML and falls back to `/index.html` for other paths. Set the frontend environment variables in the Vercel project before building. The Vite configuration uses `@sparticuz/chromium` for prerendering on Vercel Linux when Vercel sets `VERCEL=1`.

### Firebase Hosting

`firebase.json` serves the `dist` directory and rewrites paths to `index.html`. Build first, then deploy the Hosting target:

```sh
bun run build
firebase deploy --only hosting
```

### Before production handover

- Replace all test Razorpay credentials with production credentials in their respective client/function settings.
- Verify Razorpay order creation, signature verification, refunds, and webhook delivery using a controlled test transaction before opening payment flows.
- Confirm Appwrite collection/index/permission configuration, bucket access, admin Team membership, function scopes, and CORS/execute permissions.
- Restrict Appwrite API key scopes and rotate credentials if any have been shared outside trusted secret storage.
- Ensure the production frontend and Function point to the same Appwrite project/database and matching collection IDs.
- Keep backups/exports of production Appwrite data and maintain access to the Appwrite, Razorpay, Firebase/Vercel, DNS, and domain accounts.

## Project layout

| Path | Purpose |
|---|---|
| `src/pages/` | Public routes and admin/merchant screens |
| `src/components/` | Shared page layouts and UI components |
| `src/lib/` | Appwrite client, API wrappers, payment, storage, and schema metadata |
| `src/context/` | Authentication and cart state |
| `appwrite-functions/referrals/` | Server-side referral, membership-payment, and redemption Function |
| `public/`, `src/assets/` | Static images and visual assets |
| `vite.config.ts` | Vite build, prerendering, and sitemap generation |
| `firebase.json`, `vercel.json` | Hosting route configuration |
