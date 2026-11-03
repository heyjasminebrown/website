import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAvailability } from "@/lib/booking";
import { BookingForm } from "../booking-form";

export const metadata: Metadata = {
  title: "Book a Call with Jasmine Brown",
  description:
    "Book a call with Jasmine Brown, real estate investor and private lending relationship manager. Pick a time that works for you, and she'll give you a call at your scheduled time.",
  // Every calendar link shares one address for search engines.
  alternates: { canonical: "/meet" },
};

// /meet shows her main calendar; /meet/<link> shows that calendar. Open times come from her CRM
// (see src/lib/booking.ts) fresh on every visit.
async function Booking({ params }: { params: PageProps<"/meet/[[...calendar]]">["params"] }) {
  const { calendar } = await params;
  if (calendar && calendar.length > 1) notFound();
  const link = calendar?.[0]?.toLowerCase();
  // Open times are always fetched for the visitor, never while the page is prebuilt.
  await connection();
  // A paused or unknown calendar shows the CRM's message instead of the times.
  const availability = await getAvailability(link);
  return <BookingForm key={link ?? ""} initial={availability} link={link} />;
}

export default function MeetPage({ params }: PageProps<"/meet/[[...calendar]]">) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* The form says it all, so the page's main heading is only for search engines and screen readers. */}
      <h1 className="sr-only">Book a Call with Jasmine Brown</h1>
      <Suspense
        fallback={
          <p className="rounded-2xl border border-border bg-surface p-6 text-muted sm:p-10" aria-busy="true">
            Loading open times…
          </p>
        }
      >
        <Booking params={params} />
      </Suspense>
    </section>
  );
}
