// Talks to Jasmine's CRM, which checks her calendars and books calls (see the CRM's docs/BOOKING-API.md).
// Calls are made from this site's server, so the CRM's browser allow-list doesn't apply.

// Vercel keeps quotes pasted around a value, which would break the URL.
const env = (key: string) => process.env[key]?.trim().replace(/^["']|["']$/g, "") || undefined;

// BOOKING_API_URL is only for testing against a stand-in CRM.
const crm = () => (env("BOOKING_API_URL") ?? "https://www.calljasminebrown.com").replace(/\/+$/, "");

// Her calendar is in Eastern time, so every time on the page is shown in Eastern.
export const BOOKING_TIMEZONE = "America/New_York";

export type BookingCalendar = { slug: string; name: string; description: string | null; durationMinutes: number };
export type Slot = { startAt: string; endAt: string };
export type Availability =
  | { ok: true; calendar: BookingCalendar; calendars: BookingCalendar[]; slots: Slot[] }
  | { ok: false; error: string };

export type BookingRequest = {
  calendar?: string;
  startsAt: string;
  name: string;
  phone: string;
  email: string;
};
export type BookingResult =
  | { ok: true; confirmed: boolean; startsAt: string; endsAt?: string }
  | { ok: false; error: string; taken?: boolean };

const unreachable = "The calendar is unavailable right now. Please try again in a few minutes.";

/** Open times for a calendar (her main calendar when no link is given). Never throws. */
export async function getAvailability(calendar?: string): Promise<Availability> {
  const query = calendar ? `?calendar=${encodeURIComponent(calendar)}` : "";
  try {
    const res = await fetch(`${crm()}/api/booking/availability${query}`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (data?.ok) return { ok: true, calendar: data.calendar, calendars: data.calendars ?? [], slots: data.slots ?? [] };
    console.error("[booking] Availability error", res.status, data);
    return { ok: false, error: data?.error ?? unreachable };
  } catch (err) {
    console.error("[booking] Could not reach the CRM", err);
    return { ok: false, error: unreachable };
  }
}

/** Books a time. The CRM's errors are already written for the visitor. Never throws. */
export async function bookTime(request: BookingRequest): Promise<BookingResult> {
  try {
    const res = await fetch(`${crm()}/api/booking/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `website` is the CRM's honeypot; real visitors always send it empty.
      body: JSON.stringify({ ...request, source: "Website", website: "" }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (data?.ok) {
      return {
        ok: true,
        confirmed: data.confirmed === true,
        startsAt: data.startsAt ?? request.startsAt,
        endsAt: data.endsAt,
      };
    }
    console.error("[booking] Booking error", res.status, data);
    return { ok: false, error: data?.error ?? unreachable, taken: data?.taken === true };
  } catch (err) {
    console.error("[booking] Could not reach the CRM", err);
    return { ok: false, error: unreachable };
  }
}
