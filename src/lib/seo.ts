import type { Metadata } from "next";
import { getSettings } from "@/lib/content/access";
import { absoluteUrl } from "@/lib/utils";
import { PAGE_DESCRIPTIONS } from "@/lib/site";

export async function buildMetadata(path: string, title?: string): Promise<Metadata> {
  const settings = await getSettings();
  const { seo, business } = settings;
  const pageTitle = title
    ? seo.titleTemplate.replace("%s", title)
    : seo.ogTitle || `${business.name} — ${business.tagline}`;
  const description = PAGE_DESCRIPTIONS[path] ?? seo.description;
  const url = absoluteUrl(path);

  return {
    metadataBase: absoluteUrl("/"),
    title: pageTitle,
    description,
    keywords: seo.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: business.name,
      title: seo.ogTitle || pageTitle,
      description: seo.ogDescription || description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || pageTitle,
      description: seo.ogDescription || description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function localBusinessJsonLd(settings: Awaited<ReturnType<typeof getSettings>>) {
  const { business, seo } = settings;
  const hours = business.hours
    .filter((entry) => !entry.closed)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: to24h(entry.open),
      closes: to24h(entry.close),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "@id": absoluteUrl("/#organization"),
    name: business.name,
    description: seo.ogDescription || seo.description,
    url: absoluteUrl("/"),
    telephone: business.phone.startsWith("+")
      ? business.phone
      : `+${business.phone}`,
    ...(business.email ? { email: business.email } : {}),
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.addressLine1,
      addressLocality: business.city,
      addressRegion: business.region,
      postalCode: business.postal,
      addressCountry: business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: Number(business.latitude),
      longitude: Number(business.longitude),
    },
    sameAs: [business.facebook, business.instagram, business.youtube].filter(
      Boolean
    ),
    ...(business.ratingValue && business.ratingCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.ratingValue,
            reviewCount: business.ratingCount,
          },
        }
      : {}),
    openingHoursSpecification: hours,
  };
}

export function faqJsonLd(
  faqs: { data: { question: string; answer: string } }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.data.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.data.answer,
      },
    })),
  };
}

function to24h(value: string): string {
  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}
