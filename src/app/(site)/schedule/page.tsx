import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { ScheduleEntry } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { HoursCard, ScheduleTable } from "@/components/site/schedule";
import { CtaBand } from "@/components/site/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/schedule", "Schedule & hours");
}

export default async function SchedulePage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<ScheduleEntry>("schedule"),
  ]);
  const entries = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Schedule"
        title="When you can train"
        text="Opening hours are listed below. The weekly class timetable changes with the gym — message us for this week's sessions."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={messenger} variant="primary" data-track="cta_schedule_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Ask what&apos;s running today
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" data-track="cta_schedule_trial">
            {settings.trial.label}
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell grid gap-8 py-14 md:py-20 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Weekly timetable"
              title="Training sessions"
              text="Times, coaches and availability for each session."
            />
            <div className="mt-8">
              <ScheduleTable entries={entries} />
            </div>
          </div>

          <Reveal delay={80} className="grid content-start gap-5">
            <HoursCard
              hours={settings.business.hours}
              note={settings.business.directionsNote}
            />
            <div className="border border-line bg-ink-800 p-6 sm:p-7">
              <p className="u-label text-flare-soft">Plan your visit</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Hours can change on holidays and fight days. A quick message
                before you travel saves a wasted trip.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="outline" size="sm" data-track="cta_schedule_contact">
                  Contact details
                </ButtonLink>
                <ButtonLink href="/first-visit" variant="ghost" size="sm" data-track="cta_schedule_first_visit">
                  First visit guide
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading="Lock in a time to train"
        text="Send your preferred days and times — the gym will confirm a session that fits."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={settings.business.phoneDisplay || settings.business.phone}
        phoneHref={`tel:${settings.business.phone}`}
      />
    </>
  );
}
