import Image from "next/image";
import { ArrowRight, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { SiteSettings } from "@/lib/content/types";
import { formatPhone } from "@/lib/utils";
import { summarizeHours } from "@/components/site/footer";

export function Hero({ settings }: { settings: SiteSettings }) {
  const { business, hero, trial } = settings;
  const messenger = hero.secondaryHref || business.messenger;
  const hasImage = Boolean(hero.image);
  const ratingReady = Boolean(business.ratingValue && business.ratingCount);
  const hoursSummary = summarizeHours(business.hours);
  const headlineLines = hero.headline.split("\n").filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-ink u-noise">
      {hasImage ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/70" />
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="u-grid-lines absolute inset-0 -z-10 opacity-50"
          />
          <div
            aria-hidden="true"
            className="absolute -left-40 top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-flare/10 blur-[140px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 left-0 -z-10 select-none whitespace-nowrap text-[22vw] font-bold uppercase leading-none tracking-tighter text-transparent opacity-[0.07]"
            style={{
              fontFamily: "var(--font-condensed)",
              WebkitTextStroke: "1px var(--color-chalk)",
            }}
          >
            Knock&apos;ls
          </span>
        </>
      )}

      <div className="u-shell relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.4fr_0.85fr] lg:gap-14 lg:py-24 xl:py-28">
        <div>
          <span className="hero-rise block" style={{ animationDelay: "40ms" }}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </span>

          <h1 className="u-display mt-7 text-[clamp(2.6rem,8.5vw,6.25rem)] leading-[0.9]">
            {headlineLines.map((line, index) => (
              <span
                key={line}
                className="hero-rise block"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                {index === headlineLines.length - 1 ? (
                  <>
                    {line.replace(/\.$/, "")}
                    <span className="text-flare">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <div
            aria-hidden="true"
            className="hero-rise mt-7 h-px w-24 bg-flare"
            style={{ animationDelay: "420ms" }}
          />

          <p
            className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: "480ms" }}
          >
            {hero.subheadline}
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "560ms" }}
          >
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

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-3" style={{ animationDelay: "640ms" }}>
            {ratingReady ? (
              <a
                href="/testimonials"
                data-track="cta_hero_rating"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-chalk"
              >
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
                  {business.ratingValue}
                </span>
                <span>
                  from {business.ratingCount} public review
                  {business.ratingCount === "1" ? "" : "s"}
                </span>
              </a>
            ) : null}
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

        <aside
          className="hero-rise border border-line bg-ink-800/90 backdrop-blur-sm"
          style={{ animationDelay: "360ms" }}
          aria-label="Gym location and opening hours"
        >
          <div className="u-hatch border-b border-line px-6 py-4">
            <p className="u-label text-flare-soft">Train at Knock&apos;ls</p>
          </div>

          <div className="px-6 py-6">
            <p className="u-display text-2xl leading-tight sm:text-3xl">
              {business.tagline}
            </p>

            <dl className="mt-6 grid gap-5">
              <div>
                <dt className="u-label text-muted-dim">Where</dt>
                <dd className="mt-2 text-sm leading-relaxed text-chalk">
                  <address className="not-italic">
                    {business.addressLine1}
                    <br />
                    {[business.addressLine2, business.city]
                      .filter(Boolean)
                      .join(", ")}{" "}
                    {business.postal}
                  </address>
                  {business.directionsNote ? (
                    <span className="mt-2 block text-xs text-flare-soft">
                      {business.directionsNote}
                    </span>
                  ) : null}
                </dd>
              </div>

              <div>
                <dt className="u-label text-muted-dim">Opening hours</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {hoursSummary}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="map_click_hero"
              className="flex min-h-12 items-center justify-center gap-2 bg-ink-800 px-4 py-4 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-ink-700"
            >
              <MapPin size={14} aria-hidden="true" />
              Map
            </a>
            <a
              href={`tel:${business.phone}`}
              data-track="cta_hero_call_panel"
              className="flex min-h-12 items-center justify-center gap-2 bg-ink-800 px-4 py-4 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-ink-700"
            >
              <Phone size={14} aria-hidden="true" />
              Call
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
