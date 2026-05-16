"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";

const mistakes = [
  {
    track: "Track 0 · Foundations",
    module: "Module 4 · Wallets & Identity",
    lesson: "What MetaMask actually does — and doesn't do",
    lessonUrl: "/learn/track-0/module-4/what-metamask-does",
    title: "I thought MetaMask was the blockchain",
    story: "During my first three months of learning Web3, I genuinely believed my ETH was 'inside' the MetaMask browser extension. I treated it like a desktop software wallet that stored actual coins on my hard drive. When a transaction failed to broadcast, I asked a friend: 'Is MetaMask down?'",
    lessonLearned: "MetaMask is not a wallet; it's a local key manager. Coins never 'live' inside MetaMask. Your assets exist entirely as state variables (balances) in the public blockchain's global distributed ledger. MetaMask just securely stores the private key and signs transactions locally using the Web Crypto API, then broadcasts them via public RPC nodes.",
    severity: "Conceptual",
  },
  {
    track: "Track 0 · Foundations",
    module: "Module 5 · Gas & Transactions",
    lesson: "Why gas exists and how it's calculated",
    lessonUrl: "/learn/track-0/module-5/why-gas-exists",
    title: "Hardcoded 21,000 gas limit for a smart contract call",
    story: "I wanted to ensure my dApp's transaction went through, so I hardcoded 'gasLimit: 21000' directly in my frontend transaction parameters for a complex smart contract interaction. The transaction instantly failed with an 'intrinsic gas too low' error, and I spent 3 hours debugging why my contract 'reverted'.",
    lessonLearned: "A gas limit of 21,000 units is the fixed cost for a simple transfer of native Ether from one EOA (Externally Owned Account) to another. The moment you interact with a smart contract, the EVM starts executing opcodes (SSTORE, SLOAD, KECCAK256), each costing additional gas. Never hardcode gas limits for contract calls — use the provider's gas estimation (e.g., 'estimateGas') to calculate it dynamically.",
    severity: "Technical",
  },
  {
    track: "Track 1 · Solidity Systems",
    module: "Module 1 · Storage Mechanics",
    lesson: "The extreme cost of on-chain storage",
    lessonUrl: "/learn/track-1",
    title: "Stored full proposal descriptions directly on-chain",
    story: "When building my first voting contract, I stored long string descriptions (sometimes multiple paragraphs) directly in a state variable mapping. When a user tried to submit a proposal during a congested network hour, they were hit with a $140 gas bill. Some transactions failed completely because they exceeded the block gas limit.",
    lessonLearned: "Permanent state storage is the most expensive operation in the EVM (SSTORE costs 20,000 gas per 32-byte slot). For large text, metadata, or media, use off-chain decentralized storage like IPFS or Arweave, and store only the resulting 32-byte content hash (IPFS CID) on-chain.",
    severity: "Architectural",
  },
  {
    track: "Track 2 · Full-Stack Web3",
    module: "Module 1 · Node Architecture",
    lesson: "Reading the chain: Ethers v5 vs v6 syntax",
    lessonUrl: "/learn/track-2",
    title: "Followed a stale Ethers.js v5 video tutorial",
    story: "I spent an entire afternoon copy-pasting code from a popular 2022 YouTube tutorial to connect my React frontend to a smart contract. The code threw endless compilation errors saying 'getDefaultProvider is not a function' and 'Signer.getAddress is undefined'. I felt incredibly stupid.",
    lessonLearned: "Ethers.js underwent a major structural rewrite from v5 to v6. Providers, signers, and big number utilities were renamed or completely rearranged (e.g., BigNumber became bigint natively, and BrowserProvider replaced Web3Provider). Always check package versions in the tutorial's package.json before writing code, or read the official migration guides.",
    severity: "Development",
  },
  {
    track: "Track 4 · Account Abstraction",
    module: "Module 1 · AA Foundations",
    lesson: "Why MetaMask UX fails at consumer scale",
    lessonUrl: "/learn/track-4/module-1/why-metamask-ux-fails",
    title: "Lost an entire college hackathon to a MetaMask setup demo",
    story: "We built an amazing Web3 voting application for a local hackathon. When the judges arrived to try it, they didn't have MetaMask installed. We spent 9 out of our 10 allotted demo minutes helping them download the extension, write down seed phrases, and request testnet faucet tokens. We didn't even get to show the core app logic.",
    lessonLearned: "Targeting non-crypto-native users with standard EOA/MetaMask flows is conversion suicide. Modern Web3 consumer apps must employ embedded wallets (via Privy or Web3Auth) and Account Abstraction (ERC-4337) to let users sign up using standard social OAuth and sponsor gas fees behind the scenes.",
    severity: "UX & Product",
  },
  {
    track: "Track 5 · ZK & Privacy",
    module: "Module 2 · Circom & zkSNARKs",
    lesson: "Poseidon hashing vs SHA-256 in ZK circuits",
    lessonUrl: "/learn/track-5/module-2/poseidon-vs-sha256",
    title: "Used SHA-256 for hashing identity data in Circom",
    story: "In my initial ZKredential architecture, I hashed student IDs and grades using SHA-256 inside my Circom circuit, because I knew SHA-256 was safe. The circuit constraints ballooned to over 30,000. Generating a proof locally took my laptop 3 full minutes and completely crashed the browser when running in WebAssembly.",
    lessonLearned: "Traditional hash functions like SHA-256 are highly optimized for CPU bitwise operations but incredibly inefficient to represent as arithmetic constraints in ZK systems (R1CS). Use a ZK-friendly hash function like Poseidon, which operates natively on prime fields and reduces the constraint count to under 1,000 for the same input size.",
    severity: "Mathematical",
  },
];

