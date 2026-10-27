import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <div>
          <Link href="/" className="inline-block">
            <Image src="/images/logo.png" alt={site.name} width={1200} height={258} sizes="200px" className="h-9 w-auto" />
          </Link>
          <a href={`mailto:${site.email}`} className="mt-3 block hover:text-foreground">
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
            {site.social.filter((item) => item.href).map((item) => (
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
