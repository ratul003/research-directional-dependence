import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://research-directional-dependence.vercel.app"),
  title: "Modeling Bivariate Directional Dependence, Wahid Tawsif Ratul",
  description:
    "Senior thesis, University of Minnesota Morris (Ratul & Sungur): a simulation study using order statistics and concomitants to detect bivariate directional dependence. Uniform-distributed variables show the strongest asymmetry.",
  openGraph: {
    title: "Modeling Bivariate Directional Dependence",
    description: "Order statistics, concomitants, and a sampling algorithm for detecting which variable drives which.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modeling Bivariate Directional Dependence",
    description: "A simulation study with order statistics and concomitants.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}<Analytics /></body>
    </html>
  );
}
