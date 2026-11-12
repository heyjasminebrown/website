import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { NavDropdown } from "./nav-dropdown";

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
          {nav.map((item) =>
            "children" in item ? (
              <NavDropdown key={item.label} label={item.label} links={item.children} />
            ) : (
              <Link key={item.href} href={item.href} className="text-muted hover:text-foreground">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm">
            Menu
          </summary>
          <nav className="absolute right-0 z-10 mt-2 flex w-64 flex-col rounded-lg border border-border bg-surface p-2 shadow-lg">
            {nav.map((item) =>
              "children" in item ? (
                <div key={item.label}>
                  <p className="px-3 py-2 text-sm text-muted">{item.label}</p>
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block rounded py-2 pl-6 pr-3 text-sm hover:bg-background">
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm hover:bg-background">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}
