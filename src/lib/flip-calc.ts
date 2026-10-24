// Fix & flip underwriting, ported from Jasmine's "Property Analysis Template" spreadsheet.
// Percentages are whole numbers (80 = 80%); points are whole numbers (2 = 2 points).
// The lender finances a share of the purchase plus a share of the rehab; a second loan is a
// dollar amount. Both are interest only for the full hold time. The first loan's interest is
// counted as a monthly carrying cost; points and second-loan interest are financing costs.

export type FlipInputs = {
  resaleValue: number;
  renovationCost: number;
  purchasePrice: number;
  holdMonths: number;
  purchaseFinancedPct: number;
  rehabFinancedPct: number;
  firstPoints: number;
  firstRate: number;
  partnerAmount: number;
  secondRate: number;
  monthlyHoa: number;
  monthlyUtilities: number;
  buyAttorneyFees: number;
  propertyTaxes: number;
  insurance: number;
  buyTitlePct: number;
  sellAttorneyFees: number;
  sellTitlePct: number;
  realtorPct: number;
};

export const defaultInputs: FlipInputs = {
  resaleValue: 1_400_000,
  renovationCost: 400_000,
  purchasePrice: 675_000,
  holdMonths: 9,
  purchaseFinancedPct: 80,
  rehabFinancedPct: 100,
  firstPoints: 1,
  firstRate: 11,
  partnerAmount: 0,
  secondRate: 12,
  monthlyHoa: 0,
  monthlyUtilities: 200,
  buyAttorneyFees: 600,
  propertyTaxes: 9_000,
  insurance: 1_800,
  buyTitlePct: 1,
  sellAttorneyFees: 600,
  sellTitlePct: 1,
  realtorPct: 2.5,
};

function loan(amount: number, points: number, rate: number, months: number) {
  const pointsCost = (amount * points) / 100;
  const monthlyPayment = (amount * rate) / 100 / 12;
  const interest = monthlyPayment * months;
  return { amount, pointsCost, monthlyPayment, interest };
}

export function underwrite(i: FlipInputs) {
  const projectCost = i.purchasePrice + i.renovationCost;
  const lenderAmount = (i.purchasePrice * i.purchaseFinancedPct + i.renovationCost * i.rehabFinancedPct) / 100;
  const first = loan(lenderAmount, i.firstPoints, i.firstRate, i.holdMonths);
  const second = loan(i.partnerAmount, 0, i.secondRate, i.holdMonths);
  const financingCost = first.pointsCost + second.pointsCost + second.interest;

  const monthlyHolding = first.monthlyPayment + i.monthlyHoa + i.monthlyUtilities;
  const holdingCost = monthlyHolding * i.holdMonths;

  const buyTitle = (i.purchasePrice * i.buyTitlePct) / 100;
  const costToBuy = i.buyAttorneyFees + buyTitle + i.propertyTaxes + i.insurance;

  const sellTitle = (i.resaleValue * i.sellTitlePct) / 100;
  const realtorFees = (i.resaleValue * i.realtorPct) / 100;
  const costToSell = i.sellAttorneyFees + sellTitle + realtorFees;

  const totalCost = projectCost + financingCost + holdingCost + costToBuy + costToSell;
  const profit = i.resaleValue - totalCost;
  // The spreadsheet's ROI used one month of holding costs; this uses the full hold, matching profit.
  const roi = totalCost > 0 ? profit / totalCost : 0;

  return {
    projectCost,
    first,
    second,
    financingCost,
    monthlyHolding,
    holdingCost,
    buyTitle,
    costToBuy,
    sellTitle,
    realtorFees,
    costToSell,
    totalCost,
    profit,
    roi,
  };
}

export type FlipResult = ReturnType<typeof underwrite>;

/** Reads inputs from a form, falling back to defaults and rejecting nonsense values. */
export function parseInputs(get: (key: string) => unknown): FlipInputs {
  const out = { ...defaultInputs };
  for (const key of Object.keys(defaultInputs) as (keyof FlipInputs)[]) {
    const n = Number(String(get(key) ?? "").replace(/[$,%\s]/g, ""));
    if (Number.isFinite(n) && n >= 0 && n < 1e10) out[key] = n;
  }
  return out;
}

export const money = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
export const percent = (n: number) => `${(n * 100).toFixed(1)}%`;
