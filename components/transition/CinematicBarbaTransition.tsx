"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cinematic Barba-style page transition.
 *
 * Flow:
 *  idle → mountEnter (curtain mounts off-screen at bottom)
 *       → enter (curtain animates UP from bottom to cover viewport)
 *       → covered (route changes under curtain)
 *       → exit (curtain animates UP out through top)
 *       → idle
 */

type Phase =
  | "idle"
  | "mountEnter" // mounted at translateY(100%), waiting one frame
  | "enter"      // animating to translateY(0%)
  | "covered"    // holding at translateY(0%), route changing underneath
  | "exit";      // animating to translateY(-100%)

const ENTER_MS = 380;    // curtain slides up to cover (snappy & responsive)
const HOLD_MS = 140;     // hold while new page renders
const EXIT_MS = 300;     // curtain slides out through top
const SAFETY_MS = 3500;  // hard reset if stuck

export default function CinematicBarbaTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const targetHref = useRef<string | null>(null);
  const prevPathname = useRef(pathname);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafety = useCallback(() => {
    if (safetyRef.current) clearTimeout(safetyRef.current);
    safetyRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearSafety();
    setPhase("idle");
    targetHref.current = null;
  }, [clearSafety]);

  // ─── 1. Click interceptor ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      // Block clicks during transition
      if (phase !== "idle") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        /^(https?:|mailto:|tel:|#)/.test(href)
      )
        return;

      const target = new URL(href, window.location.origin);
      if (
        target.pathname === pathname &&
        target.search === window.location.search
      )
        return;

      e.preventDefault();
      e.stopImmediatePropagation();

      targetHref.current = target.pathname + target.search;
      prevPathname.current = pathname;

      // Mount curtain off-screen, then trigger animation next frame
      setPhase("mountEnter");

      // Safety: force-reset if anything goes wrong
      clearSafety();
      safetyRef.current = setTimeout(reset, SAFETY_MS);
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [pathname, phase, clearSafety, reset]);

  // ─── 2. mountEnter → enter (one-frame delay for CSS to pick up initial position)
  useEffect(() => {
    if (phase !== "mountEnter") return;

    // Double rAF guarantees the browser has painted the initial position
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("enter");
      });
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  // ─── 3. enter finishes → covered → push route ─────────────────
  useEffect(() => {
    if (phase !== "enter") return;

    const timer = setTimeout(() => {
      setPhase("covered");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      if (targetHref.current) {
        router.push(targetHref.current);
      }
    }, ENTER_MS);

    return () => clearTimeout(timer);
  }, [phase, router]);

  // ─── 4. covered → wait for pathname change → exit ──────────────
  useEffect(() => {
    if (phase !== "covered") return;

    if (pathname !== prevPathname.current) {
      // New page is rendered – hold briefly then exit
      const timer = setTimeout(() => setPhase("exit"), HOLD_MS);
      return () => clearTimeout(timer);
    }
    // If pathname hasn't changed yet, this effect re-runs when it does
  }, [phase, pathname]);

  // ─── 5. exit finishes → idle ───────────────────────────────────
  useEffect(() => {
    if (phase !== "exit") return;

    const timer = setTimeout(() => {
      reset();
    }, EXIT_MS);

    return () => clearTimeout(timer);
  }, [phase, reset]);

  // ─── Don't render when idle ────────────────────────────────────
  if (phase === "idle") return null;

  // ─── Compute inline styles ─────────────────────────────────────
  let transform: string;
  let transition: string;

  switch (phase) {
    case "mountEnter":
      // Start position: fully below viewport, NO transition
      transform = "translateY(100%)";
      transition = "none";
      break;
    case "enter":
      // Animate from 100% → 0% (bottom to center)
      transform = "translateY(0%)";
      transition = `transform ${ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      break;
    case "covered":
      // Stay covering the screen
      transform = "translateY(0%)";
      transition = "none";
      break;
    case "exit":
      // Animate from 0% → -100% (center to above viewport)
      transform = "translateY(-100%)";
      transition = `transform ${EXIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      break;
    default:
      transform = "translateY(100%)";
      transition = "none";
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "all",
        transform,
        transition,
        willChange: "transform",
      }}
      className="flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#08080b] overflow-hidden"
    >
      {/* Top energy line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />

      {/* Ambient glow - lightweight blur on mobile */}
      <div
        className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-purple-500/15 dark:bg-purple-600/25 blur-[36px] sm:blur-[80px] pointer-events-none"
        style={{
          opacity: phase === "mountEnter" ? 0 : 0.85,
          transform: phase === "mountEnter" ? "scale(0.6)" : "scale(1.1)",
          transition:
            phase !== "mountEnter"
              ? "opacity 0.3s ease-out, transform 0.3s ease-out"
              : "none",
        }}
      />

      {/* Logo + brand */}
      <div
        className="relative flex flex-col items-center gap-5 z-10 select-none"
        style={{
          opacity: phase === "mountEnter" ? 0 : 1,
          transform:
            phase === "mountEnter"
              ? "scale(0.7) translateY(20px)"
              : "scale(1) translateY(0px)",
          transition:
            phase !== "mountEnter"
              ? "opacity 0.35s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "none",
        }}
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

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-sm sm:text-base font-bold tracking-[0.3em] text-zinc-900 dark:text-white uppercase drop-shadow-sm dark:drop-shadow">
            ROADTOCHAIN
          </span>
          <span className="font-sans text-[11px] sm:text-xs font-medium tracking-[0.15em] text-zinc-500 dark:text-zinc-400 uppercase">
            Learn Web3 Engineering
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="w-32 sm:w-40 h-[2px] rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mt-1">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600"
            style={{
              width: phase === "mountEnter" ? "0%" : phase === "enter" ? "60%" : phase === "covered" ? "85%" : "100%",
              transition: phase === "mountEnter" ? "none" : 
                phase === "enter" ? `width ${ENTER_MS}ms ease-out` :
                phase === "covered" ? `width ${HOLD_MS}ms ease-out` :
                `width ${EXIT_MS * 0.6}ms ease-out`,
            }}
          />
        </div>
      </div>

      {/* Bottom energy line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />
    </div>
  );
}
