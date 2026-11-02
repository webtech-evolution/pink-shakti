import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Crown,
  TrendingUp,
  GraduationCap,
  Scale,
  Globe2,
  Mic,
  Award,
  ArrowRight,
  Check,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import { photos } from "@/lib/photos";
import { PageExtras } from "@/components/PageExtras";

const pillars = [
  {
    id: "health",
    icon: Heart,
    title: "Health & Wellness",
    tagline: "Stronger Body. Stronger You",
    subtitle: "Pillar 01",
    description:
      "For women at every stage of life, this pillar brings attention to reproductive and menstrual health, mental wellbeing, nutrition, fitness and preventive care.",
    initiatives: [
      "Women's Health",
      "Fertility & Reproductive Health",
      "Menstrual Health",
      "PCOS & Hormonal Health",
      "Pregnancy & Motherhood",
      "Menopause",
      "Mental Health",
      "Nutrition",
      "Fitness & Yoga",
      "Preventive Healthcare",
      "Cancer Awareness",
      "Family Wellbeing",
    ],
    image: photos.pillarHealth,
    accent: "from-blush/30 via-blush/10 to-transparent",
  },
  {
    id: "power",
    icon: Crown,
    title: "Leadership & Power",
    tagline: "Confident. Fearless. Unstoppable",
    subtitle: "Pillar 02",
    description:
      "For women ready to lead in their communities, public life or careers, this pillar focuses on confidence, public speaking, governance, personal branding and mentorship.",
    initiatives: [
      "Women Leadership",
      "Public Leadership",
      "Political Leadership",
      "Corporate Leadership",
      "Decision Making",
      "Public Speaking",
      "Personal Branding",
      "Confidence Building",
      "Governance",
      "Mentorship",
    ],
    image: photos.pillarLeadership,
    accent: "from-gold/30 via-gold/10 to-transparent",
  },
  {
    id: "wealth",
    icon: TrendingUp,
    title: "Wealth & Entrepreneurship",
    tagline: "Limitless Possibilities",
    subtitle: "Pillar 03",
    description:
      "For home-based sellers, founders, MSME owners, professionals and aspiring investors, this pillar focuses on business skills, financial literacy, networking and growth.",
    initiatives: [
      "Entrepreneurship",
      "Startups",
      "MSME",
      "Financial Literacy",
      "Investment",
      "Banking",
      "Insurance",
      "Business Networking",
      "Funding",
      "Women in Business",
      "Career Growth",
    ],
    image: photos.pillarWealth,
    accent: "from-maroon/20 via-maroon/5 to-transparent",
  },
  {
    id: "future",
    icon: GraduationCap,
    title: "Education & Future",
    tagline: "Learn. Innovate. Lead",
    subtitle: "Pillar 04",
    description:
      "For students, educators and women building their next career step, this pillar explores education, practical skills, digital literacy, STEM, AI and future-ready work.",
    initiatives: [
      "School Education",
      "Higher Education",
      "Skill Development",
      "Career Guidance",
      "AI & Technology",
      "STEM",
      "Research & Innovation",
      "Digital Literacy",
      "Scholarships",
      "Future Careers",
    ],
    image: photos.pillarEducation,
    accent: "from-blush-soft/40 via-ivory to-transparent",
  },
  {
    id: "justice",
    icon: Scale,
    title: "Rights, Safety & Justice",
    tagline: "Safe. Aware. Equal",
    subtitle: "Pillar 05",
    description:
      "For women seeking to understand and exercise their rights, this pillar focuses on legal awareness, cyber and personal safety, workplace protection and equality.",
    initiatives: [
      "Women's Rights",
      "Legal Awareness",
      "Family Law",
      "Property Rights",
      "Cyber Law",
      "Cyber Safety",
      "Personal Safety",
      "Self Defence",
      "POSH Awareness",
      "Gender Equality",
      "Human Rights",
    ],
    image: photos.pillarJustice,
    accent: "from-maroon/25 via-blush/10 to-transparent",
  },
  {
    id: "society",
    icon: Globe2,
    title: "Society, Culture & Environment",
    tagline: "Rooted. Responsible. Rising",
    subtitle: "Pillar 06",
    description:
      "For artists, writers, volunteers and changemakers, this pillar brings together culture, community development, sustainability and environmental action.",
    initiatives: [
      "Social Impact",
      "Community Development",
      "Volunteering",
      "Rural Development",
      "Culture & Heritage",
      "Literature",
      "Arts",
      "Environment",
      "Sustainability",
      "Climate Action",
      "Civic Engagement",
    ],
    image: photos.pillarSociety,
    accent: "from-blush-soft/30 via-ivory to-transparent",
  },
  {
    id: "media",
    icon: Mic,
    title: "Media & Global Connect",
    tagline: "Voice. Reach. Influence",
    subtitle: "Pillar 07",
    description:
      "For journalists, creators and women growing their professional reach, this pillar explores storytelling, podcasting, social media and global connections.",
    initiatives: [
      "Journalism",
      "Podcasting",
      "Content Creation",
      "Public Relations",
      "Social Media",
      "Influencer Development",
      "Personal Branding",
      "International Networking",
      "Global Opportunities",
      "Diplomacy & Cultural Exchange",
    ],
    image: photos.pillarMedia,
    accent: "from-gold/25 via-blush/10 to-transparent",
  },
  {
    id: "inspiration",
    icon: Award,
    title: "Inspiration & Recognition",
    tagline: "Celebrate. Honour. Inspire",
    subtitle: "Pillar 08",
    description:
      "For women whose work can inspire others, this pillar celebrates achievements and creates space for recognition, mentorship and shared stories.",
    initiatives: [
      "Women Achievers",
      "Awards & Honours",
      "Role Models",
      "Mentorship Programs",
      "Fellowships",
      "Scholarships",
      "Inspirational Stories",
      "Community Recognition",
      "Hall of Fame",
      "Lifetime Achievement Awards",
      "Youth Icons",
    ],
    image: photos.pillarInspiration,
    accent: "from-gold/30 via-blush/10 to-transparent",
  },
];

