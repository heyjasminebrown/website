import type { Metadata } from "next";
import { BookingEmbed } from "./booking-embed";

export const metadata: Metadata = {
  title: "Book a Call with Jasmine Brown",
  description: "Pick a time that works for you and book a call with Jasmine Brown.",
  alternates: { canonical: "/meet" },
};

// The calendar itself lives in Jasmine's CRM (it checks her real Google
// Calendar and books instantly). /meet/<calendar> is rewritten here in
// next.config.ts; the embed reads which calendar from the address.
export default function MeetPage() {
  return (
    <section className="bg-lavender px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl leading-tight sm:text-5xl">Let&apos;s talk</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
            Pick a time that works for you. You&apos;ll get a calendar invite with a video link right away.
          </p>
        </div>
        <div className="mt-8 rounded-3xl bg-surface p-2 shadow-sm sm:p-6">
          <BookingEmbed />
        </div>
      </div>
    </section>
  );
}
