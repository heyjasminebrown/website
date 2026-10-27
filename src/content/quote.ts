// The Get a Quote form (/quote). Everyone answers the borrower-experience questions; each loan type then has
// its own property questions, shown once it's picked. Edit the lists below and the form, validation and lead
// email all update automatically.

export type Answers = Record<string, string | undefined>;

export type QuoteField = {
  name: string;
  label: string;
  kind: "text" | "money" | "number" | "percent" | "date" | "select" | "radio" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  // Only shown (and only required) when another answer matches: equals one value, is one of several,
  // or has been answered with anything except a value.
  showIf?: { field: string; equals?: string; oneOf?: string[]; notEquals?: string };
  // Worked out from other answers (e.g. LTV from loan amount and price) and shown locked, not typed.
  compute?: (answers: Answers) => string | undefined;
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

export function isShown(f: QuoteField, answers: Answers) {
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
 * question (e.g. a loan balance after answering "No" to an existing loan) can't keep its follow-ups visible.
 */
export function resolveFields(fields: QuoteField[], answers: Answers) {
  const values: Record<string, string> = {};
  const shown = fields.filter((f) => {
    if (!isShown(f, values)) return false;
    const value = f.compute ? f.compute(values) : answers[f.name];
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

// The questions Conventus's DSCR loan sizer needs.
const dscr: QuoteField[] = [
  address,
  {
    name: "propertyType",
    label: "Property Type",
    kind: "select",
    options: [
      "SFR (1 Unit)",
      "2-4 Unit",
      "5-9 Units",
      "10+ Units",
      "Mixed-Use",
      "Condo (Warrantable)",
      "Condo (Non-Warrantable)",
    ],
    required: true,
  },
  {
    name: "transactionType",
    label: "Transaction Type",
    kind: "select",
    options: ["Purchase", "Refi - Rate/Term", "Refi - Cash Out", "Delayed Finance"],
    required: true,
  },
  { name: "purchasePrice", label: "Purchase Price", kind: "money", required: true },
  { name: "loanAmount", label: "Loan Amount", kind: "money", required: true, row: 7 },
  {
    name: "ltv",
    label: "LTV %",
    kind: "percent",
    row: 7,
    compute: (a) => {
      const ltv = (amount(a.loanAmount) / amount(a.purchasePrice)) * 100;
      return Number.isFinite(ltv) && ltv > 0 ? ltv.toFixed(2) : undefined;
    },
  },
  {
    name: "existingLoanBalance",
    label: "Existing Loan Balance",
    kind: "money",
    placeholder: "0",
    hint: "Enter $0 if free & clear.",
  },
  {
    name: "amortization",
    label: "Amortization",
    kind: "select",
    options: ["Fully Amortizing (P&I)", "Interest Only"],
    required: true,
  },
  {
    name: "propertiesInLoan",
    label: "Properties in this Loan",
    kind: "select",
    options: ["1 Property (Single Asset)", "2-10 Properties (Portfolio)", "11-20 Properties (Portfolio)"],
    required: true,
  },
  {
    name: "prepayment",
    label: "Prepayment Structure",
    kind: "select",
    options: ["3 years", "5 years", "7 years"],
    required: true,
  },
  { name: "grossMonthlyRent", label: "Gross Monthly Rent", kind: "money", required: true, section: "Income" },
  { name: "section8", label: "Are any units Section 8 / LIHTC?", kind: "radio", options: ["No", "Yes"] },
  {
    name: "occupiedUnits",
    label: "# Occupied Units",
    kind: "number",
    required: true,
    placeholder: "e.g. 1",
    hint: "Out of total units — used to check occupancy minimums.",
  },
  { name: "propertyTax", label: "Property Tax", kind: "money", row: 8, section: "Annual Expenses" },
  { name: "insurance", label: "Insurance", kind: "money", row: 8 },
  { name: "hoaDues", label: "HOA / Condo Dues (Annual)", kind: "money", placeholder: "0" },
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

export const quote = {
  eyebrow: "Get a Quote",
  heading: "Fund your deal",
  intro:
    "Tell me about your deal and get your quote. Once your loan is approved, we can fund your deal in as little as 10–14 days.",
};
