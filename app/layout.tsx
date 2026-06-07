import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { ProgressProvider } from "@/app/context/ProgressContext";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChainVidya — Learn Web3 Engineering",
    template: "%s · ChainVidya",
  },
  description: "Modern Web3 engineering education. 8 tracks from blockchain foundations to ZK proofs. Built from real shipped projects — Socio3, ProofChain, ChainCure, ZeroLeak. No hype. Real systems.",
  keywords: [
    "learn web3",
    "blockchain tutorial",
    "solidity course",
    "ERC-4337 tutorial",
    "account abstraction explained",
    "circom zk proof tutorial",
    "learn ethereum development",
    "web3 for beginners",
    "smart contract security",
    "privy embedded wallet tutorial"
  ],
  authors: [{ name: "Atharva Baodhankar", url: "https://atharvabaodhankar.me" }],
  creator: "Atharva Baodhankar",
  publisher: "ChainVidya",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ChainVidya",
    title: "ChainVidya — Learn Web3 Engineering",
    description: "Modern Web3 engineering education. No hype. Real systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChainVidya — Web3 Engineering Education",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainVidya — Learn Web3 Engineering",
    description: "Modern Web3 engineering. No hype. Real systems.",
    images: ["/og-twitter.png"],
    creator: "@atharvabaodhankar",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-bg text-text min-h-screen flex flex-col font-sans`}
      >
        <ProgressProvider>
          <Nav />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}

