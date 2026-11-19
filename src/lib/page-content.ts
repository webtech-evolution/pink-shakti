import type { Faq } from "@/components/FaqBlock";
import type { InfoSection } from "@/components/InfoGrid";
import summitImg from "@/assets/event-summit.jpg";
import cancerImg from "@/assets/event-cancer.jpg";
import storyCeo from "@/assets/story-ceo.jpg";
import storyFounder from "@/assets/story-founder.jpg";
import { u } from "@/lib/photos";

export type Photo = { src: string; alt: string; caption: string };
type PageContent = { sections: InfoSection[]; faqs: Faq[]; photos?: Photo[]; quote?: string };

const ph = (id: string, alt: string, caption: string): Photo => ({
  src: u(id, 900, 700),
  alt,
  caption,
});

// Free Unsplash photos (unsplash.com/license); replace with real Pink Shakti photos when available.
const P = {
  groupSaris: ph(
    "photo-1774437677758-663255699a06",
    "Group of Indian women in colourful saris standing together",
    "Together, we rise",
  ),
  fiveFriends: ph(
    "photo-1774438028452-dd7357ee9329",
    "Five Indian women in colourful saris smiling together",
    "Sisterhood is our superpower",
  ),
  courtyard: ph(
    "photo-1786596552158-fb0aa2d260ba",
    "Three Indian women talking together in a sunlit courtyard",
    "Every conversation can open a door",
  ),
  dancing: ph(
    "photo-1758797316117-8d133af25f8c",
    "Women in teal saris dancing joyfully outdoors",
    "Celebrate every small win",
  ),
  festival: ph(
    "photo-1774437897209-67abc350fb36",
    "Women in colourful saris dancing at a festival",
    "Culture, joy and belonging",
  ),
  micStage: ph(
    "photo-1560523159-4a9692d222ef",
    "Woman speaking confidently on stage with a microphone",
    "Your voice deserves a stage",
  ),
  onStage: ph(
    "photo-1560523159-94c9d18bcf27",
    "Woman standing on stage in front of an audience",
    "Step up. Speak up.",
  ),
  listening: ph(
    "photo-1555725305-e823b44548de",
    "Group of women listening attentively at a session",
    "Learning is better together",
  ),
  panel: ph(
    "photo-1768508950520-541f4a08758d",
    "Four women on a panel, one speaking into a microphone",
    "Women leading the conversation",
  ),
  audience: ph(
    "photo-1626287935075-3275d2d9025e",
    "Audience raising hands to ask questions at a conference",
    "Curiosity is where growth begins",
  ),
  mic: ph(
    "photo-1551731409-43eb3e517a1a",
    "Woman holding a microphone and smiling",
    "Own your story",
  ),
  notebooks: ph(
    "photo-1503428593586-e225b39bddfe",
    "Participants taking notes during a workshop",
    "One workshop can change your business",
  ),
  crafting: ph(
    "photo-1757085242641-d829ddde7191",
    "Three women painting and crafting together at a table",
    "Skills shared are skills multiplied",
  ),
  tailoring: ph(
    "photo-1753162659622-371949a713ec",
    "Women working together in a tailoring workshop",
    "Made by hand, made with pride",
  ),
  designers: ph(
    "photo-1753162656029-781d67c7f6e6",
    "Women designers reviewing sketches and fabrics",
    "Ideas become businesses",
  ),
  greenery: ph(
    "photo-1544928147-79a2dbc1f389",
    "Women crafting with flowers and greenery at a workshop",
    "Create, connect, grow",
  ),
  laptop: ph(
    "photo-1531421693921-03e5aa6ee863",
    "Woman working on a laptop at a table",
    "Learn at your own pace",
  ),
  macbook: ph(
    "photo-1573167101669-476636b96cea",
    "Woman entrepreneur working on her laptop",
    "Your business, your rules",
  ),
  office: ph(
    "photo-1716703742424-16bbc0d1fad3",
    "Two women working together in an office",
    "Find your next client",
  ),
  fabrics: ph(
    "photo-1646578486121-67aed93c4f4e",
    "Woman sitting in front of a display of colourful fabrics",
    "From her hands to your home",
  ),
  sweets: ph(
    "photo-1777833804579-f38ad188427e",
    "Woman selling colourful homemade sweets",
    "Homemade, with love",
  ),
  flowers: ph(
    "photo-1779231127202-19497c13f4f8",
    "Woman arranging colourful flowers at her market stall",
    "Every stall tells a story",
  ),
  market: ph(
    "photo-1774585975271-915c0e24e9da",
    "Woman in traditional Indian attire at a market",
    "Local makers, loyal buyers",
  ),
  necklaces: ph(
    "photo-1620619767323-b95a89183081",
    "Handmade colourful beaded necklaces on display",
    "Handmade jewellery",
  ),
  lanterns: ph(
    "photo-1764218057040-5427eb0f1f5a",
    "Handcrafted lanterns and baskets for sale",
    "Crafts with a story",
  ),
  earrings: ph(
    "photo-1671642883395-0ab89c3ac890",
    "Handmade earrings on a wooden table",
    "Small pieces, big dreams",
  ),
  beads: ph(
    "photo-1601121141461-9d6647bca1ed",
    "Gold and purple beaded necklace close-up",
    "Detail is everything",
  ),
  jewellery: ph(
    "photo-1756483560049-e7b2208f99a0",
    "Smiling Indian woman in traditional jewellery and attire",
    "Confidence looks good on you",
  ),
  pinkSari: ph(
    "photo-1617627143750-d86bc21e42bb",
    "Woman in a pink and orange sari with gold jewellery",
    "Rooted and rising",
  ),
  smile: ph(
    "photo-1533128361669-69c065857a13",
    "Young Indian woman smiling outdoors",
    "Your journey starts today",
  ),
  glasses: ph(
    "photo-1679138118375-47f78db3761d",
    "Young professional woman in glasses smiling",
    "Ambition has no age",
  ),
  chair: ph(
    "photo-1590649613897-1d5c44ca3409",
    "Woman sitting on a chair, relaxed and confident",
    "Take your seat at the table",
  ),
  writing: ph(
    "photo-1763475945531-7241e0015363",
    "Elderly woman in a sari writing at a desk",
    "It's never too late to begin",
  ),
  sketching: ph(
    "photo-1769275060315-905dd80915c9",
    "Young woman sketching outdoors",
    "Dream it. Draw it. Do it.",
  ),
  meditating: ph(
    "photo-1758797316894-c25b94e8426a",
    "Woman meditating on a yoga mat outdoors",
    "A strong woman starts with a healthy one",
  ),
  yoga: ph(
    "photo-1679688301686-b164852aed9b",
    "Woman practising yoga in a large room",
    "Wellness is power",
  ),
};

