"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Cpu, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

interface Autopsy {
  id: string;
  name: string;
  tagline: string;
  goal: string;
  prototype: string;
  pain: string;
  fixes: string[];
  lessons: string;
  color: string;
  badge: string;
}

const autopsies: Autopsy[] = [
  {
    id: "chainelect",
    name: "ChainElect",
    tagline: "The Naive Voting System Gas Collapse",
    goal: "Build a decentralized voting platform where election logs are immutably verified.",
    prototype: "React client calling Solidity contract functions directly via MetaMask, storing all voter addresses in a dynamic on-chain array.",
    pain: "As voter count scaled to 714, the gas cost of iterating the array to count votes exceeded the Block Gas Limit. Transactions began to revert automatically, and public RPC node endpoints rate-limited the API keys.",
    fixes: [
      "Refactored storage array iteration into O(1) Solidity mapping lookups",
      "Packed storage variables (uint8, address, bool) in slots to save gas",
      "Delegated vote counting off-chain via indexer event logs"
    ],
    lessons: "Solidity contract storage is a consensus notary, not a database. Never loop over unbounded dynamic arrays on-chain.",
    color: "#3b82f6", // blue
    badge: "Solidity Limits"
  },
  {
    id: "proofchain",
    name: "ProofChain",
    tagline: "The Leaked API Key Security Failure",
    goal: "Immutably verify document integrity and ownership.",
    prototype: "Client-side uploads directly to Pinata and smart contracts using secret keys hardcoded in frontend React code.",
    pain: "Anyone inspecting the browser bundle or dev tools network tab could copy-paste the private IPFS API keys, causing immediate storage exhaustion attacks.",
    fixes: [
      "Created a secure Node.js Express API gateway proxy layer",
      "Moved all private API keys to server-side .env configurations",
      "Compressed document payloads before pinning to reduce IPFS costs"
    ],
    lessons: "Client-side JS is a public document. Never store secret credentials, credentials proxies, or private keys in the browser.",
    color: "#f59e0b", // amber
    badge: "Gateway Design"
  },
  {
    id: "socio3v1",
    name: "Socio3 V1",
    tagline: "The Direct RPC Query Freeze",
    goal: "Deploy a decentralized social media platform with post feeds.",
    prototype: "React frontend calling getAllPosts() on the smart contract directly via a standard Alchemy RPC endpoint, sorting arrays in JavaScript.",
    pain: "Loading 10 posts took 150ms. At 1,000 posts, serialization and memory overhead caused 4-second loading page freezes. At 10,000 posts, the RPC node timed out with error -32000.",
    fixes: [
      "Introduced The Graph Protocol to index block events in real time",
      "Replaced direct RPC contract reads with high-speed GraphQL queries",
      "Enabled client-side pagination limits (LIMIT and OFFSET equivalent)"
    ],
    lessons: "RPC nodes are execution nodes, not query engines. Reading lists requires off-chain event indexing.",
    color: "#ef4444", // red
    badge: "EVM Limits"
  },
  {
    id: "socio3v2",
    name: "Socio3 V2",
    tagline: "The Smart Account Faucet Revert",
    goal: "Provide a gasless, MetaMask-free social onboarding experience.",
    prototype: "Universal Privy Google logins generating Smart Accounts, with a faucet contract gifting test MATIC directly to the Smart Account contracts.",
    pain: "Onboarding drop-off fell, but gas payouts failed. Faucet transactions reverted because standard faucets enforce a fixed 25k gas limit, while contract wallets require >25k gas to delegate receive() functions.",
    fixes: [
      "Routed faucet gas payouts to the user's Privy EOA signer instead",
      "Implemented a client-side Bridge Card allowing one-click EOA-to-Smart Account transfers",
      "Integrated Pimlico Paymasters to sponsor social actions gaslessly"
    ],
    lessons: "Faucets cannot send native assets directly to contract accounts. Send to the EOA, then bridge.",
    color: "#7c3aed", // violet
    badge: "Account Abstraction"
  },
  {
    id: "chaincure",
    name: "ChainCure",
    tagline: "The Compromised Single-Key Supply Chain",
    goal: "Audit pharmaceutical supply chains to detect counterfeit drug batches.",
    prototype: "A single centralized admin wallet holding exclusive onlyOwner keys to flag drug batches.",
    pain: "A single compromised key would allow an attacker to flag legitimate batches as counterfeits, triggering millions of dollars in supply chain recalls.",
    fixes: [
      "Implemented role-based AccessControl allowing regulators and manufacturers distinct rights",
      "Configured multi-signature thresholds requiring multiple signatures to authorize state updates",
      "Used ECDSA cryptography to verify off-chain signatures directly inside Solidity"
    ],
    lessons: "A single admin key is a single point of collapse. Real security requires distributed multi-signature trust models.",
    color: "#ec4899", // pink
    badge: "Trust Distribution"
  }
];

