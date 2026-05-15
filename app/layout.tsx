import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "LearnBlockchain",
    template: `%s · ${process.env.NEXT_PUBLIC_SITE_NAME || "LearnBlockchain"}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Modern Web3 engineering for the next generation of builders. No hype. Real systems.",
  openGraph: {
    type: "website",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "LearnBlockchain",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text min-h-screen flex flex-col font-sans`}
      >
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
