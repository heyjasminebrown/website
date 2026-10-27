"use server";

import {
  amount,
  borrowerExperience,
  labelOf,
  quoteLoanTypes,
  resolveFields,
  type Answers,
  type QuoteField,
} from "@/content/quote";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

/** Returns an error message for a field's answer, or nothing if it's fine. */
function check(f: QuoteField, value: string, answers: Answers): string | undefined {
  const label = labelOf(f, answers);
  if (!value) return f.required ? `Please fill in "${label}".` : undefined;
  if (f.digits && !new RegExp(`^\\d{${f.digits}}$`).test(value)) {
    return `"${label}" should be ${f.digits} digits, e.g. 726.`;
  }
  if (f.kind === "number") {
    const n = Number(value.replace(/,/g, ""));
    if (!Number.isFinite(n) || n < 0) return `"${label}" should be a number.`;
    if (f.name === "creditScore" && (n < 300 || n > 850)) return "Please enter a credit score between 300 and 850.";
  }
  if (f.kind === "money") {
    const n = amount(value);
    if (!Number.isFinite(n) || n < 0) return `"${label}" should be a dollar amount.`;
  }
  if (f.kind === "percent") {
    const n = amount(value);
    const max = f.max?.(answers) ?? 100;
    if (!Number.isFinite(n) || n <= 0) return `"${label}" should be a percentage, e.g. 75.`;
    if (n > max) {
      return `"${label}" can be up to ${max}%${answers.transactionType ? ` for ${answers.transactionType}` : ""}.`;
    }
  }
  if ((f.kind === "radio" || f.kind === "select") && f.options && !f.options.includes(value)) {
    return `Please choose an option for "${label}".`;
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
  // Questions hidden by an earlier answer don't count, and calculated answers (e.g. LTV) replace what was sent.
  const resolved = resolveFields(allFields, values);
  const shown = resolved.shown;
  Object.assign(values, resolved.values);
  const isVisible = new Set(shown.map((f) => f.name));

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
    const problem = check(f, values[f.name], resolved.values);
    if (problem) return { status: "error", values, message: problem };
  }

  const answered = (fields: QuoteField[]) =>
    fields
      .filter((f) => isVisible.has(f.name) && (values[f.name] || f.section))
      .flatMap((f) => [
        ...(f.section ? ["", `-- ${f.section} --`] : []),
        ...(values[f.name] ? [`${labelOf(f, resolved.values)}: ${values[f.name]}`] : []),
      ]);
  const text = [
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Referred by: ${values.referredBy || "(no one)"}`,
    "",
    "BORROWER EXPERIENCE",
    ...answered(borrowerExperience),
    "",
    `PROJECT DETAILS (${loanType})`,
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