export default function AutopsiesPage() {
  const [activeTab, setActiveTab] = useState<string>("chainelect");
  const current = autopsies.find((a) => a.id === activeTab) || autopsies[0];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg2/80 px-3.5 py-1.5 mb-6 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            System Architecture Diagnostics
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Architecture Autopsies
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            We don&apos;t just build systems. We dissect why they fail in production. Explore real-world autopsies of key Web3 apps, tracing their evolution from naive designs to robust infrastructures.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Tabs */}
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim block mb-3 px-2">
              {"// CASE STUDIES"}
            </span>
            <div className="flex flex-row lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0">
              {autopsies.map((a) => {
                const isActive = activeTab === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveTab(a.id)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-300 shrink-0 lg:shrink cursor-pointer w-[200px] lg:w-full`}
                    style={{
                      borderColor: isActive ? a.color : "rgba(255, 255, 255, 0.06)",
                      backgroundColor: isActive ? `${a.color}0a` : "transparent",
                    }}
                  >
                    <div className="min-w-0">
                      <h3 className="font-sans text-xs font-bold text-text truncate">
                        {a.name}
                      </h3>
                      <span className="font-mono text-[9px] text-dim block truncate mt-0.5">
                        {a.badge}
                      </span>
                    </div>
                    <ChevronRight 
                      className="h-4 w-4 hidden lg:block transition-transform duration-300"
                      style={{ 
                        color: isActive ? a.color : "var(--color-dim)",
                        transform: isActive ? "translateX(2px)" : "none"
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-border p-6 bg-bg2 relative overflow-hidden"
              >
                {/* Accent Background Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-5 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${current.color} 0%, transparent 60%)`
                  }}
                />

                {/* Eyebrow */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-4 mb-5 font-mono text-[9px] text-dim uppercase tracking-widest">
                  <span>{current.badge}</span>
                  <span>Case Study ID: {current.id.toUpperCase()}</span>
                </div>

                {/* Title & Tagline */}
                <h2 className="text-xl font-bold tracking-tight text-text">
                  {current.name} <span className="text-muted font-normal">&mdash; {current.tagline}</span>
                </h2>

                {/* Grid Sections (Two-column table style) */}
                <div className="mt-6 grid grid-cols-[80px_1fr] gap-x-4 gap-y-6 text-xs leading-relaxed">
                  
                  {/* System Goal */}
                  <div className="font-mono text-[10px] text-dim select-none pt-0.5">
                    [goal]
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      System Goal
                    </h4>
                    <p className="text-muted">{current.goal}</p>
                  </div>

                  {/* Naive Prototype */}
                  <div className="font-mono text-[10px] text-dim select-none pt-0.5">
                    [prototype]
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      The Naive Prototype
                    </h4>
                    <p className="text-muted">{current.prototype}</p>
                  </div>

                  {/* Pain & Failures */}
                  <div className="font-mono text-[10px] text-red-500 dark:text-red-400 select-none pt-0.5">
                    [failure]
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      Why it broke in production
                    </h4>
                    <p className="text-muted">{current.pain}</p>
                  </div>

                  {/* Architectural Fixes */}
                  <div className="font-mono text-[10px] text-emerald-500 dark:text-emerald-400 select-none pt-0.5">
                    [fix]
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      Production Refactoring
                    </h4>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-muted">
                      {current.fixes.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Realization */}
                  <div className="col-span-2 mt-2 border-t border-border/40 pt-4 font-mono text-xs text-text">
                    &gt; {current.lessons}
                  </div>

                </div>

                {/* Footer Link */}
                <div className="mt-8 pt-4 border-t border-border/40 flex justify-end">
                  <Link
                    href={`/learn/track-${current.id === "chainelect" ? "0" : current.id === "proofchain" ? "3" : current.id === "socio3v1" ? "2" : current.id === "socio3v2" ? "4" : "1"}`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold hover:gap-1.5 transition-all"
                    style={{ color: current.color }}
                  >
                    View Related Lessons <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
