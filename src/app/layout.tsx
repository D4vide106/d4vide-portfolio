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
  themeColor: "#00f2fe",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://d4vide106.github.io/d4vide-portfolio/"),
  title: "D4VIDE106 // CREATOR & DEVELOPER",
  description: "Game Developer, Software Creator & Content Creator • Modpack, Mod Minecraft, Mappe Roblox e Tool per la community.",
  keywords: [
    "D4vide106",
    "Game Developer",
    "Software Creator",
    "Minecraft Mods",
    "Minecraft Modpacks",
    "Roblox Maps",
    "Infinity Project Studios",
  ],
  authors: [{ name: "Davide (D4vide106)", url: "https://d4vide106.github.io/d4vide-portfolio/" }],
  creator: "D4vide106",
  publisher: "D4vide106",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://d4vide106.github.io/d4vide-portfolio/",
    siteName: "D4VIDE106 Portfolio",
    title: "D4VIDE106 // CREATOR & DEVELOPER",
    description: "Game Developer, Software Creator & Content Creator • Modpack, Mod Minecraft, Mappe Roblox e Tool per la community.",
    images: [
      {
        url: "https://d4vide106.github.io/d4vide-portfolio/og-banner.jpg",
        secureUrl: "https://d4vide106.github.io/d4vide-portfolio/og-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "D4VIDE106 - Official Portfolio Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@d4vide106",
    creator: "@d4vide106",
    title: "D4VIDE106 // CREATOR & DEVELOPER",
    description: "Game Developer, Software Creator & Content Creator • Modpack, Mod Minecraft, Mappe Roblox e Tool per la community.",
    images: ["https://d4vide106.github.io/d4vide-portfolio/og-banner.jpg"],
  },
  icons: {
    icon: "https://mc-heads.net/avatar/_D4vide106_/64",
    shortcut: "https://mc-heads.net/avatar/_D4vide106_/64",
    apple: "https://mc-heads.net/avatar/_D4vide106_/64",
  },
  other: {
    "theme-color": "#00f2fe",
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
