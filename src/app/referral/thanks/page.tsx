import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Thank you for the referral", robots: { index: false } };

// Confetti pieces with fixed (not random) positions so the server and browser render the same thing.
const COLORS = ["var(--blush)", "var(--lavender)", "#d4a94a", "#f6f5f6"];
const confetti = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 7) % 30) / 10,
  duration: 4 + ((i * 13) % 30) / 10,
  size: 6 + ((i * 5) % 7),
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

async function Message({ searchParams }: { searchParams: PageProps<"/referral/thanks">["searchParams"] }) {
  const { from, to } = await searchParams;
  const name = (v: string | string[] | undefined) => (typeof v === "string" ? v.slice(0, 60).trim() : "");
  const referrer = name(from);
  const referral = name(to);
  return (
    <>
      <h1 className="mt-6 text-4xl leading-tight sm:text-6xl">Thank you for the referral{referrer && `, ${referrer}`}!</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl">
        I&apos;ll reach out to {referral || "them"} within 24 hours.
      </p>
      <p className="mt-3 font-display text-xl">You&apos;re on your way to a bonus!</p>
    </>
  );
}

export default function ReferralThanksPage({ searchParams }: PageProps<"/referral/thanks">) {
  return (
    <section className="relative overflow-hidden bg-accent px-4 py-20 text-center text-blush sm:px-6 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.round ? c.size : c.size * 1.8,
              background: c.color,
              borderRadius: c.round ? "999px" : "2px",
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl">
        <span className="inline-grid h-20 w-20 place-items-center rounded-full bg-blush text-4xl shadow-lg" aria-hidden>
          🎉
        </span>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] opacity-80">Referral received</p>
        <Suspense fallback={<h1 className="mt-6 text-4xl leading-tight sm:text-6xl">Thank you for the referral!</h1>}>
          <Message searchParams={searchParams} />
        </Suspense>
        <Link
          href="/referral"
          className="mt-10 inline-block rounded-full bg-blush px-8 py-4 text-lg text-accent shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Refer another friend
        </Link>
      </div>
    </section>
  );
}
