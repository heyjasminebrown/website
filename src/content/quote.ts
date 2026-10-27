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
  // Worked out from other answers (e.g. loan amount from LTV and price) and shown locked, not typed.
  compute?: (answers: Answers) => string | undefined;
  // A different wording when the other answers call for it (e.g. "Combined ..." for a portfolio).
  labelFor?: (answers: Answers) => string | undefined;
  // The highest number allowed, which can depend on other answers (e.g. LTV by transaction type).
  max?: (answers: Answers) => number;
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

export function labelOf(f: QuoteField, answers: Answers) {
  return f.labelFor?.(answers) ?? f.label;
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
  "In the past 3 years, how many real estate projects have you completed?";

const address: QuoteField = { name: "propertyAddress", label: "Property Address", kind: "text", required: true };

// Used by every loan type.
const propertyTypes = [
  "Single-Family, 1 unit",
  "Duplex",
  "Triplex",
  "Fourplex",
  "Townhouse or Condo",
  "Apartment Building",
];

const propertyType: QuoteField = {
  name: "propertyType",
  label: "Property Type",
  kind: "select",
  options: propertyTypes,
  required: true,
};
// Asked after the property type when it's an apartment building.
const totalUnits: QuoteField = {
  name: "totalUnits",
  label: "How many total units?",
  kind: "number",
  required: true,
  showIf: { field: "propertyType", equals: "Apartment Building" },
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
const purchaseTypes = ["Purchase", "Delayed Finance"];
const refiTypes = ["Refi - Rate/Term", "Refi - Cash Out"];
const portfolios = ["2-10 Properties (Portfolio)", "11-20 Properties (Portfolio)"];
const oneUnitTypes = ["Single-Family, 1 unit", "Townhouse or Condo"];
// Highest LTV Conventus allows by transaction type.
const maxLtv: Record<string, number> = { "Delayed Finance": 80, "Refi - Rate/Term": 80, "Refi - Cash Out": 75 };
// For a portfolio, income and expense questions cover all the properties together.
const combined = (label: string) => (a: Answers) =>
  a.propertiesInLoan && portfolios.includes(a.propertiesInLoan) ? `Combined ${label}` : undefined;

const dscr: QuoteField[] = [
  address,
  propertyType,
  totalUnits,
  {
    name: "transactionType",
    label: "Transaction Type",
    kind: "select",
    options: [...purchaseTypes, ...refiTypes],
    required: true,
  },
  {
    name: "purchasePrice",
    label: "Purchase Price",
    kind: "money",
    required: true,
    showIf: { field: "transactionType", oneOf: purchaseTypes },
  },
  {
    name: "propertyValue",
    label: "Property Value",
    kind: "money",
    required: true,
    showIf: { field: "transactionType", oneOf: refiTypes },
  },
  {
    name: "ltv",
    label: "LTV %",
    kind: "percent",
    required: true,
    placeholder: "e.g. 75",
    row: 7,
    max: (a) => maxLtv[a.transactionType ?? ""] ?? 100,
  },
  {
    name: "loanAmount",
    label: "Loan Amount",
    kind: "money",
    row: 7,
    // LTV % of the purchase price or property value.
    compute: (a) => {
      const loan = (amount(a.ltv) / 100) * amount(a.purchasePrice ?? a.propertyValue);
      return Number.isFinite(loan) && loan > 0 ? Math.round(loan).toLocaleString("en-US") : undefined;
    },
  },
  {
    name: "existingLoanBalance",
    label: "Existing Loan Balance",
    kind: "money",
    placeholder: "0",
    hint: "Enter $0 if free & clear.",
    showIf: { field: "transactionType", oneOf: refiTypes },
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
    options: ["1 Property (Single Asset)", ...portfolios],
    required: true,
  },
  {
    name: "propertyCount",
    label: "Exact Number of Properties",
    kind: "number",
    required: true,
    showIf: { field: "propertiesInLoan", oneOf: portfolios },
  },
  {
    name: "prepayment",
    label: "Prepayment Structure",
    kind: "select",
    options: ["3 years", "5 years", "7 years"],
    required: true,
  },
  {
    name: "rentalType",
    label: "Rental Type",
    kind: "radio",
    options: ["Long-Term Rental", "Short-Term Rental"],
    required: true,
    section: "Income",
  },
  {
    name: "grossMonthlyRent",
    label: "Gross Monthly Rent",
    kind: "money",
    required: true,
    labelFor: combined("Gross Monthly Rent"),
  },
  {
    name: "occupiedAtClosing",
    label: "Will the property be occupied at closing?",
    kind: "radio",
    options: yesNo,
    required: true,
    showIf: { field: "propertyType", oneOf: oneUnitTypes },
  },
  {
    name: "occupiedUnits",
    label: "How many units will be occupied at closing?",
    kind: "number",
    required: true,
    placeholder: "e.g. 1",
    showIf: { field: "propertyType", oneOf: propertyTypes.filter((t) => !oneUnitTypes.includes(t)) },
  },
  {
    name: "propertyTax",
    label: "Property Tax",
    kind: "money",
    row: 8,
    section: "Annual Expenses",
    labelFor: combined("Property Tax"),
  },
  { name: "insurance", label: "Insurance", kind: "money", row: 8, labelFor: combined("Insurance") },
  {
    name: "hoaDues",
    label: "HOA / Condo Dues (Annual)",
    kind: "money",
    placeholder: "0",
    labelFor: combined("HOA / Condo Dues (Annual)"),
  },
];

export const quoteLoanTypes: Record<string, QuoteField[]> = {
  "Fix and Flip": [
    address,
    propertyType,
    totalUnits,
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
      options: propertyTypes,
      required: true,
      section: "Construction Plan",
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
