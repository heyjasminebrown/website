import { rehabCategories } from "@/content/lead-magnets";
import { FillLine, GuideShell, guideMetadata } from "../guide-shell";

export const metadata = guideMetadata("rehab-budget");

export default function RehabBudgetGuide() {
  return (
    <GuideShell
      slug="rehab-budget"
      intro="Fill in your own estimate for each line, then compare it with your contractors' quotes. Skip anything the property doesn't need."
    >
      <div className="flex justify-end gap-3 text-xs font-medium uppercase tracking-wider text-muted">
        <span className="w-24">Your estimate</span>
        <span className="w-24">Quote 1</span>
        <span className="w-24">Quote 2</span>
      </div>
      {rehabCategories.map((c) => (
        <section key={c.heading} className="break-inside-avoid !mt-6">
          <h2 className="text-xl">{c.heading}</h2>
          <div className="mt-2">
            {c.lines.map((line) => (
              <FillLine key={line} label={line} columns={3} />
            ))}
          </div>
        </section>
      ))}
      <section className="break-inside-avoid">
        <h2 className="text-xl">Totals</h2>
        <div className="mt-2">
          <FillLine label="Subtotal" columns={3} />
          <FillLine label="Contingency (10–15% of subtotal)" columns={3} />
          <FillLine label="Total rehab budget" columns={3} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Tip: older homes and anything touching the roof, foundation or systems deserve the higher end of your
          contingency. Plug your total into the Fix &amp; Flip Calculator to see how it affects your profit.
        </p>
      </section>
    </GuideShell>
  );
}
