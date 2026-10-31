import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { listTestimonials } from "@/lib/content-api";
import type { Testimonial } from "@/lib/types";

export default function StoriesPage() {
  const [stories, setStories] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta(
    "Success Stories | Women of Pink Shakti",
    "Read stories from women in the Pink Shakti community about their work, learning and growth.",
  );

  useEffect(() => {
    listTestimonials(true)
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <PageHero
        eyebrow="Member voices"
        title={
          <>
            Women who rise <span className="italic text-gold">together</span>
          </>
        }
        subtitle="Stories belong to the women who lived them. We share member experiences here with their permission."
      />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <p className="py-16 text-center text-sm text-maroon/50">Loading stories...</p>
          ) : stories.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {stories.map((story) => (
                <article
                  key={story.$id}
                  className="border-t-2 border-gold/40 bg-white px-6 py-7 sm:px-8"
                >
                  <Quote className="mb-4 size-6 text-gold" />
                  <blockquote className="font-display text-xl leading-relaxed text-maroon/80">
                    “{story.quote}”
                  </blockquote>
                  <div className="mt-7 flex items-center gap-4">
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.name}
                        className="size-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-maroon">{story.name}</p>
                      {story.role && (
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-maroon/50">
                          {story.role}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl border-t border-gold/30 py-12 text-center">
              <h2 className="font-display text-2xl text-maroon">
                Member stories are being gathered
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-maroon/60">
                We will share first-hand experiences here as members choose to contribute and
                approve their stories for publication.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
