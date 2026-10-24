"use server";

import { site } from "@/content/site";
import { money, parseInputs, percent, underwrite } from "@/lib/flip-calc";
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

  // Recalculate on the server rather than trusting numbers sent from the browser.
  const i = parseInputs((key) => formData.get(key));
  const r = underwrite(i);
  const report = [
    "FIX & FLIP DEAL ANALYSIS",
    "",
    `Projected profit: ${money(r.profit)}`,
    `ROI: ${percent(r.roi)}`,
    "",
    "THE DEAL",
    `Resale value (ARV): ${money(i.resaleValue)}`,
    `Purchase price: ${money(i.purchasePrice)}`,
    `Renovation costs: ${money(i.renovationCost)}`,
    `Holding period: ${i.holdMonths} months`,
    `Total purchase + renovation: ${money(r.projectCost)}`,
    "",
    "FINANCING",
    `First mortgage: ${i.firstLtc}% = ${money(r.first.amount)} at ${i.firstRate}%, ${i.firstPoints} points (${money(r.first.monthlyPayment)}/mo interest only)`,
    ...(i.secondLtc > 0
      ? [
          `Second mortgage: ${i.secondLtc}% = ${money(r.second.amount)} at ${i.secondRate}%, ${i.secondPoints} points (${money(r.second.monthlyPayment)}/mo interest only)`,
        ]
      : []),
    `Total financing cost (points + interest): ${money(r.financingCost)}`,
    "",
    "COSTS",
    `Holding: ${money(r.monthlyHolding)}/mo x ${i.holdMonths} = ${money(r.holdingCost)}`,
    `Closing costs to buy: ${money(r.costToBuy)}`,
    `Closing costs to sell: ${money(r.costToSell)} (incl. ${i.realtorPct}% realtor fees)`,
    `Total all-in cost: ${money(r.totalCost)}`,
  ].join("\n");

  const lead = `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "(not given)"}`;
  const result = await sendEmail({
    subject: `Calculator lead: ${values.name} (${money(r.profit)} profit deal)`,
    text: `${lead}\n\n${report}`,
    replyTo: values.email,
  });
  if (result === "logged") return { status: "success", message: "Dev mode: report logged to the server console." };
  if (result !== "sent") return { status: "error", values, message: sendFailureMessage(result) };

  // The lead's copy is a nice-to-have: Jasmine already has their details if this fails.
  await sendEmail({
    to: values.email,
    replyTo: site.email,
    subject: "Your fix & flip deal analysis",
    text: [
      `Hi ${values.name.split(" ")[0]},`,
      "",
      "Here's the analysis you ran on my fix & flip calculator.",
      "",
      report,
      "",
      "Want to talk about funding this deal? Just reply to this email.",
      "",
      `${site.owner}`,
      site.url,
      "",
      "These figures are estimates for illustration only and are not a loan offer or commitment.",
    ].join("\n"),
  });

  return {
    status: "success",
    message: `Your report is on its way to ${values.email}. I'll be in touch about funding your deal!`,
  };
}
