// Wealthy Notes blog posts live as Markdown files in content/blog/<slug>.md, with a header like:
//
//   ---
//   title: How hard money loans work
//   description: One or two sentences for Google and the post list.
//   date: 2026-10-24
//   image: /images/blog/my-photo.jpg   (optional)
//   draft: true                         (optional; drafts are hidden on the live site)
//   ---
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

const dir = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  draft: boolean;
  html: string;
  minutes: number;
  // Questions under a "## Frequently asked questions" heading (each "### Question" followed by its answer).
  faq: { question: string; answer: string }[];
};

function extractFaq(body: string) {
  const section = body.split(/^## Frequently asked questions\s*$/im)[1]?.split(/^## /m)[0];
  if (!section) return [];
  return section
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const [question, ...rest] = chunk.split("\n");
      // Plain-text answer: drop Markdown links, emphasis and extra whitespace.
      const answer = rest
        .join(" ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`>]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return { question: question.trim(), answer };
    })
    .filter((f) => f.question && f.answer);
}

function parse(file: string): Post {
  const raw = readFileSync(path.join(dir, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const body = match ? match[2] : raw;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title || file,
    description: meta.description || "",
    date: meta.date || "",
    image: meta.image || undefined,
    draft: meta.draft === "true",
    html: marked.parse(body, { async: false }),
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 230)),
    faq: extractFaq(body),
  };
}

// Drafts show everywhere except the live site, so they can be previewed before publishing.
const showDrafts = process.env.VERCEL_ENV !== "production";

/** Published posts, newest first. */
export function getPosts(): Post[] {
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
  return files
    .map(parse)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
