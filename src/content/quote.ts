// The Get a Quote form (/quote). Everyone answers the borrower-experience questions; each loan type then has
// its own property questions, shown once it's picked. Edit the lists below and the form, validation and lead
// email all update automatically.

export type QuoteField = {
  name: string;
  label: string;
  kind: "text" | "money" | "number" | "date" | "select" | "radio" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  // Only shown (and only required) when another answer matches, e.g. { field: "ownLand", equals: "Yes" }.
  showIf?: { field: string; equals: string };
  // Fields with the same row number sit side by side on wider screens.
  row?: number;
  // Only digits can be typed, up to this many (e.g. 3 for a credit score).
  digits?: number;
  // Shown as a lighter sub-label under a bold question (the experience counts).
  sub?: boolean;
};

export const isShown = (f: QuoteField, answers: Record<string, string | undefined>) =>
  !f.showIf || answers[f.showIf.field] === f.showIf.equals;

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

const address: QuoteField = { name: "propertyAddress", label: "Address", kind: "text", required: true };

const propertyType: QuoteField = {
  name: "propertyType",
  label: "Property type",
  kind: "select",
  options: ["Single Family - 1 unit", "Duplex", "Triplex", "Quad", "5+ units"],
  required: true,
};

// Used by Ground Up Construction; Fix and Flip reuses some of these in its own order.
const projectDetails: QuoteField[] = [
  { name: "rehabCost", label: "Rehab cost", kind: "money", required: true, row: 3 },
  { name: "projectMonths", label: "Estimated project length (months)", kind: "number", required: true, row: 3 },
  { name: "projectDescription", label: "Brief project description", kind: "textarea", required: true },
  { name: "arv", label: "ARV (after repair value)", kind: "money", required: true },
  {
    name: "comps",
    label: "2–3 comps",
    kind: "textarea",
    placeholder: "Addresses or links to 2–3 recent nearby sales",
  },
  { name: "exitStrategy", label: "Exit strategy", kind: "radio", options: ["Sell", "Rent"], required: true },
];

const yesNo = ["Yes", "No"];

// TODO: placeholder questions until Jasmine sends the DSCR fields.
const dscrPlaceholder: QuoteField[] = [
  address,
  propertyType,
  { name: "loanAmount", label: "Estimated loan amount", kind: "money" },
  { name: "dealNotes", label: "Anything else about your deal?", kind: "textarea" },
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
    ...projectDetails.filter((f) => ["comps", "exitStrategy"].includes(f.name)),
  ],
  "Ground Up Construction": [
    address,
    propertyType,
    { name: "vacantLand", label: "Is the property currently vacant land?", kind: "radio", options: yesNo, required: true },
    { name: "ownLand", label: "Do you own the land?", kind: "radio", options: yesNo, required: true },
    {
      name: "landPurchasePrice",
      label: "Original purchase price",
      kind: "money",
      required: true,
      showIf: { field: "ownLand", equals: "Yes" },
      row: 2,
    },
    {
      name: "landPurchaseDate",
      label: "Date purchased",
      kind: "date",
      required: true,
      showIf: { field: "ownLand", equals: "Yes" },
      row: 2,
    },
    {
      name: "purchasePrice",
      label: "Purchase price",
      kind: "money",
      required: true,
      showIf: { field: "ownLand", equals: "No" },
    },
    { name: "constructionStarted", label: "Have you started construction?", kind: "radio", options: yesNo, required: true },
    {
      name: "asIsCollateral",
      label: "As-is collateral type",
      kind: "radio",
      options: ["Vacant land", "Building", "Other"],
      required: true,
    },
    ...projectDetails,
  ],
  "DSCR Purchase": dscrPlaceholder,
  "DSCR Refinance": dscrPlaceholder,
};

export const quote = {
  eyebrow: "Get a Quote",
  heading: "Fund your deal",
  intro:
    "Tell me about your deal and get your quote. Once your loan is approved, we can fund your deal in as little as 10–14 days.",
};
