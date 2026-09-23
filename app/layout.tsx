import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { person } from "@/content/site";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
const dmSans = localFont({
  src: "./fonts/dm-sans.woff2",
  weight: "100 1000",
  variable: "--font-dm",
  display: "swap",
});
const caveat = localFont({
  src: "./fonts/caveat.woff2",
  weight: "600",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://illananemard09.github.io/portfolio";
const description =
  "Illana Nemard — Marketing, Communications & Event Manager in Melbourne. Strategic mind, creative execution, memorable experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${person.name} — Ideas into experiences`, template: `%s — ${person.name}` },
  description,
  keywords: ["event manager", "marketing", "communications", "Melbourne", "brand activation", "corporate events", "portfolio"],
  authors: [{ name: person.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${person.name} — Ideas into experiences`,
    description,
    siteName: person.name,
    locale: "en_AU",
  },
  twitter: { card: "summary_large_image", title: `${person.name} — Ideas into experiences`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#121110",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  url: siteUrl,
  sameAs: [person.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressCountry: "AU" },
  knowsLanguage: ["fr", "en", "es"],
  alumniOf: "INSEEC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
