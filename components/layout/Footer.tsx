"use client";

import Link from "next/link";

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "ChainVidya";

  return (
    <footer className="border-t border-border bg-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Left Side */}
        <Link href="/" className="font-mono text-xs text-dim hover:text-muted">
          &copy; {new Date().getFullYear()} {siteName}
        </Link>

        {/* Right Side */}
        <p className="text-center text-xs tracking-tight text-dim sm:text-right">
          Built by a student who got confused so you don&apos;t have to.
        </p>
      </div>
    </footer>
  );
}
