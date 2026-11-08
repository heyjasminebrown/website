"use client";

import { useActionState } from "react";
import { joinConference, type ConferenceState } from "./actions";

const initialState: ConferenceState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ConferenceForm() {
  const [state, formAction, pending] = useActionState(joinConference, initialState);
  const v = state.values ?? {};

  return (
    <form action={formAction} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" defaultValue={v.firstName} className={field} />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input id="lastName" name="lastName" required autoComplete="family-name" defaultValue={v.lastName} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email} className={field} />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="w-full rounded-full bg-accent px-7 py-4 text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Sign Up"}
      </button>
    </form>
  );
}
