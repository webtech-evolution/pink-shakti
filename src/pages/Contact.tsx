import { Mail, Instagram, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { usePageMeta } from "@/lib/use-page-meta";
import { EnquiryForm, cityOptions } from "@/components/EnquiryForm";
import { PageExtras } from "@/components/PageExtras";

export default function ContactPage() {
  usePageMeta(
    "Contact Pink Shakti | Join, Sell, Sponsor or Partner",
    "Talk to the Pink Shakti team in Ahmedabad about membership, selling on Sakhi Bazaar, booking a stall, speaking at events, sponsorship, CSR or media.",
  );

  return (
    <main>
      <PageHero
        eyebrow="Questions or ideas? Talk to our team"
        title={
          <>
            Contact <span className="italic text-gold">Us</span>
          </>
        }
        subtitle="Contact us about joining Pink Shakti, attending an event or working together."
      />

      <section className="py-12 sm:py-16 lg:py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <Mail className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Email</h2>
              <a
                href="mailto:pinkshakti360@gmail.com"
                className="text-sm text-maroon/60 hover:text-gold transition-colors"
              >
                pinkshakti360@gmail.com
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <Instagram className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Instagram</h2>
              <a
                href="https://instagram.com/pinkshaktiofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-maroon/60 hover:text-gold transition-colors"
              >
                @pinkshaktiofficial
              </a>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/10">
              <MapPin className="size-6 text-gold mb-4" />
              <h2 className="font-display text-xl text-maroon mb-2">Based In</h2>
              <p className="text-sm text-maroon/60">
                Ahmedabad, Gujarat — connecting women across India.
              </p>
            </div>
          </div>

          <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-gold/10">
            <EnquiryForm
              subject="Pink Shakti website enquiry"
              button="Send message"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "mobile", label: "Mobile (WhatsApp)", type: "tel", required: true },
                { name: "email", label: "Email", type: "email" },
                { name: "city", label: "City", options: cityOptions },
                {
                  name: "want",
                  label: "I want to",
                  options: [
                    "Join",
                    "Sell on Sakhi Bazaar",
                    "Book a stall",
                    "Sponsor or CSR",
                    "Speak at an event",
                    "Media",
                    "Other",
                  ],
                  required: true,
                },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
      <PageExtras page="contact" />
    </main>
  );
}
