import type { Metadata } from "next";
import { MessageCircle, ArrowRight } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Program } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { ProgramCard } from "@/components/site/content-cards";
import { CtaBand } from "@/components/site/cta-band";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/programs", "Programs");
}

export default async function ProgramsPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<Program>("programs"),
  ]);
  const programs = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Train what you want to train"
        text="Boxing, Muay Thai, private coaching or your very first session — every program is coached, and every level is welcome."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" variant="primary" data-track="cta_programs_trial">
            {settings.trial.label}
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/schedule" variant="outline" data-track="cta_programs_schedule">
            See schedule
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          {programs.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {programs.map((program, index) => (
                <ProgramCard key={program.slug} program={program} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Program list is being updated"
              text="Message the gym and we will tell you exactly what is running this week."
              action={
                <ButtonLink href={messenger} variant="primary">
                  <MessageCircle size={15} aria-hidden="true" />
                  Message the gym
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Not sure where to start"
              title="Tell us your goal — we will point you at the right session"
              text="Weight loss, fitness, technique, confidence or competition: a short message is enough to get a recommendation from the coaches."
            />
          </Reveal>
          <Reveal delay={80} className="grid gap-4">
            {[
              "Never trained before? Start with First-Timers.",
              "Want focused improvement? Book private coaching.",
              "Travelling through Cebu? Ask about short-term training.",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-4 border border-line bg-ink p-5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-flare" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-muted">{line}</p>
              </div>
            ))}
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href="/book" variant="primary" data-track="cta_programs_advice">
                Get a recommendation
              </ButtonLink>
              <ButtonLink href={messenger} variant="outline" data-track="cta_programs_messenger">
                <MessageCircle size={15} aria-hidden="true" />
                Message us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading={settings.home.ctaHeading}
        text={settings.home.ctaText}
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={settings.business.phoneDisplay || settings.business.phone}
        phoneHref={`tel:${settings.business.phone}`}
      />
    </>
  );
}
