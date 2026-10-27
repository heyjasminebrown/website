// The Get a Quote form (/quote). Each loan type has its own follow-up questions, shown once it's picked.
// To change a loan type's questions, edit its list below; the form and the lead email update automatically.

export type QuoteField = {
  name: string;
  label: string;
  kind: "text" | "money" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
};

// TODO: placeholder questions until Jasmine sends the real fields for each loan type.
const placeholder: QuoteField[] = [
  { name: "propertyLocation", label: "Property address or city", kind: "text", required: true },
  { name: "loanAmount", label: "Estimated loan amount", kind: "money" },
  { name: "dealNotes", label: "Anything else about your deal?", kind: "textarea" },
];

export const quoteLoanTypes: Record<string, QuoteField[]> = {
  "Fix and Flip": placeholder,
  "New Construction": placeholder,
  "DSCR Purchase": placeholder,
  "DSCR Refinance": placeholder,
};

export const quote = {
  eyebrow: "Get a Quote",
  heading: "Fund your deal",
  intro:
    "Tell me about your deal and get your quote. Once your loan is approved, we can fund your deal in as little as 10–14 days.",
};
