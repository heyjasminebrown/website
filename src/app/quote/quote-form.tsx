"use client";

import { useActionState, useState } from "react";
import { borrowerExperience, experienceNote, isShown, quoteLoanTypes, type QuoteField } from "@/content/quote";
import { sendQuote, type QuoteState } from "./actions";

const initialState: QuoteState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children} {optional && <span className="font-normal text-muted">(optional)</span>}
    </label>
  );
}

function Input({ f, value }: { f: QuoteField; value?: string }) {
  const common = {
    id: f.name,
    name: f.name,
    required: f.required,
    defaultValue: value,
    placeholder: f.placeholder,
    className: field,
  };
  if (f.kind === "textarea") return <textarea rows={3} {...common} />;
  if (f.kind === "radio")
    return (
      <div className="mt-2 flex flex-wrap gap-3">
        {f.options?.map((o) => (
          <label
            key={o}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground"
          >
            <input type="radio" name={f.name} value={o} required={f.required} defaultChecked={value === o} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    );
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
  if (f.kind === "date") return <input type="date" {...common} />;
  return <input inputMode={f.kind === "number" ? "numeric" : undefined} {...common} />;
}

// Written out in full so Tailwind can find these class names.
const COLUMNS: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" };

/** Renders questions in order, putting fields that share a row number side by side. */
function Fields({ fields, values }: { fields: QuoteField[]; values: Record<string, string | undefined> }) {
  const groups: QuoteField[][] = [];
  for (const f of fields) {
    const last = groups.at(-1);
    if (f.row !== undefined && last?.[0].row === f.row) last.push(f);
    else groups.push([f]);
  }
  return groups.map((g) => (
    <div key={g[0].name} className={g.length > 1 ? `grid gap-5 ${COLUMNS[g.length]}` : undefined}>
      {g.map((f) => (
        <div key={f.name} className={f.kind === "radio" ? "" : "flex flex-col justify-end"}>
          {f.kind === "radio" ? (
            <fieldset>
              <legend className="text-sm font-medium">{f.label}</legend>
              <Input f={f} value={values[f.name]} />
            </fieldset>
          ) : (
            <>
              <Label htmlFor={f.name} optional={!f.required}>
                {f.label}
              </Label>
              <Input f={f} value={values[f.name]} />
            </>
          )}
          {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
        </div>
      ))}
    </div>
  ));
}

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(sendQuote, initialState);
  const v = state.values ?? {};
  const [loanType, setLoanType] = useState(v.loanType ?? "");
  // Live answers, so questions that depend on an earlier answer can appear and disappear.
  const [answers, setAnswers] = useState<Record<string, string>>(v);
  const fields = (quoteLoanTypes[loanType] ?? []).filter((f) => isShown(f, answers));

  if (state.status === "success") {
    return <p className="rounded-lg bg-background p-6 text-lg">{state.message}</p>;
  }

  return (
    <form
      action={formAction}
      onChange={(e) => {
        const t = e.target as unknown as HTMLInputElement;
        if (t.name) setAnswers((a) => ({ ...a, [t.name]: t.value }));
      }}
      className="space-y-5"
    >
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

      <fieldset className="space-y-5 border-t border-border pt-6">
        <legend className="sr-only">Borrower experience</legend>
        <p className="font-display text-2xl">Borrower experience</p>
        <Fields fields={borrowerExperience.slice(0, 1)} values={v} />
        <p className="text-sm text-muted">{experienceNote}</p>
        <Fields fields={borrowerExperience.slice(1)} values={v} />
      </fieldset>

      <div className="border-t border-border pt-6">
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
          <legend className="sr-only">{loanType} property information</legend>
          <p className="font-display text-2xl">Property information</p>
          <Fields fields={fields} values={v.loanType === loanType ? v : {}} />
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
