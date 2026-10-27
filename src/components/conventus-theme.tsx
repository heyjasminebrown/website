import { Inter } from "next/font/google";

// Conventus body font; headings use the Helvetica/Arial bold from their materials (see .cv-page in globals.css).
const inter = Inter({ subsets: ["latin"], variable: "--font-cv-body" });

/** Wraps a page in Conventus branding: their fonts, and the site's accent colours swapped for Conventus ones. */
export function ConventusTheme({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} cv-page`}>{children}</div>;
}
