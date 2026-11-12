// Fix & flip underwriting, ported from Jasmine's "Property Analysis Template" spreadsheet.
// Percentages are whole numbers (80 = 80%); points are whole numbers (2 = 2 points).
// The lender finances a share of the purchase plus a share of the rehab, interest only for the full
// hold time. The interest is counted as a monthly carrying cost; points are the financing cost.

export type FlipInputs = {
  resaleValue: number;
  renovationCost: number;
  purchasePrice: number;
  holdMonths: number;
  purchaseFinancedPct: number;
  rehabFinancedPct: number;
  firstPoints: number;
  firstRate: number;
  monthlyHoa: number;
  monthlyUtilities: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  buyClosingPct: number;
  buyRealtorPct: number;
  sellClosingPct: number;
  realtorPct: number;
};

// Visitors start with these filled in; everything else starts blank (0).
export const defaultInputs: FlipInputs = {
  resaleValue: 0,
  renovationCost: 0,
  purchasePrice: 0,
  holdMonths: 12,
  purchaseFinancedPct: 80,
  rehabFinancedPct: 100,
  firstPoints: 1,
  firstRate: 0,
  monthlyHoa: 0,
  monthlyUtilities: 0,
  monthlyTaxes: 0,
  monthlyInsurance: 0,
  buyClosingPct: 1,
  buyRealtorPct: 3,
  sellClosingPct: 1,
  realtorPct: 3,
};

/** True once there's enough to analyze: a purchase price and an ARV. */
export const hasDeal = (i: FlipInputs) => i.purchasePrice > 0 && i.resaleValue > 0;

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
  const financingCost = first.pointsCost;

  const monthlyHolding = first.monthlyPayment + i.monthlyHoa + i.monthlyUtilities + i.monthlyTaxes + i.monthlyInsurance;
  const holdingCost = monthlyHolding * i.holdMonths;

  // Closing costs cover title and attorney fees together.
  const buyClosing = (i.purchasePrice * i.buyClosingPct) / 100;
  const buyRealtorFees = (i.purchasePrice * i.buyRealtorPct) / 100;
  const costToBuy = buyClosing + buyRealtorFees;

  const sellClosing = (i.resaleValue * i.sellClosingPct) / 100;
  const realtorFees = (i.resaleValue * i.realtorPct) / 100;
  const costToSell = sellClosing + realtorFees;

  const totalCost = projectCost + financingCost + holdingCost + costToBuy + costToSell;
  const profit = i.resaleValue - totalCost;
  // The spreadsheet's ROI used one month of holding costs; this uses the full hold, matching profit.
  const roi = totalCost > 0 ? profit / totalCost : 0;

  return {
    projectCost,
    first,
    financingCost,
    monthlyHolding,
    holdingCost,
    buyClosing,
    buyRealtorFees,
    costToBuy,
    sellClosing,
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
