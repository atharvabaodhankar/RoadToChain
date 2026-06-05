"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, AlertTriangle } from "lucide-react";
import { tracks } from "@/lib/curriculum";
import LivingNetworkCanvas from "@/components/hero/LivingNetworkCanvas";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// ─── Problem-First Learning Steps ──────────────────────────────────────────
const learningSteps = [
  {
    num: "01",
    title: "Problem First",
    desc: "Every lesson starts with a real-world problem. Not a concept. Not a definition. A problem you might actually face.",
  },
  {
    num: "02",
    title: "Layman Explanation",
    desc: "The analogy that makes it click — before you touch any code. If you can explain it in plain English, you understand it.",
  },
  {
    num: "03",
    title: "Technical Deep Dive",
    desc: "The actual engineering: EVM internals, contract storage, circuit constraints, bundler validation. No handwaving.",
  },
  {
    num: "04",
    title: "Production Reality",
    desc: "How real production apps handle this. What breaks at scale. What costs too much. What the tutorials skip.",
  },
  {
    num: "05",
    title: "Reality Check",
    desc: "Honest tradeoffs, mainnet deployment costs, limits of decentralized networks, and hard scalability truths.",
  },
  {
    num: "06",
    title: "Mistakes I Made",
    desc: "First-person mistakes from shipping ZKredential, ChainCure, erc4337-kit. Not hidden — woven into every lesson.",
  },
  {
    num: "07",
    title: "Mini Challenge",
    desc: "A small, hands-on, high-value practice challenge to consolidate knowledge and ensure you write working code.",
  },
  {
    num: "08",
    title: "Hero Project Integration",
    desc: "Every concept feeds the track capstone project. You never wonder why you're learning something.",
  },
];

// ─── Top 6 Mistakes ─────────────────────────────────────────────────────────
const topMistakes = [
  {
    title: "I thought MetaMask was the blockchain",
    desc: "Asked 'is MetaMask down?' when a transaction failed. MetaMask is just a key manager. The blockchain runs independently on thousands of nodes.",
    track: "Track 0 → Module 4",
  },
  {
    title: "Stored full proposal text on-chain",
    desc: "Every contract call cost massive gas. Some hit the block limit randomly. Blockchain is not a general-purpose database. Learned IPFS the hard way.",
    track: "Track 1 → Module 1",
  },
  {
    title: "Followed a YouTube ethers.js v5 tutorial",
    desc: "Spent 4 hours debugging. getDefaultProvider gone. Contract constructor changed. Signer API changed. Always check the package version first.",
    track: "Track 2 → Module 1",
  },
  {
    title: "Used SHA-256 inside a Circom circuit",
    desc: "Constraint count exploded to 30,000+. Proof generation: 3 minutes. Switched to Poseidon. Constraints: 904. Proof time: 0.4 seconds. Nobody tells you this.",
    track: "Track 5 → Module 2",
  },
  {
    title: "Forgot nonces in signature verification",
    desc: "Built a contract accepting signed messages for auth. Same signature could be replayed forever. Nonces are mandatory in any off-chain signing system.",
    track: "Track 6 → Module 1",
  },
  {
    title: "Lost a hackathon to an ERC-4337 encoding bug",
    desc: "UserOperation gas fields wrong. paymasterAndData encoding incorrect. 3 days debugging. Built erc4337-kit afterwards so nobody else wastes this time.",
    track: "Track 4 → Module 1",
  },
];

// ─── Stack Pills ─────────────────────────────────────────────────────────────
const stackItems = [
  { label: "Next.js 15", color: "#fafafa" },
  { label: "viem", color: "#3b82f6" },
  { label: "wagmi", color: "#14b8a6" },
  { label: "Privy", color: "#7c3aed" },
  { label: "Hardhat", color: "#f59e0b" },
  { label: "Pimlico", color: "#ec4899" },
  { label: "ethers.js v6", color: "#3b82f6" },
  { label: "The Graph", color: "#6d28d9" },
  { label: "IPFS + Pinata", color: "#06b6d4" },
  { label: "Polygon Amoy", color: "#7c3aed" },
  { label: "Base Mainnet", color: "#3b82f6" },
  { label: "OpenZeppelin", color: "#4ade80" },
  { label: "Circom + snarkjs", color: "#ec4899" },
  { label: "ERC-4337", color: "#f97316" },
];

// ─── Learning Path Nodes ──────────────────────────────────────────────────────
const pathNodes = ["Learn", "Build", "Break", "Debug", "Improve", "Deploy"];

