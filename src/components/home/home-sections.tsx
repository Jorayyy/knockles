import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/badge";
import { MediaImage } from "@/components/ui/media-image";
import {
  ProgramCard,
  TestimonialCard,
} from "@/components/site/content-cards";
import { FaqList } from "@/components/site/faq-list";
import { summarizeHours } from "@/components/site/footer";
import { parseKeyedLines } from "@/lib/content/access";
import type {
  BusinessSettings,
  Faq,
  FirstVisitSettings,
  GalleryImage,
  HomeSettings,
  Program,
  Testimonial,
} from "@/lib/content/types";
import { formatPhone } from "@/lib/utils";

export function TrustStrip({ business }: { business: BusinessSettings }) {
  const ratingReady = Boolean(business.ratingValue && business.ratingCount);

  const items: {
    label: string;
    value: string;
    href?: string;
    track?: string;
  }[] = [
    {
      label: "Disciplines",
      value: "Boxing & Muay Thai",
    },
    {
      label: "Experience",
      value: "Beginners welcome",
      href: "/first-visit",
      track: "trust_first_visit",
    },
    {
      label: "Sessions",
      value: "Private & small group",
      href: "/programs",
      track: "trust_programs",
    },
    {
      label: "Find us",
      value: `${business.city}, ${business.country === "Philippines" ? "Cebu" : business.country}`,
      href: "https://www.google.com/maps/search/?api=1&query=" + business.latitude + "," + business.longitude,
      track: "trust_map",
    },
  ];

  if (ratingReady) {
    items.unshift({
      label: "Rated",
      value: `${business.ratingValue} · ${business.ratingCount} reviews`,
      href: "/testimonials",
      track: "trust_rating",
    });
  }

  return (
    <section aria-label="At a glance" className="border-b border-line bg-ink-800">
      <div className="u-shell flex flex-wrap gap-x-10 gap-y-5 py-6">
        {items.map((item) => {
          const body = (
            <>
              <span className="u-label block text-muted-dim">{item.label}</span>
              <span className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-chalk transition-colors group-hover:text-flare-soft sm:text-base">
                {item.label === "Rated" ? (
                  <Star
                    size={13}
                    className="fill-flare text-flare"
                    aria-hidden="true"
                  />
                ) : null}
                {item.value}
              </span>
            </>
          );

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              data-track={item.track}
              className="group block min-w-[9rem]"
            >
              {body}
            </Link>
          ) : (
            <div key={item.label} className="min-w-[9rem]">
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function BenefitsSection({ home }: { home: HomeSettings }) {
  const benefits = parseKeyedLines(home.benefits);

  return (
    <section className="border-b border-line bg-ink">
      <div className="u-shell py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={"Why Knock'ls"}
            title={home.benefitsHeading || "Coached on every round"}
            text="Four reasons people keep coming back — from their first session onward."
          />
        </Reveal>

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Reveal
              key={benefit.title}
              delay={index * 60}
              className="flex flex-col bg-ink p-6 sm:p-7"
            >
              <span className="u-label text-muted-dim" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="u-display mt-6 text-2xl sm:text-3xl">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {benefit.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramsSection({
  home,
  programs,
}: {
  home: HomeSettings;
  programs: Program[];
}) {
  return (
    <section className="border-b border-line bg-ink-800">
      <div className="u-shell py-16 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Programs"
            title={home.programsHeading}
            text={home.programsText}
          />
          <ButtonLink
            href="/programs"
            variant="outline"
            size="md"
            className="shrink-0 self-start md:self-auto"
            data-track="cta_view_programs"
          >
            All programs
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>

        {programs.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 3).map((program, index) => (
              <ProgramCard key={program.slug} program={program} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="Programs are being updated"
              text="Message the gym to ask what is running this week."
              action={
                <ButtonLink href="/contact" variant="primary">
                  Contact the gym
                </ButtonLink>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function BeginnersSection({
  firstVisit,
}: {
  firstVisit: FirstVisitSettings;
}) {
  const steps = parseKeyedLines(firstVisit.steps).slice(0, 6);

  return (
    <section className="border-b border-line bg-bone text-ink">
      <div className="u-shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="ink">Never boxed before?</Eyebrow>
            <h2 className="u-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
              {firstVisit.headline}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
              {firstVisit.intro}
            </p>

            <ul className="mt-7 grid gap-2.5">
              {[
                "No experience expected — beginners are the norm here.",
                "No sparring on your first session.",
                "Tell us what to bring before you come.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm text-ink/75 before:mt-2 before:h-1 before:w-4 before:shrink-0 before:bg-flare before:content-['']"
                >
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/book"
                variant="primary"
                size="lg"
                data-track="cta_beginner"
              >
                Start as a beginner
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="/first-visit"
                variant="ink"
                size="lg"
                data-track="cta_first_visit"
              >
                What to expect
              </ButtonLink>
            </div>
          </Reveal>

          <ol className="grid gap-px bg-ink/15 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                as="li"
                delay={index * 50}
                className="bg-bone p-6"
              >
                <span className="u-label text-flare" aria-hidden="true">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="u-display mt-3 text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function AtmosphereSection({
  home,
  images,
}: {
  home: HomeSettings;
  images: GalleryImage[];
}) {
  if (!images.length) return null;

  const strip = images.slice(0, 7);

  return (
    <section className="border-b border-line bg-ink">
      <div className="u-shell pt-16 md:pt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Inside the gym"
            title={home.environmentHeading}
            text={home.environmentText}
          />
          <ButtonLink
            href="/gallery"
            variant="outline"
            size="md"
            className="shrink-0 self-start md:self-auto"
            data-track="cta_view_gallery"
          >
            View gallery
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>

      <div className="u-shell mt-10">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6">
          {strip.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              className="group relative w-[78vw] shrink-0 snap-start overflow-hidden border border-line bg-ink-800 sm:w-[46vw] lg:w-[31vw]"
            >
              <div className="relative aspect-[4/3] w-full">
                <MediaImage
                  src={image.src}
                  alt={image.alt || image.title || "Training at Knock'ls"}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4">
                <span className="u-label text-chalk">
                  {image.title || image.category || "Knock'ls"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TestimonialsSection({
  home,
  testimonials,
}: {
  home: HomeSettings;
  testimonials: Testimonial[];
}) {
  return (
    <section className="border-b border-line bg-ink-800">
      <div className="u-shell py-16 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Social proof"
            title={home.proofHeading}
            text={home.proofText}
          />
          <ButtonLink
            href="/testimonials"
            variant="outline"
            size="md"
            className="shrink-0 self-start md:self-auto"
            data-track="cta_view_testimonials"
          >
            Read all reviews
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>

        {testimonials.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Reveal
                key={`${testimonial.date}-${index}`}
                delay={index * 60}
                className="h-full"
              >
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="Reviews coming soon"
              text="Testimonials will appear here once published."
            />
          </div>
        )}

        <p className="mt-8 text-sm text-muted-dim">
          Prefer to ask directly?{" "}
          <Link
            href="/contact"
            className="text-chalk underline decoration-flare underline-offset-4"
          >
            Contact the gym
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function LocationSection({ business }: { business: BusinessSettings }) {
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;

  return (
    <section className="border-b border-line bg-ink">
      <div className="u-shell grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Location"
            title="Find the gym in Mactan"
            text={
              business.directionsNote ||
              "Message us if you need help finding the door."
            }
          />

          <dl className="mt-9 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="u-label text-muted-dim">Address</dt>
              <dd className="mt-2 text-sm leading-relaxed text-chalk">
                <address className="not-italic">
                  {business.addressLine1}
                  <br />
                  {[business.addressLine2, business.city]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  {business.postal}
                  <br />
                  {business.country}
                </address>
              </dd>
            </div>
            <div>
              <dt className="u-label text-muted-dim">Opening hours</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {summarizeHours(business.hours)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={directionsHref}
              variant="primary"
              size="lg"
              data-track="cta_directions_home"
            >
              <MapPin size={16} aria-hidden="true" />
              Get directions
            </ButtonLink>
            <ButtonLink
              href={`tel:${business.phone}`}
              variant="outline"
              size="lg"
              data-track="cta_phone_home"
            >
              <Phone size={16} aria-hidden="true" />
              {formatPhone(business.phoneDisplay || business.phone)}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="border border-line bg-ink-800">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <iframe
                title={`Map showing ${business.name}`}
                src={`https://www.google.com/maps?q=${business.latitude},${business.longitude}&z=16&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[1.05]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
              <p className="text-xs text-muted-dim">
                {business.directionsNote}
              </p>
              <a
                href={business.messenger}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_messenger_location"
                className="u-label inline-flex items-center gap-2 text-chalk transition-colors hover:text-flare-soft"
              >
                <MessageCircle size={14} aria-hidden="true" />
                Ask for directions
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FaqTeaser({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  const preview = faqs.slice(0, 5);

  return (
    <section className="border-b border-line bg-ink-800">
      <div className="u-shell grid gap-10 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Before you ask"
            title="Questions from first-timers"
            text="Experience, gear, prices, hours and location — answered straight."
          />
          <div className="mt-7">
            <ButtonLink href="/faq" variant="outline" size="md" data-track="cta_view_faq">
              Read all FAQs
              <ArrowRight size={15} aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <FaqList faqs={preview} />
        </Reveal>
      </div>
    </section>
  );
}
