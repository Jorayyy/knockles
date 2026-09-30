import type { Metadata } from "next";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import type { Faq } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/faq", "FAQ");
}

export default async function FaqPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<Faq>("faqs"),
  ]);
  const faqs = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions from first-timers"
        text="Everything people usually ask before their first session — experience, gear, prices, hours and how to find us."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={messenger} variant="primary" data-track="cta_faq_messenger">
            <MessageCircle size={15} aria-hidden="true" />
            Ask something else
          </ButtonLink>
          <ButtonLink href="/book" variant="outline" data-track="cta_faq_trial">
            Book a trial session
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="border-b border-line bg-ink-800">
        <div className="u-shell grid gap-8 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Still unsure"
              title="Two ways to get a straight answer"
              text="Message the gym on Facebook Messenger, or call during opening hours — both reach the coaches directly."
            />
          </Reveal>
          <Reveal delay={80} className="flex flex-wrap gap-3">
            <ButtonLink href={messenger} variant="primary" size="lg" data-track="cta_faq_messenger_bottom">
              <MessageCircle size={16} aria-hidden="true" />
              Message on Messenger
            </ButtonLink>
            <ButtonLink href={`tel:${settings.business.phone}`} variant="outline" size="lg" data-track="cta_faq_phone">
              <Phone size={16} aria-hidden="true" />
              {settings.business.phoneDisplay || settings.business.phone}
            </ButtonLink>
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

      {faqs.length ? <JsonLd data={faqJsonLd(items)} /> : null}
    </>
  );
}
