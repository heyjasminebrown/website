import type { Metadata } from "next";
import Image from "next/image";
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
    <>
      <section className="bg-accent px-4 py-16 text-blush sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-wider opacity-80">Loan Referral Program</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Earn up to $1,500 when you refer a fellow investor!</h1>
            <p className="mt-6 max-w-xl text-lg">
              Know someone working on a real estate deal? Earn a referral bonus when they complete a loan with us*
            </p>
            <a
              href="#refer"
              className="mt-8 inline-block rounded-full bg-blush px-7 py-3 text-accent transition-opacity hover:opacity-90"
            >
              Refer an investor
            </a>
            <p className="mt-6 text-sm opacity-80">*Referral bonus up to $1,500, based on final loan amount.</p>
          </div>
          <Image
            src="/images/Jasmine-Closing-2.jpg"
            alt="Jasmine Brown smiling while signing closing paperwork"
            width={768}
            height={1023}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="mx-auto aspect-[4/5] w-full max-w-sm rounded-3xl object-cover object-top"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-4xl">How it works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-2xl text-blush">
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
    </>
  );
}
