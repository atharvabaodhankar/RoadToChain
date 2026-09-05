"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reset scroll to top cleanly on route change
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <div className="relative w-full flex-1">
      {/* ─── Peak Cinematic Barba Shutter Curtain (Client-Only Animation) ─── */}
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.div
            key={`cinematic-curtain-${pathname}`}
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.82,
              delay: 0.22,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#08080b] border-b border-zinc-200/80 dark:border-white/10 overflow-hidden"
          >
            {/* Holographic Ambient Glow Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.8, 0.25], scale: [0.7, 1.25, 1] }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute w-[340px] h-[340px] rounded-full bg-purple-500/15 dark:bg-purple-600/30 blur-[100px] pointer-events-none"
            />

            {/* Cinematic Logo & HUD Centerpiece */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex flex-col items-center gap-4 z-10 select-none"
            >
              {/* Logo with Adaptive Violet Drop-Shadow */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_12px_28px_rgba(124,58,237,0.3)] dark:drop-shadow-[0_0_40px_rgba(168,85,247,0.7)] animate-pulse-slow">
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
                <div className="flex items-center gap-2 font-mono text-[9px] text-purple-700 dark:text-purple-400 font-semibold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                  <span>SYNCING STATE TRANSITION</span>
                </div>
              </div>
            </motion.div>

            {/* Trailing Luminous Energy Line at the bottom edge of the curtain */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent shadow-[0_0_20px_rgba(124,58,237,0.5)] dark:shadow-[0_0_24px_#a855f7]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Page Content Cinematic Rise ─── */}
      <motion.div
        key={`cinematic-content-${pathname}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
}
