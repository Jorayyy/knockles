import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/icons/social";
import { getSettings } from "@/lib/content/access";
import { FOOTER_GROUPS } from "@/lib/site";
import { formatPhone } from "@/lib/utils";
import { Wordmark } from "./wordmark";
import type { Hour } from "@/lib/content/types";

export function summarizeHours(hours: Hour[]): string {
  const open = hours.filter((entry) => !entry.closed);
  if (!open.length) return "Message us for opening hours";

  const weekday = open.filter((entry) =>
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(entry.day)
  );
  const parts: string[] = [];

  if (
    weekday.length === 5 &&
    new Set(weekday.map((entry) => `${entry.open}-${entry.close}`)).size === 1
  ) {
    parts.push(`Mon–Fri ${weekday[0].open} – ${weekday[0].close}`);
  } else {
    for (const entry of weekday) {
      parts.push(`${entry.day.slice(0, 3)} ${entry.open} – ${entry.close}`);
    }
  }

  for (const entry of open.filter(
    (item) => item.day === "Saturday" || item.day === "Sunday"
  )) {
    parts.push(`${entry.day.slice(0, 3)} ${entry.open} – ${entry.close}`);
  }

  if (
    hours.some((entry) => entry.closed && entry.day === "Sunday") &&
    !open.some((entry) => entry.day === "Sunday")
  ) {
    parts.push("Sun closed");
  }

  return parts.join(" · ");
}

export async function Footer() {
  const { business, seo, trial } = await getSettings();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
  const socials = [
    { label: "Facebook", href: business.facebook, icon: FacebookIcon },
    { label: "Messenger", href: business.messenger, icon: MessageCircle },
    { label: "Instagram", href: business.instagram, icon: InstagramIcon },
    { label: "YouTube", href: business.youtube, icon: YoutubeIcon },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="border-t border-line bg-ink-800 pb-24 lg:pb-0">
      <div className="u-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <Wordmark wordmark={business.wordmark} tagline="Boxing Gym" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {seo.ogDescription || business.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`social_${social.label.toLowerCase()}`}
                className="inline-flex h-11 w-11 items-center justify-center border border-line text-muted transition-colors hover:border-chalk hover:text-chalk"
              >
                <social.icon size={16} aria-hidden="true" />
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav key={group.label} aria-label={`Footer: ${group.label}`}>
            <p className="u-label mb-5 text-muted-dim">{group.label}</p>
            <ul className="grid gap-2.5">
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-chalk"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <p className="u-label mb-5 text-muted-dim">Visit the gym</p>
          <address className="not-italic text-sm leading-relaxed text-muted">
            {business.addressLine1}
            <br />
            {[business.addressLine2, business.city].filter(Boolean).join(", ")}{" "}
            {business.postal}
            <br />
            {business.country}
          </address>
          {business.directionsNote ? (
            <p className="mt-3 text-xs text-flare-soft">{business.directionsNote}</p>
          ) : null}
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="map_click_footer"
            className="u-label mt-4 inline-flex items-center gap-2 text-chalk transition-colors hover:text-flare-soft"
          >
            <MapPin size={14} aria-hidden="true" />
            Open in Google Maps
          </a>
          <p className="mt-4 text-xs leading-relaxed text-muted-dim">
            {summarizeHours(business.hours)}
          </p>

          <p className="u-label mt-7 mb-4 text-muted-dim">Contact</p>
          <div className="flex flex-col items-start gap-3">
            <a
              href={`tel:${business.phone}`}
              data-track="cta_phone_footer"
              className="inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-chalk"
            >
              <Phone size={15} aria-hidden="true" className="text-flare-soft" />
              {formatPhone(business.phoneDisplay || business.phone)}
            </a>
            <a
              href={business.messenger}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_messenger_footer"
              className="inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-chalk"
            >
              <MessageCircle
                size={15}
                aria-hidden="true"
                className="text-flare-soft"
              />
              Message on Messenger
            </a>
            <Link
              href="/book"
              data-track="cta_trial_footer"
              className="u-label mt-2 inline-flex min-h-11 items-center justify-center border border-flare bg-flare px-5 text-white transition-colors hover:border-flare-deep hover:bg-flare-deep"
            >
              {trial.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="u-shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-dim sm:flex-row">
          <p>
            © {new Date().getFullYear()} {business.name} · {business.city}
            {business.country ? `, ${business.country}` : ""}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="transition-colors hover:text-chalk">
              Owner login
            </Link>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
