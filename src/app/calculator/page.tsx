import type { Metadata } from "next";
import { Calculator } from "./calculator";

export const metadata: Metadata = {
  title: "Fix & Flip Calculator",
  description:
    "Underwrite your next fix and flip in minutes. Enter the purchase price, rehab budget and ARV to see projected profit and ROI.",
};

export default function CalculatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-muted">Free tool</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Fix &amp; Flip Calculator</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Underwrite your next flip in minutes. Plug in your numbers and see your projected profit and ROI
        instantly, then get the full analysis sent to your inbox.
      </p>
      <div className="mt-12">
        <Calculator />
      </div>
      <p className="mt-12 max-w-3xl text-xs text-muted">
        This calculator provides estimates for illustration only. Results depend on the information you enter and are
        not a loan offer, commitment to lend, or financial advice. Interest is calculated on the full loan amount for
        the full holding period.
      </p>
    </section>
  );
}
