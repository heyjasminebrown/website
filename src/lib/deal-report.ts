// Turns a calculator deal into the emailed report, as both branded HTML and a plain-text fallback.
import { site } from "@/content/site";
import { money, percent, type FlipInputs, type FlipResult } from "@/lib/flip-calc";

type Row = { label: string; value: string; note?: string; total?: boolean };
type Section = { title: string; rows: Row[] };

const points = (n: number) => `${n} point${n === 1 ? "" : "s"}`;

export function dealSections(i: FlipInputs, r: FlipResult): Section[] {
  return [
    {
      title: "The deal",
      rows: [
        { label: "Purchase price", value: money(i.purchasePrice) },
        { label: "Rehab budget", value: money(i.renovationCost) },
        { label: "ARV", value: money(i.resaleValue) },
        { label: "Hold time", value: `${i.holdMonths} months` },
      ],
    },
    {
      title: "Financing",
      rows: [
        {
          label: "Loan amount",
          value: money(r.first.amount),
          note: `${i.purchaseFinancedPct}% of purchase + ${i.rehabFinancedPct}% of rehab`,
        },
        { label: "Interest rate", value: `${i.firstRate}%`, note: `${money(r.first.monthlyPayment)}/mo interest only` },
        { label: "Origination", value: money(r.first.pointsCost), note: points(i.firstPoints) },
        ...(i.partnerAmount > 0
          ? [
              {
                label: "Second loan",
                value: money(i.partnerAmount),
                note: `${i.secondRate}% · ${money(r.second.interest)} interest over the hold`,
              },
            ]
          : []),
      ],
    },
    {
      title: "Costs",
      rows: [
        {
          label: "Carrying costs",
          value: money(r.holdingCost),
          note: `${money(r.monthlyHolding)}/mo × ${i.holdMonths} months`,
        },
        {
          label: "Acquisition costs",
          value: money(r.costToBuy),
          note: `${i.buyClosingPct}% closing costs, taxes & insurance`,
        },
        {
          label: "Selling costs",
          value: money(r.costToSell),
          note: `${i.realtorPct}% realtor fees + ${i.sellClosingPct}% closing costs`,
        },
        { label: "Financing costs", value: money(r.financingCost) },
        { label: "Total all-in cost", value: money(r.totalCost), total: true },
      ],
    },
  ];
}

export function reportText(r: FlipResult, sections: Section[]) {
  return [
    `Net profit: ${money(r.profit)}`,
    `ROI: ${percent(r.roi)}`,
    ...sections.flatMap((s) => [
      "",
      s.title.toUpperCase(),
      ...s.rows.map((row) => `${row.label}: ${row.value}${row.note ? ` (${row.note})` : ""}`),
    ]),
  ].join("\n");
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const C = { plum: "#34223a", blush: "#e3b79c", page: "#ebeaeb", muted: "#6b5a70", line: "#e4dee6", loss: "#f2a7a7" };
const serif = "Georgia, 'Times New Roman', serif";

function sectionHtml(s: Section) {
  const rows = s.rows
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 0;border-top:1px solid ${C.line};font-size:15px;color:${C.plum};${row.total ? "font-weight:bold;" : ""}">
          ${escape(row.label)}${row.note ? `<br><span style="font-size:12px;color:${C.muted};font-weight:normal;">${escape(row.note)}</span>` : ""}
        </td>
        <td align="right" style="padding:10px 0;border-top:1px solid ${C.line};font-size:15px;color:${C.plum};white-space:nowrap;vertical-align:top;${row.total ? "font-weight:bold;" : ""}">
          ${escape(row.value)}
        </td>
      </tr>`,
    )
    .join("");
  return `
    <p style="margin:28px 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">${escape(s.title)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;
}

/** Branded HTML email. `top` is trusted HTML placed above the numbers (escape anything user-supplied). */
export function reportHtml({
  preheader,
  top,
  r,
  sections,
  cta,
}: {
  preheader: string;
  top: string;
  r: FlipResult;
  sections: Section[];
  cta?: { label: string; href: string };
}) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fix &amp; flip deal analysis</title></head>
<body style="margin:0;padding:0;background:${C.page};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:${serif};">
    <tr><td style="background:${C.plum};padding:24px 32px;">
      <p style="margin:0;font-size:22px;color:${C.blush};">${escape(site.name)}</p>
      <p style="margin:4px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${C.blush};opacity:.8;">Finance &amp; Real Estate</p>
    </td></tr>
    <tr><td style="padding:32px;color:${C.plum};">
      ${top}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:${C.plum};border-radius:12px;">
        <tr><td style="padding:24px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.blush};opacity:.8;">Net profit</p>
          <p style="margin:6px 0 0;font-size:40px;line-height:1.1;color:${r.profit < 0 ? C.loss : C.blush};">${escape(money(r.profit))}</p>
          <p style="margin:10px 0 0;font-size:16px;color:${C.blush};">ROI <span style="font-size:22px;">${escape(percent(r.roi))}</span></p>
        </td></tr>
      </table>
      ${sections.map(sectionHtml).join("")}
      ${
        cta
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px auto 8px;"><tr><td style="background:${C.plum};border-radius:999px;">
          <a href="${escape(cta.href)}" style="display:inline-block;padding:14px 28px;font-size:16px;color:${C.blush};text-decoration:none;">${escape(cta.label)}</a>
        </td></tr></table>`
          : ""
      }
    </td></tr>
    <tr><td style="padding:20px 32px 28px;border-top:1px solid ${C.line};font-size:12px;line-height:1.5;color:${C.muted};">
      ${escape(site.owner)} · <a href="${site.url}" style="color:${C.muted};">${escape(site.url.replace(/^https?:\/\//, ""))}</a><br>
      These figures are estimates for illustration only, based on the numbers entered, and are not a loan offer or commitment to lend.
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

export { escape as escapeHtml };
