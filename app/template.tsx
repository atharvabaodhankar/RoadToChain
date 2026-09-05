"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure scroll position resets cleanly to top on route change
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <div className="relative w-full flex-1">
      {/* ─── Barba.js Top Energy Sweep Indicator ─── */}
      <motion.div
        key={`barba-bar-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.7, 1],
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-accent via-purple-400 to-emerald-400 shadow-[0_0_12px_var(--accent)]"
      />

      {/* ─── Barba.js Page Content Smooth Glide & Fade ─── */}
      <motion.div
        key={`barba-page-${pathname}`}
        initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
}
