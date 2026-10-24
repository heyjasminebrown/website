import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { Subscribe } from "../subscribe";

export function generateStaticParams() {
  const slugs = getPosts().map((p) => ({ slug: p.slug }));
  // The build needs at least one page here, even before any post is published; this one 404s.
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.date, ...(post.image && { images: [post.image] }) },
    ...(post.draft && { robots: { index: false } }),
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}${post.image ?? "/images/Jasmine-Home-1.jpg"}`,
    author: { "@id": `${site.url}/#jasmine` },
    publisher: { "@id": `${site.url}/#business` },
    ...(post.faq.length && {
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    }),
  };

  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <Link href="/blog" className="text-sm uppercase tracking-wider text-muted hover:text-foreground">
          ← Wealthy Notes
        </Link>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-muted">
          {formatDate(post.date)} · {post.minutes} min read{post.draft && " · Draft (not on the live site)"}
        </p>
        {post.image && (
          <Image
            src={post.image}
            alt=""
            width={1200}
            height={675}
            priority
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}
        <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className="mt-14 flex items-center gap-5 rounded-2xl border border-border bg-surface p-6">
          <Image
            src="/images/Jasmine-Home-1.jpg"
            alt={site.owner}
            width={160}
            height={160}
            className="h-20 w-20 shrink-0 rounded-full object-cover object-[center_30%]"
          />
          <div>
            <p className="font-display text-xl">Written by {site.owner}</p>
            <p className="mt-1 text-sm text-muted">
              Real estate investor helping Atlanta investors fund their deals and build wealth.{" "}
              <Link href="/loan" className="text-accent underline underline-offset-4">
                Fund your next deal
              </Link>
            </p>
          </div>
        </div>
      </article>
      <Subscribe />
    </>
  );
}
