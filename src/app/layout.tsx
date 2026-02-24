import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrainOverlay from "@/components/GrainOverlay";
import UtmCapture from "@/components/UtmCapture";
import SessionTracker from "@/components/SessionTracker";
import CookieConsent from "@/components/CookieConsent";
import { buildMetadata, buildWebsiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildWebsiteJsonLd() }}
        />
      </head>
      <body className="min-h-screen bg-neutral-950 text-white antialiased">
        <GrainOverlay />
        <UtmCapture />
        <SessionTracker />
        <Header />
        <main className="pt-[72px]">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
