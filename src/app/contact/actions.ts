"use server";

import { site } from "@/content/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  // Echoed back on error so the form can refill what the visitor typed.
  values?: Record<string, string>;
};

const OPTIONAL_FIELDS = ["phone", "loanType", "location", "amount"] as const;

// Vercel keeps quotes pasted around a value, which Resend then rejects.
const env = (key: string) => process.env[key]?.trim().replace(/^["']|["']$/g, "") || undefined;

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

  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] RESEND_API_KEY not set; message not sent:\n" + text);
      return { status: "success", message: "Dev mode: message logged to the server console." };
    }
    return { status: "error", values, message: `The form isn't set up yet. Please email ${site.email} directly.` };
  }

  const failed = { status: "error", values, message: `Something went wrong. Please email ${site.email} directly.` } as const;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("CONTACT_FROM_EMAIL") ?? "Website <onboarding@resend.dev>",
        to: env("CONTACT_TO_EMAIL") ?? site.email,
        reply_to: email,
        subject: `${topic}: ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return failed;
    }
  } catch (err) {
    console.error("[contact] Could not reach Resend", err);
    return failed;
  }
  return { status: "success", message: thanks };
}
