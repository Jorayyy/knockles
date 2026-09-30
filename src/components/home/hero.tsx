import { ArrowRight, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { SiteSettings } from "@/lib/content/types";
import { formatPhone } from "@/lib/utils";

export function Hero({ settings }: { settings: SiteSettings }) {
  const { business, hero, trial } = settings;
  const messenger = hero.secondaryHref || business.messenger;
  const weekdayHours = business.hours.find((entry) => entry.day === "Monday");

  return (
    <section className="relative overflow-hidden border-b border-line bg-ink u-noise">
      <div
        aria-hidden="true"
        className="u-grid-lines absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-flare/12 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-px bg-line"
      />

      <div className="u-shell relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <h1 className="u-display mt-7 whitespace-pre-line text-[3.25rem] leading-[0.92] sm:text-7xl lg:text-[5.75rem]">
            {hero.headline}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.subheadline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={hero.primaryHref || "/book"}
              variant="primary"
              size="lg"
              data-track="cta_hero_trial"
            >
              {hero.primaryLabel || trial.label}
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={messenger}
              variant="outline"
              size="lg"
              data-track="cta_hero_messenger"
            >
              <MessageCircle size={16} aria-hidden="true" />
              {hero.secondaryLabel || "Message us"}
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={13}
                    className="fill-flare text-flare"
                  />
                ))}
              </span>
              <span className="font-medium text-chalk">
                {business.ratingValue || "5.0"}
              </span>
              <span>
                from {business.ratingCount || "12"} public review
                {business.ratingCount === "1" ? "" : "s"}
              </span>
            </span>
            <a
              href={`tel:${business.phone}`}
              data-track="cta_hero_phone"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-chalk"
            >
              <Phone size={14} className="text-flare-soft" aria-hidden="true" />
              {formatPhone(business.phoneDisplay || business.phone)}
            </a>
          </div>
        </div>

        <aside className="border border-line bg-ink-800/80 backdrop-blur-sm">
          <div className="border-b border-line px-6 py-5">
            <p className="u-label text-flare-soft">Train at Knock&apos;ls</p>
            <p className="u-display mt-3 text-3xl leading-tight">
              {business.tagline}
            </p>
          </div>

          <div className="grid gap-5 px-6 py-6">
            <div>
              <p className="u-label text-muted-dim">Where</p>
              <address className="mt-2 not-italic text-sm leading-relaxed text-chalk">
                {business.addressLine1}
                <br />
                {[business.addressLine2, business.city].filter(Boolean).join(", ")}{" "}
                {business.postal}
              </address>
              {business.directionsNote ? (
                <p className="mt-2 text-xs text-flare-soft">
                  {business.directionsNote}
                </p>
              ) : null}
            </div>

            <div>
              <p className="u-label text-muted-dim">Opening hours</p>
              <p className="mt-2 text-sm text-chalk">
                Mon–Fri {weekdayHours?.open} – {weekdayHours?.close}
              </p>
              <p className="text-sm text-muted">
                Sat{" "}
                {business.hours.find((entry) => entry.day === "Saturday")?.open}{" "}
                – {business.hours.find((entry) => entry.day === "Saturday")?.close}
                {" · "}Sun closed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="map_click_hero"
              className="flex items-center justify-center gap-2 bg-ink-800 px-4 py-4 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-ink-700"
            >
              <MapPin size={14} aria-hidden="true" />
              Map
            </a>
            <a
              href={`tel:${business.phone}`}
              data-track="cta_hero_call_panel"
              className="flex items-center justify-center gap-2 bg-ink-800 px-4 py-4 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-ink-700"
            >
              <Phone size={14} aria-hidden="true" />
              Call
            </a>
          </div>
        </aside>
      </div>

      <div className="border-t border-line bg-ink-800/60">
        <div className="u-shell flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
          {[
            "Boxing",
            "Muay Thai",
            "Private coaching",
            "Beginners welcome",
            "Mactan, Cebu",
          ].map((item) => (
            <span
              key={item}
              className="u-label flex items-center gap-3 text-muted"
            >
              <span className="h-1.5 w-1.5 bg-flare" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
