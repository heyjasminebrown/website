import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ReferralForm } from "./referral-form";

export const metadata: Metadata = {
  title: "Refer a Friend",
  alternates: { canonical: "/referral" },
  description: "Know someone who needs funding for a real estate deal? Send them my way.",
};

export default function ReferralPage() {
  return (
    <Section eyebrow="Referrals" title="Refer a friend">
      <p className="mb-10 max-w-xl text-lg text-muted">
        Know someone who needs funding for their next real estate deal? Share their details below and I&apos;ll reach
        out to them personally. Thank you for trusting me with your network!
      </p>
      <ReferralForm />
    </Section>
  );
}
