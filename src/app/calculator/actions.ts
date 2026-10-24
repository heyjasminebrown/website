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
    `Net profit: ${money(r.profit)}`,
    `ROI: ${percent(r.roi)}`,
    "",
    "THE DEAL",
    `ARV: ${money(i.resaleValue)}`,
    `Purchase price: ${money(i.purchasePrice)}`,
    `Rehab budget: ${money(i.renovationCost)}`,
    `Hold time: ${i.holdMonths} months`,
    `Purchase + rehab: ${money(r.projectCost)}`,
    "",
    "FINANCING",
    `Loan: ${money(r.first.amount)} (${i.purchaseFinancedPct}% of purchase + ${i.rehabFinancedPct}% of rehab) at ${i.firstRate}%, ${i.firstPoints} points (${money(r.first.monthlyPayment)}/mo interest only)`,
    ...(i.partnerAmount > 0
      ? [
          `Second loan: ${money(i.partnerAmount)} at ${i.secondRate}% (${money(r.second.monthlyPayment)}/mo interest only)`,
        ]
      : []),
    `Financing costs (points${i.partnerAmount > 0 ? " + second loan interest" : ""}): ${money(r.financingCost)}`,
    "",
    "DEAL COSTS",
    `Carrying costs: ${money(r.monthlyHolding)}/mo x ${i.holdMonths} = ${money(r.holdingCost)} (interest-only payment, HOA, utilities)`,
    `Acquisition costs: ${money(r.costToBuy)} (${i.buyClosingPct}% closing costs, ${money(i.propertyTaxes)} property taxes, ${money(i.insurance)} insurance)`,
    `Selling costs: ${money(r.costToSell)} (${i.realtorPct}% realtor fees + ${i.sellClosingPct}% closing costs)`,
    `Total all-in cost: ${money(r.totalCost)}`,
  ].join("\n");

  const lead = `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "(not given)"}`;
  const result = await sendEmail({
    subject: `Calculator lead: ${values.name} (${money(r.profit)} net profit deal)`,
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
