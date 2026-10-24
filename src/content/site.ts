// All copy for the site lives here. Edit this file to change the wording on every page.

export const site = {
  name: "Hey Jasmine Brown",
  owner: "Jasmine Brown",
  tagline: "Building wealth through real estate, smart money moves and better business systems.",
  description:
    "Jasmine Brown helps small businesses grow through marketing and technology, and guides homeowners and investors through their real estate decisions.",
  url: "https://heyjasminebrown.com",
  email: "jasmine@heyjasminebrown.com",
  social: [{ label: "Instagram", href: "https://instagram.com/heyjasminebrown" }],
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Invest", href: "/passiveincome" },
  { label: "Fund Your Deal", href: "/loan" },
  { label: "Events", href: "/events" },
  { label: "Newsletter", href: "/subscribe" },
];

export const offerings = [
  {
    title: "Passive income",
    summary: "Earn returns backed by real estate without managing properties yourself.",
    href: "/passiveincome",
    cta: "Learn about investing",
  },
  {
    title: "Fund your deal",
    summary: "Financing for fix & flips, ground-up construction, multifamily and rentals.",
    href: "/loan",
    cta: "Get funding",
  },
  {
    title: "Money makeover",
    summary: "Get your finances organized and build a plan to start growing your wealth.",
    href: "/contact?topic=Money%20Makeover",
    cta: "Get your money makeover",
  },
  {
    title: "Marketing & technology",
    summary: "Help for small businesses to streamline operations and grow with data-driven marketing.",
    href: "/contact?topic=Business%20consulting",
    cta: "Work together",
  },
];

export const about = {
  heading: "Hey, I'm Jasmine.",
  paragraphs: [
    "My career began in corporate America, where I spent over a decade working with Fortune 500 companies, developing data-driven strategies and streamlining complex operations.",
    "From there I moved into real estate investing. Today I help small businesses optimize their growth through marketing and technology, and I guide homeowners and investors through their real estate decisions.",
  ],
};

export const passiveIncome = {
  heading: "Ready to earn double-digit returns backed by real estate?",
  intro:
    "Put your money to work in real estate without becoming a landlord. Investors fund vetted projects and earn returns secured by the property.",
  points: [
    { title: "Backed by real estate", body: "Your investment is secured by real property." },
    { title: "Truly passive", body: "No tenants, toilets or renovations to manage." },
    { title: "Clear reporting", body: "Know where your money is and how it's performing." },
  ],
  disclaimer:
    "Investing involves risk, including loss of principal. Past performance does not guarantee future results. This is not an offer to sell securities.",
};

export const loans = {
  heading: "Fund your deal",
  intro: "Financing for real estate investors. Tell me about your project and I'll help you find the right loan.",
  types: [
    { title: "Fix & Flip", body: "Short-term funding to buy and renovate properties for resale." },
    { title: "Ground Up Construction", body: "Financing for new builds, from lot to finished property." },
    { title: "Multifamily", body: "Loans for apartment buildings and multi-unit properties." },
    { title: "Rentals", body: "Long-term financing for buy-and-hold rental properties." },
  ],
};

// Add, remove or update events here. Leave `link` empty if there's no ticket page.
export const events = [
  {
    title: "National Co-Living Conference",
    date: "Date TBA",
    location: "Denver, CO",
    summary: "A national gathering on co-living and rent-by-the-room real estate.",
    link: "",
  },
  {
    title: "Women REI Meetup",
    date: "Date TBA",
    location: "Atlanta, GA",
    summary: "A meetup for women in real estate investing to connect, learn and do deals.",
    link: "",
  },
];

export const newsletter = {
  name: "Wealthy Notes",
  tagline: "Money & real estate insights",
  intro: "Practical tips on money, real estate and building wealth, delivered to your inbox.",
};
