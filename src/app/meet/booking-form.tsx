"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { BOOKING_TIMEZONE, type Availability, type Slot } from "@/lib/booking";
import { bookCall, loadTimes, type BookState } from "./actions";

const initialState: BookState = { status: "idle" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";
// Highlighted from the picked state rather than :checked, because the browser unticks radios when a
// form resets after an error.
const pill = (picked: boolean) =>
  `cursor-pointer rounded-full border px-4 py-2 text-sm hover:border-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${
    picked ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface"
  }`;

// Every time is shown in Eastern, whatever the visitor's own time zone.
const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: BOOKING_TIMEZONE, ...options }).format(new Date(iso));
const dayKey = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TIMEZONE }).format(new Date(iso));
const dayLabel = (iso: string) => format(iso, { weekday: "short", month: "short", day: "numeric" });
const timeLabel = (iso: string) => format(iso, { hour: "numeric", minute: "2-digit" });
const fullLabel = (iso: string) =>
  `${format(iso, { weekday: "long", month: "long", day: "numeric" })} at ${timeLabel(iso)} ET`;

/** Open times grouped by Eastern calendar day, in order. */
function byDay(slots: Slot[]) {
  const days = new Map<string, Slot[]>();
  for (const s of slots) days.set(dayKey(s.startAt), [...(days.get(dayKey(s.startAt)) ?? []), s]);
  return [...days.entries()];
}

export function BookingForm({ initial, link }: { initial: Availability; link?: string }) {
  const [availability, setAvailability] = useState(initial);
  const [state, formAction, pending] = useActionState(bookCall, initialState);
  const [day, setDay] = useState<string>();
  const [startsAt, setStartsAt] = useState<string>();
  const [refreshing, startRefresh] = useTransition();

  // Someone else took the time they picked: show fresh times so they can pick again.
  const taken = state.status === "error" && state.taken;
  useEffect(() => {
    if (!taken) return;
    startRefresh(async () => {
      setAvailability(await loadTimes(link));
      setStartsAt(undefined);
    });
  }, [taken, state, link]);

  if (state.status === "booked") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <p className="font-display text-3xl">{state.confirmed ? "You're booked!" : "Request received"}</p>
        {state.startsAt && <p className="mt-3 text-lg">{fullLabel(state.startsAt)}</p>}
        <p className="mt-3 text-muted">
          {state.confirmed
            ? `A calendar invite with a video link is on its way to ${state.email}, and you'll get a text confirmation.`
            : "Jasmine will confirm your time shortly."}
        </p>
        {state.meetLink && (
          <a href={state.meetLink} className="mt-6 inline-block text-accent underline underline-offset-4">
            Video link for our call
          </a>
        )}
      </div>
    );
  }

  if (!availability.ok) {
    return <p className="rounded-2xl border border-border bg-surface p-6 text-lg sm:p-10">{availability.error}</p>;
  }

  const { calendar, calendars, slots } = availability;
  const days = byDay(slots);
  const selectedDay = days.find(([key]) => key === day) ?? days[0];
  const v = state.status === "error" ? state.values : {};

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
      {/* /meet offers every calendar when there's more than one. */}
      {!link && calendars.length > 1 && (
        <nav aria-label="Type of call" className="mb-8 flex flex-wrap gap-3">
          {calendars.map((c) => (
            <Link
              key={c.slug}
              href={`/meet/${c.slug}`}
              aria-current={c.slug === calendar.slug ? "page" : undefined}
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-accent aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      <h2 className="text-2xl">{calendar.name}</h2>
      <p className="mt-1 text-muted">
        {calendar.durationMinutes} minutes · Video call · All times Eastern (ET)
      </p>
      {calendar.description && <p className="mt-3">{calendar.description}</p>}

      {days.length === 0 ? (
        <p className="mt-8 text-lg">There are no open times right now. Please check back soon.</p>
      ) : (
        <form action={formAction} className="mt-8 space-y-8" aria-busy={refreshing}>
          <input type="hidden" name="calendar" value={link ?? ""} />
          {/* The picked time is sent from here, which a form reset doesn't clear. */}
          <input type="hidden" name="startsAt" value={startsAt ?? ""} />

          <fieldset>
            <legend className="text-sm font-medium">Pick a day</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {days.map(([key, daySlots]) => (
                <label key={key} className={pill(key === selectedDay[0])}>
                  <input
                    type="radio"
                    name="pickDay"
                    checked={key === selectedDay[0]}
                    onChange={() => {
                      setDay(key);
                      setStartsAt(undefined);
                    }}
                    className="sr-only"
                  />
                  {dayLabel(daySlots[0].startAt)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium">Pick a time on {dayLabel(selectedDay[1][0].startAt)}</legend>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {selectedDay[1].map((s) => (
                <label key={s.startAt} className={`${pill(s.startAt === startsAt)} text-center`}>
                  <input
                    type="radio"
                    name="pickTime"
                    checked={s.startAt === startsAt}
                    onChange={() => setStartsAt(s.startAt)}
                    className="sr-only"
                  />
                  {timeLabel(s.startAt)}
                </label>
              ))}
            </div>
          </fieldset>

          {startsAt && (
            <fieldset className="space-y-5 border-t border-border pt-8">
              <legend className="sr-only">Your details</legend>
              <p className="font-display text-xl">{fullLabel(startsAt)}</p>
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input id="name" name="name" required autoComplete="name" defaultValue={v.name} className={field} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} className={field} />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email} className={field} />
                </div>
              </div>
              <div>
                <label htmlFor="topic" className="text-sm font-medium">
                  What would you like to talk about? <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea id="topic" name="topic" rows={3} maxLength={2000} defaultValue={v.topic} className={field} />
              </div>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <button
                disabled={pending}
                className="rounded-full bg-accent px-7 py-3 text-accent-foreground hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Booking…" : "Book this time"}
              </button>
            </fieldset>
          )}

          <p aria-live="polite" className="text-sm text-red-600">
            {state.status === "error" && state.message}
            {refreshing && " Loading the latest open times…"}
          </p>
        </form>
      )}
    </div>
  );
}
