"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ContactForm({
  topic = "General enquiry",
  loanTypes,
  signup,
  submitLabel = "Send message",
}: {
  topic?: string;
  loanTypes?: string[];
  signup?: boolean;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return <p className="rounded-lg border border-border bg-surface p-6 text-lg">{state.message}</p>;
  }

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <input type="hidden" name="topic" value={topic} />
      <div className={signup ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
      </div>
      {loanTypes && (
        <>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="loanType" className="text-sm font-medium">Loan type</label>
              <select id="loanType" name="loanType" className={field}>
                {loanTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="text-sm font-medium">Loan amount needed</label>
              <input id="amount" name="amount" inputMode="numeric" placeholder="$" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="text-sm font-medium">Property location</label>
            <input id="location" name="location" placeholder="City, State" className={field} />
          </div>
        </>
      )}
      {!signup && (
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            {loanTypes ? "Tell me about the deal" : "How can I help?"}
          </label>
          <textarea id="message" name="message" required rows={5} className={field} />
        </div>
      )}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600 dark:text-red-400">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
