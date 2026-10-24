import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-foreground">{site.name}</p>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            {site.email}
          </a>
        </div>
        <div className="flex gap-10">
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {site.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-foreground" target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
