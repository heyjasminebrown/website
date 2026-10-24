import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }, ...[...nav, { href: "/contact" }, { href: "/passiveincome" }, { href: "/referral" }].map((item) => ({ url: `${site.url}${item.href}` }))];
}
