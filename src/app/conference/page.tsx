import type { Metadata } from "next";
import Image from "next/image";
import { ConferenceForm } from "./conference-form";

// A landing page shared at events; it isn't in the site menu.
export const metadata: Metadata = {
  title: "Meet Me at the Closing Table",
  description: "Join my free webinar where we'll underwrite deals together and answer investing questions.",
  alternates: { canonical: "/conference" },
};

export default function ConferencePage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 pt-10 text-center sm:px-6">
      <Image
        src="/images/Jasmine-Headshot.jpg"
        alt="Jasmine Brown"
        width={800}
        height={800}
        priority
        sizes="224px"
        className="mx-auto w-48 rounded-full sm:w-56"
      />
      <h1 className="mt-8 text-5xl leading-tight sm:text-7xl">Meet Me at the Closing Table</h1>
      <p className="mt-4 font-display text-2xl sm:text-3xl">Free Webinar Series</p>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
        Join my free webinar where we&apos;ll underwrite deals together and answer investing questions.
      </p>
      <div className="mt-10 rounded-3xl bg-surface p-6 shadow-sm sm:p-10">
        <ConferenceForm />
      </div>
    </section>
  );
}
