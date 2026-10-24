import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/content/site";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <Section eyebrow="Services" title="Services & pricing">
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.title} service={s} detailed />
        ))}
      </div>
      <p className="mt-10 text-muted">
        Not sure which fits?{" "}
        <Link href="/contact" className="font-medium text-accent underline underline-offset-4">
          Get in touch
        </Link>{" "}
        and we&apos;ll figure it out together.
      </p>
    </Section>
  );
}
