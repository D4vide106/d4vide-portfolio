import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "D4vide106 | Portfolio",
  description: "Portfolio of D4vide106 AKA Davide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ptSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
