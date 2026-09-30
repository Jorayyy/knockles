import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { SITE_NAV } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", ...SITE_NAV.map((item) => item.href), "/book"];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/book" ? 0.9 : 0.7,
  }));
}
