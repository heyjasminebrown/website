// Free guides and tools offered in exchange for an email (the /free pages).
// Each one has a landing page at /free/<slug> and, except the quiz, a printable guide at /guides/<slug>
// that is emailed to the visitor after they sign up.

export type LeadMagnet = {
  slug: string;
  title: string;
  eyebrow: string;
  pitch: string;
  bullets: string[];
  cta: string;
  // Shown under the title in the email to the visitor.
  emailIntro: string;
};

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "loan-ready",
    title: "Are You Loan-Ready?",
    eyebrow: "2-minute quiz",
    pitch:
      "Answer 8 quick questions about your experience, cash and credit to see how ready you are to fund your next investment deal.",
    bullets: [
      "Your loan-readiness score out of 100",
      "What lenders will look at first",
      "Your next steps to get funded faster",
    ],
    cta: "See my score",
    emailIntro: "Here are your results from the Loan-Ready quiz.",
  },
  {
    slug: "flip-checklist",
    title: "Fix & Flip Deal Checklist",
    eyebrow: "Free checklist",
    pitch:
      "The step-by-step checklist to run every flip through, from the first walkthrough to the closing table, so nothing slips through the cracks.",
    bullets: [
      "What to check before you make an offer",
      "Due diligence and financing must-dos",
      "Rehab and resale steps that protect your profit",
    ],
    cta: "Send me the checklist",
    emailIntro: "Here's your Fix & Flip Deal Checklist. Run every deal through it before you sign.",
  },
  {
    slug: "rehab-budget",
    title: "Rehab Budget Worksheet",
    eyebrow: "Free worksheet",
    pitch:
      "A room-by-room worksheet for estimating your renovation costs, so your rehab budget (and your profit) holds up once the walls come down.",
    bullets: [
      "Every major cost category in one place",
      "Space for contractor quotes side by side",
      "Built-in contingency so surprises don't sink the deal",
    ],
    cta: "Send me the worksheet",
    emailIntro: "Here's your Rehab Budget Worksheet. Print it and bring it to your next walkthrough.",
  },
  {
    slug: "passive-income-guide",
    title: "Passive Income Starter Guide",
    eyebrow: "Free guide",
    pitch:
      "New to investing in real estate without being a landlord? This guide explains how passive real estate investing works and the questions to ask before you invest.",
    bullets: [
      "The main ways to invest passively in real estate",
      "How returns, terms and risk work",
      "10 questions to ask before you invest a dollar",
    ],
    cta: "Send me the guide",
    emailIntro: "Here's your Passive Income Starter Guide.",
  },
  {
    slug: "money-makeover",
    title: "Money Makeover Worksheet",
    eyebrow: "Free worksheet",
    pitch:
      "Get clear on where your money goes and build a simple plan to start growing your wealth, one page at a time.",
    bullets: [
      "See your full monthly cash flow at a glance",
      "Set savings and investing goals that stick",
      "A 30-day action plan to get started",
    ],
    cta: "Send me the worksheet",
    emailIntro: "Here's your Money Makeover Worksheet. Set aside 30 minutes, grab a coffee and fill it in.",
  },
];

export const getLeadMagnet = (slug: string) => leadMagnets.find((m) => m.slug === slug);