export const pageContent: Record<string, PageContent> = {
  sakhiBazaar: {
    photos: [P.fabrics, P.necklaces, P.flowers],
    quote:
      "Every product here carries a woman's dream. When you buy from her, you invest in her family's future.",
    sections: [
      {
        id: "sell-sakhi",
        eyebrow: "For women makers",
        title: "Sell on Sakhi Bazaar",
        img: storyFounder,
        imgAlt: "Woman entrepreneur preparing products to sell on Sakhi Bazaar",
        intro:
          "Your products deserve more than a WhatsApp status. List them on Sakhi Bazaar and we promote them at our events, on Instagram and Facebook, in WhatsApp communities and through corporate gifting.",
        items: [
          {
            title: "Join as a Pink Saathi",
            text: "Become a member on the Udaan plan or above to unlock seller access.",
          },
          {
            title: "Fill the seller form",
            text: "Share your business details and upload clear photos of your products.",
          },
          {
            title: "Get verified in 2–3 days",
            text: "Our team checks every product so shoppers can buy with confidence.",
          },
          {
            title: "Go live and share",
            text: "Your store goes live. Share your Sakhi Bazaar link everywhere.",
          },
        ],
        numbered: true,
        cta: { to: "/sell", label: "Join the seller waitlist" },
      },
      {
        id: "sakhi-categories",
        eyebrow: "Categories at launch",
        title: "Handmade, homemade and made with care",
        items: [
          {
            title: "Handicrafts & décor",
            text: "Hand-painted, embroidered and crafted pieces for every home.",
          },
          {
            title: "Fashion & ethnic wear",
            text: "Boutique collections, sarees, kurtis and designer wear by women.",
          },
          { title: "Jewellery", text: "Handmade, oxidised, beaded and fashion jewellery." },
          {
            title: "Home food & snacks",
            text: "Pickles, masalas, sweets, bakes and homemade snacks.",
          },
          {
            title: "Beauty & wellness",
            text: "Natural skincare, wellness products and self-care essentials.",
          },
          {
            title: "Art, gifts & services",
            text: "Artworks, gift hampers, and services like tuition, coaching and design.",
          },
        ],
      },
      {
        id: "sakhi-promote",
        eyebrow: "How we promote you",
        title: "We bring buyers to your products",
        img: summitImg,
        imgAlt: "Pink Shakti event with product stalls",
        items: [
          {
            title: "On-ground",
            text: "Stalls and product displays at Pink Shakti events and city meet-ups.",
          },
          {
            title: "Online",
            text: "Instagram, Facebook, WhatsApp communities and paid ads for Sakhi Bazaar.",
          },
          {
            title: "Community",
            text: "Member-to-member buying and corporate gifting through CSR partners.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is Sakhi Bazaar?",
        a: "Sakhi Bazaar is Pink Shakti's marketplace where every product is made by a Pink Shakti woman: handmade, homemade, designed and crafted with care, with honest prices and verified sellers.",
      },
      {
        q: "Who can sell on Sakhi Bazaar?",
        a: "Pink Saathi members on the Udaan plan or above can sell after a 2–3 day product verification by the Pink Shakti team.",
      },
      {
        q: "How are Sakhi Bazaar products promoted?",
        a: "At Pink Shakti events and meet-ups, on Instagram and Facebook, in WhatsApp communities, through paid ads and through corporate gifting with CSR partners.",
      },
      {
        q: "Who ships the products?",
        a: "Sellers handle product quality, stock, packaging and dispatch of their own orders, and must report damages within 48 hours.",
      },
      {
        q: "How can I shop on Sakhi Bazaar?",
        a: "Join Pink Shakti free to get Sakhi Bazaar launch updates and member offers first.",
      },
    ],
  },

  events: {
    photos: [P.listening, P.panel, P.audience],
    quote: "The room you walk into can change the life you walk out with.",
    sections: [
      {
        id: "event-types",
        eyebrow: "What we host",
        title: "Events where women get seen",
        intro:
          "Summits, city meet-ups, workshops and awareness drives. Come to learn, to connect, or to showcase your business on stage and at a stall.",
        items: [
          {
            title: "Women leadership summits",
            text: "Large gatherings of founders, professionals and changemakers with talks, panels and awards.",
          },
          {
            title: "City meet-ups",
            text: "Smaller, warm circles in your city to meet women, share your work and find clients.",
          },
          {
            title: "Skill workshops",
            text: "Hands-on sessions on business, digital marketing, finance, health and personal growth.",
          },
          {
            title: "Awareness drives",
            text: "Health check-ups, cancer awareness, safety and rights sessions for women and families.",
          },
        ],
      },
      {
        id: "event-proof",
        eyebrow: "Where we've been",
        title: "Moments from our journey",
        img: cancerImg,
        imgAlt: "Pink Shakti women's health awareness drive",
        items: [
          {
            title: "Women Leadership Summit",
            text: "Our first summit brought together 1,200+ founders and changemakers.",
          },
          {
            title: "PINK SHAKTI Awards",
            text: "Celebrating women achievers, with Awards partnerships across 5 countries.",
          },
          {
            title: "Health & awareness drives",
            text: "Programmes that have reached 50,000+ women across 8 cities.",
          },
        ],
      },
      {
        id: "event-join",
        eyebrow: "Ways to take part",
        title: "Attend, exhibit, pitch or speak",
        items: [
          {
            title: "Attend",
            text: "Learn, network and meet women who share your goals. Open events are free for Aarambh members.",
          },
          {
            title: "Book a stall",
            text: "Showcase and sell your products to visitors. Paid members get a stall discount.",
          },
          {
            title: "Pitch on stage",
            text: "Pragati and Shikhar members can apply for a short pitch slot in front of buyers and partners.",
          },
          {
            title: "Speak or sponsor",
            text: "Share your expertise as a speaker, or support an event as a sponsor or CSR partner.",
          },
        ],
        cta: { to: "/contact", label: "Register your interest" },
      },
    ],
    faqs: [
      {
        q: "Who can attend Pink Shakti events?",
        a: "Every woman is welcome. Open events, webinars and city meet-ups are free for Aarambh members.",
      },
      {
        q: "Can I sell my products at an event?",
        a: "Yes. You can book a stall at Pink Shakti events, and paid Pink Saathi members get a stall discount.",
      },
      {
        q: "How do I pitch my business on stage?",
        a: "Pragati and Shikhar members can apply for a stage pitch slot from their dashboard; the team schedules the slot.",
      },
      {
        q: "Where are Pink Shakti events held?",
        a: "Mainly across Gujarat, starting from Ahmedabad, with programmes that have reached 8 cities in India.",
      },
      {
        q: "How will I know about the next event?",
        a: "Join Pink Shakti free or register your interest on the Contact page and you'll get the first invite.",
      },
    ],
  },

  membership: {
    photos: [P.jewellery, P.office, P.onStage],
    quote: "You don't need permission to grow. You need a community that believes in you.",
    sections: [
      {
        id: "plan-fit",
        eyebrow: "Which plan is for you",
        title: "Start free, grow when you're ready",
        items: [
          {
            title: "Aarambh · Free",
            text: "For every woman who wants to explore, learn and meet the community.",
          },
          {
            title: "Udaan",
            text: "For women starting out, like home bakers, artists, tutors and beauticians, who want skills and first visibility.",
          },
          {
            title: "Pragati",
            text: "For women with a running business who want clients, stage time and a strong network.",
          },
          {
            title: "Shikhar",
            text: "For established founders and professionals who want maximum visibility and 1-to-1 expert advice.",
          },
        ],
      },
      {
        id: "member-benefits",
        eyebrow: "What membership gives you",
        title: "Skill, stage and sisterhood",
        items: [
          {
            title: "Learn",
            text: "Skill workshops across 8 pillars, webinars and masterclasses with experts.",
          },
          {
            title: "Get seen",
            text: "Stage pitch time, event stalls and features on Pink Shakti media.",
          },
          {
            title: "Find clients",
            text: "Business networking meets, mentorship circles and client introductions.",
          },
          {
            title: "Sell",
            text: "Your own product listings on Sakhi Bazaar, promoted online and on-ground.",
          },
          {
            title: "Be recognised",
            text: "Digital certificate, member ID and consideration for PINK SHAKTI Awards.",
          },
          {
            title: "Belong",
            text: "A sisterhood of women who celebrate your wins and lift you up.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is the Aarambh plan really free?",
        a: "Yes. Aarambh is free for life and needs no card details.",
      },
      {
        q: "What is a Pink Saathi?",
        a: "A Pink Saathi is a member of the Pink Shakti community. Every member starts with the free Aarambh plan and can upgrade to Udaan, Pragati or Shikhar.",
      },
      {
        q: "Can I upgrade my plan later?",
        a: "Yes, you can upgrade any time as your business grows.",
      },
      {
        q: "How do stall discounts work?",
        a: "Paid members get a coupon code in their dashboard to use when booking a stall at Pink Shakti events.",
      },
      {
        q: "How do I get stage time?",
        a: "Pragati and Shikhar members apply from their dashboard and the Pink Shakti team schedules the slot.",
      },
    ],
  },

  contact: {
    photos: [P.sketching, P.macbook, P.market],
    quote: "Every big journey begins with one message. Send yours.",
    sections: [
      {
        id: "contact-help",
        eyebrow: "How we can help",
        title: "Tell us what you're looking for",
        intro:
          "Want to join, book a stall, sponsor an event or partner with us? Write to us and the Pink Shakti team will get back to you.",
        items: [
          {
            title: "Join the community",
            text: "Questions about Pink Saathi plans, benefits or your membership.",
          },
          {
            title: "Sell on Sakhi Bazaar",
            text: "Seller onboarding, product categories and verification.",
          },
          {
            title: "Book a stall or pitch",
            text: "Showcase your business at our next summit or city meet-up.",
          },
          {
            title: "Sponsor or CSR",
            text: "Event sponsorship, CSR programmes and Adopt-a-Woman-Entrepreneur.",
          },
          {
            title: "Speak at an event",
            text: "Share your expertise with women across Gujarat and India.",
          },
          {
            title: "Media & press",
            text: "Interviews, features and press coverage of Pink Shakti.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I contact Pink Shakti?",
        a: "Email pinkshakti360@gmail.com, message us on Instagram, or fill the contact form on this page.",
      },
      {
        q: "Where is Pink Shakti based?",
        a: "Pink Shakti is based in Ahmedabad, Gujarat, and runs programmes across India.",
      },
      { q: "How soon will I get a reply?", a: "The team usually replies within 1–2 working days." },
      {
        q: "Can my company partner with Pink Shakti?",
        a: "Yes. Choose sponsorship or CSR in your message, or visit the CSR and Partner pages for options.",
      },
    ],
  },

  stories: {
    photos: [P.smile, P.glasses, P.writing],
    quote: "Her story could be the reason another woman finally begins.",
    sections: [
      {
        id: "share-story",
        eyebrow: "Your story matters",
        title: "Every rise inspires another woman",
        img: storyCeo,
        imgAlt: "Woman entrepreneur sharing her Pink Shakti story",
        intro:
          "Behind every Pink Shakti woman is a story of courage: a first sale, a first stage, a first client. We share these stories so other women can see what's possible.",
        items: [
          {
            title: "What you do",
            text: "Your skill, business or profession and where you started.",
          },
          {
            title: "What changed",
            text: "The workshop, event or connection that made a difference.",
          },
          {
            title: "One number",
            text: "A result you're proud of, like orders, clients or new skills.",
          },
          { title: "One line", text: "What Pink Shakti means to you, in your own words." },
        ],
        cta: { to: "/contact", label: "Share your story" },
      },
    ],
    faqs: [
      {
        q: "Who are the women in Pink Shakti stories?",
        a: "Members and participants of Pink Shakti events, workshops and circles who agreed to share their journeys.",
      },
      {
        q: "How can I share my story?",
        a: "Contact the Pink Shakti team with what you do, what changed, one result you're proud of and a short line about Pink Shakti. We only publish with your written consent.",
      },
      {
        q: "Can my story be featured on social media?",
        a: "Yes. Selected stories are featured on the website and on Pink Shakti's Instagram and Facebook, with your permission.",
      },
    ],
  },

  pillars: {
    photos: [P.meditating, P.notebooks, P.panel],
    quote:
      "A woman's growth is never one thing. It is health, courage, knowledge and recognition, together.",
    sections: [],
    faqs: [
      {
        q: "What are the eight pillars of Pink Shakti?",
        a: "Health & Wellness, Leadership & Power, Wealth & Entrepreneurship, Education & Future, Rights, Safety & Justice, Society, Culture & Environment, Media & Global Connect, and Inspiration & Recognition.",
      },
      {
        q: "Why does Pink Shakti work across eight pillars?",
        a: "A woman's growth depends on her health, confidence, knowledge, income, safety and recognition together. The eight pillars make sure no part of her journey is left out.",
      },
      {
        q: "How can I take part in a pillar?",
        a: "Join Pink Shakti free, then attend the workshops, circles and events linked to the pillars that matter to you.",
      },
    ],
  },

  awards: {
    photos: [P.pinkSari, P.mic, P.fiveFriends],
    quote: "Excellence deserves to be seen, celebrated and remembered.",
    sections: [
      {
        id: "awards-how",
        eyebrow: "How to nominate",
        title: "Nominate in four simple steps",
        numbered: true,
        items: [
          {
            title: "Choose a category",
            text: "Pick the honour that best matches her work and impact.",
          },
          {
            title: "Tell her story",
            text: "Share what she does, the challenges she overcame and the change she created.",
          },
          {
            title: "Add proof",
            text: "Include numbers, photos, links or press that show her impact.",
          },
          {
            title: "Submit",
            text: "Our awards team reviews every nomination and contacts shortlisted nominees.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What are the PINK SHAKTI Awards?",
        a: "The PINK SHAKTI Awards celebrate women who excel in leadership, wellness, wealth, rights, culture and social impact, with partnerships across 5 countries.",
      },
      {
        q: "Who can be nominated?",
        a: "Women achievers, entrepreneurs, professionals and changemakers whose work creates real impact. You can nominate yourself or someone else.",
      },
      {
        q: "Is there a fee to nominate?",
        a: "Please check the nomination form for current details for this awards season.",
      },
      {
        q: "How are winners selected?",
        a: "Nominations are reviewed by the Pink Shakti awards team based on impact, achievement and story.",
      },
    ],
  },

  csr: {
    photos: [P.yoga, P.greenery, P.festival],
    quote: "Investing in a woman is investing in a whole community.",
    sections: [
      {
        id: "csr-why",
        eyebrow: "Why partner with us",
        title: "Measurable impact for women, on the ground",
        items: [
          { title: "Reach", text: "Programmes that have reached 50,000+ women across 8 cities." },
          {
            title: "Ready programmes",
            text: "Health drives, skilling, safety and entrepreneurship programmes ready to fund.",
          },
          {
            title: "Adopt-a-Woman-Entrepreneur",
            text: "Fund a woman's training, stall and launch, and follow her progress.",
          },
          {
            title: "Clear reporting",
            text: "Photos, attendance and outcome reports for your CSR records.",
          },
        ],
        cta: { to: "/contact", label: "Discuss a CSR programme" },
      },
    ],
    faqs: [
      {
        q: "What CSR programmes does Pink Shakti run?",
        a: "Women's health and awareness drives, skill development, safety and rights sessions, and women entrepreneurship programmes including Adopt-a-Woman-Entrepreneur.",
      },
      {
        q: "Can a company sponsor a specific event?",
        a: "Yes. Companies can sponsor a summit, city meet-up or workshop and receive brand visibility and impact reporting.",
      },
      {
        q: "How do we start a CSR partnership?",
        a: "Contact the Pink Shakti team with your CSR focus area and budget, and we'll share a programme proposal.",
      },
    ],
  },

  partners: {
    photos: [P.audience, P.office, P.micStage],
    quote: "Brands that stand with women grow with women.",
    sections: [
      {
        id: "partner-why",
        eyebrow: "Why brands partner with us",
        title: "Reach women who are building something",
        items: [
          {
            title: "An engaged community",
            text: "Women entrepreneurs, professionals and changemakers who attend, buy and recommend.",
          },
          {
            title: "On-ground presence",
            text: "Visibility at summits, city meet-ups, workshops and the PINK SHAKTI Awards.",
          },
          {
            title: "Real social impact",
            text: "Programmes that have reached 50,000+ women across 8 cities, with clear reporting.",
          },
          {
            title: "Authentic storytelling",
            text: "Content and media features built around real women's journeys.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How can my brand partner with Pink Shakti?",
        a: "Through event sponsorship, media partnerships, CSR programmes, brand collaborations with women sellers and corporate gifting via Sakhi Bazaar.",
      },
      {
        q: "What do partners get?",
        a: "Visibility with a growing community of women entrepreneurs and professionals, on-ground presence at events and measurable social impact.",
      },
      {
        q: "Can educational institutions partner with Pink Shakti?",
        a: "Yes. Pink Shakti partners with colleges and universities on women's skilling, leadership and entrepreneurship programmes.",
      },
    ],
  },

  media: {
    photos: [P.micStage, P.dancing, P.panel],
    quote: "When women are seen, more women believe they can.",
    sections: [
      {
        id: "media-featured",
        eyebrow: "Get featured",
        title: "Your work deserves to be seen",
        intro:
          "Pink Shakti shares women's journeys through event coverage, reels, interviews and panels. Members on higher plans are considered for panel and media features.",
        items: [
          {
            title: "Event coverage",
            text: "Photos and videos of your stall, pitch or talk at Pink Shakti events.",
          },
          {
            title: "Reels & stories",
            text: "Short features on Pink Shakti's Instagram and Facebook.",
          },
          {
            title: "Panels & interviews",
            text: "Speak on panels and in interviews about your field and journey.",
          },
        ],
        cta: { to: "/contact", label: "Media enquiries" },
      },
    ],
    faqs: [
      {
        q: "Where can I see photos from Pink Shakti events?",
        a: "This Media page collects photos and press moments from summits, awards nights, health drives and community meet-ups.",
      },
      {
        q: "How can journalists contact Pink Shakti?",
        a: "Write to pinkshakti360@gmail.com with 'Media' in the subject line, or use the Contact page.",
      },
    ],
  },

  join: {
    photos: [P.fiveFriends, P.chair, P.greenery],
    quote: "The best time to join was yesterday. The next best time is now.",
    sections: [
      {
        id: "join-after",
        eyebrow: "After you join",
        title: "What happens next",
        numbered: true,
        items: [
          {
            title: "Welcome to the sisterhood",
            text: "You become a Pink Saathi on the free Aarambh plan.",
          },
          {
            title: "Get invited",
            text: "Receive invitations to open events, webinars and awareness sessions.",
          },
          {
            title: "Find your people",
            text: "Meet women in your city and in circles that match your goals.",
          },
          {
            title: "Upgrade when ready",
            text: "Unlock workshops, stage time, stall discounts and selling on Sakhi Bazaar.",
          },
        ],
      },
      {
        id: "join-who",
        eyebrow: "Who joins Pink Shakti",
        title: "Every woman with a dream is welcome",
        items: [
          { title: "Homemakers", text: "Turning a skill or hobby into income from home." },
          { title: "Entrepreneurs", text: "Growing a boutique, bakery, salon, studio or startup." },
          {
            title: "Professionals",
            text: "Doctors, lawyers, teachers, coaches and corporate women building their voice.",
          },
          {
            title: "Students",
            text: "Young women learning future skills and finding mentors early.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is it free to join Pink Shakti?",
        a: "Yes. Joining with the Aarambh plan is free for life.",
      },
      {
        q: "What happens after I join?",
        a: "You become a Pink Saathi, get community updates, invitations to open events and webinars, and can upgrade any time for workshops, stage time and selling.",
      },
      {
        q: "Do I need a business to join?",
        a: "No. Pink Shakti welcomes students, homemakers, professionals and entrepreneurs: every woman who wants to learn and grow.",
      },
    ],
  },

  shop: {
    photos: [P.earrings, P.sweets, P.lanterns],
    quote: "Buy with purpose. Every order supports a woman-led business.",
    sections: [],
    faqs: [
      {
        q: "Who makes the products in the Pink Shakti shop?",
        a: "Every product is listed by a woman-led business from the Pink Shakti community.",
      },
      {
        q: "How is my order delivered?",
        a: "Each seller packs and dispatches her own orders. You can track them from My Orders.",
      },
      {
        q: "How do I become a seller?",
        a: "Join as a Pink Saathi on Udaan or above and apply through the Sell on Sakhi Bazaar page.",
      },
    ],
  },

  howItWorks: {
    photos: [P.crafting, P.micStage, P.sweets],
    quote: "From your kitchen table to the big stage, one step at a time.",
    sections: [
      {
        id: "hiw-examples",
        eyebrow: "Real journeys",
        title: "What this looks like for women like you",
        intro:
          "Every woman starts from a different place. Here is how the same four steps work for different kinds of women in our community.",
        items: [
          {
            title: "The home baker",
            text: "Joins free, learns food photography and pricing in a workshop, books a stall at a city meet-up, and starts taking orders from women she met there.",
          },
          {
            title: "The tutor or coach",
            text: "Joins a circle, shares her expertise in a webinar, and gets referrals from members who need classes for their children.",
          },
          {
            title: "The boutique owner",
            text: "Pitches her collection on stage, meets buyers and partners, and lists her designs on Sakhi Bazaar.",
          },
          {
            title: "The professional",
            text: "Builds her personal brand through panels and media features, and finds clients and collaborators in business networking meets.",
          },
        ],
        cta: { to: "/join", label: "Start step 1: Join free" },
      },
    ],
    faqs: [
      {
        q: "How does Pink Shakti work?",
        a: "Join free, learn and connect through workshops and circles, get seen through stage pitches and stalls at events, then grow and sell through client introductions and Sakhi Bazaar.",
      },
      {
        q: "How long does it take to join?",
        a: "About two minutes. Sign in and choose the free Aarambh plan.",
      },
      {
        q: "Do I have to upgrade?",
        a: "No. Aarambh is free for life. Upgrade only when you want workshops, stage time, stall discounts or selling on Sakhi Bazaar.",
      },
    ],
  },

  sell: {
    photos: [P.sweets, P.earrings, P.tailoring],
    quote: "Your products deserve more than a WhatsApp status.",
    sections: [
      {
        id: "sell-checklist",
        eyebrow: "Seller checklist",
        title: "Be ready on day one",
        items: [
          {
            title: "Clear photos",
            text: "Bright, natural-light photos of each product from 2–3 angles.",
          },
          {
            title: "Honest prices",
            text: "Include material, effort and delivery so every sale is profitable.",
          },
          {
            title: "Simple descriptions",
            text: "Size, material, care instructions and delivery time in plain words.",
          },
          {
            title: "Reliable dispatch",
            text: "Good packaging and on-time shipping build repeat customers.",
          },
        ],
        cta: { to: "/membership", label: "Become a Pink Saathi" },
      },
    ],
    faqs: [
      {
        q: "Who can sell on Sakhi Bazaar?",
        a: "Pink Saathi members on Udaan or above, after a 2–3 day product verification.",
      },
      {
        q: "What can I sell?",
        a: "Handicrafts and décor, fashion and ethnic wear, jewellery, home food and snacks, beauty and wellness, art and gifts, and services like tuition, coaching and design.",
      },
      {
        q: "Who handles delivery?",
        a: "Sellers pack and dispatch their own orders and handle stock and product quality.",
      },
    ],
  },

  showcase: {
    photos: [P.mic, P.lanterns, P.beads],
    quote: "Talent hidden is talent wasted. Put your work in the room.",
    sections: [
      {
        id: "showcase-prepare",
        eyebrow: "Before your showcase",
        title: "How to make the most of your moment",
        numbered: true,
        items: [
          {
            title: "Know your one line",
            text: "Say what you make or do, and for whom, in one clear sentence.",
          },
          {
            title: "Bring your best products",
            text: "Carry your bestsellers, clear price tags and a few samples people can touch or taste.",
          },
          {
            title: "Make it easy to buy",
            text: "Keep a UPI QR code, a visiting card and your Instagram or WhatsApp number ready.",
          },
          {
            title: "Follow up",
            text: "Message every contact within two days. Most orders come after the event, not during it.",
          },
        ],
        cta: { to: "/contact", label: "Book a stall or pitch" },
      },
    ],
    faqs: [
      {
        q: "How can I showcase my business with Pink Shakti?",
        a: "Through event stalls, product demonstrations and stage pitches at Pink Shakti summits and city meet-ups.",
      },
      {
        q: "Who can pitch on stage?",
        a: "Pragati and Shikhar members can apply for stage pitch slots; other members can book stalls.",
      },
    ],
  },

  circles: {
    photos: [P.courtyard, P.yoga, P.designers],
    quote: "Find your circle and you will never grow alone again.",
    sections: [
      {
        id: "circle-inside",
        eyebrow: "Inside a circle",
        title: "Small groups, big support",
        intro:
          "A circle is a small group of women who share one goal. You meet, learn together, celebrate each other's wins and open doors for each other.",
        items: [
          {
            title: "Meet regularly",
            text: "Online and in-person meet-ups with women in your interest area.",
          },
          {
            title: "Learn from each other",
            text: "Share what's working, ask for advice and learn from experts invited to the circle.",
          },
          {
            title: "Refer and buy",
            text: "Members recommend each other's services and buy from each other first.",
          },
          {
            title: "Grow in confidence",
            text: "Practise speaking, pitching and leading in a safe, supportive space.",
          },
        ],
        cta: { to: "/join", label: "Join free and find your circle" },
      },
    ],
    faqs: [
      {
        q: "What are Pink Shakti circles?",
        a: "Small community groups around a shared interest, like entrepreneurship, wellness, leadership or education, where women learn and support each other.",
      },
      {
        q: "How do I join a circle?",
        a: "Join Pink Shakti free, then choose the circles that match your goals.",
      },
    ],
  },

  resources: {
    photos: [P.laptop, P.notebooks, P.market],
    quote: "Knowledge is the first investment every entrepreneur makes.",
    sections: [],
    faqs: [
      {
        q: "Are Pink Shakti resources free?",
        a: "Yes. The guides on this page are free for every woman entrepreneur.",
      },
      {
        q: "What topics do the resources cover?",
        a: "Starting a home business, pricing products, finding clients, showcasing at events and selling online.",
      },
    ],
  },

  about: {
    photos: [P.groupSaris, P.courtyard, P.panel],
    quote: "Women do not need permission. They need an ecosystem.",
    sections: [],
    faqs: [],
  },
  partner: {
    photos: [P.micStage, P.office, P.groupSaris],
    quote: "Together, we can build stages for a million women.",
    sections: [],
    faqs: [],
  },
};
