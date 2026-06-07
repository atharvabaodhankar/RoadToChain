"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PixelBlast from "./PixelBlast";

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
    concepts: ["Gas", "EVM Execution"],
  },
  {
    id: "04",
    shortLabel: "TESTNETS",
    question: "Why fake ETH exists?",
    assumption: "Real ETH should be enough.",
    reality: "Testnets remove financial risk.",
    concepts: ["Testnets", "Deployment"],
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

const getCardStyle = (offset: number) => {
  const transition = "all 0.7s cubic-bezier(0.25, 1, 0.5, 1)";
  const transformOrigin = "top center";
  if (offset === 0) {
    return {
      transform: "translateY(56px) scale(1) rotate(0deg)",
      transformOrigin,
      zIndex: 30,
      opacity: 1,
      pointerEvents: "auto" as const,
      transition,
    };
  } else if (offset === 1) {
    return {
      transform: "translateY(28px) scale(0.96) rotate(1.2deg)",
      transformOrigin,
      zIndex: 20,
      opacity: 0.95,
      pointerEvents: "auto" as const,
      transition,
    };
  } else if (offset === 2) {
    return {
      transform: "translateY(0px) scale(0.92) rotate(-0.8deg)",
      transformOrigin,
      zIndex: 10,
      opacity: 0.82,
      pointerEvents: "auto" as const,
      transition,
    };
  } else if (offset === 3) {
    return {
      transform: "translateY(-14px) scale(0.88) rotate(0.4deg)",
      transformOrigin,
      zIndex: 5,
      opacity: 0.45,
      pointerEvents: "none" as const,
      transition,
    };
  } else {
    // offset === 4 (Exiting card)
    return {
      transform: "translateX(-110%) translateY(56px) scale(0.96) rotate(-4deg)",
      transformOrigin,
      zIndex: 40,
      opacity: 0,
      pointerEvents: "none" as const,
      transition,
    };
  }
};

function ConfusionArchive() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CONFUSION_CARDS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl h-[230px] select-none overflow-visible">
      {CONFUSION_CARDS.map((card, idx) => {
        const isActive = idx === activeIndex;
        const offset = (idx - activeIndex + CONFUSION_CARDS.length) % CONFUSION_CARDS.length;
        const styleObj = getCardStyle(offset);

        return (
          <div
            key={card.id}
            onClick={() => setActiveIndex(idx)}
            style={styleObj}
            className={`absolute top-0 left-0 right-0 h-[165px] text-left rounded-lg border p-4 transition-all select-none overflow-hidden backdrop-blur-md ${
              isActive
                ? "border-accent/40 bg-bg/95 dark:bg-bg2/95 shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
                : "border-border bg-bg/90 dark:bg-bg2/90 shadow-[0_12px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] cursor-pointer hover:border-border-hover"
            }`}
          >
            {/* Card Header (Tab Area) */}
            <div className="flex items-center justify-between h-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] font-bold text-accent/80 opacity-70 tracking-wider">
                  {card.id} // {card.shortLabel}
                </span>
              </div>
              {isActive ? (
                <span className="inline-flex items-center gap-1 font-mono text-[8px] font-bold tracking-wider text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse-dot" />
                  SOLVED
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/35" />
              )}
            </div>

            {/* Card Content Details */}
            <div
              className={`mt-2 border-t border-border/15 pt-2.5 transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h4 className="font-semibold text-[13.5px] tracking-tight text-text leading-tight">
                {card.question}
              </h4>

              <div className="grid grid-cols-2 gap-4 mt-2.5 pt-2.5 border-t border-border/15">
                <div>
                  <div className="font-mono text-[8.5px] font-bold tracking-wider text-red-500/70 mb-1 uppercase">
                    Mistaken Assumption
                  </div>
                  <p className="text-[11.5px] text-muted italic leading-normal">
                    &ldquo;{card.assumption}&rdquo;
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[8.5px] font-bold tracking-wider text-emerald-500/70 mb-1 uppercase">
                    Reality
                    </div>
                  <p className="text-[11.5px] text-text leading-normal font-medium">
                    {card.reality}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="relative w-full flex items-center border-b px-6 sm:px-10 lg:px-16"
      style={{
        minHeight: "88vh",
        paddingTop: "7rem",
        paddingBottom: "5rem",
        borderColor: "var(--border)",
      }}
    >
      {/* Interactive WebGL background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90 select-none">
        <PixelBlast
          variant="circle"
          pixelSize={4}
          color="#8b5cf6"
          patternScale={7}
          patternDensity={0.95}
          pixelSizeJitter={0.41}
          enableRipples={true}
          rippleSpeed={0.25}
          rippleThickness={0.1}
          rippleIntensityScale={1.2}
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
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
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
                Begin Track 0 <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg3"
              style={{
                border: "1px solid var(--border2)",
                color: "var(--text-secondary)",
              }}
            >
              Explore Curriculum
            </Link>
          </div>
        </div>

        {/* Right Column (Confusion Archive Board) */}
        <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end hero-reveal hero-delay-3">
          <ConfusionArchive />
        </div>
      </div>
    </section>
  );
}
