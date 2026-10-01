import type { Metadata } from "next";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { getSettings, parseKeyedLines } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/first-visit", "Your first visit");
}

const BRING = [
  "Comfortable training clothes",
  "Clean indoor shoes",
  "A water bottle",
  "Your questions — ask everything",
];

export default async function FirstVisitPage() {
  const settings = await getSettings();
  const { firstVisit, business, trial } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;
  const steps = parseKeyedLines(firstVisit.steps);

  return (
    <>
      <PageHero
        eyebrow="First visit"
        title={firstVisit.headline}
        text={firstVisit.intro}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" variant="primary" data-track="cta_firstvisit_trial">
            {trial.label}
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={messenger} variant="outline" data-track="cta_firstvisit_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Ask a question first
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          <SectionHeading
            eyebrow="The walk-through"
            title="From first message to first round"
            text="Six steps, no surprises. Nothing is signed and nothing is owed before you have trained."
          />

          <ol className="mt-10 grid gap-px border border-line bg-line md:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                as="li"
                delay={(index % 2) * 60}
                className="flex gap-5 bg-ink p-6 sm:p-8"
              >
                <span className="u-display shrink-0 text-5xl text-flare/90 sm:text-6xl" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="u-display text-2xl sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          {firstVisit.closing ? (
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-chalk/90">
              {firstVisit.closing}
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="What to bring"
              title="Arrive ready, leave sweaty"
              text="No special equipment is needed for your first session — just come dressed to move."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {BRING.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border border-line bg-ink p-4 text-sm text-chalk/90"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-flare" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Gloves and other gear: message us before you come and we will tell
              you exactly what to bring and what you can use at the gym.
            </p>
          </div>

          <Reveal delay={80} className="border border-line bg-ink p-6 sm:p-7">
            <Eyebrow>Nervous about it?</Eyebrow>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Every coach here was a beginner once, and visitors repeatedly
              describe the gym as welcoming and beginner friendly. Nobody expects
              you to know anything before your first round.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/faq" variant="outline" size="sm" data-track="cta_firstvisit_faq">
                Read the FAQ
              </ButtonLink>
              <ButtonLink href={`tel:${business.phone}`} variant="ghost" size="sm" data-track="cta_firstvisit_phone">
                <Phone size={14} aria-hidden="true" />
                {business.phoneDisplay || business.phone}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading="Ready when you are"
        text="Send one message with the day and time you want to train — the gym takes it from there."
        primaryLabel={trial.label}
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
