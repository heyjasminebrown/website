import type { Metadata } from "next";
import Link from "next/link";
import { quote } from "@/content/quote";
import { QuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Get a Quote: Fix & Flip, Construction and DSCR Loans",
  description:
    "Get a quote for your fix and flip, new construction or DSCR loan. Once approved, your deal can be funded in as little as 10–14 days.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-accent px-4 py-16 text-blush sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-wider opacity-80">{quote.eyebrow}</p>
          <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">{quote.heading}</h1>
          <p className="mt-6 text-lg sm:text-xl">{quote.intro}</p>
          <Link href="/conventus" className="mt-6 inline-block underline underline-offset-4 hover:opacity-80">
            Learn more about our loan products →
          </Link>
        </div>
      </section>
      <section className="bg-lavender px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-surface p-6 shadow-sm sm:p-10">
          <h2 className="text-3xl">Tell me about your deal</h2>
          <p className="mb-8 mt-2 text-muted">It takes about two minutes.</p>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
