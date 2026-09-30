import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/content/access";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { Analytics } from "@/components/site/analytics";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { RevealController } from "@/components/site/reveal-controller";
import { StickyMobileCTA } from "@/components/site/sticky-cta";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const condensed = Barlow_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/");
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const jsonLd = localBusinessJsonLd(settings);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${condensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-flare focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyMobileCTA />
        <Analytics />
        <RevealController />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