// The Loan-Ready quiz. Points per answer add up to a score out of 100.
export const loanQuiz = [
  {
    id: "deals",
    question: "How many investment properties have you bought, flipped or built in the last 3 years?",
    options: [
      { label: "None yet", points: 2 },
      { label: "1–2", points: 9 },
      { label: "3–5", points: 13 },
      { label: "6 or more", points: 15 },
    ],
  },
  {
    id: "credit",
    question: "What's your estimated credit score?",
    options: [
      { label: "Below 620", points: 2 },
      { label: "620–679", points: 8 },
      { label: "680–719", points: 12 },
      { label: "720 or higher", points: 15 },
    ],
  },
  {
    id: "cash",
    question: "How much cash could you put toward a deal (down payment, closing costs and reserves)?",
    options: [
      { label: "Less than $25k", points: 3 },
      { label: "$25k–$50k", points: 9 },
      { label: "$50k–$100k", points: 13 },
      { label: "More than $100k", points: 15 },
    ],
  },
  {
    id: "property",
    question: "Do you have a property in mind?",
    options: [
      { label: "Not yet, I'm still learning", points: 2 },
      { label: "I'm actively looking", points: 7 },
      { label: "I'm about to make an offer", points: 11 },
      { label: "I'm under contract", points: 13 },
    ],
  },
  {
    id: "numbers",
    question: "Have you run the numbers (purchase price, rehab budget, ARV)?",
    options: [
      { label: "Not yet", points: 1 },
      { label: "Rough estimates", points: 5 },
      { label: "Yes, with comps and contractor quotes", points: 10 },
    ],
  },
  {
    id: "entity",
    question: "Will you buy in an LLC or other business entity?",
    options: [
      { label: "Not sure", points: 2 },
      { label: "I plan to set one up", points: 5 },
      { label: "Yes, it's already set up", points: 8 },
    ],
  },
  {
    id: "team",
    question: "Do you have your team lined up (contractor, agent, title company)?",
    options: [
      { label: "Not yet", points: 1 },
      { label: "Some of them", points: 5 },
      { label: "Yes, all of them", points: 9 },
    ],
  },
  {
    id: "timeline",
    question: "When do you need funding?",
    options: [
      { label: "Just exploring", points: 2 },
      { label: "In the next 3–6 months", points: 6 },
      { label: "In the next 30–90 days", points: 9 },
      { label: "Within 30 days", points: 10 },
    ],
  },
];

export const quizResults = [
  {
    min: 75,
    label: "Ready to fund",
    summary: "You look like a strong borrower. Lenders like what they see when you have experience, cash and a plan.",
    nextSteps: [
      "Gather your last two bank statements, ID and entity documents.",
      "Put together your scope of work and rehab budget for the property.",
      "Get pre-approved so you can make offers with confidence.",
    ],
  },
  {
    min: 50,
    label: "Almost there",
    summary: "You've got a solid foundation. A few gaps could cost you a better rate or slow your closing.",
    nextSteps: [
      "Firm up your numbers with comps and at least one contractor quote.",
      "Set up your LLC and business bank account before you're under contract.",
      "Talk to a lender now so you know your buying power before you make offers.",
    ],
  },
  {
    min: 0,
    label: "Building your foundation",
    summary: "Everyone starts somewhere! Most first-time investors get funded once a few key pieces are in place.",
    nextSteps: [
      "Use the Fix & Flip Calculator to practice analyzing deals in your market.",
      "Build your cash reserves and check your credit report for errors.",
      "Line up your team and look for a deal where an experienced partner can join you.",
    ],
  },
];

export function scoreQuiz(answers: Record<string, string>) {
  const score = loanQuiz.reduce((total, q) => {
    const option = q.options.find((o) => o.label === answers[q.id]);
    return total + (option?.points ?? 0);
  }, 0);
  return { score, result: quizResults.find((r) => score >= r.min)! };
}

export const flipChecklist = [
  {
    heading: "Before you make an offer",
    items: [
      "Pull at least 3 sold comps within half a mile and the last 6 months to estimate ARV",
      "Walk the property and note the roof, foundation, HVAC, electrical, plumbing and windows",
      "Estimate your rehab budget room by room and add a 10–15% contingency",
      "Run the deal through the Fix & Flip Calculator, including holding and selling costs",
      "Work out your maximum offer from your target profit, not the asking price",
      "Check zoning, permits needed and any HOA rules",
    ],
  },
  {
    heading: "Under contract",
    items: [
      "Schedule a professional inspection within your inspection period",
      "Get at least 2 contractor bids with a written scope of work",
      "Order title and check for liens, judgments and open permits",
      "Lock in your financing and send the lender your scope of work",
      "Get insurance quotes (builder's risk or vacant property coverage)",
      "Confirm your closing date and how much cash to bring",
    ],
  },
  {
    heading: "During the rehab",
    items: [
      "Pull permits before work starts",
      "Agree on a payment schedule tied to completed work, never pay in full upfront",
      "Track every expense against your budget each week",
      "Take before, during and after photos for draws and marketing",
      "Visit the site regularly and keep a punch list",
    ],
  },
  {
    heading: "Selling",
    items: [
      "Close out permits and get final inspections signed off",
      "Stage and photograph the property professionally",
      "Price it using fresh comps, not the ARV you hoped for",
      "Review offers on net proceeds, not just price",
      "Compare your actual profit to your original analysis, and learn from the difference",
    ],
  },
];

