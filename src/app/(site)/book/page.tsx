import type { Metadata } from "next";
import { CircleCheckBig, CircleAlert, MessageCircle, Phone } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Program } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { LeadForm } from "@/components/site/lead-form";
import { HoursCard } from "@/components/site/schedule";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { formatPhone } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/book", "Book a trial session");
}

const ERROR_MESSAGES: Record<string, string> = {
  rate: "Too many requests — please wait a moment and try again.",
  invalid: "Please check the highlighted fields and try again.",
  store: "We could not save your request. Please message the gym directly.",
};

const NEXT_STEPS = [
  "Your details reach the coaches directly.",
  "We reply on Messenger or by phone during opening hours.",
  "You confirm a time, turn up and train — that is it.",
];

export default async function BookPage({
  searchParams,
}: PageProps<"/book">) {
  const query = await searchParams;
  const [settings, programItems] = await Promise.all([
    getSettings(),
    getPublishedItems<Program>("programs"),
  ]);
  const { business, trial } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;

  const sent = Boolean(query.sent);
  const errorKey = typeof query.error === "string" ? query.error : "";

  return (
    <>
      <PageHero
        eyebrow="Book a trial"
        title={trial.headline}
        text={trial.intro}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={messenger} variant="outline" data-track="cta_book_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Message us instead
          </ButtonLink>
          <ButtonLink href={`tel:${business.phone}`} variant="ghost" data-track="cta_book_phone">
            <Phone size={15} aria-hidden="true" />
            {formatPhone(business.phoneDisplay || business.phone)}
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell grid gap-8 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            {!sent && errorKey ? (
              <div
                className="mb-6 flex items-start gap-3 border border-flare/50 bg-flare/10 px-5 py-4 text-sm text-flare-soft"
                role="alert"
              >
                <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.invalid}</span>
              </div>
            ) : null}

            {sent ? (
              <div
                className="mb-6 flex items-start gap-3 border border-flare/50 bg-flare/10 px-5 py-4 text-sm text-flare-soft"
                role="status"
              >
                <CircleCheckBig size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{trial.successMessage}</span>
              </div>
            ) : null}

            <LeadForm
              programs={programItems.map((item) => item.data.name)}
              trial={trial}
              businessPhone={business.phone}
              messenger={messenger}
              source="book"
            />
          </div>

          <Reveal delay={80} className="grid content-start gap-5">
            <div className="border border-line bg-ink-800 p-6 sm:p-7">
              <Eyebrow>What happens next</Eyebrow>
              <ol className="mt-5 grid gap-4">
                {NEXT_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="u-label mt-0.5 text-flare-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <HoursCard hours={business.hours} note={business.directionsNote} />

            <div className="border border-line bg-ink-800 p-6">
              <p className="u-label text-muted-dim">Faster than the form?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href={messenger} variant="primary" size="sm" data-track="cta_book_messenger_card">
                  <MessageCircle size={14} aria-hidden="true" />
                  Messenger
                </ButtonLink>
                <ButtonLink href={`tel:${business.phone}`} variant="outline" size="sm" data-track="cta_book_phone_card">
                  <Phone size={14} aria-hidden="true" />
                  Call the gym
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
