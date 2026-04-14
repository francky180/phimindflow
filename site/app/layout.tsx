import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHIMINDFLOW — Premium Broker, Course & Management System",
  description:
    "A structured path to broker setup, education, and premium management. Follow the proven 3-step Fibonacci growth system.",
  metadataBase: new URL("https://phimindflow.com"),
  openGraph: {
    title: "PHIMINDFLOW — Structured Wealth. Zero Guesswork.",
    description:
      "Three steps. One system. Open your broker, learn the Fibonacci framework, then step into premium management.",
    siteName: "PHIMINDFLOW",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PHIMINDFLOW — Structured Wealth. Zero Guesswork.",
    description:
      "A precision-built 3-step growth system. Broker setup, elite education, premium management.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PHIMINDFLOW",
  url: "https://phimindflow.com",
  description:
    "A precision-built growth system using Fibonacci mathematics. Broker setup, elite education, and premium capital management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] font-[family-name:var(--font-inter)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
