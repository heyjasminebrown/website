import Link from "next/link";
import { Section } from "@/components/section";
import { about, newsletter, offerings, site } from "@/content/site";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Hey, I&apos;m {site.owner}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{site.tagline}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{site.description}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/passiveincome"
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
          >
            Start investing
          </Link>
          <Link href="/loan" className="rounded-full border border-border px-6 py-3 font-medium hover:bg-surface">
            Fund your deal
          </Link>
        </div>
      </section>

      <Section eyebrow="Work with me" title="How I can help">
        <div className="grid gap-6 sm:grid-cols-2">
          {offerings.map((o) => (
            <Link
              key={o.title}
              href={o.href}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <h3 className="text-lg font-semibold">{o.title}</h3>
              <p className="mt-2 text-muted">{o.summary}</p>
              <span className="mt-auto pt-6 font-medium text-accent">
                {o.cta} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="About" title={about.heading}>
        <div className="max-w-2xl space-y-4 text-lg text-muted">
          <p>{about.paragraphs[0]}</p>
        </div>
        <Link href="/about" className="mt-6 inline-block font-medium text-accent underline underline-offset-4">
          Read my story
        </Link>
      </Section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-accent px-8 py-12 text-accent-foreground">
          <p className="text-sm font-medium uppercase tracking-wider opacity-80">{newsletter.tagline}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Get {newsletter.name}</h2>
          <p className="mt-2 max-w-xl opacity-90">{newsletter.intro}</p>
          <Link
            href="/subscribe"
            className="mt-6 inline-block rounded-full bg-background px-6 py-3 font-medium text-foreground hover:opacity-90"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </>
  );
}
