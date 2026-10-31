export interface CommunityPlan {
  id: string;
  name: string;
  meaning: string;
  price: number;
  duration: "lifetime" | "yearly";
  features: string[];
  available: boolean;
}

export const communityPlans: CommunityPlan[] = [
  {
    id: "aarambh",
    name: "Aarambh",
    meaning: "The Beginning",
    price: 0,
    duration: "lifetime",
    features: [
      "Pink Saathi community",
      "Invitations to open events, webinars and city meet-ups",
      "Awareness sessions on health, safety and rights",
      "Community newsletter and programme updates",
    ],
    available: true,
  },
  {
    id: "udaan",
    name: "Udaan",
    meaning: "The Flight",
    price: 1499,
    duration: "yearly",
    features: [
      "All Aarambh benefits",
      "Priority seats at summits and masterclasses",
      "Skill-building workshops across the eight pillars",
      "Digital Pink Saathi certificate & ID",
    ],
    available: false,
  },
  {
    id: "pragati",
    name: "Pragati",
    meaning: "The Progress",
    price: 2999,
    duration: "yearly",
    features: [
      "All Udaan benefits",
      "Mentorship circles with women leaders",
      "Business & career networking meets",
      "Consideration for panels and media features",
    ],
    available: false,
  },
  {
    id: "shikhar",
    name: "Shikhar",
    meaning: "The Summit",
    price: 4999,
    duration: "yearly",
    features: [
      "All Pragati benefits",
      "VIP access to the PINK SHAKTI Awards night",
      "One-to-one advisory with domain experts",
      "Featured member profile across our platforms",
    ],
    available: false,
  },
];

export function getCommunityPlan(id: string) {
  return communityPlans.find((plan) => plan.id === id) || communityPlans[0];
}
