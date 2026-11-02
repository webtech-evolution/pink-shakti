import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { PageExtras } from "@/components/PageExtras";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";

export default function StoriesPage() {
  usePageMeta(
    "Women Success Stories | Pink Shakti Community",
    "Real stories of women entrepreneurs and professionals who learned, showcased their work and grew with Pink Shakti. Read them, get inspired and share your own.",
  );
  return (
    <main>
      <PageHero
        eyebrow="Voices of Pink Shakti"
        title={
          <>
            Women who <span className="italic text-gold">rose</span> with Pink Shakti
          </>
        }
        subtitle="A first sale. A first stage. A first client. These are the moments our community is built on."
      />
      <PageExtras page="stories" />
      <section className="py-16 lg:py-20 bg-ivory" aria-labelledby="story-form">
        <div className="max-w-3xl mx-auto px-6">
          <span className="page-label mb-4">Share your story</span>
          <h2 id="story-form" className="font-display text-3xl lg:text-4xl text-maroon mb-4">
            Has Pink Shakti been part of your journey?
          </h2>
          <p className="text-maroon/60 leading-relaxed mb-8">
            Tell us in a few lines. We publish stories only with your written consent, and we'll
            call you before featuring you.
          </p>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
            <EnquiryForm
              subject="My Pink Shakti story"
              button="Send my story"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "city", label: "City", options: cityOptions },
                { name: "business", label: "What you do", required: true },
                {
                  name: "story",
                  label: "What changed for you, and one result you're proud of",
                  type: "textarea",
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
