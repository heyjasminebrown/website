import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ContactForm } from "@/app/contact/contact-form";
import { passiveIncome } from "@/content/site";

export const metadata: Metadata = { title: "Passive Income", description: passiveIncome.intro };

export default function PassiveIncomePage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-20 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Invest</p>
        <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">{passiveIncome.heading}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{passiveIncome.intro}</p>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3">
        {passiveIncome.points.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg">{p.title}</h2>
            <p className="mt-2 text-muted">{p.body}</p>
          </div>
        ))}
      </section>
      <Section eyebrow="Get started" title="Join the investor list">
        <ContactForm topic="Passive income investor" submitLabel="I'm interested" />
        <p className="mt-10 max-w-2xl text-xs text-muted">{passiveIncome.disclaimer}</p>
      </Section>
    </>
  );
}
