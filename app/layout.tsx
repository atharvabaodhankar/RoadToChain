import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { ProgressProvider } from "@/app/context/ProgressContext";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, educationalOrganizationSchema } from "@/lib/seo";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roadtochain.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RoadToChain — Learn Web3 & Blockchain Engineering",
    template: "%s · RoadToChain",
  },
  description:
    "Learn Web3 engineering the right way. 8 structured tracks covering blockchain fundamentals, Solidity, ERC-4337 account abstraction, ZK proofs with Circom, DeFi protocols, and more. Built from real shipped projects. No hype — real systems.",
  keywords: [
    // Core learning intent
    "learn web3",
    "learn blockchain",
    "learn ethereum",
    "web3 tutorial",
    "blockchain course free",
    "web3 for beginners",
    "web3 engineering education",
    // Solidity / Smart contracts
    "solidity tutorial",
    "solidity course",
    "smart contract development",
    "smart contract security",
    "learn solidity from scratch",
    // Account Abstraction
    "ERC-4337 tutorial",
    "account abstraction explained",
    "account abstraction ethereum",
    "ERC-4337 course",
    "smart wallet development",
    // ZK / Circom
    "ZK proof tutorial",
    "zero knowledge proof explained",
    "circom tutorial",
    "snarkjs tutorial",
    "zkSNARK course",
    // DeFi / Protocols
    "DeFi protocol tutorial",
    "uniswap v3 explained",
    "AMM how it works",
    "defi engineering",
    // Wallets
    "privy embedded wallet tutorial",
    "web3 wallet integration",
    "wagmi tutorial",
    // Infrastructure
    "the graph tutorial",
    "blockchain indexing",
    "subgraph development",
    "web3 backend",
    // Brand
    "roadtochain",
    "roadtochain.tech",
  ],
  authors: [{ name: "Atharva Baodhankar", url: "https://atharvabaodhankar.me" }],
  creator: "Atharva Baodhankar",
  publisher: "RoadToChain",
  category: "Education",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RoadToChain",
    title: "RoadToChain — Learn Web3 & Blockchain Engineering",
    description:
      "8 tracks from blockchain basics to ZK proofs. Built from real shipped projects. No hype — real systems. Free Web3 engineering education.",
    images: [
      {
        url: `${siteUrl}/api/og?title=RoadToChain+%E2%80%94+Learn+Web3+Engineering&track=Web3+Engineering`,
        width: 1200,
        height: 630,
        alt: "RoadToChain — Web3 Engineering Education Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@roadtochain",
    title: "RoadToChain — Learn Web3 & Blockchain Engineering",
    description:
      "8 tracks from blockchain basics to ZK proofs. No hype — real engineering. Free.",
    images: [
      `${siteUrl}/api/og?title=RoadToChain+%E2%80%94+Learn+Web3+Engineering&track=Web3+Engineering`,
    ],
    creator: "@atharvabaodhankar",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
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
        <JsonLd schema={[organizationSchema(), websiteSchema(), educationalOrganizationSchema()]} />
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

