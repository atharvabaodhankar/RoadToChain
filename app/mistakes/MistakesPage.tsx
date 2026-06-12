"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Terminal,
  Activity,
  BarChart2,
  Eye,
  Search,
  Filter,
  Play,
  RotateCcw,
} from "lucide-react";
import { useProgress } from "@/app/context/ProgressContext";
import { tracks } from "@/lib/curriculum";

interface Mistake {
  id: string;
  track: string;
  module: string;
  lesson: string;
  lessonUrl: string;
  title: string;
  story: string;
  lessonLearned: string;
  severity: "Conceptual" | "Technical" | "Architectural" | "UX & Product";
  simulatorId?: string;
  simulatorName?: string;
}

const mistakes: Mistake[] = [
  {
    id: "db-misconception",
    track: "Track 1 · Solidity Systems",
    module: "Module 4 · Evolutionary Voting",
    lesson: "Blockchain is NOT your database — hybrid design rules",
    lessonUrl: "/learn/track-1/module-4/blockchain-is-not-your-database",
    title: "The Day I Thought Blockchain Was A Database",
    story: "When building my first voting contract, I stored long string descriptions (sometimes multiple paragraphs) directly in a state variable mapping. When a user tried to submit a proposal during a congested network hour, they were hit with a $140 gas bill. Some transactions failed completely because they exceeded the block gas limit.",
    lessonLearned: "Permanent state storage is the most expensive operation in the EVM (SSTORE costs 20,000 gas per 32-byte slot). For large text, metadata, or media, use off-chain decentralized storage like IPFS or Arweave, and store only the resulting 32-byte content hash (IPFS CID) on-chain.",
    severity: "Architectural",
    simulatorId: "gas",
    simulatorName: "Gas Simulator",
  },
  {
    id: "redis-need",
    track: "Track 2 · Full-Stack Web3",
    module: "Module 4 · Why Redis Suddenly Appeared",
    lesson: "Why we added Redis — IPFS was too slow",
    lessonUrl: "/learn/track-2/module-4/why-we-added-redis",
    title: "The Day I Needed Redis",
    story: "Our IPFS gateway fetches took 3-5 seconds per image. The admin panel took over 8 seconds to load, leading to a massive 60% user drop-off. I realized that querying IPFS directly on every page load was killing our system usability.",
    lessonLearned: "IPFS public gateways are slow and rate-limited. To build high-performance web applications, you must cache the immutable IPFS metadata (JSON structure, image links) in a fast in-memory database like Redis on the backend. This drops feed loading times to under 80ms.",
    severity: "Technical",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
  },
  {
    id: "graph-need",
    track: "Track 2 · Full-Stack Web3",
    module: "Module 5 · Why Indexing Appeared",
    lesson: "Why blockchain needs indexers — the sort/filter problem",
    lessonUrl: "/learn/track-2/module-5/why-blockchain-needs-indexers",
    title: "The Day I Needed The Graph",
    story: "The PM asked for a leaderboard sorted by votes. I quickly realized there is no 'ORDER BY' or 'WHERE' in Solidity. I tried to solve this by fetching all dynamic data from the contract directly in JS and sorting it in the client. Once we hit 1,000 items, the RPC node timed out and the browser froze.",
    lessonLearned: "Solidity has no native query engine. For filtering, sorting, or pagination, you must use an indexing service like The Graph. It compiles contract events (like 'VoteCast') into an off-chain queryable GraphQL database, removing load from RPC nodes.",
    severity: "Architectural",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
  },
  {
    id: "voting-gas-collapse",
    track: "Track 1 · Solidity Systems",
    module: "Module 4 · Evolutionary Voting",
    lesson: "How I broke my first voting system — a gas disaster",
    lessonUrl: "/learn/track-1/module-4/how-i-broke-my-first-voting-system",
    title: "Why My Voting System Broke",
    story: "I designed a naive Solidity voting engine using simple arrays and looped over all voter addresses on-chain to compute results. It worked perfectly in my local unit tests with 10 voters. But when voter count scaled to 714 in production, the transaction gas cost to run the tally loop exceeded the block gas limit, rendering the contract frozen forever.",
    lessonLearned: "Gas limit is the absolute cap of computation in a block. Never design smart contracts with loops that grow dynamically with the number of users (O(n) storage iteration). Use O(1) mappings or tally votes incrementally on-chain whenever a vote is cast.",
    severity: "Technical",
    simulatorId: "gas",
    simulatorName: "Gas Simulator",
  },
  {
    id: "metamask-ux-failure",
    track: "Track 4 · Why Web3 UX Failed",
    module: "Module 1 · Why Web3 UX Failed",
    lesson: "Why MetaMask UX fails at consumer scale",
    lessonUrl: "/learn/track-4/module-1/why-metamask-confusion",
    title: "Why MetaMask Confused Everyone",
    story: "I spent my entire college hackathon demo helping the judges install the MetaMask extension, configure the Polygon RPC network, write down 12-word seed phrases, and get MATIC faucet tokens. We ran out of time and couldn't show our core features because onboarding took 9 out of our 10 minutes.",
    lessonLearned: "Forcing mainstream users through standard EOA/MetaMask extension setups is conversion suicide. Modern consumer applications must utilize embedded wallets (like Privy) for social OAuth logins and sponsor all gas fees under the hood via Account Abstraction.",
    severity: "UX & Product",
    simulatorId: "signing",
    simulatorName: "Signing Simulator",
  },
  {
    id: "smart-account-faucet",
    track: "Track 4 · Why Web3 UX Failed",
    module: "Module 1 · Why Web3 UX Failed",
    lesson: "Why Web3 mobile onboarding sucks — and the Privy solution",
    lessonUrl: "/learn/track-4/module-1/why-web3-mobile-onboarding-sucks",
    title: "The Smart Account Faucet Nightmare",
    story: "We implemented beautiful Google OAuth logins generating Privy Smart Accounts. But our native token faucet transactions kept reverting when sending MATIC directly to the Smart Account contract addresses. Faucets hardcode a 25,000 gas limit for transfers, but smart contract accounts require >25,000 gas to execute their delegation logic.",
    lessonLearned: "Native gas token transfers to contract wallets will fail if hardcoded with strict gas limits. Faucet payloads must either target the user's EOA signer address directly, or the application must bypass faucet distribution entirely by sponsoring user operations gaslessly via Pimlico Paymasters.",
    severity: "Conceptual",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
  }
];

