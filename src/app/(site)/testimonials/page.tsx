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
  const ratingReady = Boolean(business.ratingValue && business.ratingCount);
  const ratingScore = Number(business.ratingValue);
  const filledStars = Number.isFinite(ratingScore)
    ? Math.max(0, Math.min(5, Math.round(ratingScore)))
    : 5;

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What members say"
        text={
          ratingReady
            ? `Rated ${business.ratingValue} from ${business.ratingCount} public reviews — here is what people report after training at Knock'ls.`
            : "Here is what people report after training at Knock'ls — published publicly, not written by us."
        }
      />

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          <div className="mb-10 flex flex-wrap items-center gap-6 border border-line bg-ink-800 px-6 py-5">
            {ratingReady ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="u-display text-5xl text-flare-soft">
                    {business.ratingValue}
                  </span>
                  <div>
                    <div
                      className="flex gap-0.5"
                      role="img"
                      aria-label={`Rated ${business.ratingValue} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className={
                            index < filledStars
                              ? "fill-flare text-flare"
                              : "text-line"
                          }
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {business.ratingCount} public review
                      {business.ratingCount === "1" ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-line sm:block" aria-hidden="true" />
              </>
            ) : null}
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
        heading="Come see for yourself"
        text="The easiest way to judge the coaching is one session with the team."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
