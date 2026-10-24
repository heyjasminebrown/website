import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ContactForm } from "@/app/contact/contact-form";
import { loans } from "@/content/site";

export const metadata: Metadata = { title: "Fund Your Deal", description: loans.intro };

export default function LoanPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-20 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">Financing</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{loans.heading}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{loans.intro}</p>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6">
        {loans.types.map((t) => (
          <div key={t.title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <p className="mt-2 text-muted">{t.body}</p>
          </div>
        ))}
      </section>
      <Section eyebrow="Apply" title="Tell me about your deal">
        <ContactForm topic="Loan request" loanTypes={loans.types.map((t) => t.title)} submitLabel="Request funding" />
      </Section>
    </>
  );
}
