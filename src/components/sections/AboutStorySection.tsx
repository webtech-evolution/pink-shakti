import type { Faq } from "@/components/FaqBlock";

const founderNote = [
  "Every day I meet women with remarkable talent: a home baker whose cakes sell out in her society, a teacher who could train a hundred others, a young designer with ideas ahead of the market, a professional ready to lead. What most of them lack is not ability. It is a stage, a network and a system that takes their skill seriously.",
  "I started Pink Shakti to build that system. Not another one-time event, but a 360° ecosystem that walks with a woman through every part of her journey: her health, her confidence, her knowledge, her business, her rights and her recognition.",
  "At Pink Shakti, a woman can learn a new skill on Monday, meet a mentor on Wednesday, present her product on stage at the weekend, and find her next client through our community. Soon she will also sell through Sakhi Bazaar, our own marketplace for women-led brands.",
];

const journey = [
  ["Learn", "Skills & knowledge"],
  ["Connect", "Community & network"],
  ["Grow", "Business & career"],
  ["Lead", "Voice & leadership"],
  ["Earn", "Clients & markets"],
  ["Inspire", "Recognition"],
];

export const aboutFaqs: Faq[] = [
  {
    q: "What is Pink Shakti?",
    a: "Pink Shakti is India's 360° women's ecosystem, based in Ahmedabad, Gujarat. It brings together health, leadership, wealth and entrepreneurship, education, rights and safety, culture, media and recognition so women can learn, connect, showcase their work and grow in one place.",
  },
  {
    q: "Who founded Pink Shakti?",
    a: "Pink Shakti was founded by Manish Patel as an initiative of the ZCAD Group, Ahmedabad.",
  },
  {
    q: "What is the mission of Pink Shakti?",
    a: "To give every woman a skill, a stage and a sisterhood: equal access to opportunity, knowledge, leadership and recognition, so that women are not just included but leading.",
  },
  {
    q: "Does Pink Shakti work only in Gujarat?",
    a: "Pink Shakti started in Ahmedabad and operates pan-India. It has reached women in 8 cities and has PINK SHAKTI Awards partnerships across 5 countries.",
  },
  {
    q: "How can companies and institutions partner with Pink Shakti?",
    a: "Through CSR programmes, event sponsorship, Adopt-a-Woman-Entrepreneur and brand collaborations. Visit the CSR or Partner pages, or contact the team.",
  },
];

export function AboutStorySection() {
  return (
    <>
      <section className="py-16 lg:py-24 bg-ivory" aria-labelledby="founder-note">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-12 lg:grid-cols-[1fr_2fr] items-start">
          <div>
            <span className="page-label mb-4">From the founder</span>
            <h2
              id="founder-note"
              className="font-display text-3xl lg:text-4xl text-maroon leading-tight mb-6"
            >
              "Women do not need permission.{" "}
              <span className="italic text-gold">They need an ecosystem.</span>"
            </h2>
            <p className="font-display text-lg text-maroon">Manish Patel</p>
            <p className="text-sm text-maroon/60">Founder, Pink Shakti · ZCAD Group</p>
          </div>
          <div className="space-y-5 text-maroon/70 leading-relaxed">
            {founderNote.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background" aria-labelledby="journey">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <span className="page-label mb-4">One journey, six stages</span>
          <h2
            id="journey"
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-maroon mb-6 leading-tight"
          >
            We walk with you from{" "}
            <span className="italic text-gold">first skill to recognition</span>
          </h2>
          <p className="text-maroon/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Most programmes end when the event ends. Pink Shakti stays with a woman through every
            stage of her growth.
          </p>
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {journey.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-ivory p-5">
                <span className="text-gold font-display text-2xl">{i + 1}</span>
                <h3 className="font-display text-xl text-maroon">{t}</h3>
                <p className="text-xs text-maroon/60 mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-maroon text-ivory" aria-labelledby="zcad">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
              Who is behind Pink Shakti
            </span>
            <h2 id="zcad" className="font-display text-3xl lg:text-4xl leading-tight mb-5">
              An initiative of <span className="italic text-gold">ZCAD Group</span>, Ahmedabad
            </h2>
            <p className="text-ivory/70 leading-relaxed">
              Pink Shakti was founded under the ZCAD Group and is based in Ahmedabad, Gujarat. From
              here we operate pan-India and are building one of the country's most powerful
              women-led ecosystems, one woman, one city and one stage at a time.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6">
            {[
              ["1,200+", "Founders & changemakers at our first summit"],
              ["50,000+", "Women reached through events & programmes"],
              ["8", "Cities reached"],
              ["5", "Countries in Awards partnerships"],
            ].map(([v, t]) => (
              <div key={t} className="rounded-2xl border border-ivory/15 p-5">
                <dd className="font-display text-4xl text-gold">{v}</dd>
                <dt className="text-xs text-ivory/60 mt-2">{t}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
