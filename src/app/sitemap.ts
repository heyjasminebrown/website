import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }, ...nav.map((item) => ({ url: `${site.url}${item.href}` }))];
}
