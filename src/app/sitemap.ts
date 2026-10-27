import type { MetadataRoute } from "next";
import { leadMagnets } from "@/content/lead-magnets";
import { getPosts } from "@/lib/blog";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...nav.map((item) => item.href).filter((href) => href !== "/"),
    "/about",
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
