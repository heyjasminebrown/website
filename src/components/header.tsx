import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={1200}
            height={258}
            priority
            sizes="200px"
            className="h-9 w-auto sm:h-10"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm">
            Menu
          </summary>
          <nav className="absolute right-0 z-10 mt-2 flex w-44 flex-col rounded-lg border border-border bg-surface p-2 shadow-lg">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm hover:bg-background">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
