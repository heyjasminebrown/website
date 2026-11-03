import type { Metadata } from "next";
import { Section } from "@/components/section";
import { BookingEmbed } from "./booking-embed";

export const metadata: Metadata = {
  title: "Book a Call with Jasmine Brown",
  description:
    "Book a call with Jasmine Brown, real estate investor and private lending relationship manager. Pick a time that works for you and get a calendar invite with a video link right away.",
  alternates: { canonical: "/meet" },
};

// The calendar itself lives in Jasmine's CRM (it checks her real Google
// Calendar and books instantly). /meet/<calendar> is rewritten here in
// next.config.ts; the embed reads which calendar from the address, and every
// calendar shares the /meet canonical so search engines see one page.
export default function MeetPage() {
  return (
    <Section main eyebrow="Book a Call" title="Let's talk">
      <p className="-mt-4 max-w-2xl text-lg text-muted">
        Pick a time that works for you. You&apos;ll get a calendar invite with a video link right away.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-2 sm:p-6">
        <BookingEmbed />
      </div>
    </Section>
  );
}
