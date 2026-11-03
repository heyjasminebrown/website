"use server";

import { bookTime, getAvailability, type BookingResult } from "@/lib/booking";

// Remembered in the visitor's browser after they book, so next time they only pick a time.
export type Guest = { firstName: string; lastName: string; phone: string; email: string };

export type BookState =
  | { status: "idle" }
  | { status: "booked"; confirmed: boolean; startsAt: string; guest: Guest }
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
    firstName: get("firstName", 100),
    lastName: get("lastName", 100),
    phone: get("phone"),
    email: get("email"),
  };
  const guest: Guest = { firstName: values.firstName, lastName: values.lastName, phone: values.phone, email: values.email };
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "booked", confirmed: true, startsAt: values.startsAt, guest };

  const fail = (message: string): BookState => ({ status: "error", message, values });
  if (!values.firstName || !values.lastName) return fail("Please enter your first and last name.");
  if (!values.phone || !values.email) return fail("Please enter your phone and email.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return fail("Please enter a valid email.");
  if (values.phone.replace(/\D/g, "").length < 10) return fail("Please enter a full phone number.");
  if (!values.startsAt) return fail("Please pick a time.");

  const result: BookingResult = await bookTime({
    calendar: values.calendar || undefined,
    startsAt: values.startsAt,
    name: `${values.firstName} ${values.lastName}`,
    phone: values.phone,
    email: values.email,
  });
  if (!result.ok) return { status: "error", message: result.error, taken: result.taken, values };
  return {
    status: "booked",
    confirmed: result.confirmed,
    startsAt: result.startsAt,
    guest,
  };
}
