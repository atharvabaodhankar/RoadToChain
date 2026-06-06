import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { ProgressProvider } from "@/app/context/ProgressContext";

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
    <html lang="en" suppressHydrationWarning>
      <head>
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

