import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { newsletter } from "@/content/site";
import { getPosts } from "@/lib/blog";
import { Subscribe } from "./subscribe";

export const metadata: Metadata = {
  title: `${newsletter.name}: Money & Real Estate Blog`,
  description:
    "Wealthy Notes by Jasmine Brown: practical insights on real estate investing, funding your deals and building wealth.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <section className="bg-accent px-4 py-20 text-blush sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wider opacity-80">{newsletter.tagline}</p>
          <h1 className="mt-2 text-5xl sm:text-7xl">{newsletter.name}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg">
            Real talk on real estate investing and personal finance, from my notebook to yours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {posts.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent"
              >
                {p.image && (
                  <Image src={p.image} alt="" width={800} height={450} className="aspect-[16/9] w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-muted">
                    {p.minutes} min read{p.draft && " · Draft"}
                  </p>
                  <h2 className="mt-2 text-2xl">{p.title}</h2>
                  <p className="mt-2 text-muted">{p.description}</p>
                  <span className="mt-auto pt-6 text-accent">
                    Read the note <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted">The first notes are on their way. Subscribe below so you don&apos;t miss them.</p>
        )}
      </section>

      <Subscribe />
    </>
  );
}
