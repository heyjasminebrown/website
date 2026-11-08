"use server";

import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type ConferenceState = { status: "idle" | "error"; message: string; values?: Record<string, string> };

export async function joinConference(_prev: ConferenceState, formData: FormData): Promise<ConferenceState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) redirect("/conference/thanks");

  const get = (key: string) => String(formData.get(key) ?? "").trim().slice(0, 200);
  const values = { firstName: get("firstName"), lastName: get("lastName"), email: get("email") };
  if (!values.firstName || !values.lastName) {
    return { status: "error", values, message: "Please enter your first and last name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { status: "error", values, message: "Please enter a valid email." };
  }

  const name = `${values.firstName} ${values.lastName}`;
  const [saved, result] = await Promise.all([
    saveLead({ source: "Conference", name, email: values.email, details: { firstName: values.firstName, lastName: values.lastName } }),
    sendEmail({
      subject: `Webinar sign-up: ${name}`,
      text: [`First name: ${values.firstName}`, `Last name: ${values.lastName}`, `Email: ${values.email}`, "", "From heyjasminebrown.com/conference"].join("\n"),
      replyTo: values.email,
      // Webinar sign-ups go to Jasmine's own inbox, not the loan leads inbox.
      to: site.email,
    }),
  ]);
  // The sign-up counts as received if it reached either the database or the inbox.
  if (result !== "sent" && result !== "logged" && !saved) {
    return { status: "error", values, message: sendFailureMessage(result) };
  }
  redirect("/conference/thanks");
}
