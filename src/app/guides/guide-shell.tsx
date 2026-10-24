import type { Metadata } from "next";
import { getLeadMagnet } from "@/content/lead-magnets";
import { site } from "@/content/site";
import { PrintButton } from "./print-button";

// Guides are emailed to people who sign up, so keep them out of search results.
export function guideMetadata(slug: string): Metadata {
  return { title: getLeadMagnet(slug)?.title, robots: { index: false, follow: false } };
}

export function GuideShell({ slug, intro, children }: { slug: string; intro: string; children: React.ReactNode }) {
  const magnet = getLeadMagnet(slug)!;
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 print:py-0">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">{site.name}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{magnet.title}</h1>
      <p className="mt-4 text-lg text-muted">{intro}</p>
      <div className="mt-6">
        <PrintButton />
      </div>
      <div className="mt-10 space-y-10">{children}</div>
      <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
        Questions? Email me at {site.email}. &mdash; {site.owner}, {site.url.replace("https://", "")}
      </p>
    </article>
  );
}

/** A labelled line with blank space to write a number in. */
export function FillLine({ label, columns = 1 }: { label: string; columns?: number }) {
  return (
    <div className="flex items-end gap-3 border-b border-border py-2 text-sm">
      <span className="flex-1">{label}</span>
      {Array.from({ length: columns }, (_, i) => (
        <span key={i} className="w-24 shrink-0 border-b border-dotted border-muted/50 text-muted">$</span>
      ))}
    </div>
  );
}
