import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content/site";
import { ConferenceForm } from "./conference-form";

const aboutMe = [
  "I specialize in financing fix-and-flips, new construction, rental properties, and multifamily investments nationwide. My approach is simple: understand the deal, find the right financing solution, and help investors move forward with confidence.",
  "As a real estate investor myself, I know there’s a lot that goes into bringing a project to life. I understand the challenges, the opportunities, and how important it is to have the right financing partner in your corner. For me, it’s about more than funding deals. It’s about helping investors build wealth, grow their portfolios, and make a meaningful impact in the communities where they invest.",
  "You’ve got the vision. Let me help you secure the financing to bring it to life.",
];

// A landing page shared at events; it isn't in the site menu.
export const metadata: Metadata = {
  title: "Meet Me at the Closing Table",
  description: "Join my free webinar where we'll underwrite deals together and answer investing questions.",
  alternates: { canonical: "/conference" },
};

export default function ConferencePage() {
  return (
    <>
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
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
          Join my free webinar where we&apos;ll underwrite deals together and answer investing questions.
        </p>
        <div className="mt-10 rounded-3xl bg-surface p-6 shadow-sm sm:p-10">
          <ConferenceForm />
        </div>
      </section>

      {/* Styled like the about section on the home page. */}
      <section className="bg-accent px-4 py-24 text-blush sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mx-auto max-w-md text-5xl leading-tight sm:text-7xl">{about.heading}</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {aboutMe.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
