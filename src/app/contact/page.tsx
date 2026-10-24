import type { Metadata } from "next";
import { Section } from "@/components/section";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section eyebrow="Contact" title="Let's talk">
      <p className="mb-8 max-w-xl text-muted">
        Fill in the form, or email{" "}
        <a href={`mailto:${site.email}`} className="font-medium text-accent underline underline-offset-4">
          {site.email}
        </a>
        . I reply within two business days.
      </p>
      <ContactForm />
    </Section>
  );
}
