"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cinematic Barba-style page transition.
 *
 * Flow:
 *  1. User clicks an internal link → we intercept, prevent default,
 *     and start the "enter" phase (curtain slides UP from bottom to center).
 *  2. Once curtain covers the viewport → we push the route and wait for
 *     the pathname to actually change. Screen is fully covered so user
 *     sees nothing.
 *  3. Pathname changes → "exit" phase (curtain slides UP out of viewport).
 *  4. Done → reset to idle.
 *
 * Key fixes over previous version:
 *  - Uses CSS transitions instead of spring for enter (spring onAnimationComplete is unreliable).
 *  - Explicit timing with setTimeout for the covered→exit transition.
 *  - Safety timeout to prevent permanent stuck state.
 *  - Proper Next.js Link interception (works with <Link> prefetching).
 */

type Phase = "idle" | "enter" | "covered" | "exit";

const ENTER_DURATION = 500; // ms for curtain to slide up to center
const COVERED_DELAY = 200; // ms to wait while covered (let new page render)
const EXIT_DURATION = 450; // ms for curtain to slide out
const SAFETY_TIMEOUT = 4000; // ms max time before force-resetting

export default function CinematicBarbaTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const targetHref = useRef<string | null>(null);
  const prevPathname = useRef(pathname);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up safety timer
  const clearSafety = useCallback(() => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  }, []);

  // Force reset everything to idle
  const forceReset = useCallback(() => {
    clearSafety();
    setPhase("idle");
    targetHref.current = null;
  }, [clearSafety]);

  // Start a safety timeout that force-resets if transition gets stuck
  const startSafety = useCallback(() => {
    clearSafety();
    safetyTimer.current = setTimeout(() => {
      console.warn("[Transition] Safety timeout – force resetting");
      forceReset();
    }, SAFETY_TIMEOUT);
  }, [clearSafety, forceReset]);

  // ─── Phase 1: Intercept clicks ──────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Only left-click without modifiers
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      // Already transitioning – block
      if (phase !== "idle") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external, hash, download, blank-target links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        /^(https?:|mailto:|tel:|#)/.test(href)
      ) {
        return;
      }

      // Build full URL to compare
      const target = new URL(href, window.location.origin);
      if (
        target.pathname === pathname &&
        target.search === window.location.search
      ) {
        return; // same page
      }

      // ── Start transition ──
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      targetHref.current = target.pathname + target.search;
      prevPathname.current = pathname;
      setPhase("enter");
      startSafety();
    };

    // Capture phase so we fire before Next.js Link handlers
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, phase, startSafety]);

  // ─── Phase 2: Enter complete → push route ───────────────────────
  useEffect(() => {
    if (phase !== "enter") return;

    const timer = setTimeout(() => {
      setPhase("covered");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (targetHref.current) {
        router.push(targetHref.current);
      }
    }, ENTER_DURATION);

    return () => clearTimeout(timer);
  }, [phase, router]);

  // ─── Phase 3: Wait for pathname change → exit ───────────────────
  useEffect(() => {
    if (phase !== "covered") return;

    // Pathname actually changed – start exit
    if (pathname !== prevPathname.current) {
      const timer = setTimeout(() => {
        setPhase("exit");
      }, COVERED_DELAY);
      return () => clearTimeout(timer);
    }

    // If pathname hasn't changed yet, we'll catch it on next render
    // (this effect re-runs when pathname changes because it's a dependency)
  }, [phase, pathname]);

  // ─── Phase 4: Exit complete → idle ──────────────────────────────
  useEffect(() => {
    if (phase !== "exit") return;

    const timer = setTimeout(() => {
      forceReset();
    }, EXIT_DURATION);

    return () => clearTimeout(timer);
  }, [phase, forceReset]);

  // ─── Don't render anything when idle ────────────────────────────
  if (phase === "idle") return null;

  // ─── Compute curtain position ───────────────────────────────────
  const getTransform = (): string => {
    switch (phase) {
      case "enter":
        return "translateY(0%)"; // slide to center
      case "covered":
        return "translateY(0%)"; // stay covering
      case "exit":
        return "translateY(-100%)"; // slide out through top
      default:
        return "translateY(100%)"; // off-screen below
    }
  };

  const getTransition = (): string => {
    switch (phase) {
      case "enter":
        return `transform ${ENTER_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      case "exit":
        return `transform ${EXIT_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      default:
        return "none";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: phase === "idle" ? "none" : "all",
        transform: phase === "idle" ? "translateY(100%)" : getTransform(),
        transition: getTransition(),
      }}
      className="flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#08080b] overflow-hidden"
    >
      {/* Top energy line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />

      {/* Ambient glow */}
      <motion.div
        key={`glow-${phase}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.85, scale: 1.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute w-[360px] h-[360px] rounded-full bg-purple-500/15 dark:bg-purple-600/30 blur-[110px] pointer-events-none"
      />

      {/* Logo + brand */}
      <motion.div
        key={`logo-${phase}`}
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex flex-col items-center gap-4 z-10 select-none"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_12px_28px_rgba(124,58,237,0.3)] dark:drop-shadow-[0_0_40px_rgba(168,85,247,0.7)]">
          <Image
            src="/logo.png?v=4"
            alt="RoadToChain"
            fill
            sizes="80px"
            priority
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="font-mono text-xs font-bold tracking-[0.3em] text-zinc-900 dark:text-white uppercase drop-shadow-sm dark:drop-shadow">
            ROADTOCHAIN
          </span>
        </div>
      </motion.div>

      {/* Bottom energy line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />
    </div>
  );
}
