import { getPublishedItems, getSettings } from "@/lib/content/access";
import type {
  Faq,
  GalleryImage,
  Program,
  Testimonial,
} from "@/lib/content/types";
import {
  AtmosphereSection,
  BenefitsSection,
  BeginnersSection,
  FaqTeaser,
  LocationSection,
  ProgramsSection,
  TestimonialsSection,
  TrustStrip,
} from "@/components/home/home-sections";
import { Hero } from "@/components/home/hero";
import { CtaBand } from "@/components/site/cta-band";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, programs, testimonials, gallery, faqs] = await Promise.all([
    getSettings(),
    getPublishedItems<Program>("programs"),
    getPublishedItems<Testimonial>("testimonials"),
    getPublishedItems<GalleryImage>("gallery"),
    getPublishedItems<Faq>("faqs"),
  ]);

  const { business, home, firstVisit, hero, trial } = settings;
  const messenger = hero.secondaryHref || business.messenger;

  return (
    <>
      <Hero settings={settings} />
      <TrustStrip business={business} />
      <BenefitsSection home={home} />
      <ProgramsSection home={home} programs={programs.map((item) => item.data)} />
      <BeginnersSection firstVisit={firstVisit} />
      <AtmosphereSection
        home={home}
        images={gallery.map((item) => item.data)}
      />
      <TestimonialsSection
        home={home}
        testimonials={testimonials.map((item) => item.data)}
      />
      <LocationSection business={business} />
      <FaqTeaser faqs={faqs.map((item) => item.data)} />
      <CtaBand
        heading={home.ctaHeading}
        text={home.ctaText}
        primaryLabel={trial.label}
        primaryHref="/book"
        secondaryLabel="Message us"
        secondaryHref={messenger}
        phoneLabel={business.phoneDisplay || business.phone}
        phoneHref={`tel:${business.phone}`}
      />
    </>
  );
}
