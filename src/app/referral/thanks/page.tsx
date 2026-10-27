import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Thank you for the referral", robots: { index: false } };

async function Message({ searchParams }: { searchParams: PageProps<"/referral/thanks">["searchParams"] }) {
  const { from, to } = await searchParams;
  const name = (v: string | string[] | undefined) => (typeof v === "string" ? v.slice(0, 60).trim() : "");
  const referrer = name(from);
  const referral = name(to);
  return (
    <>
      <h1 className="text-4xl leading-tight sm:text-5xl">
        Thank you for the referral{referrer && `, ${referrer}`}!
      </h1>
      <p className="mt-6 text-lg text-muted">I&apos;ll reach out to {referral || "them"} within 24 hours.</p>
    </>
  );
}

export default function ReferralThanksPage({ searchParams }: PageProps<"/referral/thanks">) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <Suspense fallback={<h1 className="text-4xl leading-tight sm:text-5xl">Thank you for the referral!</h1>}>
        <Message searchParams={searchParams} />
      </Suspense>
      <Link href="/referral" className="mt-10 inline-block text-accent underline underline-offset-4 hover:opacity-80">
        Refer another friend
      </Link>
    </section>
  );
}