// Dynamic live logs arrays based on phase states
const CONFUSION_LOGS = [
  { type: "warn", icon: "✖", text: "FAIL: EVM execution frame reverted" },
  { type: "warn", icon: "⚠", text: "RPC_ERR: connection timeout (12000ms)" },
  { type: "warn", icon: "✖", text: "tx failed: invalid transaction nonce" },
  { type: "warn", icon: "⚠", text: "MetaMask: user rejected transaction" },
  { type: "warn", icon: "✖", text: "gas: insufficient balance for state fee" }
];

const FORMING_LOGS = [
  { type: "sync", icon: "⚙", text: "EVM: parsing SmartAccount ABI..." },
  { type: "sync", icon: "⚡", text: "RPC: handshake request dispatched" },
  { type: "sync", icon: "⚡", text: "mempool: propagating signed UserOp" },
  { type: "sync", icon: "⚙", text: "consensus: syncing network status" },
  { type: "sync", icon: "⚙", text: "proving: generating SNARK witness" }
];

const MASTERY_LOGS = [
  { type: "ok", icon: "✓", text: "State root commitment successfully finalized" },
  { type: "ok", icon: "✓", text: "EVM: payload execution succeeded in frame" },
  { type: "ok", icon: "✓", text: "consensus: reached 2/3+ precommit votes" },
  { type: "ok", icon: "✓", text: "gas sponsored via paymaster contract" },
  { type: "ok", icon: "✓", text: "proof validated (904 circuit constraints)" }
];

