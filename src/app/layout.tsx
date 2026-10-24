import type { Metadata } from "next";
import { Marcellus, PT_Serif } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/content/site";
import "./globals.css";

const display = Marcellus({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = PT_Serif({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    images: [{ url: "/images/Jasmine-Home-1.jpg", width: 1365, height: 2048, alt: site.owner }],
  },
  twitter: { card: "summary_large_image" },
};

// Tells search engines and AI who this is, what she offers and where, in a format they read directly.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: site.url,
      email: site.email,
      description: site.description,
      image: `${site.url}/images/Jasmine-Home-1.jpg`,
      logo: `${site.url}/icon.png`,
      areaServed: { "@type": "City", name: "Atlanta", containedInPlace: { "@type": "State", name: "Georgia" } },
      founder: { "@id": `${site.url}/#jasmine` },
      sameAs: site.social.map((s) => s.href).filter(Boolean),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Real estate investor loans",
        itemListElement: ["Fix and flip loans", "New construction loans", "DSCR loans", "Multifamily loans"].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "LoanOrCredit", name },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#jasmine`,
      name: site.owner,
      url: `${site.url}/about`,
      image: `${site.url}/images/Jasmine-Home-1.jpg`,
      description: "Real estate investor helping Atlanta investors fund their deals and small businesses grow.",
      sameAs: site.social.map((s) => s.href).filter(Boolean),
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, publisher: { "@id": `${site.url}/#business` } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
