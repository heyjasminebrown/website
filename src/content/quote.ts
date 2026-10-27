// The Get a Quote form (/quote). Everyone answers the borrower-experience questions; each loan type then has
// its own property questions, shown once it's picked. Edit the lists below and the form, validation and lead
// email all update automatically.

export type Answers = Record<string, string | undefined>;

export type QuoteField = {
  name: string;
  label: string;
  kind: "text" | "money" | "number" | "percent" | "date" | "select" | "radio" | "textarea";
  options?: string[];
  // Either always required, or required only when the other answers call for it.
  required?: boolean | ((answers: Answers) => boolean);
  placeholder?: string;
  hint?: string;
  // Only shown (and only required) when another answer matches: equals one value, is one of several,
  // or has been answered with anything except a value.
  showIf?: { field: string; equals?: string; oneOf?: string[]; notEquals?: string };
  // An extra condition for showing the field, for rules that depend on more than one answer.
  when?: (answers: Answers) => boolean;
  // Filled in automatically (and locked) from another answer, e.g. units from the property type.
  // Answers not in the list are typed in by hand.
  auto?: { from: string; values: Record<string, number> };
  // A number that can't be more than another answer (e.g. occupied units vs total units).
  maxOf?: string;
  // Starts a new titled section within the loan type's questions.
  section?: string;
  // A bold question shown above this field's row (used with sub-labelled boxes, e.g. beds/baths/sq ft).
  lead?: string;
  // Fields with the same row number sit side by side on wider screens.
  row?: number;
  // Only digits can be typed, up to this many (e.g. 3 for a credit score).
  digits?: number;
  // Shown as a lighter sub-label under a bold question (the experience counts).
  sub?: boolean;
};

/** Reads a typed amount like "$250,000" or "7.5" as a number (NaN if it isn't one). */
export function amount(value: string | undefined) {
  const cleaned = (value ?? "").replace(/[$,%\s]/g, "");
  return cleaned ? Number(cleaned) : NaN;
}

export function isRequired(f: QuoteField, answers: Answers) {
  return typeof f.required === "function" ? f.required(answers) : !!f.required;
}

/** The locked value for an auto-filled field, or undefined when it's typed in by hand. */
export function autoValue(f: QuoteField, answers: Answers) {
  const n = f.auto && answers[f.auto.from] ? f.auto.values[answers[f.auto.from]!] : undefined;
  return n === undefined ? undefined : String(n);
}

export function isShown(f: QuoteField, answers: Answers) {
  if (f.when && !f.when(answers)) return false;
  if (!f.showIf) return true;
  const { field, equals, oneOf, notEquals } = f.showIf;
  const answer = answers[field];
  if (equals !== undefined) return answer === equals;
  if (oneOf) return !!answer && oneOf.includes(answer);
  if (notEquals !== undefined) return !!answer && answer !== notEquals;
  return true;
}

/**
 * Works through the questions in order and returns the ones to show plus the answers that count.
 * Conditions only see answers to questions that are themselves shown, so a stale answer to a hidden
 * question (e.g. a purchase price after switching to Refinance) can't keep its follow-ups visible.
 */
export function resolveFields(fields: QuoteField[], answers: Answers) {
  const values: Record<string, string> = {};
  const shown = fields.filter((f) => {
    if (!isShown(f, values)) return false;
    const value = autoValue(f, values) ?? answers[f.name];
    if (value) values[f.name] = value;
    return true;
  });
  return { shown, values };
}

export function visibleFields(fields: QuoteField[], answers: Answers) {
  return resolveFields(fields, answers).shown;
}

export const borrowerExperience: QuoteField[] = [
  {
    name: "creditScore",
    label: "Estimated credit score",
    kind: "number",
    required: true,
    placeholder: "e.g. 726",
    digits: 3,
  },
  { name: "flipsCompleted", label: "Flips Completed", kind: "number", required: true, placeholder: "0", row: 1, sub: true },
  {
    name: "constructionCompleted",
    label: "Ground Up Builds Completed",
    kind: "number",
    required: true,
    placeholder: "0",
    row: 1,
    sub: true,
  },
  { name: "rentalsOwned", label: "Rentals Owned", kind: "number", required: true, placeholder: "0", row: 1, sub: true },
];
export const experienceNote =
  "In the past 3 years, how many projects have you completed? And how many rentals do you own today? Only count properties where you or your entity were on title.";

const address: QuoteField = { name: "propertyAddress", label: "Property Address", kind: "text", required: true };

