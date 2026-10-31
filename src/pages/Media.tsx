import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { listGallery } from "@/lib/content-api";
import type { GalleryItem } from "@/lib/types";
import { photos } from "@/lib/photos";

const FALLBACK: Pick<GalleryItem, "title" | "image" | "caption">[] = [
  {
    title: "Women Leadership Summit",
    image: photos.gallery[0],
    caption: "Ahmedabad, Gujarat",
  },
  {
    title: "Cancer Awareness Drive",
    image: photos.gallery[1],
    caption: "Community health outreach",
  },
  {
    title: "PINK SHAKTI Awards Night",
    image: photos.gallery[2],
    caption: "Honouring excellence",
  },
  {
    title: "Entrepreneurship Masterclass",
    image: photos.gallery[3],
    caption: "Wealth pillar workshop",
  },
  {
    title: "Glam & Media Showcase",
    image: photos.gallery[4],
    caption: "Runway for women-led brands",
  },
  {
    title: "Sisterhood Meetup",
    image: photos.gallery[5],
    caption: "Networking evening",
  },
];

export default function MediaPage() {
  usePageMeta(
    "Media Gallery | PINK SHAKTI 360°",
    "Photos and press moments from PINK SHAKTI 360° summits, awards nights, health drives and community meetups.",
  );

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    listGallery().then(setItems).catch(() => setItems([]));
  }, []);

  const gallery = items.length ? items : FALLBACK;

  return (
    <div className="min-h-screen bg-ivory">
      <PageHero
        eyebrow="Media & Press"
        title={
          <>
            Moments of <span className="italic text-gold">Shakti</span>
          </>
        }
        subtitle="A look inside our summits, awards nights, wellness drives and community gatherings across India."
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((item, i) => (
            <motion.button
              key={`${item.title}-${i}`}
              type="button"
              onClick={() => setActive(item.image)}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-white text-left"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg text-maroon group-hover:text-gold transition-colors">
                  {item.title}
                </h2>
                {item.caption && (
                  <p className="text-[11px] uppercase tracking-widest text-maroon/40 mt-1">
                    {item.caption}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-sm text-maroon/50 mt-14">
          For press enquiries, interviews or media kits, write to{" "}
          <a className="text-gold" href="mailto:media@pinkshakti.com">
            media@pinkshakti.com
          </a>
          .
        </p>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[60] bg-maroon/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-ivory/90 text-maroon flex items-center justify-center"
            aria-label="Close image"
            onClick={() => setActive(null)}
          >
            <X size={16} />
          </button>
          <img src={active} alt="" className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
