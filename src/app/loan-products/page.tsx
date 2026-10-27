import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lender, productRows, products, relationshipManager } from "@/content/loan-products";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Loan Products",
  description:
    "Bridge, bridge + rehab, ground-up construction and DSCR loans from a direct lender with $10B+ funded. Rates, terms, leverage and credit requirements.",
  alternates: { canonical: "/loan-products" },
};

function Quote({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/quote"
      className={`inline-block rounded-full px-7 py-3 text-center transition-opacity hover:opacity-90 ${
        light ? "bg-blush text-accent" : "bg-accent text-accent-foreground"
      } ${className}`}
    >
      Get a Quote
    </Link>
  );
}

const List = ({ items }: { items: string[] }) =>
  items.length === 1 ? (
    <p>{items[0]}</p>
  ) : (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );

/** Simple house mark for the Equal Housing Lender notice. */
const HouseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M9 13h6M9 16h6" />
  </svg>
);

export default function LoanProductsPage() {
  return (
    <>
      <section className="bg-accent px-4 py-16 text-blush sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] opacity-80">Direct lender</p>
          <h1 className="mt-3 text-5xl leading-tight sm:text-7xl">Loan Products</h1>
          <p className="mt-6 max-w-2xl text-lg">
            Bridge, rehab, ground-up construction and DSCR loans for real estate investors, straight from a direct
            lender.
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-10">
            {lender.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl sm:text-6xl">{s.value}</p>
                <p className="mt-1 text-sm uppercase tracking-wider opacity-80">{s.label}</p>
              </div>
            ))}
            <Quote light className="ml-auto" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-4xl">Loan programs</h2>

        {/* Comparison table on larger screens */}
        <div className="mt-10 hidden overflow-hidden rounded-3xl border border-border bg-surface lg:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-accent text-blush">
                <th className="w-40 p-4" />
                {products.map((p) => (
                  <th key={p.name} className="p-4 text-left font-display text-xl font-normal">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productRows.map((row) => (
                <tr key={row} className="border-t border-border align-top">
                  <th className="p-4 text-left font-display text-lg font-normal text-accent">{row}</th>
                  {products.map((p) => (
                    <td key={p.name} className="p-4 text-muted">
                      <List items={p[row]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* One card per product on phones and tablets */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
          {products.map((p) => (
            <article key={p.name} className="overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="bg-accent px-6 py-5 text-blush">
                <h3 className="text-2xl">{p.name}</h3>
              </div>
              <dl className="divide-y divide-border px-6 text-sm">
                {productRows.map((row) => (
                    <div key={row} className="py-4">
                      <dt className="font-display text-base text-accent">{row}</dt>
                      <dd className="mt-1 text-muted">
                        <List items={p[row]} />
                      </dd>
                    </div>
                  ))}
              </dl>
              <div className="px-6 pb-6">
                <Quote className="w-full" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 hidden text-center lg:block">
          <Quote />
        </div>
      </section>

      <section className="bg-lavender px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-surface p-8">
            <h2 className="text-3xl">Credit requirements</h2>
            <ul className="mt-6 space-y-3">
              {lender.credit.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="text-accent">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-surface p-8">
            <h2 className="text-3xl">Where we lend</h2>
            <p className="mt-6 text-lg">
              Nationwide, in every state except {lender.statesNotServed.slice(0, -1).join(", ")} and{" "}
              {lender.statesNotServed.at(-1)}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {lender.statesNotServed.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
                  Not available: {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Quote />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm uppercase tracking-wider text-muted">About your relationship manager</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-4xl">{relationshipManager.greeting}</h2>
            <div className="mt-6 space-y-4 text-lg text-muted">
              {relationshipManager.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-8">{relationshipManager.signoff}</p>
            <p className="font-display text-2xl">{relationshipManager.signature}</p>
            <div className="mt-6 space-y-1">
              <a href={`mailto:${lender.contact.email}`} className="block text-accent underline underline-offset-4">
                {lender.contact.email}
              </a>
              <a href={`tel:${lender.contact.phone.replace(/\D/g, "")}`} className="block text-accent underline underline-offset-4">
                {lender.contact.phone}
              </a>
              <p className="text-muted">
                Connect with me:{" "}
                <a href={site.social[0].href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
                  @heyjasminebrown
                </a>
              </p>
            </div>
            <Quote className="mt-8" />
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <Image
              src="/images/Jasmine-Closing-1.jpg"
              alt="Jasmine Brown signing closing documents"
              width={376}
              height={376}
              className="aspect-[3/4] w-full rounded-2xl object-cover"
            />
            <Image
              src="/images/Jasmine-Closing-3.jpg"
              alt="Jasmine Brown in front of an investment property"
              width={645}
              height={646}
              className="aspect-[3/4] w-full rounded-2xl object-cover object-left"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-xs text-muted sm:flex-row sm:items-center">
          <div className="flex-1 space-y-2">
            <p>{lender.disclaimer}</p>
            <p>{lender.license}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-foreground">
            <HouseIcon />
            <span className="text-sm uppercase leading-tight tracking-wider">
              Equal Housing
              <br />
              Lender
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
