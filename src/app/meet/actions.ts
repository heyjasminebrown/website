"use server";

import { bookTime, getAvailability, type BookingResult } from "@/lib/booking";

export type BookState =
  | { status: "idle" }
  | { status: "booked"; confirmed: boolean; startsAt: string; email: string; meetLink?: string | null }
  | { status: "error"; message: string; taken?: boolean; values: Record<string, string> };

/** Fresh open times, e.g. after someone else took the time a visitor picked. */
export async function loadTimes(calendar?: string) {
  return getAvailability(calendar);
}

export async function bookCall(_prev: BookState, formData: FormData): Promise<BookState> {
  const get = (key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);
  const values = {
    calendar: get("calendar"),
    startsAt: get("startsAt"),
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    topic: get("topic", 2000),
  };
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) {
    return { status: "booked", confirmed: true, startsAt: values.startsAt, email: values.email };
  }

  const fail = (message: string): BookState => ({ status: "error", message, values });
  if (!values.startsAt) return fail("Please pick a time.");
  if (!values.name || !values.phone || !values.email) return fail("Please enter your name, phone and email.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return fail("Please enter a valid email.");
  if (values.phone.replace(/\D/g, "").length < 10) return fail("Please enter a full phone number.");

  const result: BookingResult = await bookTime({
    calendar: values.calendar || undefined,
    startsAt: values.startsAt,
    name: values.name,
    phone: values.phone,
    email: values.email,
    topic: values.topic || undefined,
  });
  if (!result.ok) return { status: "error", message: result.error, taken: result.taken, values };
  return {
    status: "booked",
    confirmed: result.confirmed,
    startsAt: result.startsAt,
    email: values.email,
    meetLink: result.meetLink,
  };
}
