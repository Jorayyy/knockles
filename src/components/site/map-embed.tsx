import { ExternalLink, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { BusinessSettings } from "@/lib/content/types";

export function MapEmbed({ business }: { business: BusinessSettings }) {
  const coordinates = `${business.latitude},${business.longitude}`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;

  return (
    <div className="border border-line bg-ink-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-flare-soft" aria-hidden="true" />
          <p className="u-label text-muted">Find us</p>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          data-track="map_click"
          className="u-label inline-flex items-center gap-2 text-chalk transition-colors hover:text-flare-soft"
        >
          Get directions
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <iframe
          title={`Map showing ${business.name}`}
          src={`https://www.google.com/maps?q=${coordinates}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[1.05]"
        />
      </div>
      <div className="grid gap-4 border-t border-line px-5 py-5 sm:grid-cols-2">
        <div>
          <p className="u-label text-muted-dim">Address</p>
          <address className="mt-2 not-italic text-sm leading-relaxed text-chalk">
            {business.addressLine1}
            <br />
            {[business.addressLine2, business.city].filter(Boolean).join(", ")}{" "}
            {business.postal}
            <br />
            {business.country}
          </address>
        </div>
        <div>
          <p className="u-label text-muted-dim">Entrance</p>
          <p className="mt-2 text-sm leading-relaxed text-chalk">
            {business.directionsNote || "Message us if you need help finding the door."}
          </p>
          <div className="mt-4">
            <ButtonLink href={directionsHref} variant="outline" size="sm" data-track="map_directions">
              <MapPin size={14} aria-hidden="true" />
              Directions
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
