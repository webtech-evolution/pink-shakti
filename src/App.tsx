import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import PillarsPage from "@/pages/Pillars";
import EventsPage from "@/pages/Events";
import EventDetailPage from "@/pages/EventDetail";
import AwardsPage from "@/pages/Awards";
import MembershipPage from "@/pages/Membership";
import SakhiBazaarPage from "@/pages/SakhiBazaar";
import MediaPage from "@/pages/Media";
import PartnersPage from "@/pages/Partners";
import ContactPage from "@/pages/Contact";
import CSRPage from "@/pages/CSR";
import PrivacyPage from "@/pages/Privacy";
import TermsPage from "@/pages/Terms";
import JoinPage from "@/pages/Join";
import LoginPage from "@/pages/Login";
import ProfilePage from "@/pages/Profile";
/* Marketplace pages temporarily hidden from public view:
import ShopPage from "@/pages/Shop";
import StorePage from "@/pages/Store";
import ProductDetailPage from "@/pages/ProductDetail";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import OrderConfirmationPage from "@/pages/OrderConfirmation";
import MyOrdersPage from "@/pages/MyOrders";
*/
import NotFoundPage from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MerchantRoute } from "@/components/merchant/MerchantRoute";
import { MerchantLayout } from "@/components/merchant/MerchantLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminEventsList from "@/pages/admin/EventsList";
import AdminEventForm from "@/pages/admin/EventForm";
import AdminRegistrations from "@/pages/admin/Registrations";
import AdminMembershipsList from "@/pages/admin/MembershipsList";
import AdminMembershipForm from "@/pages/admin/MembershipForm";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminSchema from "@/pages/admin/Schema";
import AdminMerchantsList from "@/pages/admin/MerchantsList";
import AdminOrders from "@/pages/admin/Orders";
import AdminMembersList from "@/pages/admin/MembersList";
import AdminLeads from "@/pages/admin/Leads";
import AdminReferralRewards from "@/pages/admin/ReferralRewards";
import StoriesPage from "@/pages/Stories";
import {
  CirclesPage,
  FAQPage,
  HowItWorksPage,
  PartnerPage,
  ResourcesPage,
  SellPage,
  ShowcasePage,
} from "@/pages/ContentPages";
import MerchantLogin from "@/pages/merchant/Login";
import MerchantRegister from "@/pages/merchant/Register";
import MerchantCheckout from "@/pages/merchant/Checkout";
import MerchantOnboarding from "@/pages/merchant/Onboarding";
import MerchantDashboard from "@/pages/merchant/Dashboard";
import MerchantProducts from "@/pages/merchant/Products";
import MerchantProductForm from "@/pages/merchant/ProductForm";
import MerchantOrders from "@/pages/merchant/Orders";

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.history?.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0 });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background font-body overflow-x-hidden">
          <Toaster position="top-center" richColors />
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminMembersList />} />
                <Route path="/admin/events" element={<AdminEventsList />} />
                <Route path="/admin/events/new" element={<AdminEventForm />} />
                <Route path="/admin/events/:id" element={<AdminEventForm />} />
                <Route path="/admin/registrations" element={<AdminRegistrations />} />
                <Route path="/admin/members" element={<AdminMembersList />} />
                <Route path="/admin/memberships" element={<AdminMembershipsList />} />
                <Route path="/admin/memberships/new" element={<AdminMembershipForm />} />
                <Route path="/admin/memberships/:id" element={<AdminMembershipForm />} />
                <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                <Route path="/admin/schema" element={<AdminSchema />} />
                <Route path="/admin/merchants" element={<AdminMerchantsList />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/leads" element={<AdminLeads />} />
                <Route path="/admin/referrals" element={<AdminReferralRewards />} />
              </Route>
            </Route>

            {/* Merchant routes */}
            <Route path="/merchant/login" element={<MerchantLogin />} />
            <Route path="/merchant/register" element={<MerchantRegister />} />
            <Route path="/merchant/checkout" element={<MerchantCheckout />} />
            <Route element={<MerchantRoute />}>
              <Route path="/merchant/onboarding" element={<MerchantOnboarding />} />
              <Route element={<MerchantLayout />}>
                <Route path="/merchant" element={<MerchantDashboard />} />
                <Route path="/merchant/products" element={<MerchantProducts />} />
                <Route path="/merchant/products/new" element={<MerchantProductForm />} />
                <Route path="/merchant/products/:id" element={<MerchantProductForm />} />
                <Route path="/merchant/orders" element={<MerchantOrders />} />
              </Route>
            </Route>

            {/* Public routes */}
            <Route
              path="/*"
              element={
                <PublicShell>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/pillars" element={<PillarsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:slug" element={<EventDetailPage />} />
                    <Route path="/showcase" element={<ShowcasePage />} />
                    <Route path="/circles" element={<CirclesPage />} />
                    <Route path="/stories" element={<StoriesPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/awards" element={<AwardsPage />} />
                    <Route path="/membership" element={<MembershipPage />} />
                    <Route path="/sakhi-bazaar" element={<SakhiBazaarPage />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/media" element={<MediaPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/partner" element={<PartnerPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/csr" element={<CSRPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Marketplace routes temporarily hidden:
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/store/:merchantId" element={<StorePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order/:id" element={<OrderConfirmationPage />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                    */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </PublicShell>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
