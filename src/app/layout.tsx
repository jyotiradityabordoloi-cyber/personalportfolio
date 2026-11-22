import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";

const sans = Geist({ subsets: ["latin"], variable: "--ff-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--ff-mono", display: "swap" });
// Heavy geometric sans for the big statements (EXPLORE MY PORTFOLIO, ABOUT ME, LET'S TALK)
const display = Montserrat({ subsets: ["latin"], weight: ["700", "800"], variable: "--ff-display", display: "swap" });
// Classic serif for the quiet lines ("Turning ideas into…")
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--ff-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — Product Portfolio`,
  description: site.intro,
  openGraph: {
    title: `${site.name} — Product Portfolio`,
    description: site.intro,
    images: ["/images/hero-source.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#050505" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable} ${display.variable} ${serif.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
