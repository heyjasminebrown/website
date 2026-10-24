import { site } from "@/content/site";

// Vercel keeps quotes pasted around a value, which Resend then rejects.
const env = (key: string) => process.env[key]?.trim().replace(/^["']|["']$/g, "") || undefined;

export type SendResult = "sent" | "logged" | "not-configured" | "failed";

/** Emails a form submission to the site owner via Resend. */
export async function sendEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[email] RESEND_API_KEY not set; not sent:\n${subject}\n${text}`);
      return "logged";
    }
    return "not-configured";
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("CONTACT_FROM_EMAIL") ?? "Website <onboarding@resend.dev>",
        to: env("CONTACT_TO_EMAIL") ?? site.email,
        reply_to: replyTo,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[email] Could not reach Resend", err);
    return "failed";
  }
}

export const sendFailureMessage = (result: SendResult) =>
  result === "not-configured"
    ? `The form isn't set up yet. Please email ${site.email} directly.`
    : `Something went wrong. Please email ${site.email} directly.`;
