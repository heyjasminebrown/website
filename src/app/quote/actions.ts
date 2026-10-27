"use server";

import { borrowerExperience, isShown, quoteLoanTypes, type QuoteField } from "@/content/quote";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

/** Returns an error message for a field's answer, or nothing if it's fine. */
function check(f: QuoteField, value: string): string | undefined {
  if (!value) return f.required ? `Please fill in "${f.label}".` : undefined;
  if (f.digits && !new RegExp(`^\\d{${f.digits}}$`).test(value)) {
    return `"${f.label}" should be ${f.digits} digits, e.g. 726.`;
  }
  if (f.kind === "number") {
    const n = Number(value.replace(/,/g, ""));
    if (!Number.isFinite(n) || n < 0) return `"${f.label}" should be a number.`;
    if (f.name === "creditScore" && (n < 300 || n > 850)) return "Please enter a credit score between 300 and 850.";
  }
  if ((f.kind === "radio" || f.kind === "select") && f.options && !f.options.includes(value)) {
    return `Please choose an option for "${f.label}".`;
  }
}

export async function sendQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thanks! I'll be in touch soon." };

  const get = (key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);
  const loanType = get("loanType");
  // Only accept questions that belong to the chosen loan type.
  const allFields = [...borrowerExperience, ...(quoteLoanTypes[loanType] ?? [])];
  const values: Record<string, string> = {
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    referredBy: get("referredBy"),
    loanType,
    ...Object.fromEntries(allFields.map((f) => [f.name, get(f.name, f.kind === "textarea" ? 3000 : 300)])),
  };
  // Questions hidden by an earlier answer don't count.
  const shown = allFields.filter((f) => isShown(f, values));

  if (!values.name || !values.phone || !values.email) {
    return { status: "error", values, message: "Please enter your name, phone and email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { status: "error", values, message: "Please enter a valid email." };
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    return { status: "error", values, message: "Please enter a full phone number." };
  }
  if (!quoteLoanTypes[loanType]) return { status: "error", values, message: "Please choose a loan type." };
  for (const f of shown) {
    const problem = check(f, values[f.name]);
    if (problem) return { status: "error", values, message: problem };
  }

  const answered = (fields: QuoteField[]) =>
    fields.filter((f) => isShown(f, values) && values[f.name]).map((f) => `${f.label}: ${values[f.name]}`);
  const text = [
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Referred by: ${values.referredBy || "(no one)"}`,
    "",
    "BORROWER EXPERIENCE",
    ...answered(borrowerExperience),
    "",
    `PROJECT INFORMATION (${loanType})`,
    ...answered(quoteLoanTypes[loanType]),
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
        ...Object.fromEntries(shown.filter((f) => values[f.name]).map((f) => [f.name, values[f.name]])),
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