const severityColors: Record<string, string> = {
  Conceptual: "#10b981", // green
  Technical: "#3b82f6", // blue
  Architectural: "#f59e0b", // amber
  "UX & Product": "#7c3aed", // violet
};

export default function MistakesPage() {
  const { completed, simulatorUsage, mistakeViews, trackMistakeView } = useProgress();
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Total lessons in curriculum
  const totalLessons = useMemo(() => {
    return tracks.reduce((acc, t) => acc + t.lessonCount, 0);
  }, []);

  const completionRate = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.round((completed.length / totalLessons) * 100);
  }, [completed.length, totalLessons]);

  const totalSimulatorInteractions = useMemo(() => {
    return Object.values(simulatorUsage).reduce((acc, val) => acc + val, 0);
  }, [simulatorUsage]);

  // Find most viewed mistake from telemetry
  const topMistakeName = useMemo(() => {
    let topId = "";
    let maxViews = 0;
    Object.entries(mistakeViews).forEach(([id, val]) => {
      if (val > maxViews) {
        maxViews = val;
        topId = id;
      }
    });
    if (!topId) return "None";
    const found = mistakes.find((m) => m.id === topId);
    return found ? found.title : "None";
  }, [mistakeViews]);

  // Filter mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.story.toLowerCase().includes(search.toLowerCase()) ||
        m.lesson.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = selectedSeverity === "All" || m.severity === selectedSeverity;
      return matchSearch && matchSeverity;
    });
  }, [search, selectedSeverity]);

  const handleToggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      trackMistakeView(id); // Log view to telemetry
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans pb-24">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-bg2/40 px-4 py-16 sm:px-6 lg:px-8">
        {/* Decorative Grid and Lights */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[250px] w-[600px] rounded-full bg-amber-500/5 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 mb-6">
            <Terminal className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono text-[10px] font-bold text-amber-500 tracking-wider uppercase">
              {"// TELEMETRY POST-MORTEM TERMINAL"}
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Mistakes Hub
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            The things they don&apos;t write in standard API documentations. Analyze production crashes, gas limits, and system collapses that shaped real Web3 networks.
          </p>

          {/* Telemetry Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {/* Metric 1 */}
            <div className="rounded-xl border border-border bg-bg3 p-4 relative overflow-hidden group hover:border-border2 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Telemetry Health</span>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-text">{completionRate}%</div>
              <div className="mt-2 text-[10px] text-muted">Average Lesson Completion</div>
              <div className="w-full bg-border/40 h-1 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl border border-border bg-bg3 p-4 relative overflow-hidden group hover:border-border2 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Simulator Diagnostics</span>
                <Play className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-text">{totalSimulatorInteractions}</div>
              <div className="mt-2 text-[10px] text-muted">Total Interactive Runs</div>
              <div className="mt-3 font-mono text-[8px] text-dim flex gap-1.5">
                <span>Gas: {simulatorUsage.gas || 0}</span>
                <span>•</span>
                <span>Sign: {simulatorUsage.signing || 0}</span>
                <span>•</span>
                <span>Deploy: {simulatorUsage.deployment || 0}</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl border border-border bg-bg3 p-4 relative overflow-hidden group hover:border-border2 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Inspected Incidents</span>
                <Eye className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-text">
                {Object.values(mistakeViews).reduce((a, b) => a + b, 0)}
              </div>
              <div className="mt-2 text-[10px] text-muted">Total Incident Views</div>
              <div className="mt-3 font-mono text-[8px] text-dim truncate">
                Active views registered locally
              </div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-xl border border-border bg-bg3 p-4 relative overflow-hidden group hover:border-border2 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim">Top Hotspot</span>
                <BarChart2 className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-sm font-bold text-text truncate max-w-full" title={topMistakeName}>
                {topMistakeName}
              </div>
              <div className="mt-2 text-[10px] text-muted">Most Visited Report</div>
              <div className="mt-3 font-mono text-[8px] text-dim">
                Telemetry diagnostic priority
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Panel */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-bg2/40 border border-border p-4 rounded-xl backdrop-blur-md">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-dim" />
            <input
              type="text"
              placeholder="Search post-mortems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg3 border border-border rounded-lg text-xs focus:outline-none focus:border-border2 placeholder:text-dim font-mono"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-dim mr-1 hidden sm:block" />
            {["All", "Conceptual", "Technical", "Architectural", "UX & Product"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded px-3 py-1.5 text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSeverity === sev
                    ? "bg-accent/10 border border-accent/40 text-accent"
                    : "border border-border bg-bg3/60 text-muted hover:text-text hover:border-border2"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMistakes.map((m) => {
              const isExpanded = expandedId === m.id;
              const severityColor = severityColors[m.severity] || "var(--color-dim)";
              const visits = mistakeViews[m.id] || 0;

              return (
                <motion.div
                  key={m.id}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden bg-bg2 ${
                    isExpanded ? "border-border2 shadow-xl" : "border-border/60 hover:border-border2/80 hover:bg-bg3/40"
                  }`}
                  style={{ borderLeft: `3px solid ${severityColor}` }}
                >
                  {/* Card Header clickable */}
                  <div
                    onClick={() => handleToggleExpand(m.id)}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div>
                      {/* Eyebrow */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[9px] text-dim">
                        <span>{m.track}</span>
                        <span>•</span>
                        <span>{m.module}</span>
                      </div>
                      {/* Title */}
                      <h3 className="text-sm font-semibold tracking-tight text-text flex items-center gap-2">
                        {m.title}
                      </h3>
                    </div>

                    {/* Badge + Clicks */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {visits > 0 && (
                        <span className="font-mono text-[9px] text-dim flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {visits} {visits === 1 ? "view" : "views"}
                        </span>
                      )}
                      <span
                        className="rounded px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border"
                        style={{
                          color: severityColor,
                          borderColor: `${severityColor}30`,
                          backgroundColor: `${severityColor}10`,
                        }}
                      >
                        {m.severity}
                      </span>
                    </div>
                  </div>

                  {/* Card Content body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="border-t border-border/40 bg-bg/40 overflow-hidden"
                      >
                        <div className="p-5 space-y-6">
                          {/* Incident Story (Terminal UI block) */}
                          <div className="rounded-lg border border-border bg-bg overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg3 font-mono text-[9px] text-dim">
                              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                              <span>INCIDENT_REPORT_LOG_{m.id.toUpperCase()}.txt</span>
                            </div>
                            <div className="p-4 font-mono text-[11px] leading-relaxed text-text/80 max-h-72 overflow-y-auto bg-bg2/60">
                              <p className="italic">&ldquo;{m.story}&rdquo;</p>
                            </div>
                          </div>

                          {/* Analysis / Lesson Learned */}
                          <div>
                            <h4 className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                              Root Cause Analysis
                            </h4>
                            <p className="text-xs text-text leading-relaxed">
                              {m.lessonLearned}
                            </p>
                          </div>

                          {/* Action Bar */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-border/30">
                            {/* Simulator link */}
                            {m.simulatorId ? (
                              <Link
                                href={`/learn/track-${m.simulatorId === "gas" ? "1/module-4/how-i-broke-my-first-voting-system" : m.simulatorId === "signing" ? "0/module-4/how-signing-actually-works" : "2/module-1/my-first-thought-i-only-need-blockchain"}`}
                                className="inline-flex items-center gap-2 rounded bg-accent hover:bg-accent2 text-text font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 transition-all w-full sm:w-auto justify-center"
                              >
                                <Play className="h-3 w-3 fill-text text-text" /> Run {m.simulatorName}
                              </Link>
                            ) : (
                              <div />
                            )}

                            {/* Lesson redirect */}
                            <Link
                              href={m.lessonUrl}
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-[#a78bfa] hover:text-[#c084fc] transition-colors py-2.5 justify-center"
                            >
                              Inspect Full Lesson <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty search */}
          {filteredMistakes.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-xl bg-bg2/10">
              <AlertTriangle className="h-8 w-8 text-dim mx-auto mb-3" />
              <p className="text-xs text-muted font-mono">No incidents matching search terms resolved.</p>
              <button 
                onClick={() => { setSearch(""); setSelectedSeverity("All"); }}
                className="mt-3 text-[10px] font-mono text-accent flex items-center gap-1 mx-auto hover:underline"
              >
                <RotateCcw className="h-3 w-3" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
