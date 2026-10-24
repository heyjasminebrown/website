import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeadMagnet } from "@/content/lead-magnets";
import { FreebieForm } from "./freebie-form";

export function freebieMetadata(slug: string): Metadata {
  const magnet = getLeadMagnet(slug);
  return { title: magnet?.title, description: magnet?.pitch, alternates: { canonical: `/free/${slug}` } };
}

/** Landing page for a free guide: the pitch on the left, the signup form on the right. */
export function FreebieLanding({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.1fr] md:py-20">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-accent">{magnet.eyebrow}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{magnet.title}</h1>
        <p className="mt-6 text-lg text-muted">{magnet.pitch}</p>
        <h2 className="mt-10 text-xl">What you&rsquo;ll get</h2>
        <ul className="mt-4 space-y-3">
          {magnet.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {children ?? (
          <FreebieForm slug={magnet.slug} heading="Get it free" intro="Tell me where to send it." submitLabel={magnet.cta} />
        )}
      </div>
    </section>
  );
}
