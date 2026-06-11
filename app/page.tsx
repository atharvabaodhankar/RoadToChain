"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, AlertTriangle } from "lucide-react";
import { tracks } from "@/lib/curriculum";
import HeroSection from "@/components/hero/HeroSection";
import WhyExistsSection from "@/components/why-exists/WhyExistsSection";

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

// ─── HomePage ─────────────────────────────────────────────────────────────

export default function HomePage() {

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <HeroSection />

      <WhyExistsSection />

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
              We learn by breaking things, not reading definitions
            </h2>
            <p className="mt-2 text-sm text-muted max-w-lg">
              Most Web3 tutorials start with dry concepts. We start with real problems. This is how engineers actually learn — from situations, not syntax.
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
              8 tracks. Built from real shipped projects. Zero hype.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tracks.map((track, i) => {
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                  whileHover={{ y: -2 }}
                  className="group relative flex flex-col gap-3 rounded-xl border border-border bg-bg2 p-5 transition-all duration-200 hover:border-border2 hover:bg-bg3"
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
              We don&apos;t teach syntax templates. We build systems.
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
              A realistic stack. No useless tech.
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
            Track 0. No wallets. No setup. Just open it and read.
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
