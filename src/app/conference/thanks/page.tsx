import type { Metadata } from "next";
import { socialIcons } from "@/components/social-icons";

export const metadata: Metadata = { title: "See you soon", robots: { index: false } };

const INSTAGRAM = "https://www.instagram.com/heyjasminebrown";

export default function ConferenceThanksPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <h1 className="text-4xl leading-tight sm:text-6xl">I look forward to seeing you again soon!</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
        Until then, let&apos;s stay connected on Instagram. Follow me!
      </p>
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow @heyjasminebrown on Instagram"
        className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full bg-accent text-background hover:opacity-90"
      >
        {socialIcons.Instagram}
      </a>
      <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-3 inline-block text-lg hover:underline">
        @heyjasminebrown
      </a>
    </section>
  );
}
