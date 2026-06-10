"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, LogIn, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/context/ProgressContext";

export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark" || "light";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "RoadToChain";
  const { 
    user, 
    loading, 
    signInWithGoogle, 
    logout, 
    isFirebaseConfigured
  } = useProgress();

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
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-text shrink-0 group">
            <div className="relative h-6 w-6 rounded border border-border/80 bg-bg2 overflow-hidden shadow-sm flex-shrink-0">
              <Image
                src="/logo.png"
                alt="RoadToChain Logo"
                fill
                sizes="24px"
                className="object-cover group-hover:scale-105 transition-transform duration-250 ease-out"
                priority
              />
            </div>
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

          {/* Desktop controls (Walkaround toggle, login/logout, CTA) */}
          <div className="hidden items-center gap-3 md:flex">


            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md bg-bg3 border border-border text-muted hover:text-text hover:border-border2 transition-all cursor-pointer h-7 w-7"
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Google Authentication Pill */}
            {loading ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg3 border border-border">
                <Loader2 className="h-3 w-3 animate-spin text-muted" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 rounded-md border border-border bg-bg2/80 pl-2 pr-1 py-1 font-mono text-xs text-text shadow-sm">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-5.5 w-5.5 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-text">
                    {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "U"}
                  </div>
                )}
                <span className="hidden lg:inline text-[9px] text-muted max-w-[80px] truncate">
                  {user.displayName || "Guest"}
                </span>
                <button
                  onClick={logout}
                  className="rounded p-1 text-dim hover:text-red-400 hover:bg-bg3 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg2 px-2.5 py-1.5 font-mono text-[9px] uppercase font-semibold text-muted hover:text-text hover:bg-bg3 transition-colors cursor-pointer"
                title={isFirebaseConfigured ? "Sign in with Google" : "Firebase not configured (using localStorage)"}
              >
                <LogIn className="h-3 w-3" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-[7px] bg-accent px-3 py-1.5 font-mono text-xs font-medium text-white transition-all hover:bg-accent2"
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

              {/* Mobile controls */}
              <div className="grid grid-cols-2 gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center rounded-md border border-border bg-bg3 p-2 text-muted hover:text-text"
                  title="Toggle Light/Dark Theme"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </button>



                {loading ? (
                  <div className="flex items-center justify-center rounded-md border border-border bg-bg3 p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted" />
                  </div>
                ) : user ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1 rounded-md border border-border bg-bg3 p-2 font-mono text-[9px] text-text hover:bg-bg4"
                  >
                    <LogOut className="h-3.5 w-3.5 text-muted" />
                    <span>OUT</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1 rounded-md border border-border bg-bg3 p-2 font-mono text-[9px] text-text hover:bg-bg4"
                  >
                    <LogIn className="h-3.5 w-3.5 text-muted" />
                    <span>IN</span>
                  </button>
                )}
              </div>

              <Link
                href="/learn"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[7px] bg-accent p-2.5 text-center font-mono text-xs font-semibold text-white transition-colors hover:bg-accent2"
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
