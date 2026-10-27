"use client";

import { useActionState, useState } from "react";
import { quoteLoanTypes, type QuoteField } from "@/content/quote";
import { sendQuote, type QuoteState } from "./actions";

const initialState: QuoteState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children} {optional && <span className="font-normal text-muted">(optional)</span>}
    </label>
  );
}

function Input({ f, value }: { f: QuoteField; value?: string }) {
  const common = { id: f.name, name: f.name, required: f.required, defaultValue: value, className: field };
  if (f.kind === "textarea") return <textarea rows={4} {...common} />;
  if (f.kind === "select")
    return (
      <select key={value} {...common} defaultValue={value ?? ""}>
        <option value="" disabled>
          Choose one
        </option>
        {f.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  if (f.kind === "money")
    return (
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3 top-1 flex items-center text-muted">$</span>
        <input inputMode="decimal" {...common} className={`${field} pl-7`} />
      </span>
    );
  return <input inputMode={f.kind === "number" ? "decimal" : undefined} {...common} />;
}

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(sendQuote, initialState);
  const v = state.values ?? {};
  const [loanType, setLoanType] = useState(v.loanType ?? "");
  const fields = quoteLoanTypes[loanType] ?? [];

  if (state.status === "success") {
    return <p className="rounded-lg bg-background p-6 text-lg">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <input id="name" name="name" required autoComplete="name" defaultValue={v.name} className={field} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} className={field} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email} className={field} />
        </div>
      </div>
      <div>
        <Label htmlFor="referredBy" optional>
          Did someone refer you? Enter their name
        </Label>
        <input id="referredBy" name="referredBy" defaultValue={v.referredBy} className={field} />
      </div>
      <div>
        <Label htmlFor="loanType">Loan type</Label>
        <select
          id="loanType"
          name="loanType"
          required
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          className={field}
        >
          <option value="" disabled>
            Choose a loan type
          </option>
          {Object.keys(quoteLoanTypes).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {fields.length > 0 && (
        <fieldset key={loanType} className="space-y-5 border-t border-border pt-6">
          <legend className="sr-only">{loanType} details</legend>
          <p className="font-display text-2xl">{loanType} details</p>
          {fields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name} optional={!f.required}>
                {f.label}
              </Label>
              <Input f={f} value={v.loanType === loanType ? v[f.name] : undefined} />
            </div>
          ))}
        </fieldset>
      )}

      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="rounded-full bg-accent px-7 py-3 text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Get my quote"}
      </button>
    </form>
  );
}
