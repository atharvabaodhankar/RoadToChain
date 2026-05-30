"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnBlockchain";

  const links = [
    { name: "Curriculum", href: "/curriculum" },
    { name: "Autopsies", href: "/architecture-autopsies" },
    { name: "Mistakes", href: "/mistakes" },
    { name: "Learn Portal", href: "/learn" },
  ];

  // Logic to highlight current track color if in learn route
  const getActiveLinkStyle = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    if (!isActive) return "text-muted hover:text-text hover:bg-bg3";
    
    // Highlight based on current page
    if (pathname.includes("track-0")) return "text-track-0 bg-track-0/10 font-medium";
    if (pathname.includes("track-1")) return "text-track-1 bg-track-1/10 font-medium";
    if (pathname.includes("track-2")) return "text-track-2 bg-track-2/10 font-medium";
    if (pathname.includes("track-3")) return "text-track-3 bg-track-3/10 font-medium";
    if (pathname.includes("track-4")) return "text-track-4 bg-track-4/10 font-medium";
    if (pathname.includes("track-5")) return "text-track-5 bg-track-5/10 font-medium";
    if (pathname.includes("track-6")) return "text-track-6 bg-track-6/10 font-medium";
    if (pathname.includes("track-7")) return "text-track-7 bg-track-7/10 font-medium";

    return "text-accent bg-accent/10 font-medium";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight text-text">
            <span>{siteName}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 font-mono text-xs tracking-tight transition-colors ${getActiveLinkStyle(
                  link.href
                )}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-[7px] bg-accent px-3 py-1.5 font-mono text-xs font-medium text-text transition-all hover:bg-accent2"
            >
              Start Learning <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-bg3 hover:text-text md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-14 z-40 border-b border-border bg-bg2 px-4 py-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex rounded-md p-2.5 font-mono text-xs tracking-tight transition-colors ${getActiveLinkStyle(
                    link.href
                  )}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border" />
              <Link
                href="/learn"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[7px] bg-accent p-2.5 text-center font-mono text-xs font-semibold text-text transition-colors hover:bg-accent2"
              >
                Start Learning <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