const propertyType: QuoteField = {
  name: "propertyType",
  label: "Property type",
  kind: "select",
  options: ["Single Family - 1 unit", "Duplex", "Triplex", "Quad", "5+ units"],
  required: true,
};

const comps: QuoteField = {
  name: "comps",
  label: "2–3 comps",
  kind: "textarea",
  placeholder: "Addresses or links to 2–3 recent nearby sales",
};
const exitStrategy: QuoteField = {
  name: "exitStrategy",
  label: "Exit strategy",
  kind: "radio",
  options: ["Sell", "Rent"],
  required: true,
};

const yesNo = ["Yes", "No"];

const purchaseOnly = { field: "financingType", equals: "Purchase" };
const refinanceOnly = { field: "financingType", equals: "Refinance" };
const atMostUnits = { maxOf: "units", placeholder: "0" };

const dscr: QuoteField[] = [
  // Section 1. Purchase and Refinance each get their own questions after the shared ones.
  {
    name: "financingType",
    label: "What type of financing are you looking for?",
    kind: "radio",
    options: ["Purchase", "Refinance"],
    required: true,
    section: "Loan & Property Details",
  },
  address,
  {
    name: "propertyType",
    label: "What type of property is it?",
    kind: "select",
    options: [
      "Single-Family",
      "Condo",
      "Townhome",
      "Duplex",
      "Triplex",
      "Fourplex",
      "Multifamily (5+ Units)",
      "Other",
    ],
    required: true,
  },
  {
    name: "units",
    label: "How many units does the property have?",
    kind: "number",
    required: true,
    auto: {
      from: "propertyType",
      values: { "Single-Family": 1, Condo: 1, Townhome: 1, Duplex: 2, Triplex: 3, Fourplex: 4 },
    },
  },
  { name: "squareFootage", label: "What is the total square footage?", kind: "number", required: true },
  {
    name: "bedBathConfiguration",
    label: "What is the bedroom/bathroom configuration?",
    kind: "text",
    required: true,
    placeholder: "e.g. 3 bed / 2 bath",
  },
  { name: "loanAmount", label: "What loan amount are you requesting?", kind: "money", required: true },
  { name: "purchasePrice", label: "What is the purchase price?", kind: "money", required: true, showIf: purchaseOnly },
  {
    name: "assignmentFees",
    label: "Are there any assignment fees?",
    kind: "radio",
    options: yesNo,
    required: true,
    showIf: purchaseOnly,
  },
  {
    name: "assignmentFee",
    label: "What is the total assignment fee?",
    kind: "money",
    required: true,
    showIf: { field: "assignmentFees", equals: "Yes" },
  },
  {
    name: "closingDate",
    label: "What is your anticipated closing date?",
    kind: "date",
    required: true,
    showIf: purchaseOnly,
  },
  {
    name: "currentValue",
    label: "What is your estimated current property value?",
    kind: "money",
    required: true,
    showIf: refinanceOnly,
  },
  {
    name: "originalPurchasePrice",
    label: "What was the original purchase price?",
    kind: "money",
    required: true,
    showIf: refinanceOnly,
  },
  { name: "purchaseDate", label: "When did you purchase the property?", kind: "date", required: true, showIf: refinanceOnly },
  {
    name: "renovationSpend",
    label: "How much have you spent on renovations or improvements?",
    kind: "money",
    required: true,
    placeholder: "0",
    showIf: refinanceOnly,
  },
  {
    name: "refinanceType",
    label: "What type of refinance are you looking for?",
    kind: "radio",
    options: ["Cash-Out", "Rate-and-Term"],
    required: true,
    showIf: refinanceOnly,
  },
  {
    name: "hasLoan",
    label: "Do you currently have a loan on the property?",
    kind: "radio",
    options: yesNo,
    required: true,
    showIf: refinanceOnly,
  },
  {
    name: "currentLender",
    label: "Who is your current lender?",
    kind: "text",
    required: true,
    showIf: { field: "hasLoan", equals: "Yes" },
  },
  {
    name: "loanPayoff",
    label: "What is your estimated current loan payoff?",
    kind: "money",
    required: true,
    showIf: { field: "hasLoan", equals: "Yes" },
  },
  {
    name: "interestRate",
    label: "What is your current interest rate?",
    kind: "percent",
    required: true,
    placeholder: "e.g. 7.25",
    showIf: { field: "hasLoan", equals: "Yes" },
  },

  // Section 2
  {
    name: "rentalType",
    label: "What type of rental is the property?",
    kind: "radio",
    options: ["Long-Term", "Mid-Term", "Short-Term", "Mixed"],
    required: true,
    section: "Rental & Occupancy Information",
  },
  { name: "occupiedUnits", label: "How many units are currently occupied?", kind: "number", required: true, ...atMostUnits },
  {
    name: "tenantsInPlace",
    label: "Will the property be delivered with tenants in place?",
    kind: "radio",
    options: ["Yes", "No", "Partially"],
    required: true,
    showIf: purchaseOnly,
    when: (a) => amount(a.occupiedUnits) > 0,
  },
  {
    name: "currentRent",
    label: "What is the current total monthly rental income?",
    kind: "money",
    required: true,
    placeholder: "0",
  },
  {
    name: "projectedRent",
    label: "What is the projected total monthly rental income?",
    kind: "money",
    // Needed when any unit is vacant.
    required: (a) => amount(a.occupiedUnits) < amount(a.units),
  },
  {
    name: "subsidized",
    label: "Is the property part of a subsidized housing program?",
    kind: "radio",
    options: yesNo,
    required: true,
  },
  {
    name: "subsidizedUnits",
    label: "How many units participate in the program?",
    kind: "number",
    required: true,
    showIf: { field: "subsidized", equals: "Yes" },
    ...atMostUnits,
  },

  // Section 3
  {
    name: "annualTaxes",
    label: "What are the annual property taxes?",
    kind: "money",
    required: true,
    section: "Property Expenses",
  },
  { name: "annualInsurance", label: "What is the annual property insurance premium?", kind: "money", required: true },
  { name: "hoa", label: "Are there HOA dues?", kind: "radio", options: yesNo, required: true },
  {
    name: "annualHoa",
    label: "What are the annual HOA dues?",
    kind: "money",
    required: true,
    showIf: { field: "hoa", equals: "Yes" },
  },
  {
    name: "otherExpenses",
    label: "Are there any additional recurring property expenses?",
    kind: "radio",
    options: yesNo,
    required: true,
  },
  {
    name: "monthlyOtherExpenses",
    label: "What are the additional monthly expenses?",
    kind: "money",
    required: true,
    showIf: { field: "otherExpenses", equals: "Yes" },
  },

  // Section 4
  {
    name: "sameMarket",
    label: "Do you live in the same market as the property?",
    kind: "radio",
    options: yesNo,
    required: true,
    section: "Property Management & Experience",
  },
  {
    name: "willSelfManage",
    label: "Will you self-manage the property?",
    kind: "radio",
    options: yesNo,
    required: true,
    showIf: purchaseOnly,
  },
  {
    name: "currentlySelfManage",
    label: "Do you currently self-manage the property?",
    kind: "radio",
    options: yesNo,
    required: true,
    showIf: refinanceOnly,
  },
  {
    name: "similarRentals",
    label: "Do you own or manage similar rental properties in this market?",
    kind: "radio",
    options: yesNo,
    required: true,
  },
];

