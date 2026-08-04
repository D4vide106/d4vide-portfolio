import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Jua } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const jua = Jua({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-jua',
});

export const metadata: Metadata = {
  title: "_D4vide106_ Portfolio",
  description: "Minecraft Mod Developer and Content Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${jua.variable} font-sans`}>{children}</body>
    </html>
  );
}
