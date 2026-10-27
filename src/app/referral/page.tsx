import type { Metadata } from "next";
import Image from "next/image";
import { ConventusTheme } from "@/components/conventus-theme";
import { referralLoanTypes } from "@/content/site";
import { ReferralForm } from "./referral-form";

export const metadata: Metadata = {
  title: "Refer a Friend",
  alternates: { canonical: "/referral" },
  description:
    "Earn up to $1,500 when you refer a fellow investor. Know someone working on a real estate deal? Earn a referral bonus when they complete a loan with us.",
};

const steps = [
  { title: "Share their details", body: "Fill in the form below with your name and your referral's contact info." },
  { title: "I reach out", body: "I'll personally connect with them about funding their deal." },
  { title: "You earn your bonus", body: "Up to $1,500, based on the final loan amount." },
];

export default function ReferralPage() {
  return (
    <ConventusTheme>
      <section className="bg-cv-dark px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cv-mint">Loan Referral Program</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Earn up to $1,500 when you refer a fellow investor!</h1>
            <p className="mt-6 max-w-xl text-lg">
              Know someone working on a real estate deal? Earn a referral bonus when they complete a loan with us*
            </p>
            <a
              href="#refer"
              className="mt-8 inline-block rounded-full bg-cv-mint px-7 py-3 text-cv-dark transition-opacity hover:opacity-90"
            >
              Refer an investor
            </a>
            <p className="mt-6 text-sm text-cv-mint-light">*Referral bonus up to $1,500, based on final loan amount.</p>
          </div>
          <Image
            src="/images/Jasmine-Investor-Group.jpg"
            alt="Jasmine Brown with real estate investors at a networking event"
            width={1640}
            height={924}
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="w-full rounded-3xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-4xl">How it works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-cv-teal font-display text-2xl text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center text-muted">
          Loans for: {referralLoanTypes.join(" · ")}
        </p>
      </section>

      <section id="refer" className="scroll-mt-6 bg-lavender px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-3xl bg-surface p-6 shadow-sm sm:p-10">
          <h2 className="text-3xl">Send your referral</h2>
          <p className="mb-8 mt-2 text-muted">It only takes a minute.</p>
          <ReferralForm />
        </div>
      </section>
    </ConventusTheme>
  );
}