export default function HomePage() {
  const siteTagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || "Web3 explained by someone who recently got it.";
  const [scrollY, setScrollY] = useState(0);

  // Monitor scroll for the Phase transitions
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollY: motionScrollY } = useScroll();
  const bgY = useTransform(motionScrollY, [0, 500], [0, 70]);
  const leftY = useTransform(motionScrollY, [0, 500], [0, 25]);
  const rightY = useTransform(motionScrollY, [0, 500], [0, -30]);

  const phase = scrollY < 120 ? 1 : scrollY < 320 ? 2 : 3;

  // Render responsive logs for the telemetry console
  const activeLogs = phase === 1 ? CONFUSION_LOGS : phase === 2 ? FORMING_LOGS : MASTERY_LOGS;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border px-4 pb-16 pt-28 sm:px-6 lg:px-8 bg-bg">
        {/* Immersive high-performance physics background canvas */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
          <LivingNetworkCanvas />
        </motion.div>

        {/* Ambient dark computational void background glows */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
          <div className="h-[500px] w-[800px] rounded-full bg-accent/5 blur-[140px] opacity-70" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl w-full z-10">
          {/* Asymmetric 12-column grid container */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[75vh]">
            
            {/* LEFT COLUMN: Editorial Typography & Human Layer (col-span-7) */}
            <motion.div style={{ y: leftY }} className="lg:col-span-7 relative z-10 flex flex-col justify-center text-left">
              
              {/* Monospace Interactive State Badge */}
              <div className="mb-8 inline-flex self-start items-center gap-2.5 rounded-full border border-border/40 bg-bg2/50 px-3.5 py-2 font-mono text-[10px] sm:text-[11px] opacity-40 hover:opacity-100 hover:border-border/80 transition-all duration-300">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="text-dim">ATMOSPHERE_STATUS:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  phase === 1 ? "text-red-400" : phase === 2 ? "text-indigo-400" : "text-cyan-400"
                }`}>
                  {phase === 1 ? "PHASE_1_CONFUSION" : phase === 2 ? "PHASE_2_UNDERSTANDING" : "PHASE_3_MASTERY"}
                </span>
              </div>

              {/* Offset Cinematic Headline Block */}
              <div className="relative">
                <motion.div
                  animate={{ y: phase === 1 ? [0, -4, 0] : 0 }}
                  transition={{ duration: 5.2, repeat: phase === 1 ? Infinity : 0, ease: "easeInOut" }}
                  className="absolute -top-14 left-4 font-mono text-[10px] sm:text-[11px] text-amber-500 font-semibold hidden md:block select-none cursor-pointer opacity-50 dark:opacity-[0.15] hover:opacity-90 hover:text-amber-400 transition-all duration-300"
                  style={{ transform: "rotate(-3deg)" }}
                >
                  {"// \"this confused me for weeks\""}
                </motion.div>

                <motion.div
                  animate={{ y: phase === 1 ? [0, -3, 0] : 0 }}
                  transition={{ duration: 5.8, repeat: phase === 1 ? Infinity : 0, ease: "easeInOut" }}
                  className="absolute -bottom-14 left-32 font-mono text-[10px] sm:text-[11px] text-purple-400 font-semibold hidden md:block select-none cursor-pointer opacity-50 dark:opacity-[0.15] hover:opacity-90 hover:text-purple-300 transition-all duration-300"
                  style={{ transform: "rotate(-1.5deg)" }}
                >
                  {"// \"why does failed tx still cost money 😭\""}
                </motion.div>

                {/* Massive bold staggered editorial statement */}
                <h1 className="flex flex-col text-left font-sans tracking-tight">
                  <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-text leading-[0.9] tracking-tighter">
                    Web3 explained
                  </span>
                  <span className="font-mono text-accent italic font-normal tracking-wide text-3xl sm:text-4xl mt-4 pl-8 block transition-colors duration-300">
                    by someone
                  </span>
                  <span className="text-text font-bold text-5xl sm:text-6.5xl lg:text-7xl mt-3 block leading-[0.95] tracking-tighter">
                    who{" "}
                    <span className="relative inline-block text-purple-400 hover:text-cyan-400 transition-colors duration-500 cursor-pointer">
                      recently
                      <span className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded" />
                    </span>{" "}
                    got it.
                  </span>
                </h1>
              </div>

              {/* Subtext description */}
              <p className="mt-8 max-w-[540px] text-sm sm:text-base leading-relaxed text-muted font-sans font-light">
                {siteTagline} 8 progressive engineering tracks. Over 40 deep-dive modules. No superficial hand-waving explanations. Every real system failure is fully documented.
              </p>

              {/* Asymmetric left-aligned CTA actions */}
              <div className="mt-10 flex flex-wrap gap-4 items-center justify-start">
                <Link
                  href="/learn/track-0"
                  className="relative group overflow-hidden inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 font-mono text-sm font-semibold text-white shadow-xl shadow-accent/20 transition-all hover:bg-accent2 hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                  <span className="relative z-10 flex items-center gap-2">
                    Begin Track 0 <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-2 rounded-lg border border-border2 px-7 py-3.5 font-mono text-sm text-muted bg-bg2/40 backdrop-blur-sm transition-all hover:border-border3 hover:bg-bg3 hover:text-text hover:-translate-y-0.5"
                >
                  Explore Curriculum
                </Link>
              </div>

              {/* Monospace details telemetry footer */}
              <div className="mt-12 font-mono text-[10px] text-dim flex flex-wrap gap-x-6 gap-y-2 border-t border-border/40 pt-5 opacity-60 dark:opacity-[0.20] hover:opacity-100 dark:hover:opacity-[0.60] transition-opacity duration-300">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> PEERS_ONLINE: 40_LIVE</span>
                <span>LATENCY: 42ms</span>
                <span>GAS_EST: 18_GWEI</span>
                <span>RECON: ACTIVE</span>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Living Systems Telemetry Panel (col-span-5) */}
            <motion.div style={{ y: rightY }} className="lg:col-span-5 relative z-10 w-full flex items-center justify-center">
              
              {/* Comment 2 orbiting the console panel */}
              <motion.div
                animate={{ y: phase === 1 ? [0, 4, 0] : 0 }}
                transition={{ duration: 4.5, repeat: phase === 1 ? Infinity : 0, ease: "easeInOut" }}
                className="absolute -top-10 -left-12 font-mono text-[10px] sm:text-[11px] text-red-400 font-semibold hidden lg:block select-none cursor-pointer opacity-50 dark:opacity-[0.15] hover:opacity-100 hover:text-red-300 transition-all duration-300 z-20"
                style={{ transform: "rotate(2deg)" }}
              >
                {"// \"why tf do we need MetaMask?\""}
              </motion.div>

              {/* Glassmorphic systems dashboard wrapper */}
              <div data-theme="dark" className="dark w-full max-w-md rounded-2xl border border-border/40 bg-[#070708]/95 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-accent-glow group">
                
                {/* Background grid texture inside component */}
                <div className="absolute inset-0 bg-grid-engineering opacity-25 pointer-events-none" />

                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      phase === 1 ? "bg-red-500 animate-pulse" : phase === 2 ? "bg-amber-500 animate-pulse" : "bg-cyan-400 animate-pulse-dot"
                    }`} />
                    <span className="font-mono text-[10px] text-muted tracking-wider uppercase font-semibold">
                      TELEMETRY_ENGINE_V3
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-dim uppercase">
                    {phase === 1 ? "STATUS_GLITCH" : phase === 2 ? "STATUS_SYNCING" : "STATUS_STABLE"}
                  </span>
                </div>

                {/* Subsystem 1: Validator node visual cluster */}
                <div className="h-44 w-full rounded-lg border border-border bg-bg/60 flex items-center justify-center relative mb-4 overflow-hidden z-10 group-hover:border-border2 transition-colors duration-300">
                  <svg className="w-full h-full" viewBox="0 0 280 140">
                    {/* Active proximity connection routes */}
                    <line 
                      x1="70" y1="40" x2="210" y2="40" 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.15)" : phase === 2 ? "rgba(99, 102, 241, 0.25)" : "rgba(34, 211, 238, 0.35)"} 
                      strokeWidth={1} 
                      strokeDasharray={phase === 1 ? "4 4" : phase === 2 ? "3 3" : "none"}
                      className="transition-all duration-500"
                    />
                    <line 
                      x1="210" y1="40" x2="210" y2="100" 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.15)" : phase === 2 ? "rgba(99, 102, 241, 0.25)" : "rgba(34, 211, 238, 0.35)"} 
                      strokeWidth={1} 
                      strokeDasharray={phase === 1 ? "4 4" : "none"}
                      className="transition-all duration-500"
                    />
                    <line 
                      x1="210" y1="100" x2="70" y2="100" 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.15)" : phase === 2 ? "rgba(99, 102, 241, 0.25)" : "rgba(34, 211, 238, 0.35)"} 
                      strokeWidth={1} 
                      className="transition-all duration-500"
                    />
                    <line 
                      x1="70" y1="100" x2="70" y2="40" 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.15)" : phase === 2 ? "rgba(99, 102, 241, 0.25)" : "rgba(34, 211, 238, 0.35)"} 
                      strokeWidth={1} 
                      className="transition-all duration-500"
                    />
                    <line 
                      x1="70" y1="40" x2="210" y2="100" 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.1)" : phase === 2 ? "rgba(99, 102, 241, 0.15)" : "rgba(168, 85, 247, 0.25)"} 
                      strokeWidth={0.8} 
                      strokeDasharray={phase === 3 ? "none" : "3 3"}
                      className="transition-all duration-500"
                    />

                    {/* Concentric spin validator alignment indicators */}
                    <circle 
                      cx="140" cy="70" r={32} 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.1)" : phase === 2 ? "rgba(99, 102, 241, 0.2)" : "rgba(124, 58, 237, 0.3)"} 
                      strokeWidth={1} 
                      fill="none" 
                      strokeDasharray="6 3"
                      className={`transition-all duration-500 origin-center ${phase > 1 ? "animate-spin" : ""}`}
                      style={{ animationDuration: "16s", transformOrigin: "140px 70px" }}
                    />
                    <circle 
                      cx="140" cy="70" r={24} 
                      stroke={phase === 1 ? "rgba(239, 68, 68, 0.05)" : phase === 2 ? "rgba(99, 102, 241, 0.15)" : "rgba(6, 182, 212, 0.4)"} 
                      strokeWidth={1} 
                      fill="none" 
                      strokeDasharray="4 4"
                      className={`transition-all duration-500 origin-center ${phase > 1 ? "animate-spin" : ""}`}
                      style={{ animationDuration: "8s", animationDirection: "reverse", transformOrigin: "140px 70px" }}
                    />

                    {/* Active validator state nodes */}
                    <circle 
                      cx="70" cy="40" r={6} 
                      fill={phase === 1 ? "#ef4444" : phase === 2 ? "#fbbf24" : "#22c55e"} 
                      className="transition-all duration-500"
                    />
                    <circle 
                      cx="210" cy="40" r={6} 
                      fill={phase === 1 ? "#ef4444" : phase === 2 ? "#fbbf24" : "#22c55e"} 
                      className="transition-all duration-500"
                    />
                    <circle 
                      cx="210" cy="100" r={6} 
                      fill={phase === 1 ? "#ef4444" : phase === 2 ? "#fbbf24" : "#22c55e"} 
                      className="transition-all duration-500"
                    />
                    <circle 
                      cx="70" cy="100" r={6} 
                      fill={phase === 1 ? "#ef4444" : phase === 2 ? "#fbbf24" : "#22c55e"} 
                      className="transition-all duration-500"
                    />

                    {/* Center consensus engine core */}
                    <circle 
                      cx="140" cy="70" r={8} 
                      fill={phase === 1 ? "#ef4444" : phase === 2 ? "#6366f1" : "#a855f7"} 
                      className="transition-all duration-500 animate-pulse"
                    />
                  </svg>

                  {/* Absolute visual notifications overlying nodes */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`font-mono text-[9px] px-2.5 py-1 rounded-md border backdrop-blur-md transition-all duration-300 shadow-md ${
                      phase === 1 
                        ? "text-red-400 bg-red-950/70 border-red-800/40" 
                        : phase === 2 
                        ? "text-indigo-400 bg-indigo-950/70 border-indigo-800/40 animate-pulse" 
                        : "text-cyan-400 bg-cyan-950/70 border-cyan-800/40"
                    }`}>
                      {phase === 1 ? "PEER_DISCONNECT_ERR" : phase === 2 ? "CONSENSUS_SYNCING..." : "BLOCK_COMMITTED_OK"}
                    </span>
                  </div>
                </div>

                {/* Subsystem 2: Scroll-reactive transaction terminal */}
                <div className="h-40 w-full rounded bg-[#030304]/80 border border-border/50 p-4 font-mono text-[10px] leading-relaxed text-zinc-400 overflow-hidden flex flex-col justify-end relative z-10">
                  <div className="space-y-2">
                    {activeLogs.map((log, index) => {
                      const opacityClass = 
                        index === 0 ? "opacity-[0.15]" :
                        index === 1 ? "opacity-[0.30]" :
                        index === 2 ? "opacity-[0.50]" :
                        index === 3 ? "opacity-[0.70]" :
                        "opacity-[0.90]";
                      return (
                        <div key={index} className={`flex gap-2.5 items-start animate-fade-in transition-all duration-500 ${opacityClass}`}>
                          <span className={`shrink-0 ${
                            log.type === "warn" ? "text-red-400/90" : log.type === "sync" ? "text-indigo-400/90 animate-pulse" : "text-emerald-400 font-bold"
                          }`}>
                            {log.icon}
                          </span>
                          <span className="text-zinc-200 select-all font-mono break-all">{log.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>


      {/* ── Problem-First Learning Flow ──────────────────────────── */}
      <section className="border-b border-border px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// how every lesson works"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              Problem-first learning
            </h2>
            <p className="mt-2 text-sm text-muted max-w-lg">
              Most Web3 tutorials start with concepts. We start with real problems. This is how engineers actually learn — from situations, not definitions.
            </p>
          </motion.div>

          <div className="mt-12 space-y-0">
            {learningSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                className="group flex gap-6 border-b border-border p-3 sm:p-3.5 transition-colors hover:bg-bg2"
              >
                <span className="font-mono text-base font-bold text-accent/40 group-hover:text-accent transition-colors">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracks Overview ──────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
            viewport={{ once: true }}
            transition={fadeUp.transition}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// curriculum"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              8 tracks. One engineer. Zero hype.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tracks.map((track, i) => {
              const isLast = i === tracks.length - 1;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                  whileHover={{ y: -2 }}
                  className={`group relative flex flex-col gap-3 rounded-xl border border-border bg-bg2 p-5 transition-all duration-200 hover:border-border2 hover:bg-bg3 ${isLast ? "sm:col-span-2" : ""}`}
                >
                  {/* Accent Bar */}
                  <div
                    className="absolute top-5 bottom-5 left-0 w-[3px] rounded-r"
                    style={{ backgroundColor: track.color }}
                  />

                  <div className="pl-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-dim">
                        {track.number}
                      </span>
                      {track.isSignature && (
                        <span className="inline-flex items-center gap-1 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent border border-accent/30">
                          <Star className="h-2.5 w-2.5 fill-accent" /> Signature
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-sans text-base font-semibold tracking-tight text-text">
                      {track.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {track.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {Array.from(new Set(track.modules.flatMap((m) => m.lessons.flatMap((l) => l.tags)))).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-bg4 px-1.5 py-0.5 font-mono text-[10px] text-muted border border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                      <span className="font-mono text-[11px] text-dim">
                        {track.moduleCount} modules · {track.lessonCount} lessons · {track.estimatedHours}h
                      </span>
                      <Link
                        href={`/learn/${track.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium transition-colors hover:gap-1.5"
                        style={{ color: track.color }}
                      >
                        Begin <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Code Block Section ────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
            viewport={{ once: true }}
            transition={fadeUp.transition}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// real code, real context"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              Not syntax. Understanding.
            </h2>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="dark mt-8 overflow-hidden rounded-xl border border-border bg-[#111113]"
            data-theme="dark"
          >
            {/* Code Header */}
            <div className="flex items-center justify-between border-b border-border bg-[#0d0d0e] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-dim">SmartAccount.sol</span>
              </div>
              <span className="font-mono text-[10px] text-dim uppercase border border-border bg-bg4 px-2 py-0.5 rounded">T4 · ERC-4337</span>
            </div>

            {/* Code Block */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* BAD Pattern */}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="text-red-400 text-sm">❌</span>
                  <span className="font-mono text-xs text-red-400 font-semibold">Traditional MetaMask Pattern</span>
                </div>
                <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-[#d4d4d8]">
                  <code>{`// User must have MetaMask installed
// User must buy gas tokens first
// User must switch networks manually
// Every tx shows a scary popup

const provider = new ethers.BrowserProvider(
  window.ethereum  // undefined on mobile!
);
const signer = await provider.getSigner();
// ↑ triggers MetaMask popup

await contract
  .connect(signer)
  .vote(proposalId);
// ↑ another popup
// ↑ user must wait 12–30 seconds
// ↑ if they don't have MATIC, it fails`}</code>
                </pre>
              </div>

              {/* GOOD Pattern */}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="text-green-400 text-sm">✅</span>
                  <span className="font-mono text-xs text-green-400 font-semibold">Modern ERC-4337 + Privy Pattern</span>
                </div>
                <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-[#d4d4d8]">
                  <code>{`// User logs in with Google — that's it.
// Embedded wallet created silently.
// Gas sponsored by your paymaster.
// Zero popups.

const { user } = usePrivy();
// ↑ Google auth → wallet auto-created

const userOp = await smartAccount
  .sendTransaction({
    to: contractAddress,
    data: encodeFunctionData({
      abi, functionName: 'vote',
      args: [proposalId]
    })
  });
// ↑ No MetaMask. No seed phrases.
// ↑ No gas tokens. Works on mobile.
// ↑ User never knows they have a wallet`}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mistakes I Made ──────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
            viewport={{ once: true }}
            transition={fadeUp.transition}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// mistakes i made"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              The things nobody tells you
            </h2>
            <p className="mt-2 text-sm text-muted">
              Not in a separate section. Woven into every lesson as first-class content.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topMistakes.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative rounded-xl border border-border bg-bg2 p-5 transition-colors hover:bg-bg3"
                style={{ borderLeft: "3px solid #f97316" }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <h3 className="font-sans text-sm font-semibold tracking-tight text-text leading-snug">
                    {m.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-muted pl-6">
                  {m.desc}
                </p>
                <div className="mt-3 pl-6">
                  <span className="font-mono text-[10px] text-dim">{m.track}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/mistakes"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-text"
            >
              See all mistakes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Learning Path ──────────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
            viewport={{ once: true }}
            transition={fadeUp.transition}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// the journey"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              Learn → Build → Deploy
            </h2>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-0">
            {pathNodes.map((node, i) => (
              <div key={node} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  className={`rounded-full px-4 py-2 font-mono text-xs font-semibold transition-all ${
                    i === 0 || i === pathNodes.length - 1
                      ? "bg-accent/20 text-accent border border-accent/40 shadow-sm shadow-accent/10"
                      : "bg-bg2 border border-border text-muted"
                  }`}
                >
                  {node}
                </motion.div>
                {i < pathNodes.length - 1 && (
                  <div className="mx-2 h-px w-6 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack Pills ────────────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            whileInView={fadeUp.animate}
            initial={fadeUp.initial}
            viewport={{ once: true }}
            transition={fadeUp.transition}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
              {"// tech stack"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
              Modern tools. Modern patterns.
            </h2>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {stackItems.map((item, i) => (
              <motion.span
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg2 px-3 py-1.5 font-mono text-xs text-muted hover:border-border2 hover:text-text transition-colors"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer Section ──────────────────────────────────────── */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        {/* Glow line on top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Start where it actually makes sense.
          </h2>
          <p className="mt-4 text-sm text-muted">
            Track 0. No wallet needed. No setup. Just open and read.
          </p>
          <div className="mt-8">
            <Link
              href="/learn/track-0"
              className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-6 py-3 font-mono text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent2 hover:shadow-accent/30"
            >
              Begin Track 0 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
