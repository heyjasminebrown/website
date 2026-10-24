import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ContactForm } from "@/app/contact/contact-form";
import { newsletter } from "@/content/site";

export const metadata: Metadata = { title: `${newsletter.name} Newsletter`, description: newsletter.intro };

export default function SubscribePage() {
  return (
    <Section eyebrow={newsletter.tagline} title={`${newsletter.name} Newsletter`}>
      <p className="mb-8 max-w-xl text-lg text-muted">{newsletter.intro}</p>
      <ContactForm topic="Newsletter" signup submitLabel="Subscribe" />
    </Section>
  );
}
