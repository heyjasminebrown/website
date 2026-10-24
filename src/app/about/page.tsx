import type { Metadata } from "next";
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
    </Section>
  );
}
