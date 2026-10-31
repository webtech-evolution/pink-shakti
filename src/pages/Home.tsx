import { HeroSection } from "@/components/sections/HeroSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { CTASection } from "@/components/sections/CTASection";
import { usePageMeta, useStructuredData } from "@/lib/use-page-meta";

export default function HomePage() {
  usePageMeta(
    "Pink Shakti | Grow Your Skill, Business & Network",
    "Join Pink Shakti, India's women ecosystem. Build skills, find community, showcase your work, meet clients and prepare to sell on Sakhi Bazaar.",
  );
  useStructuredData("organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pink Shakti",
    url: "https://www.pinkshakti.com/",
    logo: "https://www.pinkshakti.com/images/logo.jpeg",
    sameAs: ["https://www.instagram.com/pinkshaktiofficial/"],
  });
  return (
    <main>
      <HeroSection />
      <VisionSection />
      <PillarsSection />
      {/* Temporarily hidden: Stats, Events, Stories (Voices) and Partners (Sponsors) sections */}
      <CTASection />
    </main>
  );
}
