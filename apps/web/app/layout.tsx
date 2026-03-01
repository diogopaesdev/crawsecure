import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:  "CrawSecure — Scan skills. Keep your code.",
    template: "%s | CrawSecure",
  },
  description:
    "Privacy-first security scanner for ClawHub skills. Analysis runs locally — your files never leave your machine.",
  icons: {
    icon:     [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple:    "/icon.svg",
  },
  openGraph: {
    title:       "CrawSecure — Scan skills. Keep your code.",
    description: "Privacy-first security scanner for ClawHub skills. Analysis runs locally — your files never leave your machine.",
    url:         "https://crawsecure.com",
    siteName:    "CrawSecure",
    locale:      "en_US",
    type:        "website",
  },
  twitter: {
    card:        "summary",
    title:       "CrawSecure",
    description: "Privacy-first security scanner for ClawHub skills.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
