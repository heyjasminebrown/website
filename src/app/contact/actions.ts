"use server";

import { site } from "@/content/site";

export type ContactState = { status: "idle" | "success" | "error"; message: string };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Thanks! I'll be in touch soon." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please fill in your name, a valid email and a message." };
  }
  if (name.length > 200 || message.length > 5000) {
    return { status: "error", message: "That message is a bit long. Please shorten it." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] RESEND_API_KEY not set; message not sent:", { name, email, message });
      return { status: "success", message: "Dev mode: message logged to the server console." };
    }
    return { status: "error", message: `The form isn't set up yet. Please email ${site.email} directly.` };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Website <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? site.email,
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return { status: "error", message: `Something went wrong. Please email ${site.email} directly.` };
  }
  return { status: "success", message: "Thanks! I'll be in touch soon." };
}
