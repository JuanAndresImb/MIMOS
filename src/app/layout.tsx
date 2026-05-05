import type { Metadata } from "next";
import localFont from "next/font/local";
import { Caveat, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const asteria = localFont({
  src: "../../public/fonts/Asteria-DEMO.ttf",
  variable: "--font-script",
  display: "swap",
});

const mackinac = localFont({
  src: [
    { path: "../../public/fonts/P22MackinacPro-Book.woff2",       weight: "400", style: "normal" },
    { path: "../../public/fonts/P22MackinacPro-BookItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/P22MackinacPro-Medium.woff2",     weight: "500", style: "normal" },
    { path: "../../public/fonts/P22MackinacPro-Bold.woff2",       weight: "700", style: "normal" },
    { path: "../../public/fonts/P22MackinacPro-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../../public/fonts/P22MackinacPro-ExtraBold.woff2",  weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MIMOS — Des attentions artisanales belges",
    template: "%s — MIMOS",
  },
  description:
    "Envoie une douceur artisanale belge avec ton message, soigneusement emballée. Sans déplacement, sans galère. Juste de la sincérité.",
  metadataBase: new URL("https://mimos.be"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${asteria.variable} ${outfit.variable} ${caveat.variable} ${mackinac.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
