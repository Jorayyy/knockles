import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Program } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { MapEmbed } from "@/components/site/map-embed";
import { LeadForm } from "@/components/site/lead-form";
import { HoursCard } from "@/components/site/schedule";
import { FacebookIcon } from "@/components/icons/social";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";
import { formatPhone } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/contact", "Contact");
}

export default async function ContactPage() {
  const [settings, programItems] = await Promise.all([
    getSettings(),
    getPublishedItems<Program>("programs"),
  ]);
  const { business, trial } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the gym"
        text="Call, message on Facebook, or send the form — every message reaches the coaches during opening hours."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`tel:${business.phone}`} variant="primary" data-track="cta_contact_phone">
            <Phone size={15} aria-hidden="true" />
            {formatPhone(business.phoneDisplay || business.phone)}
          </ButtonLink>
          <ButtonLink href={messenger} variant="outline" data-track="cta_contact_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Message on Messenger
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell grid gap-6 py-14 md:py-20 lg:grid-cols-3">
          <Reveal className="grid gap-6 lg:col-span-2">
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
              <a
                href={`tel:${business.phone}`}
                data-track="cta_contact_card_phone"
                className="group flex items-center gap-4 bg-ink-800 p-6 transition-colors hover:bg-ink-700"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-flare/50 text-flare-soft">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="u-label block text-muted-dim">Call</span>
                  <span className="mt-1 block font-medium text-chalk">
                    {formatPhone(business.phoneDisplay || business.phone)}
                  </span>
                </span>
              </a>

              <a
                href={messenger}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_contact_card_messenger"
                className="group flex items-center gap-4 bg-ink-800 p-6 transition-colors hover:bg-ink-700"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-flare/50 text-flare-soft">
                  <MessageCircle size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="u-label block text-muted-dim">Messenger</span>
                  <span className="mt-1 block font-medium text-chalk">
                    Chat with the gym
                  </span>
                </span>
              </a>

              {business.facebook ? (
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="cta_contact_card_facebook"
                  className="group flex items-center gap-4 bg-ink-800 p-6 transition-colors hover:bg-ink-700"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-flare/50 text-flare-soft">
                    <FacebookIcon size={18} />
                  </span>
                  <span>
                    <span className="u-label block text-muted-dim">Facebook</span>
                    <span className="mt-1 block font-medium text-chalk">
                      Follow the page
                    </span>
                  </span>
                </a>
              ) : null}

              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_contact_card_directions"
                className="group flex items-center gap-4 bg-ink-800 p-6 transition-colors hover:bg-ink-700"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-flare/50 text-flare-soft">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="u-label block text-muted-dim">Directions</span>
                  <span className="mt-1 block font-medium text-chalk">
                    Open in Google Maps
                  </span>
                </span>
              </a>
            </div>

            <MapEmbed business={business} />
          </Reveal>

          <Reveal delay={80} className="grid content-start gap-5">
            <HoursCard
              hours={business.hours}
              note={business.directionsNote}
            />
            <div className="border border-line bg-ink-800 p-6">
              <p className="u-label text-muted-dim">Message us</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Facebook Messenger is usually the fastest way to reach the gym —
                replies come during opening hours.
              </p>
              <div className="mt-5">
                <ButtonLink href={messenger} variant="primary" size="sm" data-track="cta_contact_messenger_card">
                  <MessageCircle size={14} aria-hidden="true" />
                  Open Messenger
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Send a message"
              title="Prefer to write it down?"
              text="Fill in the form and the gym will get back to you on phone or Messenger. Include your experience level and the days you are free."
            />
            <div className="mt-6 flex items-center gap-4 border border-line bg-ink p-4">
              <FacebookIcon size={20} />
              <div>
                <p className="u-label text-muted-dim">Follow Knock&apos;ls</p>
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="social_facebook_contact"
                  className="text-sm text-chalk underline decoration-flare underline-offset-4"
                >
                  facebook.com/KnocklsBoxGym
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <LeadForm
              programs={programItems.map((item) => item.data.name)}
              trial={trial}
              businessPhone={business.phone}
              messenger={messenger}
              source="contact"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
