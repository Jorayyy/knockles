import { MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function CtaBand({
  heading,
  text,
  primaryLabel = "Book a trial session",
  primaryHref = "/book",
  secondaryLabel = "Message us",
  secondaryHref = "https://m.me/KnocklsBoxGym",
  phoneLabel,
  phoneHref,
  className,
}: {
  heading: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  phoneLabel?: string;
  phoneHref?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-bone text-ink", className)}>
      <div
        aria-hidden="true"
        className="u-grid-lines absolute inset-0 opacity-[0.15]"
      />
      <div className="u-shell relative py-16 md:py-24">
        <Reveal className="max-w-3xl">
          <p className="u-label text-flare">Start here</p>
          <h2 className="u-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
            {heading}
          </h2>
          {text ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              {text}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={primaryHref}
              variant="primary"
              size="lg"
              data-track="cta_band_trial"
            >
              {primaryLabel}
            </ButtonLink>
            <ButtonLink
              href={secondaryHref}
              variant="ink"
              size="lg"
              data-track="cta_band_messenger"
            >
              <MessageCircle size={16} aria-hidden="true" />
              {secondaryLabel}
            </ButtonLink>
            {phoneHref ? (
              <ButtonLink
                href={phoneHref}
                variant="ink"
                size="lg"
                data-track="cta_band_phone"
              >
                <Phone size={16} aria-hidden="true" />
                {phoneLabel}
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
