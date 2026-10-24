import { flipChecklist } from "@/content/lead-magnets";
import { GuideShell, guideMetadata } from "../guide-shell";

export const metadata = guideMetadata("flip-checklist");

export default function FlipChecklistGuide() {
  return (
    <GuideShell
      slug="flip-checklist"
      intro="Run every deal through this list, from the first walkthrough to the closing table. Tick each box as you go."
    >
      {flipChecklist.map((section) => (
        <section key={section.heading} className="break-inside-avoid">
          <h2 className="text-2xl">{section.heading}</h2>
          <ul className="mt-4 space-y-3">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded border border-muted" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </GuideShell>
  );
}