export const quoteLoanTypes: Record<string, QuoteField[]> = {
  "Fix and Flip": [
    address,
    propertyType,
    { name: "purchasePrice", label: "Purchase price", kind: "money", required: true },
    { name: "rehabCost", label: "Rehab cost", kind: "money", required: true, row: 3 },
    { name: "arv", label: "ARV (after repair value)", kind: "money", required: true, row: 3 },
    {
      name: "projectDescription",
      label: "What are you planning to do for the rehab?",
      kind: "textarea",
      required: true,
    },
    comps,
    exitStrategy,
  ],
  "Ground Up Construction": [
    address,

    // Section 1. If they don't own the land yet they may still be evaluating a lot, so no dates are asked then.
    {
      name: "ownLand",
      label: "Do you currently own the land?",
      kind: "radio",
      options: ["Yes", "Under Contract", "No"],
      required: true,
      section: "Land & Property Details",
    },
    {
      name: "landPurchasePrice",
      label: "What was the original purchase price?",
      kind: "money",
      required: true,
      showIf: { field: "ownLand", equals: "Yes" },
      row: 2,
    },
    {
      name: "landPurchaseDate",
      label: "When did you purchase the land?",
      kind: "date",
      required: true,
      showIf: { field: "ownLand", equals: "Yes" },
      row: 2,
    },
    {
      name: "contractPrice",
      label: "What is the contract purchase price?",
      kind: "money",
      required: true,
      showIf: { field: "ownLand", equals: "Under Contract" },
      row: 4,
    },
    {
      name: "closingDate",
      label: "What is the anticipated closing date?",
      kind: "date",
      required: true,
      showIf: { field: "ownLand", equals: "Under Contract" },
      row: 4,
    },
    {
      name: "estimatedLandPrice",
      label: "What is the estimated land purchase price?",
      kind: "money",
      required: true,
      showIf: { field: "ownLand", equals: "No" },
    },
    {
      name: "existingLoan",
      label: "Is there an existing loan on the property?",
      kind: "radio",
      options: yesNo,
      required: true,
      showIf: { field: "ownLand", equals: "Yes" },
    },
    {
      name: "loanBalance",
      label: "What is the current loan balance?",
      kind: "money",
      required: true,
      showIf: { field: "existingLoan", equals: "Yes" },
    },
    {
      name: "loanDueDate",
      label: "When is the loan due?",
      kind: "date",
      required: true,
      showIf: { field: "existingLoan", equals: "Yes" },
    },
    {
      name: "landCondition",
      label: "What is the current condition of the land?",
      kind: "radio",
      options: ["Vacant Land", "Existing Structure Requires Demolition", "Demolition Completed"],
      required: true,
    },

    // Section 2
    {
      name: "buildType",
      label: "What type of property are you building?",
      kind: "select",
      options: [
        "Single-Family Home",
        "Duplex",
        "Triplex",
        "Fourplex",
        "Townhomes",
        "Multifamily Apartments",
        "Mixed-Use",
      ],
      required: true,
      section: "Construction Plan",
    },
    {
      name: "buildTypeDescription",
      label: "Briefly describe the property",
      kind: "text",
      required: true,
      placeholder: "e.g. 2 retail units on the ground floor with 6 apartments above",
      showIf: { field: "buildType", equals: "Mixed-Use" },
    },
    { name: "totalUnits", label: "How many total units are you building?", kind: "number", required: true },
    {
      name: "bedsPerUnit",
      label: "Bedrooms",
      kind: "number",
      required: true,
      placeholder: "e.g. 3",
      sub: true,
      row: 6,
      lead: "What is the bed/bath/sq ft per unit?",
    },
    { name: "bathsPerUnit", label: "Bathrooms", kind: "number", required: true, placeholder: "e.g. 2.5", sub: true, row: 6 },
    { name: "sqftPerUnit", label: "Sq ft", kind: "number", required: true, placeholder: "e.g. 1,800", sub: true, row: 6 },

    // Section 3
    {
      name: "permitStatus",
      label: "Where are you at with permits?",
      kind: "select",
      options: ["Not Started", "In Progress", "Approved"],
      required: true,
      section: "Plans, Permits & Construction Status",
    },
    {
      name: "permitApprovalDate",
      label: "What is the estimated permit approval date?",
      kind: "date",
      required: true,
      showIf: { field: "permitStatus", notEquals: "Approved" },
    },
    {
      name: "constructionStage",
      label: "What is the current stage of construction?",
      kind: "select",
      options: [
        "Not Started",
        "Site Preparation or Demolition",
        "Foundation",
        "Framing",
        "Rough-Ins",
        "Interior Finishes",
        "Near Completion",
      ],
      required: true,
    },
    { ...exitStrategy, label: "What is your exit strategy?" },
    {
      name: "monthsToComplete",
      label: "What is the estimated time to complete the project (months)?",
      kind: "number",
      required: true,
    },
  ],
  DSCR: dscr,
};

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const percent = (n: number) => `${n.toFixed(1)}%`;

