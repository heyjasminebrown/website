"use server";

import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  // Echoed back on error so the form can refill what the visitor typed.
  values?: Record<string, string>;
};

const OPTIONAL_FIELDS = ["phone", "loanType", "location", "amount"] as const;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thanks! I'll be in touch soon." };

  const get = (key: string) => String(formData.get(key) ?? "").trim().slice(0, 5000);
  const topic = get("topic") || "General enquiry";
  const name = get("name");
  const email = get("email");
  const message = get("message");
  const isSignup = topic === "Newsletter";
  const values = Object.fromEntries(["name", "email", "message", ...OPTIONAL_FIELDS].map((k) => [k, get(k)]));

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (!isSignup && !message)) {
    return {
      status: "error",
      values,
      message: isSignup
        ? "Please enter your name and a valid email."
        : "Please fill in your name, a valid email and a message.",
    };
  }

  const extras = OPTIONAL_FIELDS.filter((k) => get(k)).map((k) => `${k}: ${get(k)}`);
  const text = [`Topic: ${topic}`, `Name: ${name}`, `Email: ${email}`, ...extras, "", message].join("\n");
  const thanks = isSignup ? "You're on the list! Look out for the next issue." : "Thanks! I'll be in touch soon.";

  const details = Object.fromEntries(OPTIONAL_FIELDS.filter((k) => k !== "phone" && get(k)).map((k) => [k, get(k)]));
  const [saved, result] = await Promise.all([
    saveLead({ source: topic, name, email, phone: get("phone") || undefined, message: message || undefined, details }),
    sendEmail({ subject: `${topic}: ${name}`, text, replyTo: email }),
  ]);
  if (result === "logged") return { status: "success", message: "Dev mode: message logged to the server console." };
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && !saved) return { status: "error", values, message: sendFailureMessage(result) };
  return { status: "success", message: thanks };
}
