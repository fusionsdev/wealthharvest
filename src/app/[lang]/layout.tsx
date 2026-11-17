import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai, Instrument_Serif, Noto_Serif_Thai } from "next/font/google";
import { notFound } from "next/navigation";
import { getDict } from "@/i18n";
import { locales, site, type Locale } from "@/site.config";
import "../globals.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// Thai faces are not preloaded: English pages never request them.
const thaiSerif = Noto_Serif_Thai({ subsets: ["thai"], weight: ["400", "500"], variable: "--font-thai-serif", display: "swap", preload: false });
const thaiSans = IBM_Plex_Sans_Thai({ subsets: ["thai"], weight: ["400", "500"], variable: "--font-thai-sans", display: "swap", preload: false });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#0b0f0c", colorScheme: "dark" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const t = getDict(lang as Locale);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", th: "/th", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "th" ? "th_TH" : "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: ["/og.png"] },
  };
}

// Runs before first paint. Marks the document as animated only when the visitor allows motion.
const motionScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  const jsonLd = { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url };

  return (
    <html
      lang={lang}
      className={`${instrument.variable} ${geist.variable} ${geistMono.variable} ${thaiSerif.variable} ${thaiSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
