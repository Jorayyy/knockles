import type { Metadata } from "next";
import { Camera, MessageCircle } from "lucide-react";
import { getPublishedItems, getSettings } from "@/lib/content/access";
import { buildMetadata } from "@/lib/seo";
import type { GalleryImage } from "@/lib/content/types";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { CtaBand } from "@/components/site/cta-band";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/gallery", "Gallery");
}

export default async function GalleryPage() {
  const [settings, items] = await Promise.all([
    getSettings(),
    getPublishedItems<GalleryImage>("gallery"),
  ]);
  const images = items.map((item) => item.data);
  const messenger = settings.hero.secondaryHref || settings.business.messenger;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside the gym"
        text="The floor, the bags and the people who train here — real photos from Knock'ls."
      />

      <section className="border-b border-line bg-ink">
        <div className="u-shell py-14 md:py-20">
          {images.length ? (
            <GalleryGrid images={images} />
          ) : (
            <EmptyState
              title="Photos are being uploaded"
              text="New photos from the gym floor are on their way. Until then, the best view is a visit — message us to arrange a session."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <ButtonLink href={messenger} variant="primary">
                    <MessageCircle size={15} aria-hidden="true" />
                    Message the gym
                  </ButtonLink>
                  <ButtonLink href="/book" variant="outline">
                    Book a trial session
                  </ButtonLink>
                </div>
              }
            />
          )}

          {images.length ? (
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-dim">
              <Camera size={14} aria-hidden="true" />
              Tap any photo to view it full screen.
            </p>
          ) : null}
        </div>
      </section>

      <CtaBand
        heading="See it in person"
        text="Photos are nice — training is better. Message the gym and book your first session."
        primaryLabel={settings.trial.label}
        secondaryHref={messenger}
        phoneLabel={settings.business.phoneDisplay || settings.business.phone}
        phoneHref={`tel:${settings.business.phone}`}
      />
    </>
  );
}