const severityColors: Record<string, string> = {
  Conceptual: "#10b981", // green
  Technical: "#3b82f6", // blue
  Architectural: "#f59e0b", // amber
  Development: "#ef4444", // red
  "UX & Product": "#7c3aed", // violet
  Mathematical: "#ec4899", // pink
};

export default function MistakesPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[500px] rounded-full bg-amber-500/5 blur-[100px]" />
        </div>

        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-xs font-medium text-amber-500 tracking-wide uppercase">
              No ego · Real failures
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Mistakes I Made
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Most courses pretend their authors never struggled. I believe the fastest way to learn is to study the exact ways things break. Here is every major mistake I made while building production Web3 systems.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {mistakes.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-xl border border-border bg-bg2 p-6 transition-all duration-200 hover:border-border2 hover:bg-bg3"
              style={{ borderLeft: `4px solid ${severityColors[m.severity] || "#d4d4d8"}` }}
            >
              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
                <div className="font-mono text-[10px] text-dim">
                  {m.track} · {m.module}
                </div>
                <span
                  className="rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider border"
                  style={{
                    color: severityColors[m.severity],
                    borderColor: `${severityColors[m.severity]}30`,
                    backgroundColor: `${severityColors[m.severity]}10`,
                  }}
                >
                  {m.severity}
                </span>
              </div>

              {/* Title & Story */}
              <div className="mt-4">
                <h2 className="text-base font-semibold tracking-tight text-text group-hover:text-[#a78bfa] transition-colors">
                  {m.title}
                </h2>
                <div className="mt-3 rounded-lg border border-border/40 bg-bg px-4 py-3">
                  <div className="font-mono text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-1">
                    What Happened:
                  </div>
                  <p className="text-xs leading-relaxed text-muted font-sans">
                    &ldquo;{m.story}&rdquo;
                  </p>
                </div>
              </div>

              {/* Lesson Learned */}
              <div className="mt-4">
                <div className="font-mono text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                  The Actual Engineering Reality:
                </div>
                <p className="text-xs leading-relaxed text-text font-sans">
                  {m.lessonLearned}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between border-t border-border/30 pt-4">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-dim" />
                  <span className="font-mono text-[10px] text-dim">
                    Related Lesson:{" "}
                    <span className="text-text font-sans font-medium">{m.lesson}</span>
                  </span>
                </div>
                <Link
                  href={m.lessonUrl}
                  className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#a78bfa] transition-all hover:gap-1.5"
                >
                  Read Lesson <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
