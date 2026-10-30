import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { siteUrl } from "@/content/site";
import { isLocale, locales } from "@/i18n/routing";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import "../globals.css";

// Decision 2026-10-26: Hanken Grotesk (OFL), a free stand-in for Numa's commercial Lausanne.
// Self-hosted at build time by next/font (no runtime request to Google).
const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});

// Editorial serif (OFL): italic accents in display type only.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("metaTitle"), template: "%s · Tripas-Coração" },
    description: t("metaDescription"),
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!isLocale(locale)) notFound();
  const t = await getTranslations("common");

  return (
    // suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, password managers…)
    // inject attributes on <html>/<body>. It only ignores attribute diffs on these two elements.
    <html lang={locale === "pt" ? "pt-PT" : "en"} className={`${hanken.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ConsentProvider>
            <a
              href="#main"
              className="label fixed top-3 left-3 z-[60] -translate-y-24 bg-ink px-4 py-3 text-paper focus:translate-y-0"
            >
              {t("skipToContent")}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <ConsentBanner />
          </ConsentProvider>
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  );
}
