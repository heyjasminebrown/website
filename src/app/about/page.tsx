import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { about } from "@/content/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Section eyebrow="About" title={about.heading}>
      <div className="max-w-2xl space-y-4 text-lg text-muted">
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Link
        href="/contact"
        className="mt-10 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90"
      >
        Get in touch
      </Link>
    </Section>
  );
}
