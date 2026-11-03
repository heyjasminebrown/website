"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { BOOKING_TIMEZONE, type Availability, type Slot } from "@/lib/booking";
import { bookCall, loadTimes, type BookState, type Guest } from "./actions";

const initialState: BookState = { status: "idle" };

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

// Every time is shown in Eastern, whatever the visitor's own time zone.
const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: BOOKING_TIMEZONE, ...options }).format(new Date(iso));
const dayKey = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TIMEZONE }).format(new Date(iso));
const timeLabel = (iso: string) => format(iso, { hour: "numeric", minute: "2-digit" });
const fullLabel = (iso: string) =>
  `${format(iso, { weekday: "long", month: "long", day: "numeric" })} at ${timeLabel(iso)} ET`;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

/** The days of a month ("2026-11") as "YYYY-MM-DD" keys, with blanks before the 1st so weeks start on Sunday. */
function monthGrid(month: string) {
  const [y, m] = month.split("-").map(Number);
  const blanks = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [
    ...Array<null>(blanks).fill(null),
    ...Array.from({ length }, (_, i) => `${month}-${pad(i + 1)}`),
  ];
}
const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${month}-01T12:00:00Z`),
  );
const shiftMonth = (month: string, by: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

/** Open times grouped by Eastern calendar day, in order. */
function byDay(slots: Slot[]) {
  const days = new Map<string, Slot[]>();
  for (const s of slots) days.set(dayKey(s.startAt), [...(days.get(dayKey(s.startAt)) ?? []), s]);
  return [...days.entries()];
}

// A returning visitor's details, saved in their browser after they book. Storage can be blocked
// (private windows), so every read and write is allowed to fail.
const GUEST_KEY = "meet:guest";
const readGuest = () => {
  try {
    return localStorage.getItem(GUEST_KEY);
  } catch {
    return null;
  }
};
const saveGuest = (guest: Guest | null) => {
  try {
    if (guest) localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    else localStorage.removeItem(GUEST_KEY);
  } catch {}
};
const subscribe = () => () => {};

function useSavedGuest(): Guest | null {
  const raw = useSyncExternalStore(subscribe, readGuest, () => null);
  return useMemo(() => {
    try {
      const g = raw ? JSON.parse(raw) : null;
      return g?.firstName && g?.phone && g?.email ? (g as Guest) : null;
    } catch {
      return null;
    }
  }, [raw]);
}

function Field({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input id={id} name={id} required className={field} {...props} />
    </div>
  );
}

/** A month calendar of open days, with the picked day's times beside it (below it on phones). */
function DatePicker({
  days,
  day,
  startsAt,
  onDay,
  onTime,
}: {
  days: Map<string, Slot[]>;
  day: string;
  startsAt?: string;
  onDay: (key: string) => void;
  onTime: (iso: string) => void;
}) {
  const keys = [...days.keys()];
  const first = keys[0].slice(0, 7);
  const last = keys[keys.length - 1].slice(0, 7);
  const [month, setMonth] = useState(day.slice(0, 7));
  const today = dayKey(new Date().toISOString());
  const times = days.get(day) ?? [];
  const arrow =
    "grid h-9 w-9 place-items-center rounded-full text-2xl text-accent hover:bg-lavender/40 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent";

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_12rem]">
      <div>
        <div className="flex items-center justify-center gap-6">
          <button type="button" aria-label="Previous month" disabled={month <= first} onClick={() => setMonth(shiftMonth(month, -1))} className={arrow}>
            ‹
          </button>
          <p className="w-40 text-center font-display text-lg" aria-live="polite">
            {monthLabel(month)}
          </p>
          <button type="button" aria-label="Next month" disabled={month >= last} onClick={() => setMonth(shiftMonth(month, 1))} className={arrow}>
            ›
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
          {WEEKDAYS.map((w) => (
            <p key={w} className="pb-2 text-xs font-medium uppercase tracking-wide text-muted">
              {w}
            </p>
          ))}
          {monthGrid(month).map((key, i) => {
            if (!key) return <span key={`blank-${i}`} />;
            const open = days.has(key);
            const picked = key === day;
            const label = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(
              new Date(`${key}T12:00:00Z`),
            );
            return (
              <div key={key} className="relative flex justify-center">
                <button
                  type="button"
                  disabled={!open}
                  aria-pressed={open ? picked : undefined}
                  aria-label={open ? label : `${label}, no open times`}
                  onClick={() => onDay(key)}
                  className={`grid h-11 w-11 place-items-center rounded-full text-base sm:h-12 sm:w-12 ${
                    picked
                      ? "bg-accent font-semibold text-accent-foreground"
                      : open
                        ? "bg-lavender/40 font-semibold text-accent hover:bg-lavender"
                        : "cursor-default text-muted/50"
                  }`}
                >
                  {Number(key.slice(8))}
                </button>
                {key === today && <span aria-hidden className="absolute bottom-0.5 h-1 w-1 rounded-full bg-foreground" />}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-display text-lg">{times[0] && format(times[0].startAt, { weekday: "long", month: "long", day: "numeric" })}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-1">
          {times.map((s) => {
            const picked = s.startAt === startsAt;
            return (
              <button
                key={s.startAt}
                type="button"
                aria-pressed={picked}
                onClick={() => onTime(s.startAt)}
                className={`rounded-lg border py-3 text-center font-semibold ${
                  picked ? "border-accent bg-accent text-accent-foreground" : "border-accent/40 text-accent hover:border-accent"
                }`}
              >
                {timeLabel(s.startAt)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BookingForm({ initial, link }: { initial: Availability; link?: string }) {
  const [availability, setAvailability] = useState(initial);
  const [state, formAction, pending] = useActionState(bookCall, initialState);
  const [day, setDay] = useState<string>();
  const [startsAt, setStartsAt] = useState<string>();
  const [missingTime, setMissingTime] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const saved = useSavedGuest();
  const [forgotten, setForgotten] = useState(false);
  // Returning visitors only confirm their name; their phone and email come from last time.
  const returning = saved && !forgotten ? saved : null;

  // Someone else took the time they picked: show fresh times so they can pick again.
  const taken = state.status === "error" && state.taken;
  useEffect(() => {
    if (!taken) return;
    startRefresh(async () => {
      setAvailability(await loadTimes(link));
      setStartsAt(undefined);
    });
  }, [taken, state, link]);

  // Remember them for next time.
  useEffect(() => {
    if (state.status === "booked" && state.guest.email) saveGuest(state.guest);
  }, [state]);

  if (state.status === "booked") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <p className="font-display text-3xl">{state.confirmed ? "You're booked!" : "Request received"}</p>
        {state.startsAt && <p className="mt-3 text-lg">{fullLabel(state.startsAt)}</p>}
        <p className="mt-3 text-muted">
          {state.confirmed
            ? `A calendar invite with a video link is on its way to ${state.guest.email}, and you'll get a text confirmation.`
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
  const days = new Map(byDay(slots));
  const selectedDay = day && days.has(day) ? day : days.keys().next().value;
  const v = state.status === "error" ? state.values : (returning ?? {});

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

      {!selectedDay ? (
        <p className="mt-8 text-lg">There are no open times right now. Please check back soon.</p>
      ) : (
        <form
          action={formAction}
          onSubmit={(e) => {
            // The time is a hidden field, so the browser can't flag it as missing on its own.
            if (!startsAt) {
              e.preventDefault();
              setMissingTime(true);
            }
          }}
          className="mt-8 space-y-6"
          aria-busy={refreshing}
        >
          <input type="hidden" name="calendar" value={link ?? ""} />
          {/* The picked time is sent from here, which a form reset doesn't clear. */}
          <input type="hidden" name="startsAt" value={startsAt ?? ""} />

          {returning && (
            <p className="text-lg">
              Welcome back, {returning.firstName}!{" "}
              <button
                type="button"
                onClick={() => {
                  saveGuest(null);
                  setForgotten(true);
                }}
                className="text-sm text-accent underline underline-offset-4"
              >
                Not you?
              </button>
            </p>
          )}
          {/* key: switching between returning and new visitor starts the fields fresh. */}
          <div key={returning ? "returning" : "new"} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="firstName" label="First Name" autoComplete="given-name" defaultValue={v.firstName} />
              <Field id="lastName" label="Last Name" autoComplete="family-name" defaultValue={v.lastName} />
            </div>
            {returning ? (
              <>
                <input type="hidden" name="phone" value={returning.phone} />
                <input type="hidden" name="email" value={returning.email} />
              </>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="phone" label="Phone" type="tel" autoComplete="tel" defaultValue={v.phone} />
                <Field id="email" label="Email" type="email" autoComplete="email" defaultValue={v.email} />
              </div>
            )}
          </div>

          <fieldset>
            <legend className="mb-4 text-sm font-medium">Pick a date</legend>
            <DatePicker
              days={days}
              day={selectedDay}
              startsAt={startsAt}
              onDay={(key) => {
                setDay(key);
                setStartsAt(undefined);
              }}
              onTime={(iso) => {
                setStartsAt(iso);
                setMissingTime(false);
              }}
            />
          </fieldset>

          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:gap-6">
            <button
              disabled={pending}
              className="rounded-full bg-accent px-7 py-3 text-accent-foreground hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Booking…" : "Book my call"}
            </button>
            {startsAt && <p className="text-muted">{fullLabel(startsAt)}</p>}
          </div>
          <p aria-live="polite" className="text-sm text-red-600">
            {missingTime ? "Please pick a time." : state.status === "error" && state.message}
            {refreshing && " Loading the latest open times…"}
          </p>
        </form>
      )}
    </div>
  );
}
