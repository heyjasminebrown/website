import type { Metadata } from "next";
import { InterestOnlyCalculator } from "./interest-only-calculator";

export const metadata: Metadata = {
  title: "Free Interest Only Payment Calculator",
  alternates: { canonical: "/calculator-interest-only" },
  description:
    "Enter your loan amount and interest rate to see your monthly payment on an interest-only loan.",
};

export default function InterestOnlyCalculatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-muted">Free tool</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Interest Only Payment Calculator</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Enter your loan amount and interest rate to see your monthly payment on an interest-only loan.
      </p>
      <div className="mt-12">
        <InterestOnlyCalculator />
      </div>
      <p className="mt-12 max-w-3xl text-xs text-muted">
        This calculator provides estimates for illustration only. Results depend on the information you enter and are
        not a loan offer, commitment to lend, or financial advice. Taxes, insurance and fees are not included.
      </p>
    </section>
  );
}
