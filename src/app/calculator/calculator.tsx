"use client";

import { useActionState, useState } from "react";
import { defaultInputs, money, percent, underwrite, type FlipInputs } from "@/lib/flip-calc";
import { sendReport, type ReportState } from "./actions";

type Key = keyof FlipInputs;
type Unit = "$" | "%" | "pts" | "mo";

const sections: { title: string; note?: string; fields: [Key, string, Unit][] }[] = [
  {
    title: "The deal",
    fields: [
      ["resaleValue", "Resale value (per sold comps from the MLS)", "$"],
      ["purchasePrice", "Purchase price", "$"],
      ["renovationCost", "Renovation costs (all in: staging, warranty, architect, etc.)", "$"],
      ["holdMonths", "Holding period (renovation time + days on market + 2 months)", "mo"],
    ],
  },
  {
    title: "First mortgage",
    note: "Percent of purchase + renovation",
    fields: [
      ["firstLtc", "Loan to cost", "%"],
      ["firstRate", "Interest rate (annual)", "%"],
      ["firstPoints", "Points", "pts"],
    ],
  },
  {
    title: "Investor",
    note: "Leave loan to cost at 0% if there's no investor",
    fields: [
      ["secondLtc", "Loan to cost", "%"],
      ["secondRate", "Interest rate (annual)", "%"],
      ["secondPoints", "Points", "pts"],
    ],
  },
  {
    title: "Monthly holding costs",
    fields: [
      ["monthlyTaxes", "Taxes", "$"],
      ["monthlyHoa", "HOA fees", "$"],
      ["monthlyInsurance", "Builder's risk insurance", "$"],
      ["monthlyUtilities", "Utilities", "$"],
    ],
  },
  {
    title: "Closing costs to buy",
    fields: [
      ["buyAttorneyFees", "Attorney fees", "$"],
      ["buyTitlePct", "Title company fees (% of purchase)", "%"],
    ],
  },
  {
    title: "Closing costs to sell",
    fields: [
      ["sellAttorneyFees", "Attorney fees", "$"],
      ["sellTitlePct", "Title company fees (% of resale)", "%"],
      ["realtorPct", "Realtor fees (% of resale)", "%"],
    ],
  },
];

const format = (n: number, unit: Unit) => (unit === "$" ? n.toLocaleString("en-US") : String(n));
const toNumber = (s: string) => {
  const n = Number(s.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const field =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function Calculator() {
  const [raw, setRaw] = useState(() =>
    Object.fromEntries(
      sections.flatMap((s) => s.fields.map(([k, , unit]) => [k, format(defaultInputs[k], unit)])),
    ) as Record<Key, string>,
  );
  const inputs = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, toNumber(v)])) as FlipInputs;
  const r = underwrite(inputs);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {sections.map((s) => (
          <fieldset key={s.title} className="rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
            <legend className="px-1 font-display text-xl">{s.title}</legend>
            {s.note && <p className="mb-4 text-sm text-muted">{s.note}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {s.fields.map(([key, label, unit]) => (
                <label key={key} className="block text-sm">
                  <span className="mb-1 block">{label}</span>
                  <span className="relative block">
                    {unit === "$" && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">$</span>}
                    <input
                      inputMode="decimal"
                      value={raw[key]}
                      onChange={(e) => setRaw({ ...raw, [key]: e.target.value })}
                      onBlur={() => setRaw({ ...raw, [key]: format(toNumber(raw[key]), unit) })}
                      className={`${field} ${unit === "$" ? "pl-7" : ""} ${unit !== "$" ? "pr-12" : ""}`}
                    />
                    {unit !== "$" && (
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
                        {unit === "mo" ? "months" : unit}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-accent p-6 text-blush">
          <p className="text-sm uppercase tracking-wider opacity-80">Projected profit</p>
          <p className={`mt-1 font-display text-5xl ${r.profit < 0 ? "text-red-300" : ""}`}>{money(r.profit)}</p>
          <p className="mt-3 text-lg">
            ROI <span className="font-display text-2xl">{percent(r.roi)}</span>
          </p>
        </div>

        <dl className="divide-y divide-border rounded-2xl border border-border bg-surface text-sm">
          {[
            ["Purchase + renovation", money(r.projectCost)],
            ["Financing (points + interest)", money(r.financingCost)],
            ["First mortgage payment", `${money(r.first.monthlyPayment)}/mo`],
            ...(inputs.secondLtc > 0 ? [["Investor payment", `${money(r.second.monthlyPayment)}/mo`]] : []),
            [`Holding (${money(r.monthlyHolding)}/mo)`, money(r.holdingCost)],
            ["Closing costs to buy", money(r.costToBuy)],
            ["Closing costs to sell", money(r.costToSell)],
            ["Total all-in cost", money(r.totalCost)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-5 py-3">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <ReportForm inputs={inputs} />
      </aside>
    </div>
  );
}

const initialState: ReportState = { status: "idle", message: "" };

function ReportForm({ inputs }: { inputs: FlipInputs }) {
  const [state, formAction, pending] = useActionState(sendReport, initialState);
  const v = state.values ?? {};

  if (state.status === "success") {
    return <p className="rounded-2xl border border-border bg-surface p-6">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
      <div>
        <h2 className="text-2xl">Get your full report</h2>
        <p className="mt-1 text-sm text-muted">
          I&apos;ll email you this analysis and reach out about funding options for your deal.
        </p>
      </div>
      {Object.entries(inputs).map(([k, n]) => (
        <input key={k} type="hidden" name={k} value={n} />
      ))}
      <input name="name" required placeholder="Your name" autoComplete="name" defaultValue={v.name} aria-label="Your name" className={field} />
      <input name="email" type="email" required placeholder="Email" autoComplete="email" defaultValue={v.email} aria-label="Email" className={field} />
      <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" defaultValue={v.phone} aria-label="Phone (optional)" className={field} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="w-full rounded-full bg-accent px-6 py-3 text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me my report"}
      </button>
    </form>
  );
}
