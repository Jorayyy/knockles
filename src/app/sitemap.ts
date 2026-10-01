import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { PUBLIC_ROUTES } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : route === "/book" ? 0.9 : 0.7,
  }));
}
