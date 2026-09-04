"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PixelBlast from "./PixelBlast";
import CardSwap, { Card } from "./CardSwap";

// ─── Confusion Archive Data & Component ───────────────────────────────────────
interface ConfusionCard {
  id: string;
  shortLabel: string;
  question: string;
  assumption: string;
  reality: string;
  concepts: string[];
}

const CONFUSION_CARDS: ConfusionCard[] = [
  {
    id: "01",
    shortLabel: "NETWORK",
    question: "Who runs blockchain?",
    assumption: "Google has blockchain servers",
    reality: "Distributed node network.",
    concepts: ["Nodes", "Consensus"],
  },
  {
    id: "02",
    shortLabel: "STORAGE",
    question: "Where are coins stored?",
    assumption: "Inside MetaMask",
    reality: "Stored as blockchain state.",
    concepts: ["Private Keys", "Ownership"],
  },
  {
    id: "03",
    shortLabel: "GAS COST",
    question: "Why does failed transaction cost money?",
    assumption: "It didn't work.",
    reality: "Validators still executed computation.",
    concepts: ["Gas Limit", "EVM Exec"],
  },
  {
    id: "04",
    shortLabel: "UX FAIL",
    question: "Why Web3 onboarding sucks?",
    assumption: "12-word seed phrase is standard UX",
    reality: "Embedded account abstraction.",
    concepts: ["ERC-4337", "UX"],
  },
  {
    id: "05",
    shortLabel: "HYBRID ARCH",
    question: "Can blockchain replace backend?",
    assumption: "Everything can be on-chain.",
    reality: "Modern systems are hybrid.",
    concepts: ["Limits", "Hybrid Arch"],
  },
];

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark") || 
                     document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class", "data-theme"] 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative w-full flex items-center px-6 sm:px-10 lg:px-16"
      style={{
        minHeight: "88vh",
        paddingTop: "7rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Interactive WebGL background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95 select-none transition-opacity duration-300">
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color={theme === "dark" ? "#a78bfa" : "#6d28d9"}
          patternScale={7}
          patternDensity={theme === "dark" ? 0.95 : 1.35}
          pixelSizeJitter={0.41}
          enableRipples={true}
          rippleSpeed={0.25}
          rippleThickness={0.1}
          rippleIntensityScale={theme === "dark" ? 1.2 : 1.8}
          liquid={true}
          liquidStrength={0.08}
          liquidRadius={1.0}
          speed={0.9}
          edgeFade={0.65}
        />
      </div>

      {/* Soft accent glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 25% 55%, color-mix(in srgb, var(--accent) 5%, transparent), transparent)",
        }}
      />

      {/* ── Content Grid ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (Editorial Content) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* ── Headline ── */}
          <h1 className="flex flex-col tracking-tight animate-none" style={{ lineHeight: 1.05 }}>

            {/* Web3 */}
            <span
              className="hero-reveal font-extrabold"
              style={{ fontSize: "clamp(2.8rem, 6.2vw, 5.2rem)", color: "var(--text)" }}
            >
              Web3
            </span>

            {/* explained — premium editorial serif style */}
            <span
              className="hero-reveal hero-delay-1 font-serif font-light italic text-[40px] md:text-[72px] text-accent"
              style={{
                paddingLeft: "0.75rem",
                lineHeight: 1.1,
              }}
            >
              explained
            </span>

            {/* by someone who */}
            <span
              className="hero-reveal hero-delay-2 font-light"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 3.0rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.1,
              }}
            >
              by someone who
            </span>

            {/* recently got it. */}
            <span
              className="hero-reveal hero-delay-3 font-black tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 6.8vw, 5.2rem)",
                color: "var(--text)",
                lineHeight: 1.05,
                paddingBottom: "0.1em", /* prevent descender clip */
              }}
            >
              recently{" "}
              <span style={{ color: "var(--accent)" }}>got it.</span>
            </span>
          </h1>

          {/* ── Subtext ── */}
          <p
            className="hero-reveal hero-delay-4 text-base leading-relaxed max-w-lg"
            style={{
              color: "var(--text-secondary)",
              marginTop: "2rem",
              paddingLeft: "1.25rem",
              borderLeft: "1px solid var(--border2)",
            }}
          >
            8 progressive engineering tracks. Over 40 deep-dive modules.
            No superficial hand-waving. Every real system failure is fully documented.
          </p>

          {/* ── CTAs ── */}
          <div
            className="hero-reveal hero-delay-4 flex flex-col sm:flex-row gap-4"
            style={{ marginTop: "2.5rem" }}
          >
            <Link
              href="/learn/track-0"
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              style={{
                backgroundColor: "var(--accent)",
                boxShadow: "0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
              />
              <span className="relative flex items-center gap-2">
                Begin Track 0 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              style={{
                border: "1px solid var(--border2)",
                color: "var(--text-secondary)",
              }}
            >
              Explore Curriculum
            </Link>
          </div>
        </div>

        {/* Right Column (Confusion Archive Board - Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex lg:col-span-6 relative w-full h-[360px] sm:h-[400px] justify-center lg:justify-end items-center hero-reveal hero-delay-3 overflow-visible">
          <CardSwap
            width={460}
            height={195}
            cardDistance={24}
            verticalDistance={30}
            delay={3500}
            pauseOnHover={true}
          >
            {CONFUSION_CARDS.map((card) => (
              <Card key={card.id} className="p-5 text-left select-none">
                {/* Card Header (Tab Area) */}
                <div className="flex items-center justify-between h-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-accent dark:text-purple-400 tracking-wider">
                      {card.id} {"//"} {card.shortLabel}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse-dot" />
                    SOLVED
                  </span>
                </div>

                {/* Card Content Details */}
                <div className="mt-3 border-t border-zinc-200 dark:border-white/10 pt-3">
                  <h4 className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight mb-2">
                    {card.question}
                  </h4>

                  <div className="grid grid-cols-2 gap-4 mt-2.5 pt-2.5 border-t border-zinc-200 dark:border-white/10">
                    <div>
                      <div className="font-mono text-[10px] font-bold tracking-wider text-rose-600 dark:text-rose-400 mb-1 uppercase">
                        Mistaken Assumption
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-normal">
                        &ldquo;{card.assumption}&rdquo;
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 uppercase">
                        Reality
                      </div>
                      <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-normal font-medium">
                        {card.reality}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}
