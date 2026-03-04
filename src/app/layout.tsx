import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrainOverlay from "@/components/GrainOverlay";
import UtmCapture from "@/components/UtmCapture";
import CookieConsent from "@/components/CookieConsent";
import { buildMetadata, buildWebsiteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter-latin-variable.woff2",
  display: "swap",
  variable: "--font-inter",
  weight: "100 900",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title="Quietly Cursed | The Atlas" href="/rss.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildWebsiteJsonLd() }}
        />
      </head>
      <body className="min-h-screen bg-neutral-950 text-white antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <GrainOverlay />
        <UtmCapture />
        <Header />
        <main id="main-content" className="pt-[72px]">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
