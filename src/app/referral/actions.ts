"use server";

import { redirect } from "next/navigation";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";
import { referralLoanTypes, site } from "@/content/site";

export type ReferralState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

const REQUIRED = ["referrerName", "firstName", "lastName", "phone", "loanType"] as const;
const FIELDS = [...REQUIRED, "email"] as const;

export async function sendReferral(_prev: ReferralState, formData: FormData): Promise<ReferralState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thank you for the referral!" };

  const values = Object.fromEntries([
    ...FIELDS.map((k) => [k, String(formData.get(k) ?? "").trim().slice(0, 200)]),
    ["notes", String(formData.get("notes") ?? "").trim().slice(0, 3000)],
  ]);
  const { referrerName, firstName, lastName, email, phone, loanType, notes } = values;

  if (REQUIRED.some((k) => !values[k])) {
    return { status: "error", values, message: "Please fill in all the required fields." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", values, message: "Please enter a valid email for your referral, or leave it blank." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { status: "error", values, message: "Please enter a full phone number for your referral." };
  }
  if (!referralLoanTypes.includes(loanType)) {
    return { status: "error", values, message: "Please choose a loan type." };
  }

  const text = [
    `Referred by: ${referrerName}`,
    "",
    `Name: ${firstName} ${lastName}`,
    `Email: ${email || "(not given, reach them by phone)"}`,
    `Phone: ${phone}`,
    `Loan type: ${loanType}`,
    ...(notes ? ["", "About their deal:", notes] : []),
  ].join("\n");

  // Reply-to is the referral (when they gave an email), so hitting Reply starts the conversation with them.
  const [saved, result] = await Promise.all([
    saveLead({
      source: "Referral",
      name: `${firstName} ${lastName}`,
      email: email || undefined,
      phone,
      message: notes || undefined,
      details: { referredBy: referrerName, loanType },
    }),
    sendEmail({
      subject: `Loan referral: ${firstName} ${lastName} (from ${referrerName})`,
      text,
      replyTo: email || undefined,
      to: site.loanLeadsEmail,
    }),
  ]);
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && result !== "logged" && !saved) {
    return { status: "error", values, message: sendFailureMessage(result) };
  }
  const params = new URLSearchParams({ from: referrerName.split(" ")[0], to: firstName });
  redirect(`/referral/thanks?${params}`);
}
