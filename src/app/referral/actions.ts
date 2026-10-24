"use server";

import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";
import { referralLoanTypes } from "@/content/site";

export type ReferralState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

const FIELDS = ["referrerName", "firstName", "lastName", "email", "phone", "loanType"] as const;

export async function sendReferral(_prev: ReferralState, formData: FormData): Promise<ReferralState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thank you for the referral!" };

  const values = Object.fromEntries(FIELDS.map((k) => [k, String(formData.get(k) ?? "").trim().slice(0, 200)]));
  const { referrerName, firstName, lastName, email, phone, loanType } = values;

  if (FIELDS.some((k) => !values[k])) {
    return { status: "error", values, message: "Please fill in every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", values, message: "Please enter a valid email for your referral." };
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
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Loan type: ${loanType}`,
  ].join("\n");

  // Reply-to is the referral, so hitting Reply starts the conversation with them.
  const [saved, result] = await Promise.all([
    saveLead({
      source: "Referral",
      name: `${firstName} ${lastName}`,
      email,
      phone,
      details: { referredBy: referrerName, loanType },
    }),
    sendEmail({
      subject: `Loan referral: ${firstName} ${lastName} (from ${referrerName})`,
      text,
      replyTo: email,
    }),
  ]);
  if (result === "logged") return { status: "success", message: "Dev mode: referral logged to the server console." };
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && !saved) return { status: "error", values, message: sendFailureMessage(result) };
  return {
    status: "success",
    message: `Thank you, ${referrerName.split(" ")[0]}! I'll reach out to ${firstName} soon.`,
  };
}
