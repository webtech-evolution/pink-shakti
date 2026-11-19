import crypto from "node:crypto";

export const CATEGORIES = [
  "Health & Wellness",
  "Leadership & Power",
  "Wealth & Entrepreneurship",
  "Education & Future",
  "Rights, Safety & Justice",
  "Society, Culture & Environment",
  "Media & Global Connect",
  "Inspiration & Recognition",
];

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&h=800&q=80`;

// Sample events so the admin has something to edit. Replace with real ones.
export function seedEvents() {
  const e = (slug, title, category, date, time, city, venue, image, description, ticket = "Free for members") => ({
    id: crypto.randomUUID(),
    slug,
    title,
    category,
    date,
    time,
    city,
    venue,
    image: img(image),
    description,
    ticket,
    status: "published",
    sample: true,
    createdAt: new Date().toISOString(),
  });
  return [
    e("women-leadership-summit-2026", "Women Leadership Summit 2026", "Leadership & Power", "2026-12-12", "10:00 AM – 6:00 PM", "Ahmedabad", "To be announced", "photo-1768508950520-541f4a08758d",
      "A full day of talks, panels and networking with women founders, professionals and changemakers from across Gujarat. Includes stage pitches by Pink Saathi members and the PINK SHAKTI recognition ceremony.", "₹499 · Free for Pragati & Shikhar"),
    e("sakhi-bazaar-festive-market", "Sakhi Bazaar Festive Market", "Wealth & Entrepreneurship", "2026-12-20", "11:00 AM – 8:00 PM", "Ahmedabad", "To be announced", "photo-1779231127202-19497c13f4f8",
      "A one-day market of products made by Pink Shakti women: fashion, jewellery, home food, décor and gifts. Book a stall to sell, or come to shop with purpose.", "Free entry · Stalls bookable"),
    e("digital-marketing-for-home-businesses", "Digital Marketing for Home Businesses", "Education & Future", "2027-01-10", "3:00 PM – 5:00 PM", "Online", "Zoom webinar", "photo-1531421693921-03e5aa6ee863",
      "Learn how to photograph your products, write Instagram captions that sell, and use WhatsApp Business to take orders. Practical, hands-on and beginner friendly."),
    e("womens-health-checkup-drive", "Women's Health Check-up & Awareness Drive", "Health & Wellness", "2027-01-24", "9:00 AM – 1:00 PM", "Surat", "To be announced", "photo-1758797316894-c25b94e8426a",
      "Free health check-ups, cancer awareness and a session with women doctors on nutrition, hormonal health and preventive care."),
    e("know-your-rights-workshop", "Know Your Rights: Safety & Legal Awareness", "Rights, Safety & Justice", "2027-02-07", "4:00 PM – 6:00 PM", "Vadodara", "To be announced", "photo-1555725305-e823b44548de",
      "Lawyers and safety experts explain workplace rights, property rights, cyber safety and the helplines every woman should know."),
    e("pink-shakti-awards-night-2027", "PINK SHAKTI Awards Night 2027", "Inspiration & Recognition", "2027-03-08", "6:00 PM – 10:00 PM", "Ahmedabad", "To be announced", "photo-1560523159-4a9692d222ef",
      "On International Women's Day, we honour women achievers across ten categories. An evening of stories, celebration and sisterhood.", "By invitation · VIP access for Shikhar"),
  ];
}

export function seedPlans() {
  const p = (key, name, meaning, price, features, order) => ({ key, name, meaning, price, durationMonths: price ? 12 : 0, features, order, active: true });
  return [
    p("aarambh", "Aarambh", "The beginning", 0, ["Community membership & newsletter", "Open events, webinars & city meet-ups", "Health, safety & rights sessions"], 1),
    p("udaan", "Udaan", "Take flight", 1499, ["Everything in Aarambh", "Skill workshops across 8 pillars", "Priority seats at summits & masterclasses", "Digital certificate & member ID", "Stall discount at events", "Sakhi Bazaar product listings"], 2),
    p("pragati", "Pragati", "Progress", 2999, ["Everything in Udaan", "Stage pitch at city meet-ups", "Mentorship circles", "Business & career networking meets", "Client introductions", "Panel & media feature consideration"], 3),
    p("shikhar", "Shikhar", "The summit", 4999, ["Everything in Pragati", "Stage pitch at summits", "Priority client introductions", "VIP Awards night access", "1-to-1 expert advisory", "Featured profile + dedicated reel"], 4),
  ];
}