export const rehabCategories = [
  { heading: "Exterior", lines: ["Roof", "Siding and paint", "Windows and doors", "Gutters", "Landscaping", "Driveway and walkways", "Fencing and decks"] },
  { heading: "Systems", lines: ["HVAC", "Electrical", "Plumbing", "Water heater", "Foundation and structural"] },
  { heading: "Kitchen", lines: ["Cabinets", "Countertops", "Appliances", "Sink and faucet", "Backsplash", "Lighting"] },
  { heading: "Bathrooms", lines: ["Vanity and mirror", "Toilet", "Tub and shower", "Tile", "Fixtures and fans"] },
  { heading: "Interior", lines: ["Flooring", "Interior paint", "Drywall repair", "Interior doors and trim", "Light fixtures", "Outlets and switches"] },
  { heading: "Soft costs", lines: ["Permits", "Dumpster and debris removal", "Cleaning", "Staging", "Utilities during the rehab"] },
];

export const passiveGuide = {
  sections: [
    {
      heading: "What is passive real estate investing?",
      body: [
        "Passive real estate investing means putting your money into real estate projects that someone else finds, manages and operates. You provide the capital; an experienced operator does the work. In return, you earn a share of the interest or profit.",
        "It's a way to add real estate to your portfolio without dealing with tenants, contractors or late-night repair calls.",
      ],
    },
    {
      heading: "Common ways to invest passively",
      body: [
        "Private lending: you lend money to a real estate investor for a specific project, often a fix and flip or new build. The loan is typically secured by the property, and you earn interest over a set term.",
        "Syndications and funds: you pool your money with other investors to buy a larger property, like an apartment building. You own a share and earn a portion of rental income and profit when it's sold.",
        "REITs: publicly traded companies that own real estate. You can buy shares through a brokerage account, much like a stock.",
      ],
    },
    {
      heading: "How returns, terms and risk work",
      body: [
        "Every investment has three things to understand: how you get paid (monthly interest, quarterly distributions or a lump sum at the end), how long your money is tied up, and what protects your money if something goes wrong.",
        "Higher returns usually mean higher risk. Real estate investments can lose value, projects can run late, and private investments are often hard to sell before the term ends. Only invest money you won't need for the length of the investment.",
      ],
    },
  ],
  questions: [
    "What is the operator's track record, and can I talk to past investors?",
    "What exactly am I investing in, and where is the property?",
    "How is my investment secured? Am I in first position?",
    "How and when will I be paid?",
    "How long will my money be tied up, and can I get it out early?",
    "What fees are charged, and who pays them?",
    "What happens if the project goes over budget or behind schedule?",
    "How often will I get updates, and what will they include?",
    "Is there insurance on the property, and am I named on it?",
    "Do I need to be an accredited investor to participate?",
  ],
};

export const moneyMakeover = {
  income: ["Take-home pay", "Side income", "Rental income", "Other"],
  expenses: [
    "Housing (rent or mortgage)",
    "Utilities and phone",
    "Groceries",
    "Transportation",
    "Insurance",
    "Debt payments",
    "Childcare",
    "Subscriptions",
    "Dining out and entertainment",
    "Personal and shopping",
    "Giving",
  ],
  goals: ["Emergency fund (3–6 months of expenses)", "Pay off debt", "Retirement", "Invest in real estate", "Other goal"],
  plan: [
    { week: "Week 1", task: "Track every dollar you spend. No judgment, just notice." },
    { week: "Week 2", task: "Cancel subscriptions you don't use and set up automatic savings on payday." },
    { week: "Week 3", task: "List your debts smallest to largest and pick one to attack first." },
    { week: "Week 4", task: "Choose one investing goal and the first step toward it, then book a money check-in for next month." },
  ],
};
