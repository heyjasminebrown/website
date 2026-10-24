import type { MetadataRoute } from "next";
import { leadMagnets } from "@/content/lead-magnets";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...nav.map((item) => item.href),
    "/contact",
    "/passiveincome",
    "/referral",
    "/free",
    ...leadMagnets.map((m) => `/free/${m.slug}`),
  ];
  return [{ url: site.url, priority: 1 }, ...paths.map((p) => ({ url: `${site.url}${p}` }))];
}
