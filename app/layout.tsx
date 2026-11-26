import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Atkinson_Hyperlegible_Next,
} from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
});

export const viewport: Viewport = {
  themeColor: "#2a1740",
};

export const metadata: Metadata = {
  title: `${brand.name}: medication reminders`,
  description: brand.description,
  appleWebApp: {
    capable: true,
    title: brand.name,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${atkinson.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
