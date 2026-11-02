import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import PillarsPage from "@/pages/Pillars";
import EventsPage from "@/pages/Events";
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
import StoriesPage from "@/pages/Stories";
import NotFoundPage from "@/pages/NotFound";
import {
  CirclesPage,
  FAQPage,
  HowItWorksPage,
  PartnerPage,
  ResourcesPage,
  SellPage,
  ShowcasePage,
} from "@/pages/ContentPages";

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
    <div className="min-h-screen bg-background font-body overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pillars" element={<PillarsPage />} />
        <Route path="/events" element={<EventsPage />} />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
