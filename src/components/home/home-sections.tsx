import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/badge";
import { ProgramCard, TestimonialCard } from "@/components/site/content-cards";
import { parseKeyedLines } from "@/lib/content/access";
import type {
  FirstVisitSettings,
  HomeSettings,
  Program,
  Testimonial,
} from "@/lib/content/types";

export function Marquee({ items }: { items: string[] }) {
  const content = items.map((item) => (
    <span
      key={item}
      className="u-label flex shrink-0 items-center gap-6 px-6 text-ink/80"
    >
      {item}
      <span className="h-1.5 w-1.5 rotate-45 bg-ink/40" aria-hidden="true" />
    </span>
  ));

  return (
    <div className="overflow-hidden border-b border-line bg-flare py-3.5">
      <div className="u-marquee flex w-max" aria-hidden="true">
        <div className="flex">{content}</div>
        <div className="flex">{content}</div>
      </div>
      <span className="sr-only">Boxing, Muay Thai, private coaching in Mactan, Cebu</span>
    </div>
  );
}

export function BenefitsSection({ home }: { home: HomeSettings }) {
  const benefits = parseKeyedLines(home.benefits);

  return (
    <section className="border-b border-line bg-ink">
      <div className="u-shell py-16 md:py-24">
        <Reveal>
          <p className="u-label text-flare-soft">Why train here</p>
        </Reveal>
        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Reveal
              key={benefit.title}
              delay={index * 60}
              className="flex flex-col bg-ink p-6 sm:p-7"
            >
              <span className="u-label text-muted-dim">
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

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 3).map((program, index) => (
            <ProgramCard key={program.slug} program={program} index={index} />
          ))}
        </div>

        {!programs.length ? (
          <EmptyState
            title="Programs are being updated"
            text="Message the gym to ask what is running this week."
            action={
              <ButtonLink href="/contact" variant="primary">
                Contact the gym
              </ButtonLink>
            }
          />
        ) : null}
      </div>
    </section>
  );
}

export function FirstVisitPreview({
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
            <Eyebrow tone="ink">First visit</Eyebrow>
            <h2 className="u-display mt-5 text-4xl sm:text-5xl">
              {firstVisit.headline}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
              {firstVisit.intro}
            </p>
            <div className="mt-8">
              <ButtonLink href="/first-visit" variant="ink" size="md" data-track="cta_first_visit">
                What to expect
                <ArrowRight size={15} aria-hidden="true" />
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
                <span className="u-label text-flare">
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

export function TestimonialsSection({
  home,
  testimonials,
}: {
  home: HomeSettings;
  testimonials: Testimonial[];
}) {
  return (
    <section className="border-b border-line bg-ink">
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

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={`${testimonial.date}-${index}`} delay={index * 60} className="h-full">
              <TestimonialCard testimonial={testimonial} className="h-full" />
            </Reveal>
          ))}
        </div>

        {!testimonials.length ? (
          <EmptyState
            title="Reviews coming soon"
            text="Testimonials will appear here once published."
          />
        ) : null}

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
