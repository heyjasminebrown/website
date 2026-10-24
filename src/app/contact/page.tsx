import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/section";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jasmine Brown about funding your next real estate deal, a money makeover or working together.",
  alternates: { canonical: "/contact" },
};

async function TopicForm({ searchParams }: { searchParams: PageProps<"/contact">["searchParams"] }) {
  const { topic } = await searchParams;
  return <ContactForm topic={typeof topic === "string" ? topic.slice(0, 100) : undefined} />;
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <Section eyebrow="Contact" title="Let's talk">
      <p className="mb-8 max-w-xl text-muted">
        Fill in the form, or email{" "}
        <a href={`mailto:${site.email}`} className="font-medium text-accent underline underline-offset-4">
          {site.email}
        </a>
        .
      </p>
      <Suspense fallback={<ContactForm />}>
        <TopicForm searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}
