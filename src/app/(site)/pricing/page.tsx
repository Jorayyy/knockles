import type { Metadata } from "next";
import { ArrowRight, MessageCircle, ShieldQuestion } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { Plan } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { PlanCard } from "@/components/site/content-cards";
import { CtaBand } from "@/components/site/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/pricing", "Membership & pricing");
}

const QUESTIONS = [
  "What does a monthly membership include?",
  "Is there a rate for private, one-on-one coaching?",
  "Do you have rates for multiple sessions per week?",
  "Can I train for a short stay in Cebu?",
];

export default async function PricingPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<Plan>("plans"),
  ]);
  const plans = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Membership & pricing"
        title="What it costs to train"
        text="Rates are confirmed directly by the gym so you always get current figures. Message us and you will have today's membership and session prices within the day."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={messenger} variant="primary" data-track="cta_pricing_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Get current rates
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" data-track="cta_pricing_trial">
            Book a trial session
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                index={index}
                ctaHref={plan.cta ? "/book" : "/book"}
              />
            ))}
          </div>

          {!plans.length ? (
            <div className="border border-line bg-ink-800 p-10 text-center">
              <p className="u-display text-3xl">Rates are sent on request</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">
                Message the gym for the latest membership and session prices.
              </p>
            </div>
          ) : null}

          <p className="mt-8 text-sm leading-relaxed text-muted-dim">
            Prices shown only when published by the gym. Nothing on this page is
            invented — if a figure is not listed, ask us and we will send it.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Before you pay anything"
              title="Ask these questions first"
              text="A trial session is the cheapest way to find out if the gym is right for you — then decide on a plan."
            />
          </Reveal>

          <Reveal delay={80} className="border border-line bg-ink">
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <ShieldQuestion size={16} className="text-flare-soft" aria-hidden="true" />
              <p className="u-label text-muted">Worth asking on Messenger</p>
            </div>
            <ul className="grid gap-px bg-line">
              {QUESTIONS.map((question) => (
                <li key={question} className="bg-ink px-6 py-4 text-sm text-chalk/90">
                  {question}
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={messenger} variant="primary" size="sm" data-track="cta_pricing_ask">
                  <MessageCircle size={14} aria-hidden="true" />
                  Ask on Messenger
                </ButtonLink>
                <ButtonLink href="/faq" variant="ghost" size="sm" data-track="cta_pricing_faq">
                  Read the FAQ
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading="Start with one session"
        text="Try the gym, meet the coach, then choose the plan that fits your schedule."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={settings.business.phoneDisplay || settings.business.phone}
        phoneHref={`tel:${settings.business.phone}`}
      />
    </>
  );
}
