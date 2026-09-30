import { getPublishedItems, getSettings } from "@/lib/content/access";
import type { Program, Testimonial } from "@/lib/content/types";
import { BenefitsSection, FirstVisitPreview, Marquee, ProgramsSection, TestimonialsSection } from "@/components/home/home-sections";
import { Hero } from "@/components/home/hero";
import { CtaBand } from "@/components/site/cta-band";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, programs, testimonials] = await Promise.all([
    getSettings(),
    getPublishedItems<Program>("programs"),
    getPublishedItems<Testimonial>("testimonials"),
  ]);

  const { business, home, firstVisit } = settings;
  const messenger = settings.hero.secondaryHref || business.messenger;

  return (
    <>
      <Hero settings={settings} />
      <Marquee
        items={[
          "Boxing training",
          "Muay Thai",
          "Private coaching",
          "Beginners welcome",
          "Mactan · Cebu",
        ]}
      />
      <BenefitsSection home={home} />
      <ProgramsSection home={home} programs={programs.map((item) => item.data)} />
      <FirstVisitPreview firstVisit={firstVisit} />
      <TestimonialsSection
        home={home}
        testimonials={testimonials.map((item) => item.data)}
      />
      <CtaBand
        heading={home.ctaHeading}
        text={home.ctaText}
        primaryLabel={settings.trial.label}
        primaryHref="/book"
        secondaryLabel="Message us"
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
