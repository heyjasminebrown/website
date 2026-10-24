import type { Metadata } from "next";
import { Section } from "@/components/section";
import { events } from "@/content/site";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <Section eyebrow="Events" title="Where to find me">
      <ul className="space-y-6">
        {events.map((e) => (
          <li key={e.title} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent">
                {e.date} · {e.location}
              </p>
              <h2 className="mt-1 text-xl">{e.title}</h2>
              <p className="mt-1 text-muted">{e.summary}</p>
            </div>
            {e.link && (
              <a
                href={e.link}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-center font-medium text-accent-foreground hover:opacity-90"
              >
                Details
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
