import type { MetadataRoute } from "next";
import { locales, site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((l) => ({
    url: `${site.url}/${l}`,
    changeFrequency: "monthly",
    priority: l === "en" ? 1 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}`])) },
  }));
}
