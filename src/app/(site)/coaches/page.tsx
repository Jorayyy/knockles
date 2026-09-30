import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Coach } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/coaches", "Coaches");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function CoachesPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<Coach>("coaches"),
  ]);
  const coaches = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Coaches"
        title="Who you will train with"
        text="Hands-on coaching from people who train fighters — from your first stance to your next bout."
      />

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          {coaches.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach, index) => (
                <Reveal
                  key={`${coach.name}-${index}`}
                  delay={index * 60}
                  as="article"
                  className="border border-line bg-ink-800"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-ink-700">
                    {coach.photo ? (
                      <Image
                        src={coach.photo}
                        alt={`${coach.name}, ${coach.role}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center u-hatch">
                        <span className="u-display text-6xl text-muted-dim">
                          {initials(coach.name) || "KB"}
                        </span>
                      </div>
                    )}
                    <span className="u-label absolute left-4 top-4 border border-flare/50 bg-ink/80 px-2.5 py-1 text-flare-soft backdrop-blur">
                      {coach.role || "Coach"}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="u-display text-3xl">{coach.name}</h2>
                    {coach.specialties.includes(",") ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {coach.specialties.split(",").map((tag) => (
                          <li
                            key={tag.trim()}
                            className="u-label border border-line px-2.5 py-1.5 text-muted"
                          >
                            {tag.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="u-label mt-3 text-flare-soft">
                        {coach.specialties}
                      </p>
                    )}
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {coach.bio}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Coach profiles are on the way"
              text="The team keeps a low profile — the fastest way to meet them is to message the gym and book a session."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <ButtonLink href={messenger} variant="primary">
                    <MessageCircle size={15} aria-hidden="true" />
                    Message the gym
                  </ButtonLink>
                  <ButtonLink href="/book" variant="outline">
                    Book a trial session
                    <ArrowRight size={15} aria-hidden="true" />
                  </ButtonLink>
                </div>
              }
            />
          )}
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-8 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Coaching style"
            title="Corrections between every round"
            text="Visitors consistently describe trainers who are friendly, knowledgeable and involved — staying with you through the session rather than watching from the wall."
          />
          <div className="grid gap-4">
            {[
              "Hands-on pad work with real-time feedback",
              "Technique first — conditioning follows",
              "Sessions planned around your level and goals",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-4 border border-line bg-ink p-5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-flare" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-muted">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Train with the team"
        text="Book your first session and see the coaching style for yourself."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={settings.business.phoneDisplay || settings.business.phone}
        phoneHref={`tel:${settings.business.phone}`}
      />
    </>
  );
}
