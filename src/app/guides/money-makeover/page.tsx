import { moneyMakeover } from "@/content/lead-magnets";
import { FillLine, GuideShell, guideMetadata } from "../guide-shell";

export const metadata = guideMetadata("money-makeover");

export default function MoneyMakeoverGuide() {
  return (
    <GuideShell
      slug="money-makeover"
      intro="Use last month's bank and card statements to fill this in. Be honest: this is just for you."
    >
      <section className="break-inside-avoid">
        <h2 className="text-2xl">1. Money in (monthly)</h2>
        <div className="mt-2">
          {moneyMakeover.income.map((l) => (
            <FillLine key={l} label={l} />
          ))}
          <FillLine label="Total income" />
        </div>
      </section>
      <section className="break-inside-avoid">
        <h2 className="text-2xl">2. Money out (monthly)</h2>
        <div className="mt-2">
          {moneyMakeover.expenses.map((l) => (
            <FillLine key={l} label={l} />
          ))}
          <FillLine label="Total expenses" />
        </div>
        <p className="mt-4 text-sm text-muted">Income minus expenses is what you have to save and invest each month.</p>
        <div className="mt-2">
          <FillLine label="Left over each month" />
        </div>
      </section>
      <section className="break-inside-avoid">
        <h2 className="text-2xl">3. Your goals</h2>
        <div className="mt-2">
          {moneyMakeover.goals.map((g) => (
            <FillLine key={g} label={g} columns={2} />
          ))}
        </div>
        <p className="mt-2 text-right text-xs text-muted">Target amount &nbsp;·&nbsp; Monthly contribution</p>
      </section>
      <section className="break-inside-avoid">
        <h2 className="text-2xl">4. Your 30-day plan</h2>
        <ul className="mt-4 space-y-3">
          {moneyMakeover.plan.map((p) => (
            <li key={p.week} className="flex gap-3">
              <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded border border-muted" />
              <span>
                <strong>{p.week}:</strong> {p.task}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted">This worksheet is for educational purposes only and is not financial advice.</p>
    </GuideShell>
  );
}
