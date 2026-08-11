import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LiveStatsProvider } from "@/context/LiveStatsContext";

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
  description: "Minecraft Mod Developer, Game Creator and Content Creator",
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
    <html lang="en">
      <body className={`${syne.variable} ${spaceGrotesk.variable} font-sans`}>
        <LiveStatsProvider>{children}</LiveStatsProvider>
      </body>
    </html>
  );
}
