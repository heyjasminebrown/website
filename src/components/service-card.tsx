import type { services } from "@/content/site";

export function ServiceCard({ service, detailed }: { service: (typeof services)[number]; detailed?: boolean }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 text-muted">{service.summary}</p>
      {detailed && (
        <ul className="mt-4 space-y-2 text-sm">
          {service.details.map((d) => (
            <li key={d} className="flex gap-2">
              <span aria-hidden className="text-accent">✓</span>
              {d}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-auto pt-6 font-medium">{service.price}</p>
    </div>
  );
}