export default function PillarsPage() {
  usePageMeta(
    "Pink Shakti's Eight Pillars | Skills, Health & Opportunity",
    "Explore Pink Shakti's eight pillars, from women's health and entrepreneurship to education, rights, culture, media and recognition.",
  );

  return (
    <main className="bg-background">
      {/* HERO */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush-soft/30 via-ivory to-background" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.span
            className="page-label mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Eight Pillars
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-maroon leading-[1.05] mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            A 360° Ecosystem for <span className="italic text-gold">Every Woman</span>
          </motion.h1>
        </div>
      </section>

      {/* PILLAR JUMP NAV */}
      <section className="sticky top-16 z-20 bg-maroon/95 backdrop-blur-md border-2 border-gold/50 rounded-2xl px-3 py-3 sm:px-5 sm:py-4 w-11/12 sm:w-11/12 md:w-4/5 mx-auto overflow-hidden shadow-xl shadow-maroon/20">
        <div className="max-w-7xl mx-auto px-2 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 py-2 justify-center">
            {pillars.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-full border border-gold/40 text-[10px] uppercase tracking-[0.2em] text-ivory/90 hover:text-maroon hover:border-gold hover:bg-gold transition-all whitespace-nowrap"
              >
                <p.icon size={12} className="text-gold" strokeWidth={1.6} />
                {p.title.split(" ")[0].replace(",", "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PILLAR SECTIONS */}
      {pillars.map((pillar, i) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`scroll-mt-40 py-20 lg:py-28 ${i % 2 === 0 ? "bg-background" : "bg-ivory"}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              {/* IMAGE */}
              <motion.div
                className="lg:col-span-6 relative"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative">
                  <div
                    className={`absolute -inset-4 lg:-inset-6 rounded-[3rem] bg-gradient-to-br ${pillar.accent} blur-2xl pointer-events-none`}
                  />
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-gold/10 shadow-2xl">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-maroon/80 backdrop-blur-md border border-gold/40 px-4 py-3">
                      <div className="text-ivory min-w-0">
                        {/* <div className="text-[9px] uppercase tracking-[0.3em] text-gold mb-1">
                          {pillar.subtitle}
                        </div> */}
                        <div className="font-display text-xl sm:text-2xl leading-tight">
                          {pillar.title}
                        </div>
                      </div>
                      <div className="size-14 rounded-full bg-ivory/15 backdrop-blur-md border border-ivory/30 flex items-center justify-center flex-shrink-0">
                        <pillar.icon className="size-6 text-ivory" strokeWidth={1.4} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CONTENT */}
              <motion.div
                className="lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-3 block">
                  {pillar.subtitle}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-maroon mb-3 leading-tight">
                  {pillar.title}
                </h2>
                <p className="font-display italic text-xl text-gold mb-6">{pillar.tagline}</p>
                <p className="text-maroon/65 leading-relaxed mb-8">{pillar.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                  {pillar.initiatives.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 size-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-gold" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm text-maroon/75 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/membership"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-maroon hover:text-gold transition-colors group"
                >
                  Get Involved
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-maroon relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(197,160,89,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <motion.h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory mb-5 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Eight pillars. <span className="italic text-gold">One sisterhood</span>
          </motion.h2>
          <p className="text-ivory/60 mb-8 leading-relaxed">
            Whichever pillar speaks to you — there's a circle waiting. Step into the movement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-maroon text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory transition-all group"
            >
              Join the Movement
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 border border-ivory/20 text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-ivory hover:text-maroon transition-all"
            >
              See Upcoming Events
            </Link>
          </div>
        </div>
      </section>
      <PageExtras page="pillars" />
    </main>
  );
}
