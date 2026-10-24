import type { Metadata } from "next";
import Link from "next/link";
import { leadMagnets } from "@/content/lead-magnets";

export const metadata: Metadata = {
  title: "Free Guides & Tools",
  description: "Free checklists, worksheets and guides for real estate investors and anyone building wealth.",
};

export default function FreePage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-20 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Free resources</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Free guides &amp; tools</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Checklists, worksheets and guides to help you fund deals, invest with confidence and grow your wealth.
        </p>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 pt-8 sm:grid-cols-2 sm:px-6">
        {leadMagnets.map((m) => (
          <Link
            key={m.slug}
            href={`/free/${m.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-6 hover:border-accent"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{m.eyebrow}</p>
            <h2 className="mt-2 text-xl">{m.title}</h2>
            <p className="mt-2 flex-1 text-muted">{m.pitch}</p>
            <span className="mt-4 font-medium group-hover:underline">{m.cta} &rarr;</span>
          </Link>
        ))}
      </section>
    </>
  );
}
