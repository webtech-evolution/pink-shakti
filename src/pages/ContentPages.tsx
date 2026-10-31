import { ArrowRight, Check, CircleHelp, Lightbulb, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { usePageMeta, useStructuredData } from "@/lib/use-page-meta";

const steps = [
  {
    number: "01",
    title: "Join the sisterhood",
    text: "Start with a Pink Saathi account and share your interests, city and goals.",
  },
  {
    number: "02",
    title: "Learn and build confidence",
    text: "Take part in workshops and sessions on practical skills, communication and business.",
  },
  {
    number: "03",
    title: "Find your circle",
    text: "Connect with women around a shared pillar, profession or ambition.",
  },
  {
    number: "04",
    title: "Showcase your work",
    text: "Explore event stalls, product demonstrations and stage opportunities.",
  },
  {
    number: "05",
    title: "Build useful connections",
    text: "Meet peers, potential clients and partners through the Pink Shakti community.",
  },
  {
    number: "06",
    title: "Grow at your pace",
    text: "Explore Sakhi Bazaar and other opportunities as they become available.",
  },
];

export function HowItWorksPage() {
  usePageMeta(
    "How Pink Shakti Works | Learn, Showcase, Grow",
    "See how Pink Shakti helps women join a community, build skills, showcase their work and grow meaningful connections.",
  );

  return (
    <main>
      <PageHero
        eyebrow="A path with room to grow"
        title={
          <>
            From skill to business, <span className="italic text-gold">step by step</span>
          </>
        }
        subtitle="Start with community. Choose the learning, connections and opportunities that fit your goals."
      >
        <Link
          to="/join"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-ivory"
        >
          Join free <ArrowRight size={14} />
        </Link>
      </PageHero>

      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <ol className="divide-y divide-maroon/10">
            {steps.map((step) => (
              <li key={step.number} className="grid gap-3 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8">
                <span className="font-display text-3xl text-gold">{step.number}</span>
                <div>
                  <h2 className="font-display text-2xl text-maroon">{step.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-maroon/65">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs leading-relaxed text-maroon/45">
            Event availability, eligibility and membership benefits depend on the current programme
            and plan details.
          </p>
        </div>
      </section>
    </main>
  );
}

const sellerBenefits = [
  {
    title: "A place for your products",
    text: "Prepare a seller profile with product photos, prices and the story behind your work.",
  },
  {
    title: "Promotion across the community",
    text: "Sakhi Bazaar plans to introduce women-led brands through Pink Shakti events and digital channels.",
  },
  {
    title: "A clear path to selling",
    text: "The team will share listing, verification, payment, dispatch and support requirements before launch.",
  },
];

export function SellPage() {
  usePageMeta(
    "Sell on Sakhi Bazaar | Pink Shakti",
    "Learn how women entrepreneurs can prepare to sell products on Sakhi Bazaar, the Pink Shakti marketplace for women-led brands.",
  );

  return (
    <main>
      <PageHero
        eyebrow="For women makers and entrepreneurs"
        title={
          <>
            Your products. <span className="italic text-gold">More room to grow.</span>
          </>
        }
        subtitle="Sakhi Bazaar is being prepared as a marketplace for products made by Pink Shakti women."
      >
        <Link
          to="/membership"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-ivory"
        >
          Explore Pink Saathi <ArrowRight size={14} />
        </Link>
      </PageHero>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-x-16 px-6 md:grid-cols-[0.8fr_1.2fr]">
          <div className="mb-10 md:mb-0">
            <Store className="mb-5 size-8 text-gold" />
            <h2 className="font-display text-3xl text-maroon">
              A thoughtful way to meet new customers
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-maroon/65">
              Whether you make food, fashion, jewellery, art or useful services, a clear product
              story helps people understand what makes your work yours.
            </p>
          </div>
          <div className="divide-y divide-maroon/10">
            {sellerBenefits.map((benefit) => (
              <article key={benefit.title} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-display text-xl text-maroon">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-maroon/60">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl text-maroon">Get ready to sell</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              "Choose the products you want to offer.",
              "Prepare clear photos, pricing and product details.",
              "Join the Pink Shakti community and follow launch updates.",
              "Review seller terms and complete verification when applications open.",
            ].map((item, index) => (
              <li key={item} className="flex gap-4 border-t border-gold/30 pt-4">
                <span className="font-display text-2xl text-gold">0{index + 1}</span>
                <p className="pt-1 text-sm leading-relaxed text-maroon/70">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs leading-relaxed text-maroon/45">
            Seller eligibility, product limits, commission, payment timing and launch dates will be
            confirmed before onboarding. No listing or sales guarantee is implied.
          </p>
        </div>
      </section>
    </main>
  );
}

const showcaseOptions = [
  {
    title: "Stage pitch",
    who: "Plan eligibility and selection apply",
    detail:
      "Introduce your product or service to an event audience in a short, prepared presentation.",
  },
  {
    title: "Stall or demo table",
    who: "Availability varies by event",
    detail: "Display, demonstrate and discuss your products or services with visitors.",
  },
  {
    title: "Panel and media",
    who: "By invitation or selection",
    detail: "Share your experience as part of a conversation, interview or community feature.",
  },
];

export function ShowcasePage() {
  usePageMeta(
    "Showcase Your Business | Pink Shakti",
    "Explore opportunities to present your business at Pink Shakti events through stage pitches, stalls and product demonstrations.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Speak · demonstrate · connect"
        title={
          <>
            Put your work <span className="italic text-gold">in the room</span>
          </>
        }
        subtitle="Pink Shakti events create opportunities for women to share what they make, know and do."
      />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-6xl divide-y divide-maroon/10 px-6">
          {showcaseOptions.map((option, index) => (
            <article
              key={option.title}
              className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr_1fr] sm:gap-8"
            >
              <span className="font-display text-2xl text-gold">0{index + 1}</span>
              <div>
                <h2 className="font-display text-2xl text-maroon">{option.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-wide text-maroon/45">{option.who}</p>
              </div>
              <p className="text-sm leading-relaxed text-maroon/65">{option.detail}</p>
            </article>
          ))}
          <p className="pt-6 text-xs leading-relaxed text-maroon/45">
            Stage slots, stall availability, fees and member offers are event-specific. Check the
            event listing or contact the team before making plans.
          </p>
          <div className="flex flex-wrap gap-3 pt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-full bg-maroon px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ivory hover:bg-gold hover:text-maroon"
            >
              Browse events <ArrowRight size={14} />
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 rounded-full border border-maroon/20 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-maroon hover:border-gold hover:text-gold"
            >
              View membership
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const circles = [
  [
    "Wealth & Entrepreneurship",
    "Start, run or grow a business, professional practice or home enterprise.",
  ],
  [
    "Health & Wellness",
    "Work across wellbeing, movement, nutrition, care and healthy communities.",
  ],
  [
    "Leadership & Power",
    "Build confidence, lead teams and take part in public or professional life.",
  ],
  ["Education & Future", "Teach, study, develop skills or explore technology and future careers."],
  [
    "Rights, Safety & Justice",
    "Learn about rights, safety, legal awareness and equal participation.",
  ],
  [
    "Society, Culture & Environment",
    "Create, volunteer, preserve culture or work for sustainable communities.",
  ],
  [
    "Media & Global Connect",
    "Tell stories, make media and build connections beyond your local network.",
  ],
  [
    "Inspiration & Recognition",
    "Share experience, mentor others and celebrate women's achievements.",
  ],
];

export function CirclesPage() {
  usePageMeta(
    "Pink Shakti Community Circles | Find Your Circle",
    "Explore Pink Shakti circles for entrepreneurship, wellness, leadership, education, rights, culture, media and recognition.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Learn in good company"
        title={
          <>
            Find your circle. <span className="italic text-gold">Grow together.</span>
          </>
        }
        subtitle="Each circle brings together women with shared interests, questions and ambitions."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-maroon/65">
            Circles are organized around Pink Shakti's eight pillars. Activities and meeting
            schedules vary; check current membership updates for what is available in your city.
          </p>
          <div className="grid gap-x-12 sm:grid-cols-2">
            {circles.map(([title, description], index) => (
              <article
                key={title}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-gold/25 py-6"
              >
                <span className="font-display text-xl text-gold">0{index + 1}</span>
                <div>
                  <h2 className="font-display text-xl text-maroon">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-maroon/60">{description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link
            to="/membership"
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-maroon hover:text-gold"
          >
            Join Pink Saathi <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}

const faqItems = [
  {
    question: "What is Pink Shakti?",
    answer:
      "Pink Shakti is a women-focused community connecting learning, events and opportunities across eight pillars, from health and entrepreneurship to education, rights and recognition.",
  },
  {
    question: "Who can join?",
    answer:
      "Women from different backgrounds, professions and stages of life can explore the community and its programmes.",
  },
  {
    question: "Is there a free membership?",
    answer:
      "Aarambh is the free Pink Saathi plan. Check the membership page for current plan details and availability.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Plan changes depend on the current membership terms. Review the terms shown at signup or contact Pink Shakti before changing plans.",
  },
  {
    question: "How can Pink Shakti help me meet clients?",
    answer:
      "Events, networking opportunities and business showcases can help members meet peers and potential customers. Specific introductions or outcomes are not guaranteed.",
  },
  {
    question: "Can I sell products through Pink Shakti?",
    answer:
      "Sakhi Bazaar is being prepared as a marketplace for women-led products. Seller applications, eligibility and terms will be shared before launch.",
  },
  {
    question: "Where are Pink Shakti events held?",
    answer:
      "Events are announced on the Events page with their location and details. Check each listing for the latest information.",
  },
  {
    question: "What is the refund policy for event tickets?",
    answer:
      "Please review the Terms page and the specific event's ticket conditions before registering.",
  },
  {
    question: "How can I contact Pink Shakti?",
    answer: "Email pinkshakti360@gmail.com or use the contact details on the Contact page.",
  },
];

export function FAQPage() {
  usePageMeta(
    "Pink Shakti FAQ | Membership, Events & Sakhi Bazaar",
    "Answers about joining Pink Shakti, membership, events, showcasing your work and Sakhi Bazaar.",
  );
  useStructuredData("faq-page", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });

  return (
    <main>
      <PageHero
        eyebrow="Answers before you begin"
        title={
          <>
            Frequently asked <span className="italic text-gold">questions</span>
          </>
        }
        subtitle="A quick guide to joining, events and the opportunities Pink Shakti is developing."
      />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-4xl divide-y divide-maroon/10 px-6">
          {faqItems.map((item) => (
            <article key={item.question} className="py-6 first:pt-0 last:pb-0">
              <h2 className="flex items-start gap-3 font-display text-xl text-maroon">
                <CircleHelp className="mt-1 size-5 shrink-0 text-gold" /> {item.question}
              </h2>
              <p className="mt-3 pl-8 text-sm leading-relaxed text-maroon/65">{item.answer}</p>
            </article>
          ))}
          <p className="pt-8 text-xs text-maroon/45">
            Membership, seller and event terms can change. Refer to the relevant page or agreement
            for current details.
          </p>
        </div>
      </section>
    </main>
  );
}

const partnerOpportunities = [
  {
    title: "Support an event",
    text: "Sponsor a summit, city meet-up or workshop and help create a place for women to learn and connect.",
  },
  {
    title: "Back a woman's showcase",
    text: "Help a woman entrepreneur take part in an event stall or product demonstration.",
  },
  {
    title: "Collaborate with women-led brands",
    text: "Explore brand collaborations and future marketplace opportunities with Sakhi Bazaar sellers.",
  },
  {
    title: "Build a CSR programme",
    text: "Discuss a focused programme in areas such as health, safety, skills or entrepreneurship.",
  },
];

export function PartnerPage() {
  usePageMeta(
    "Partner with Pink Shakti | Sponsor Women's Events",
    "Explore event sponsorships, support for women entrepreneurs and CSR partnerships with Pink Shakti.",
  );

  return (
    <main>
      <PageHero
        eyebrow="For brands, institutions and supporters"
        title={
          <>
            Partner with <span className="italic text-gold">Pink Shakti</span>
          </>
        }
        subtitle="Work with us to create useful opportunities for women across community, events and enterprise."
      >
        <a
          href="mailto:pinkshakti360@gmail.com?subject=Pink%20Shakti%20partnership%20enquiry"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-ivory"
        >
          Talk to us <ArrowRight size={14} />
        </a>
      </PageHero>
      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-x-12 sm:grid-cols-2">
            {partnerOpportunities.map((item, index) => (
              <article key={item.title} className="border-t border-gold/30 py-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  0{index + 1}
                </span>
                <h2 className="mt-2 font-display text-2xl text-maroon">{item.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-maroon/65">{item.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-maroon/45">
            Sponsorship inventory, audience estimates and programme outcomes are confirmed for each
            proposal; no reach or impact figures are promised on this page.
          </p>
        </div>
      </section>
    </main>
  );
}

const resources = [
  {
    id: "home-business-ideas",
    title: "10 home business ideas for women in India",
    keyword: "home business ideas for women",
    summary:
      "Start by matching a skill to a customer need: home baking, tailoring, tutoring, crafts, beauty services, consulting and digital services are all possible starting points. Test demand with a small offer before investing heavily.",
    action: "Choose one idea, describe the customer and make a simple first offer.",
  },
  {
    id: "price-handmade-products",
    title: "How to price your handmade products",
    keyword: "how to price handmade products",
    summary:
      "Include materials, packaging, your working time, fees and a share of operating costs. Compare similar products to understand the market, but do not price below your costs just to match another seller.",
    action: "Track costs for one product and calculate a price that covers them.",
  },
  {
    id: "first-ten-clients",
    title: "How to get your first 10 clients as a woman entrepreneur",
    keyword: "women entrepreneurs get clients",
    summary:
      "Begin with a clear service, a specific audience and a short explanation of the problem you solve. Ask your network for introductions, show examples of your work and follow up respectfully.",
    action: "Write a one-sentence offer and list five people who may know your audience.",
  },
  {
    id: "women-events-ahmedabad",
    title: "Women entrepreneur events in Ahmedabad",
    keyword: "women entrepreneur events Ahmedabad",
    summary:
      "Use event listings and organizer pages to check the audience, format, venue and participation terms. Before booking a stall or ticket, confirm what is included and whether the event suits your goals.",
    action: "Review the Pink Shakti Events page for current listings and event details.",
  },
  {
    id: "sell-instagram",
    title: "How to sell your products on Instagram",
    keyword: "sell products on Instagram India",
    summary:
      "Make it easy to understand what you sell, who it is for, how to order and how delivery works. Use clear product photos, consistent descriptions and direct answers to common buyer questions.",
    action: "Update your profile bio and create one post that explains ordering clearly.",
  },
  {
    id: "government-schemes",
    title: "Government schemes for women entrepreneurs",
    keyword: "schemes for women entrepreneurs India",
    summary:
      "Schemes, eligibility and application windows can change. Start with official government directories, confirm the current guidelines and speak with the relevant agency or bank before relying on a benefit.",
    action: "Check current listings on myScheme and the Ministry of MSME before applying.",
    links: [
      { label: "myScheme", href: "https://www.myscheme.gov.in/" },
      { label: "Ministry of MSME", href: "https://msme.gov.in/" },
    ],
  },
];

export function ResourcesPage() {
  usePageMeta(
    "Resources for Women Entrepreneurs | Pink Shakti",
    "Practical guides for women entrepreneurs on starting a home business, pricing products, finding clients, events and selling online.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Ideas you can put to work"
        title={
          <>
            Resources for women <span className="italic text-gold">building what's next</span>
          </>
        }
        subtitle="Short, practical starting points for women growing skills, services and businesses."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-center gap-3 border-b border-gold/20 pb-5 text-maroon/60">
            <Lightbulb className="size-5 text-gold" />
            <p className="text-sm">Browse the first set of practical guides.</p>
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            {resources.map((resource, index) => (
              <article
                id={resource.id}
                key={resource.id}
                className="border-t border-maroon/10 py-7 scroll-mt-28"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Guide 0{index + 1} · {resource.keyword}
                </p>
                <h2 className="mt-2 font-display text-2xl text-maroon">{resource.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-maroon/65">{resource.summary}</p>
                <p className="mt-4 flex gap-2 text-sm font-medium text-maroon">
                  <Check size={16} className="mt-0.5 shrink-0 text-gold" /> {resource.action}
                </p>
                {resource.links && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {resource.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-maroon/45">
            These guides are general information, not legal, tax or financial advice. Verify current
            rules with qualified professionals and official sources.
          </p>
        </div>
      </section>
    </main>
  );
}
