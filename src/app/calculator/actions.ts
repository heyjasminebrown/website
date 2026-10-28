"use server";

import { site } from "@/content/site";
import { hasDeal, money, parseInputs, percent, underwrite } from "@/lib/flip-calc";
import { dealSections, escapeHtml, reportHtml, reportText } from "@/lib/deal-report";
import { saveLead } from "@/lib/leads";
import { sendEmail, sendFailureMessage } from "@/lib/send-email";

export type ReportState = {
  status: "idle" | "success" | "error";
  message: string;
  values?: Record<string, string>;
};

export async function sendReport(_prev: ReportState, formData: FormData): Promise<ReportState> {
  // Honeypot: bots fill in every field, people never see this one.
  if (formData.get("company")) return { status: "success", message: "Your report is on its way!" };

  const get = (key: string) => String(formData.get(key) ?? "").trim().slice(0, 200);
  const values = { name: get("name"), email: get("email"), phone: get("phone") };
  if (!values.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { status: "error", values, message: "Please enter your name and a valid email." };
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    return { status: "error", values, message: "Please enter a full phone number." };
  }

  // Recalculate on the server rather than trusting numbers sent from the browser.
  const i = parseInputs((key) => formData.get(key));
  if (!hasDeal(i)) {
    return { status: "error", values, message: "Enter your purchase price and ARV first, then send your report." };
  }
  const r = underwrite(i);
  const sections = dealSections(i, r);
  const report = reportText(r, sections);
  const firstName = values.name.split(" ")[0];

  const lead = `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}`;
  const [saved, result] = await Promise.all([
    saveLead({
      source: "Calculator",
      name: values.name,
      email: values.email,
      phone: values.phone,
      details: {
        inputs: i,
        netProfit: Math.round(r.profit),
        roi: Number((r.roi * 100).toFixed(1)),
        loanAmount: Math.round(r.first.amount),
        totalCost: Math.round(r.totalCost),
      },
    }),
    sendEmail({
      subject: `Calculator lead: ${values.name} (${money(r.profit)} net profit deal)`,
      text: `${lead}\n\n${report}`,
      html: reportHtml({
        preheader: `${values.name} ran a deal: ${money(r.profit)} net profit, ${percent(r.roi)} ROI`,
        top: `
          <p style="margin:0 0 4px;font-size:24px;">New calculator lead</p>
          <p style="margin:0;font-size:16px;line-height:1.6;">
            <strong>${escapeHtml(values.name)}</strong><br>
            <a href="mailto:${escapeHtml(values.email)}" style="color:#34223a;">${escapeHtml(values.email)}</a><br>
            <a href="tel:${escapeHtml(values.phone.replace(/[^\d+]/g, ""))}" style="color:#34223a;">${escapeHtml(values.phone)}</a>
          </p>
          <p style="margin:12px 0 0;font-size:14px;color:#6b5a70;">Reply to this email to reach them directly.</p>`,
        r,
        sections,
      }),
      replyTo: values.email,
      to: site.loanLeadsEmail,
    }),
  ]);
  if (result === "logged") return { status: "success", message: "Dev mode: report logged to the server console." };
  // The lead counts as received if it reached either the database or the inbox.
  if (result !== "sent" && !saved) return { status: "error", values, message: sendFailureMessage(result) };

  // The lead's copy is a nice-to-have: Jasmine already has their details if this fails.
  await sendEmail({
    to: values.email,
    replyTo: site.email,
    subject: "Your fix & flip deal analysis",
    text: [
      `Hi ${firstName},`,
      "",
      "Thanks for running your deal through my fix & flip calculator! Here are your numbers.",
      "",
      report,
      "",
      "Ready to talk about funding this deal? Just reply to this email.",
      "",
      site.owner,
      site.url,
      "",
      "These figures are estimates for illustration only and are not a loan offer or commitment to lend.",
    ].join("\n"),
    html: reportHtml({
      preheader: `Your deal: ${money(r.profit)} net profit, ${percent(r.roi)} ROI`,
      top: `
        <p style="margin:0 0 12px;font-size:24px;">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0;font-size:16px;line-height:1.6;">
          Thanks for running your deal through my fix &amp; flip calculator! Here are your numbers.
          Ready to talk about funding it? Reply to this email or tap the button below.
        </p>`,
      r,
      sections,
      cta: {
        label: "Let's talk about funding",
        href: `mailto:${site.email}?subject=${encodeURIComponent("Funding my fix & flip")}`,
      },
    }),
  });

  return {
    status: "success",
    message: `Your report is on its way to ${values.email}. I'll be in touch about funding your deal!`,
  };
}
