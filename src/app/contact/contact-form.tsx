"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return <p className="rounded-lg border border-border bg-surface p-6 text-lg">{state.message}</p>;
  }

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">How can I help?</label>
        <textarea id="message" name="message" required rows={6} className={field} />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p aria-live="polite" className="text-sm text-red-600 dark:text-red-400">
        {state.status === "error" && state.message}
      </p>
      <button
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
