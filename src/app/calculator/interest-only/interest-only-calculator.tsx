"use client";

import { useState } from "react";
import { money } from "@/lib/flip-calc";

type Key = "loanAmount" | "rate";

const fields: [Key, string, "$" | "%"][] = [
  ["loanAmount", "Loan amount", "$"],
  ["rate", "Interest rate", "%"],
];

const toNumber = (s: string) => {
  const n = Number(s.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const cents = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const field =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function InterestOnlyCalculator() {
  const [raw, setRaw] = useState<Record<Key, string>>({ loanAmount: "", rate: "" });
  const loanAmount = toNumber(raw.loanAmount);
  const rate = toNumber(raw.rate);
  // Interest only: each month's payment is a twelfth of a year's interest on the full loan.
  const payment = (loanAmount * rate) / 100 / 12;

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
                  onBlur={() =>
                    raw[key].trim() &&
                    setRaw({ ...raw, [key]: unit === "$" ? toNumber(raw[key]).toLocaleString("en-US") : String(toNumber(raw[key])) })
                  }
                  className={`${field} ${unit === "$" ? "pl-7" : "pr-10"}`}
                />
                {unit === "%" && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">%</span>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <aside className="rounded-2xl bg-accent p-6 text-blush lg:sticky lg:top-6 lg:self-start">
        <p className="text-sm uppercase tracking-wider opacity-80">Monthly interest-only payment</p>
        {payment > 0 ? (
          <>
            <p className="mt-1 font-display text-5xl">
              {cents(payment)}
              <span className="text-2xl">/mo</span>
            </p>
            <p className="mt-3 text-sm opacity-80">
              {money(loanAmount)} × {rate}% ÷ 12 months
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg">Enter your loan amount and interest rate to see your monthly payment.</p>
        )}
      </aside>
    </div>
  );
}
