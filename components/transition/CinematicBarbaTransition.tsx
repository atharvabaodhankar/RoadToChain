"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type TransitionPhase = "idle" | "entering" | "covered" | "leaving";

export default function CinematicBarbaTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const targetUrlRef = useRef<string | null>(null);
  const isNavigatingRef = useRef(false);

  // Global click interceptor to orchestrate real Barba-style two-phase transitions
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Only handle primary left click without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (isNavigatingRef.current) {
        e.preventDefault();
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore anchor targets, downloads, or external links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        rawHref.startsWith("http://") ||
        rawHref.startsWith("https://") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("#")
      ) {
        return;
      }

      // Normalize internal path
      const url = new URL(rawHref, window.location.href);
      const currentUrl = new URL(window.location.href);

      // If clicking the current page without query change, do nothing
      if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
        return;
      }

      // Begin two-phase Barba transition
      e.preventDefault();
      isNavigatingRef.current = true;
      targetUrlRef.current = url.pathname + url.search;

      // Phase 1: Curtain sweeps UP from bottom to center with elastic spring over current page
      setPhase("entering");
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [pathname]);

  // When curtain reaches center ("entering" finished), trigger Next.js route push
  const handleEnterComplete = () => {
    if (phase === "entering" && targetUrlRef.current) {
      setPhase("covered");
      // Clean scroll to top while screen is completely covered
      window.scrollTo({ top: 0, left: 0 });
      // Execute the route change underneath the covered curtain
      router.push(targetUrlRef.current);
    }
  };

  // When pathname changes after route push, trigger Phase 2: curtain launches up to top
  useEffect(() => {
    if (phase === "covered" || phase === "entering") {
      // Small pause to let new route render under curtain
      const timer = setTimeout(() => {
        setPhase("leaving");
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [pathname, phase]);

  // When curtain exits through top ("leaving" finished), reset to idle
  const handleLeaveComplete = () => {
    if (phase === "leaving") {
      setPhase("idle");
      targetUrlRef.current = null;
      isNavigatingRef.current = false;
    }
  };

  if (phase === "idle") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="barba-elastic-curtain"
        initial={{ y: "100%" }}
        animate={
          phase === "entering"
            ? { y: "0%" }
            : phase === "covered"
            ? { y: "0%" }
            : { y: "-100%" }
        }
        transition={
          phase === "entering"
            ? {
                // Elastic bouncy spring into center
                type: "spring",
                stiffness: 130,
                damping: 15,
                mass: 0.9,
              }
            : {
                // Sleek accelerating launch upward out of top
                duration: 0.65,
                ease: [0.76, 0, 0.24, 1],
              }
        }
        onAnimationComplete={() => {
          if (phase === "entering") {
            handleEnterComplete();
          } else if (phase === "leaving") {
            handleLeaveComplete();
          }
        }}
        className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#08080b] border-y border-zinc-200/80 dark:border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Top Leading Luminous Energy Blade */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />

        {/* Holographic Ambient Glow Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.85, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute w-[360px] h-[360px] rounded-full bg-purple-500/15 dark:bg-purple-600/30 blur-[110px] pointer-events-none"
        />

        {/* Centerpiece Logo & HUD with Elastic Bounce */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{
            opacity: 1,
            scale: [0.6, 1.15, 0.96, 1.0], // Elastic rubber-band pop!
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative flex flex-col items-center gap-4 z-10 select-none"
        >
          {/* Logo with Elastic Pulse */}
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

          {/* Micro HUD System Identity */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-zinc-900 dark:text-white uppercase drop-shadow-sm dark:drop-shadow">
              ROADTOCHAIN
            </span>
          </div>
        </motion.div>

        {/* Bottom Trailing Luminous Energy Blade */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_24px_rgba(124,58,237,0.6)] dark:shadow-[0_0_24px_#a855f7]" />
      </motion.div>
    </AnimatePresence>
  );
}
