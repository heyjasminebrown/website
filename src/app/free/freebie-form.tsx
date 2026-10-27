"use client";

import Link from "next/link";
import { useActionState } from "react";
import { newsletter } from "@/content/site";
import { claimFreebie, type FreebieState } from "./actions";

const initialState: FreebieState = { status: "idle", message: "" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function FreebieForm({
  slug,
  submitLabel,
  askPhone,
  hidden = {},
  heading,
  intro,
  afterForm,
}: {
  slug: string;
  heading: string;
  intro: string;
  // Shown under the form until it's submitted, e.g. a link back to the quiz.
  afterForm?: React.ReactNode;
  submitLabel: string;
  askPhone?: boolean;
  // Extra answers sent with the form, e.g. the quiz responses.
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(claimFreebie, initialState);
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div aria-live="polite">
        {state.quiz && (
          <>
            <p className="text-sm font-medium uppercase tracking-wider text-muted">Your score</p>
            <p className="mt-1 font-display text-6xl">
              {state.quiz.score}
              <span className="text-2xl text-muted">/100</span>
            </p>
            <h3 className="mt-4 text-2xl">{state.quiz.label}</h3>
            <p className="mt-2 text-muted">{state.quiz.summary}</p>
            <h4 className="mt-6 font-bold">Your next steps</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {state.quiz.nextSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <Link
              href="/quote"
              className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
            >
              Talk to me about funding
            </Link>
          </>
        )}
        <p className={state.quiz ? "mt-6 text-sm text-muted" : "text-lg"}>{state.message}</p>
        {state.guidePath && (
          <Link
            href={state.guidePath}
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
          >
            Open it now
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl">{heading}</h2>
      <p className="mb-6 mt-2 text-muted">{intro}</p>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="slug" value={slug} />
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input id="name" name="name" defaultValue={v.name} required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              defaultValue={v.email}
              type="email"
              required
              autoComplete="email"
              className={field}
            />
          </div>
        </div>
        {askPhone && (
          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Phone <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="phone" name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" className={field} />
            <p className="mt-1 text-xs text-muted">
              If you share your number, I may call or text you about your results. Message and data rates may apply.
              Reply STOP to opt out.
            </p>
          </div>
        )}
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="newsletter"
            defaultChecked={v.newsletter === "on"}
            className="mt-1 accent-accent"
          />
          <span>
            Also send me the {newsletter.name} newsletter: {newsletter.intro.toLowerCase()} Unsubscribe anytime.
          </span>
        </label>
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
      {afterForm}
    </>
  );
}
