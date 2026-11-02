import { HeroSection } from "@/components/sections/HeroSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { HomeGuideSection } from "@/components/sections/HomeGuideSection";
import { CTASection } from "@/components/sections/CTASection";
import { usePageMeta, useStructuredData } from "@/lib/use-page-meta";

export default function HomePage() {
  usePageMeta(
    "Pink Shakti | Women Empowerment Community & Business Network in India",
    "Pink Shakti is India's 360° women's ecosystem from Ahmedabad. Join free to learn new skills, attend women's events, showcase your business, meet clients and sell on Sakhi Bazaar.",
  );
  useStructuredData("organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pink Shakti",
    url: "https://www.pinkshakti.com/",
    logo: "https://www.pinkshakti.com/images/logo.jpeg",
    description:
      "India's 360° women's ecosystem helping women build skills, find community, showcase their work, meet clients and sell.",
    founder: { "@type": "Person", name: "Manish Patel" },
    parentOrganization: { "@type": "Organization", name: "ZCAD Group" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    sameAs: ["https://www.instagram.com/pinkshaktiofficial/"],
  });
  return (
    <main>
      <HeroSection />
      <VisionSection />
      <HomeGuideSection />
      <PillarsSection />
      {/* Temporarily hidden: Stats, Events, Stories (Voices) and Partners (Sponsors) sections */}
      <CTASection />
    </main>
  );
}