/**
 * Figures worked out from the answers for the lead email and database (the borrower doesn't see them).
 * Each one is left out when an answer it needs wasn't given, e.g. payoff on a free-and-clear refinance.
 */
export const quoteCalculations: Record<string, (v: Answers) => [string, string][]> = {
  DSCR: (v) => {
    const n = (k: string) => amount(v[k]);
    const loan = n("loanAmount");
    // A free-and-clear property has nothing to pay off.
    const payoff = v.hasLoan === "No" ? 0 : n("loanPayoff");
    const rows: [string, number, (x: number) => string][] = [
      ["Vacant units", n("units") - n("occupiedUnits"), String],
      ["Requested Purchase LTV", (loan / n("purchasePrice")) * 100, percent],
      ["Requested Refinance LTV", (loan / n("currentValue")) * 100, percent],
      ["Estimated equity before closing costs", n("currentValue") - payoff, money],
      [
        "Estimated cash-out before closing costs",
        v.refinanceType === "Cash-Out" ? loan - payoff : NaN,
        money,
      ],
    ];
    return rows.filter(([, x]) => Number.isFinite(x)).map(([label, x, format]) => [label, format(x)]);
  },
};

export const quote = {
  eyebrow: "Get a Quote",
  heading: "Fund your deal",
  intro:
    "Tell me about your deal and get your quote. Once your loan is approved, we can fund your deal in as little as 10–14 days.",
};
