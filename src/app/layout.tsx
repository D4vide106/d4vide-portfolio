import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LiveStatsProvider } from "@/context/LiveStatsContext";
import { LanguageProvider } from "@/context/LanguageContext";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "D4VIDE106 // CREATOR & DEVELOPER",
  description: "Game Developer, Software Creator & Content Creator - Official Portfolio & Projects",
  icons: {
    icon: "https://mc-heads.net/avatar/_D4vide106_/64",
    shortcut: "https://mc-heads.net/avatar/_D4vide106_/64",
    apple: "https://mc-heads.net/avatar/_D4vide106_/64",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <LanguageProvider>
          <LiveStatsProvider>{children}</LiveStatsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
