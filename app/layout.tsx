import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import ScrollReadout from "@/components/ScrollReadout";
import Preloader from "@/components/Preloader";

/**
 * Two families with clearly different jobs:
 * Newsreader (variable, optical size + true italic) carries every headline,
 * Archivo carries body copy and all UI chrome.
 */
const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-opsz-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const archivo = localFont({
  src: [
    { path: "./fonts/archivo-latin-wdth-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/archivo-latin-ext-wdth-normal.woff2", style: "normal", weight: "100 900" },
  ],
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matheenbukhari.com"),
  title: {
    default: "Matheen Bukhari — Creative Manager, Dubai",
    template: "%s — Matheen Bukhari",
  },
  description:
    "Creative Manager with 20+ years across property, retail and publishing in the UAE, UK and Asia. Brand, campaigns, digital and AI-enabled creative production.",
  openGraph: {
    title: "Matheen Bukhari — Creative Manager, Dubai",
    description:
      "Creative direction, brand systems and digital delivery for property brands across the UK, the Gulf and Asia.",
    type: "website",
    images: ["/media/og.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#D6D3CC",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body className="bg-paper text-ink" suppressHydrationWarning>
        <a
          href="#main"
          className="type-micro sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <ScrollReadout />
        </SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
