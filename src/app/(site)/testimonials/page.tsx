import type { Metadata } from "next";
import { MessageCircle, Star } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Testimonial } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { TestimonialCard } from "@/components/site/content-cards";
import { CtaBand } from "@/components/site/cta-band";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/testimonials", "Testimonials");
}

export default async function TestimonialsPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<Testimonial>("testimonials"),
  ]);
  const testimonials = items.map((item) => item.data);
  const { business } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What members say"
        text={`Rated ${business.ratingValue || "5.0"} from ${business.ratingCount || "12"} public reviews — here is what people report after training at Knock'ls.`}
      />

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          <div className="mb-10 flex flex-wrap items-center gap-6 border border-line bg-ink-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="u-display text-5xl text-flare-soft">
                {business.ratingValue || "5.0"}
              </span>
              <div>
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} className="fill-flare text-flare" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {business.ratingCount || "12"} public reviews
                </p>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-line sm:block" aria-hidden="true" />
            <p className="max-w-md text-sm leading-relaxed text-muted">
              From nervous first-timers to visiting fighters — the reviews below
              are published publicly, not written by us.
            </p>
          </div>

          {testimonials.length ? (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {testimonials.map((testimonial, index) => (
                <div key={`${testimonial.date}-${index}`} className="break-inside-avoid">
                  <Reveal delay={(index % 3) * 60}>
                    <TestimonialCard testimonial={testimonial} />
                  </Reveal>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Reviews are being published"
              text="Public reviews will appear here as they are added."
              action={
                <ButtonLink href={messenger} variant="primary">
                  <MessageCircle size={15} aria-hidden="true" />
                  Ask us anything
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <CtaBand
        heading="Add your own experience"
        text="The best way to find out if Knock'ls is right for you is one session with the coaches."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
