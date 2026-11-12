import type { MetadataRoute } from "next";
import { leadMagnets } from "@/content/lead-magnets";
import { getPosts } from "@/lib/blog";
import { navLinks, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...navLinks.map((item) => item.href).filter((href) => href !== "/"),
    "/about",
    "/broker",
    "/conference",
    "/meet",
    "/passiveincome",
    "/referral",
    "/free",
    "/subscribe",
    ...leadMagnets.map((m) => `/free/${m.slug}`),
    ...getPosts()
      .filter((p) => !p.draft)
      .map((p) => `/blog/${p.slug}`),
  ];
  return [{ url: site.url, priority: 1 }, ...[...new Set(paths)].map((p) => ({ url: `${site.url}${p}` }))];
}
