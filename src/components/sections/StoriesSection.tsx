import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { listTestimonials } from "@/lib/content-api";
import type { Testimonial } from "@/lib/types";
import storyFounder from "@/assets/story-founder.jpg";
import storyCeo from "@/assets/story-ceo.jpg";

const fallbackStories: Pick<Testimonial, "quote" | "name" | "role" | "image">[] = [
  {
    quote:
      "Pink Shakti provided the platform I needed to scale my startup from a home project to a national brand. The mentorship under the Power pillar redefined my leadership style.",
    name: "Jane Doe",
    role: "Tech Entrepreneur & Founder",
    image: storyFounder,
  },
  {
    quote:
      "From wellness retreats to financial masterclasses, Pink Shakti has been my anchor. I found my voice, my network, and my purpose through this incredible sisterhood.",
    name: "Mary Smith",
    role: "Corporate Director",
    image: storyCeo,
  },
];

export function StoriesSection() {
  const [stories, setStories] = useState(fallbackStories);

  useEffect(() => {
    listTestimonials()
      .then((docs) => {
        if (docs.length) setStories(docs);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4 block">
            Inspiring Journeys
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-maroon">
            Voices of the <span className="italic text-gold">Shakti</span> Collective
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name + index}
              className="bg-ivory rounded-3xl p-8 lg:p-10 relative"
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Quote className="size-8 text-gold/30 mb-4" />
              <p className="font-display text-xl lg:text-2xl text-maroon/80 leading-relaxed mb-8 italic">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-4">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.name}
                    className="size-14 rounded-full object-cover border-2 border-gold/20"
                    loading="lazy"
                  />
                )}
                <div>
                  <div className="font-semibold text-maroon text-sm">{story.name}</div>
                  {story.role && (
                    <div className="text-[10px] uppercase tracking-widest text-gold">
                      {story.role}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
