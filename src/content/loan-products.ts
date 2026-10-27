// Loan products (/conventus), from Jasmine's Conventus "Lending Products" sheet and relationship-manager flyer.
// Conventus is named and branded on this page only. Update terms here when they change; rates are intentionally not shown.

export const lender = {
  name: "Conventus",
  stats: [
    { value: "$10B+", label: "Loans funded" },
    { value: "4,600+", label: "Clients nationwide" },
  ],
  // From the lending map: every state except these.
  statesNotServed: ["Iowa", "Minnesota", "Nevada", "North Dakota", "South Dakota", "Vermont"],
  credit: [
    "Minimum FICO score of 660",
    "No foreclosure or bankruptcy within the past 48 months",
    "Primary residence mortgage must be current",
    "No late credit card payments in the last year",
  ],
  disclaimer:
    "This is a summary of our terms and requirements and may be more expansive. Please speak with your Conventus contact for details. Information in this summary reflects current requirements and may be modified or supplemented at any time.",
  license: "Conventus LLC California Finance Lenders License 60DBO-43745",
  contact: { name: "Jasmine Brown", email: "jbrown@cvlending.com", phone: "404.789.5791" },
};

const mixedUse = "Mixed use (50% of square feet must be residential, 60% of rental income must be residential)";

export const productRows = [
  "Property types",
  "Loan amounts",
  "Types",
  "Available terms",
  "Purposes",
  "Max leverage",
] as const;

export type Product = { name: string } & Record<(typeof productRows)[number], string[]>;

export const products: Product[] = [
  {
    name: "Bridge",
    "Property types": ["1–4 units (includes townhomes, condos, PUDs, ADUs)", "5–15 multifamily", mixedUse],
    "Loan amounts": ["1–4 units: $100,000 – $10,000,000", "Multifamily / mixed use: $100,000 – $10,000,000"],
    Types: ["Purchase", "Refinance (rate/term or cash out)"],
    "Available terms": ["6–18 months"],
    Purposes: ["Short-term acquisitions and refinances"],
    "Max leverage": ["90% for purchase", "75% loan to value for rate/term refi", "70% loan to value for cash out"],
  },
  {
    name: "Bridge + Rehab",
    "Property types": ["1–4 units (includes townhomes, condos, PUDs, ADUs)", "5–15 multifamily", mixedUse],
    "Loan amounts": ["1–4 units: $100,000 – $10,000,000", "Multifamily or mixed use: $100,000 – $10,000,000"],
    Types: ["Purchase", "Fix & flip", "Refinance (rate/term or cash out)"],
    "Available terms": ["6–24 months"],
    Purposes: ["Cosmetic to heavy rehab"],
    "Max leverage": ["90% for purchase", "80% loan to value", "100% of rehab costs"],
  },
  {
    name: "Ground-Up Construction",
    "Property types": [
      "1–4 units (includes townhomes, condos, PUDs)",
      "5–15 unit multifamily",
      "Mixed use (50% of square feet must be residential, 60% of rental income must be from residential)",
    ],
    "Loan amounts": ["Up to $10,000,000"],
    Types: ["Purchase", "Fix & flip", "Refinance (rate/term or cash out)"],
    "Available terms": ["6–24 months"],
    Purposes: ["Land", "Entitled land / design stage", "Entitled & permitted (shovel-ready)", "Mid construction"],
    "Max leverage": ["85% loan to cost", "65% LTARV"],
  },
  {
    name: "DSCR",
    "Property types": ["1–4 units (includes townhomes, condos, PUDs, ADUs)"],
    "Loan amounts": ["$100,000 – $3,000,000"],
    Types: ["Purchase", "Refinance (rate/term or cash out)"],
    "Available terms": ["30-year fixed rate term loans", "5, 7 & 10 year ARMs (interest only available)"],
    Purposes: ["Long-term rentals", "Short-term rentals"],
    "Max leverage": ["80% for purchase or rate/term refi", "75% for cash out", "65% for short-term rentals"],
  },
];

export const relationshipManager = {
  greeting: "Hey, there. I’m Jasmine.",
  paragraphs: [
    "Jasmine is a lender specializing in financing fix-and-flips, new construction, rental, and multifamily real estate investment projects nationwide. She brings a strategic, solutions-oriented approach to every transaction, helping real estate investors navigate financing with clarity and confidence.",
    "As an active investor, Jasmine understands the realities of executing real estate projects and the importance of having a financing partner who sees the bigger picture. She is passionate about helping real estate investors build wealth while creating a lasting impact in the communities they serve.",
  ],
  signoff: "Your partner in growth,",
  signature: "Jasmine T. Brown",
};
