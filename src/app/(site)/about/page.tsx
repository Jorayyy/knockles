import type { Metadata } from "next";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { getPublishedItems, getSettings, parseKeyedLines, parseParagraphs } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Testimonial } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/about", "About");
}

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([
    getSettings(),
    getPublishedItems<Testimonial>("testimonials"),
  ]);
  const { about, business } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;
  const paragraphs = parseParagraphs(about.body);
  const values = parseKeyedLines(about.values);
  const featured = testimonials[0]?.data;

  return (
    <>
      <PageHero
        eyebrow="About the gym"
        title={about.headline}
        text={about.lead}
      />

      <section className="border-b border-line bg-ink">
        <div className="u-shell grid gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="grid gap-6">
            {paragraphs.map((paragraph, index) => (
              <Reveal
                key={index}
                delay={index * 60}
                className={
                  index === 0
                    ? "text-lg leading-relaxed text-chalk sm:text-xl"
                    : "text-base leading-relaxed text-muted"
                }
              >
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="grid content-start gap-5">
            <div className="border border-line bg-ink-800 p-6 sm:p-7">
              <Eyebrow>At a glance</Eyebrow>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-line-soft pb-3">
                  <dt className="text-muted">Discipline</dt>
                  <dd className="text-right text-chalk">Boxing & Muay Thai</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line-soft pb-3">
                  <dt className="text-muted">Coaching</dt>
                  <dd className="text-right text-chalk">Group & private sessions</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line-soft pb-3">
                  <dt className="text-muted">Level</dt>
                  <dd className="text-right text-chalk">Beginner to competitive</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Location</dt>
                  <dd className="text-right text-chalk">Mactan, Cebu</dd>
                </div>
              </dl>
            </div>

            {featured ? (
              <figure className="border border-flare/40 bg-ink-800 p-6 sm:p-7">
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: featured.rating }).map((_, index) => (
                    <Star key={index} size={13} className="fill-flare text-flare" />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-chalk/90">
                  “{featured.quote}”
                </blockquote>
                <figcaption className="u-label mt-4 text-muted-dim">
                  {featured.source || "Public review"}
                </figcaption>
              </figure>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell py-14 md:py-20">
          <SectionHeading
            eyebrow="How we train"
            title="What we value on the floor"
          />
          <div className="mt-9 grid gap-px border border-line bg-line md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 60} className="bg-ink-800 p-6 sm:p-7">
                <span className="u-label text-flare-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="u-display mt-5 text-2xl sm:text-3xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink">
        <div className="u-shell flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center md:py-20">
          <div className="max-w-2xl">
            <h2 className="u-display text-3xl sm:text-4xl">
              Come see the floor for yourself
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Photos only tell half the story — message us and train a session
              with the coaches.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book" variant="primary" size="lg" data-track="cta_about_trial">
              {settings.trial.label}
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={messenger} variant="outline" size="lg" data-track="cta_about_messenger">
              <MessageCircle size={16} aria-hidden="true" />
              Message us
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        heading={settings.home.ctaHeading}
        text={settings.home.ctaText}
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
