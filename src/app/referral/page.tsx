import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ReferralForm } from "./referral-form";

export const metadata: Metadata = {
  title: "Refer a Friend",
  alternates: { canonical: "/referral" },
  description: "Know someone working on a real estate deal? Send them my way to earn a referral bonus up to $1,500.",
};

export default function ReferralPage() {
  return (
    <Section eyebrow="Referrals" title="Refer a friend">
      <p className="mb-10 max-w-xl text-lg text-muted">
        Know someone working on a real estate deal? Send them my way to earn a referral bonus up to $1,500.
      </p>
      <ReferralForm />
    </Section>
  );
}
