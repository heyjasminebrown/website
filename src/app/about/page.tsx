import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About Jasmine Brown",
  description:
    "From a decade with Fortune 500 companies to real estate investing: meet Jasmine Brown, who helps Atlanta investors and small businesses grow.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="bg-accent px-4 py-24 text-blush sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mx-auto max-w-md text-5xl leading-tight sm:text-7xl">{about.heading}</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link
          href="/loan"
          className="mt-10 inline-block rounded-full bg-blush px-8 py-4 text-accent hover:opacity-90"
        >
          Work with me
        </Link>
      </div>
    </section>
  );
}
