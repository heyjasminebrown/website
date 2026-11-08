import type { Metadata } from "next";
import Image from "next/image";
import { ConferenceForm } from "./conference-form";

// A landing page shared at events; it isn't in the site menu.
export const metadata: Metadata = {
  title: "Meet Me at the Closing Table",
  description:
    "I'm hosting a webinar where we'll underwrite a deal together and I'll answer your coliving questions. Share your information and I'll send you more info.",
  alternates: { canonical: "/conference" },
};

export default function ConferencePage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 pt-10 text-center sm:px-6">
      <Image
        src="/images/Jasmine-Conventus.jpg"
        alt="Jasmine Brown"
        width={819}
        height={771}
        priority
        sizes="224px"
        className="mx-auto aspect-square w-48 rounded-full object-cover object-[56%_40%] sm:w-56"
      />
      <h1 className="mt-8 text-5xl leading-tight sm:text-7xl">Meet Me at the Closing Table</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
        I&apos;m hosting a webinar where we&apos;ll underwrite a deal together and I&apos;ll answer your coliving
        questions. Share your information and I&apos;ll send you more info.
      </p>
      <div className="mt-10 rounded-3xl bg-surface p-6 shadow-sm sm:p-10">
        <ConferenceForm />
      </div>
    </section>
  );
}
