import Link from "next/link";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { services, site, steps, testimonials } from "@/content/site";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{site.tagline}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{site.description}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
          >
            Book a free consult
          </Link>
          <Link href="/services" className="rounded-full border border-border px-6 py-3 font-medium hover:bg-surface">
            See services
          </Link>
        </div>
      </section>

      <Section eyebrow="Services" title="How I can help">
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Process" title="How it works">
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="text-sm font-medium text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Kind words" title="What clients say">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-border bg-surface p-6">
              <blockquote className="text-lg">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                {t.name}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-accent px-8 py-12 text-accent-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to get started?</h2>
          <p className="mt-2 opacity-90">Tell me a little about what you need and I&apos;ll get back to you within two business days.</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-background px-6 py-3 font-medium text-foreground hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
