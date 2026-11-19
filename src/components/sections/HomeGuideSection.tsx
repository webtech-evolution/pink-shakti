import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import summitImg from "@/assets/event-summit.jpg";
import { u } from "@/lib/photos";

const bazaarImg = u("photo-1646578486121-67aed93c4f4e", 900, 675);
import founderImg from "@/assets/story-founder.jpg";
import { FaqBlock } from "@/components/FaqBlock";

const audiences = [
  {
    title: "The home business owner",
    text: "You bake, stitch, cook or craft from home and your work sells out in your society. You are ready for buyers beyond your WhatsApp status.",
  },
  {
    title: "The first-time founder",
    text: "You have an idea or a young brand and need skills, mentors and the confidence to pitch it in front of a real audience.",
  },
  {
    title: "The professional & coach",
    text: "You are a tutor, beautician, lawyer, designer or consultant who wants more clients and a network that refers you.",
  },
  {
    title: "The woman restarting",
    text: "You stepped away for family or health and want to learn again, meet women like you and find your next step.",
  },
];

const steps = [
  {
    n: "01",
    title: "Join free",
    text: "Become a Pink Saathi with the Aarambh plan. It is free for life and takes two minutes.",
  },
  {
    n: "02",
    title: "Learn & connect",
    text: "Attend workshops, webinars and city meet-ups across 8 pillars and find women who share your goals.",
  },
  {
    n: "03",
    title: "Get seen",
    text: "Showcase your work at event stalls and pitch your business on stage in front of buyers and partners.",
  },
  {
    n: "04",
    title: "Grow & sell",
    text: "Meet clients through the community and sell your products on Sakhi Bazaar as it opens to members.",
  },
];

const offers = [
  {
    img: summitImg,
    title: "Events & summits",
    text: "Women leadership summits, city meet-ups and workshops where you learn, network and showcase your business.",
    to: "/events",
    cta: "See events",
  },
  {
    img: founderImg,
    title: "Pink Saathi membership",
    text: "Start free with Aarambh, then upgrade to Udaan, Pragati or Shikhar for workshops, stage time, stall discounts and client introductions.",
    to: "/membership",
    cta: "Compare plans",
  },
  {
    img: bazaarImg,
    title: "Sakhi Bazaar",
    text: "A marketplace where every product is made by a Pink Shakti woman, promoted at our events and across social media.",
    to: "/sakhi-bazaar",
    cta: "Explore Sakhi Bazaar",
  },
];

export const homeFaqs = [
  {
    q: "What is Pink Shakti?",
    a: "Pink Shakti is India's 360° women's ecosystem based in Ahmedabad, Gujarat. It helps women build skills, find community, showcase their work, meet clients and sell through events, mentorship and Sakhi Bazaar, across 8 pillars: health, leadership, wealth, education, rights, culture, media and recognition.",
  },
  {
    q: "Is Pink Shakti free to join?",
    a: "Yes. The Aarambh membership is free for life. You can explore the community, attend open events and join awareness sessions without paying anything.",
  },
  {
    q: "What do the paid plans add?",
    a: "Udaan, Pragati and Shikhar add skill workshops, priority seats at summits, stall discounts, stage pitch time, mentorship circles, client introductions and product listings on Sakhi Bazaar. See the Membership page for the full comparison.",
  },
  {
    q: "How can Pink Shakti help my business?",
    a: "You learn in workshops, showcase your products on stage and at event stalls, meet buyers through community circles and sell on Sakhi Bazaar, the marketplace for products made by Pink Shakti women.",
  },
  {
    q: "Where does Pink Shakti run events?",
    a: "Pink Shakti runs summits, meet-ups and workshops across Gujarat and other Indian cities, starting from Ahmedabad, and has reached women in 8 cities so far.",
  },
  {
    q: "Who started Pink Shakti?",
    a: "Pink Shakti was founded by Manish Patel as an initiative of the ZCAD Group, Ahmedabad.",
  },
];

const label = "page-label mb-4";
const h2 = "font-display text-4xl lg:text-5xl text-maroon mb-6 leading-tight";

export function HomeGuideSection() {
  return (
    <>
      <section className="py-20 bg-white" aria-labelledby="who-for">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className={label}>Who Pink Shakti is for</span>
          <h2 id="who-for" className={h2}>
            If you have a skill, <span className="italic text-gold">you belong here</span>
          </h2>
          <p className="text-maroon/60 max-w-2xl mb-12 leading-relaxed">
            Talent is everywhere. What most women lack is a stage, a network and someone who
            believes in them. Pink Shakti is that support system, whoever you are and wherever you
            are starting from.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <article key={a.title} className="rounded-2xl border border-maroon/10 bg-ivory p-6">
                <h3 className="font-display text-xl text-maroon mb-3">{a.title}</h3>
                <p className="text-sm text-maroon/60 leading-relaxed">{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory" aria-labelledby="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className={label}>How it works</span>
          <h2 id="how-it-works" className={h2}>
            From skill to business, <span className="italic text-gold">step by step</span>
          </h2>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <h3 className="font-display text-xl text-maroon mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-maroon/60 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 mt-10 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] group"
          >
            See the full journey{" "}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white" aria-labelledby="what-you-get">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className={label}>What you get</span>
          <h2 id="what-you-get" className={h2}>
            Learn, showcase and <span className="italic text-gold">sell</span> in one place
          </h2>
          <div className="grid gap-8 md:grid-cols-3 mt-10">
            {offers.map((o) => (
              <article
                key={o.title}
                className="rounded-3xl overflow-hidden border border-maroon/10 bg-ivory flex flex-col"
              >
                <img
                  src={o.img}
                  alt={`${o.title} at Pink Shakti`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-2xl text-maroon mb-3">{o.title}</h3>
                  <p className="text-sm text-maroon/60 leading-relaxed mb-6 flex-1">{o.text}</p>
                  <Link
                    to={o.to}
                    className="inline-flex items-center gap-2 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] group"
                  >
                    {o.cta}{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivory" aria-labelledby="in-numbers">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 id="in-numbers" className={h2}>
            Pink Shakti in numbers
          </h2>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              ["1,200+", "Founders & changemakers at our first summit"],
              ["50,000+", "Women reached through events & programmes"],
              ["8", "Cities reached"],
              ["5", "Countries in Awards partnerships"],
            ].map(([v, t]) => (
              <div key={t}>
                <dt className="sr-only">{t}</dt>
                <dd className="font-display text-5xl text-gold">{v}</dd>
                <dd className="text-sm text-maroon/60 mt-2">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FaqBlock id="home-faq" faqs={homeFaqs} />
    </>
  );
}
