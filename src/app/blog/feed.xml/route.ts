import { newsletter, site } from "@/content/site";
import { getPosts } from "@/lib/blog";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** RSS feed of Wealthy Notes, e.g. for newsletter tools that email new posts automatically. */
export function GET() {
  const items = getPosts()
    .filter((p) => !p.draft)
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid>${site.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(newsletter.name)} by ${escape(site.owner)}</title>
    <link>${site.url}/blog</link>
    <description>${escape(newsletter.intro)}</description>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
