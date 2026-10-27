"use server";

import { quoteLoanTypes } from "@/content/quote";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

export async function sendQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thanks! I'll be in touch soon." };

  const get = (key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);
  const loanType = get("loanType");
  // Only accept the questions that belong to the chosen loan type.
  const fields = quoteLoanTypes[loanType] ?? [];
  const values: Record<string, string> = {
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    referredBy: get("referredBy"),
    loanType,
    ...Object.fromEntries(fields.map((f) => [f.name, get(f.name, f.kind === "textarea" ? 3000 : 300)])),
  };

  if (!values.name || !values.phone || !values.email) {
    return { status: "error", values, message: "Please enter your name, phone and email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { status: "error", values, message: "Please enter a valid email." };
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    return { status: "error", values, message: "Please enter a full phone number." };
  }
  if (!fields.length) return { status: "error", values, message: "Please choose a loan type." };
  const missing = fields.find((f) => f.required && !values[f.name]);
  if (missing) return { status: "error", values, message: `Please fill in "${missing.label}".` };

  const answers = fields.filter((f) => values[f.name]).map((f) => `${f.label}: ${values[f.name]}`);
  const text = [
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Referred by: ${values.referredBy || "(no one)"}`,
    "",
    `Loan type: ${loanType}`,
    ...answers,
  ].join("\n");

  const [saved, result] = await Promise.all([
    saveLead({
      source: `Quote: ${loanType}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      details: {
        loanType,
        ...(values.referredBy && { referredBy: values.referredBy }),
        ...Object.fromEntries(fields.filter((f) => values[f.name]).map((f) => [f.name, values[f.name]])),
      },
    }),
    sendEmail({
      subject: `Quote request (${loanType}): ${values.name}${values.referredBy ? ` · referred by ${values.referredBy}` : ""}`,
      text,
      replyTo: values.email,
    }),
  ]);
  if (result === "logged") return { status: "success", message: "Dev mode: quote request logged to the server console." };
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && !saved) return { status: "error", values, message: sendFailureMessage(result) };
  return {
    status: "success",
    message: `Thanks, ${values.name.split(" ")[0]}! I'll review your ${loanType} deal and reach out with your quote soon.`,
  };
}
