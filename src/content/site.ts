// All copy for the site lives here. Edit this file to change the wording on every page.

export const site = {
  name: "Hey Jasmine Brown",
  owner: "Jasmine Brown",
  tagline: "Finance & Real Estate",
  // Home page: the line under the big heading.
  subtagline: "Moving your wealth forward.",
  description:
    "Hard money loans for Atlanta real estate investors (fix & flip, new construction, DSCR and multifamily), plus money and real estate guidance from Jasmine Brown.",
  areaServed: "Atlanta, GA",
  url: "https://heyjasminebrown.com",
  email: "jasmine@heyjasminebrown.com",
  social: [
    { label: "Instagram", href: "https://instagram.com/heyjasminebrown" },
    // TODO: add your LinkedIn profile URL; the icon is hidden until it's set.
    { label: "LinkedIn", href: "" },
  ],
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Loan Products", href: "/conventus" },
  { label: "Referral", href: "/referral" },
  { label: "Calculator", href: "/calculator" },
  { label: "Events", href: "/events" },
  { label: "Wealthy Notes", href: "/blog" },
];

export const about = {
  heading: "Hey there, I’m Jasmine.",
  paragraphs: [
    "Thanks for stopping by my corner of the internet! My career began in corporate America, where I spent over a decade working with Fortune 500 companies to develop data-driven strategies and streamline complex operations. This foundation in risk management, strategy, and project leadership sharpened my ability to analyze challenges from multiple angles and deliver tailored, practical solutions. I later applied this strategic mindset to real estate investing, growing my own portfolio while helping others navigate buying, selling, and investing with confidence.",
    "Today, I combine my corporate expertise and real estate experience to support both small businesses and individual clients. I help businesses optimize growth through marketing and technology, while guiding homeowners and investors through their real estate decisions. With empathy and a results-focused approach, I provide personalized service designed to deliver clarity, confidence, and success across all my clients’ goals.",
    "Committed to open communication and thoughtful guidance, I work closely with each client to understand their unique needs and objectives. My aim is to make every business challenge and real estate transaction as smooth and rewarding as possible, so you can move forward with peace of mind. I look forward to the opportunity of working with you!",
  ],
};

// The buttons beside your photo on the home page.
export const homeLinks = [
  { label: "Fund Your Deal", href: "/quote" },
  { label: "Refer a Friend", href: "/referral" },
  { label: "Fix & Flip Calculator", href: "/calculator" },
  { label: "Upcoming Events", href: "/events" },
];

export const gallery = {
  heading: "Let’s Keep Growing Together!",
  photos: [
    { src: "/images/Jasmine-Closing-1.jpg", alt: "Jasmine Brown signing closing documents on a real estate deal" },
    { src: "/images/Jasmine-Closing-2.jpg", alt: "Jasmine Brown smiling while signing closing paperwork" },
    { src: "/images/Jasmine-Closing-3.jpg", alt: "Jasmine Brown celebrating in front of an investment property" },
  ],
  connect: "Let’s stay connected on Instagram & LinkedIn!",
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

// The loan options on the referral page (/referral).
export const referralLoanTypes = ["Fix and Flip", "New Construction", "DSCR", "Multifamily (5+ units)"];

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
