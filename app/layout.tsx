import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Serif_Devanagari } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-devanagari",
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  title: "Pal | A Moment That Saves a Life",
  description: "Discreet AI-Powered SOS System for Domestic Abuse Survivors. Pal looks like a recipe app — behind a secret gesture lies a life-saving system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${notoSerifDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-text bg-dawn">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
