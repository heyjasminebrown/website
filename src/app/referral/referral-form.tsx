"use client";

import { useActionState } from "react";
import { referralLoanTypes } from "@/content/site";
import { sendReferral, type ReferralState } from "./actions";

const initialState: ReferralState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ReferralForm() {
  const [state, formAction, pending] = useActionState(sendReferral, initialState);
  const v = state.values ?? {};

  if (state.status === "success") {
    return <p className="rounded-lg bg-background p-6 text-lg">{state.message}</p>;
  }

  return (
    <form action={formAction} className="max-w-xl space-y-8">
      <div>
        <label htmlFor="referrerName" className="text-sm font-medium">Your First &amp; Last Name</label>
        <input id="referrerName" name="referrerName" required autoComplete="name" defaultValue={v.referrerName} className={field} />
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-2xl">Referral&apos;s Contact Details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
            <input id="firstName" name="firstName" required autoComplete="off" defaultValue={v.firstName} className={field} />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
            <input id="lastName" name="lastName" required autoComplete="off" defaultValue={v.lastName} className={field} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="off" defaultValue={v.email} className={field} />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <input id="phone" name="phone" type="tel" required autoComplete="off" defaultValue={v.phone} className={field} />
        </div>
        <div>
          <label htmlFor="loanType" className="text-sm font-medium">What type of loan are they interested in?</label>
          <select key={v.loanType} id="loanType" name="loanType" required defaultValue={v.loanType ?? ""} className={field}>
            <option value="" disabled>
              Choose a loan type
            </option>
            {referralLoanTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </fieldset>

      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send referral"}
      </button>
    </form>
  );
}
