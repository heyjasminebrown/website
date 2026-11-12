"use client";

import { useState } from "react";
import { money } from "@/lib/flip-calc";
import { defaultInterestOnlyInputs, interestOnly, type InterestOnlyInputs } from "@/lib/interest-only-calc";

type Key = keyof InterestOnlyInputs;
type Unit = "$" | "%" | "yr";

const fields: [Key, string, Unit][] = [
  ["loanAmount", "Loan amount", "$"],
  ["rate", "Interest rate", "%"],
  ["termYears", "Loan term", "yr"],
  ["interestOnlyYears", "Interest-only period", "yr"],
];

const format = (n: number, unit: Unit) => (unit === "$" ? n.toLocaleString("en-US") : String(n));
const toNumber = (s: string) => {
  const n = Number(s.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const years = (months: number) => {
  const y = Math.round((months / 12) * 10) / 10;
  return `${y} year${y === 1 ? "" : "s"}`;
};

const field =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function InterestOnlyCalculator() {
  const [raw, setRaw] = useState(
    () =>
      Object.fromEntries(
        fields.map(([k, , unit]) => [k, defaultInterestOnlyInputs[k] ? format(defaultInterestOnlyInputs[k], unit) : ""]),
      ) as Record<Key, string>,
  );
  const inputs = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, toNumber(v)])) as InterestOnlyInputs;
  const r = interestOnly(inputs);
  const ready = inputs.loanAmount > 0 && inputs.rate > 0 && r.termMonths > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <fieldset className="self-start rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
        <legend className="px-1 font-display text-xl">The loan</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([key, label, unit]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block">{label}</span>
              <span className="relative block">
                {unit === "$" && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">$</span>}
                <input
                  inputMode="decimal"
                  value={raw[key]}
                  onChange={(e) => setRaw({ ...raw, [key]: e.target.value })}
                  onBlur={() => raw[key].trim() && setRaw({ ...raw, [key]: format(toNumber(raw[key]), unit) })}
                  className={`${field} ${unit === "$" ? "pl-7" : "pr-14"}`}
                />
                {unit !== "$" && (
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
                    {unit === "yr" ? "years" : unit}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-accent p-6 text-blush">
          <p className="text-sm uppercase tracking-wider opacity-80">Interest-only payment</p>
          {ready ? (
            <>
              <p className="mt-1 font-display text-5xl">
                {money(r.ioPayment)}
                <span className="text-2xl">/mo</span>
              </p>
              <p className="mt-3 text-lg">
                {r.ioMonths === r.termMonths ? "For the full loan term" : `For the first ${years(r.ioMonths)}`}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg">Enter your loan amount and interest rate to see your monthly payment.</p>
          )}
        </div>

        {ready && (
          <dl className="divide-y divide-border rounded-2xl border border-border bg-surface text-sm">
            {[
              r.remainingMonths
                ? [`Payment after the interest-only period (${years(r.remainingMonths)})`, `${money(r.laterPayment)}/mo`]
                : ["Balance due at the end of the loan", money(r.balloon)],
              ["Interest paid during the interest-only period", money(r.ioInterest)],
              ["Total interest over the loan", money(r.totalInterest)],
              ["Fully amortizing payment, for comparison", `${money(r.fullyAmortizing)}/mo`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </aside>
    </div>
  );
}
