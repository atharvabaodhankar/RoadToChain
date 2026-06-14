"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  Search,
  RotateCcw,
} from "lucide-react";
import { useProgress } from "@/app/context/ProgressContext";

interface TimelineStep {
  label: string;
  desc: string;
}

interface CodeDiff {
  before: string;
  after: string;
}

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
  layoutType: "quote" | "code-diff" | "timeline";
  timelineSteps?: TimelineStep[];
  codeDiff?: CodeDiff;
  detailsAddendum?: string;
}

const mistakes: Mistake[] = [
  {
    id: "db-misconception",
    track: "Track 1 · Solidity Systems",
    module: "Module 4 · Evolutionary Voting",
    lesson: "Blockchain is NOT your database — hybrid design rules",
    lessonUrl: "/learn/track-1/module-4/blockchain-is-not-your-database",
    title: "Storing a paragraph cost me $140 in gas",
    story: "When building my first voting contract, I stored long string descriptions (sometimes multiple paragraphs) directly in a state variable mapping. When a user tried to submit a proposal during a congested network hour, they were hit with a $140 gas bill. Some transactions failed completely because they exceeded the block gas limit.",
    lessonLearned: "Permanent state storage is the most expensive operation in the EVM (SSTORE costs 20,000 gas per 32-byte slot). For large text, metadata, or media, use off-chain decentralized storage like IPFS or Arweave, and store only the resulting 32-byte content hash (IPFS CID) on-chain.",
    severity: "Architectural",
    simulatorId: "gas",
    simulatorName: "Gas Simulator",
    layoutType: "timeline",
    timelineSteps: [
      { label: "1. Raw String Input", desc: "User inputs a detailed 3-paragraph proposal description on the frontend." },
      { label: "2. SSTORE Explosion", desc: "EVM executes SSTORE once for every 32-byte chunk, consuming 20,000 gas per slot." },
      { label: "3. Out of Gas Revert", desc: "Gas required spikes past the Block Gas Limit during congestion; tx fails and burns fees." }
    ],
    detailsAddendum: "Edit: It turns out gas costs on mainnet had spiked to 180 gwei that morning. The same transaction would cost around $4 today, but the architectural vulnerability remains exactly the same."
  },
  {
    id: "redis-need",
    track: "Track 2 · Full-Stack Web3",
    module: "Module 4 · Why Redis Suddenly Appeared",
    lesson: "Why we added Redis — IPFS was too slow",
    lessonUrl: "/learn/track-2/module-4/why-we-added-redis",
    title: "I rebuilt Redis badly, three times",
    story: "Our IPFS gateway fetches took 3-5 seconds per image. The admin panel took over 8 seconds to load, leading to a massive 60% user drop-off. I realized that querying IPFS directly on every page load was killing our system usability.",
    lessonLearned: "IPFS public gateways are slow and rate-limited. To build high-performance web applications, you must cache the immutable IPFS metadata (JSON structure, image links) in a fast in-memory database like Redis on the backend. This drops feed loading times to under 80ms.",
    severity: "Technical",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
    layoutType: "code-diff",
    codeDiff: {
      before: `// Direct gateway query on render (Took ~4s)
const res = await fetch(\`https://ipfs.io/ipfs/\${cid}\`);
const metadata = await res.json();
return metadata;`,
      after: `// Cache hit with background sync (Takes ~40ms)
let cached = await redis.get(cid);
if (!cached) {
  cached = await fetchFromGateway(cid);
  await redis.set(cid, JSON.stringify(cached), 'EX', 3600);
}
return JSON.parse(cached);`
    },
    detailsAddendum: "Note: The first version of my custom cache had a race condition that served stale metadata to users during bulk mints. Sticking to simple Redis EX set commands solved it."
  },
  {
    id: "graph-need",
    track: "Track 2 · Full-Stack Web3",
    module: "Module 5 · Why Indexing Appeared",
    lesson: "Why blockchain needs indexers — the sort/filter problem",
    lessonUrl: "/learn/track-2/module-5/why-blockchain-needs-indexers",
    title: "Without The Graph, every page load was a full chain scan",
    story: "The PM asked for a leaderboard sorted by votes. I quickly realized there is no 'ORDER BY' or 'WHERE' in Solidity. I tried to solve this by fetching all dynamic data from the contract directly in JS and sorting it in the client. Once we hit 1,000 items, the RPC node timed out and the browser froze.",
    lessonLearned: "Solidity has no native query engine. For filtering, sorting, or pagination, you must use an indexing service like The Graph. It compiles contract events (like 'VoteCast') into an off-chain queryable GraphQL database, removing load from RPC nodes.",
    severity: "Architectural",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
    layoutType: "quote",
    detailsAddendum: "Strikethrough: ~~I thought RPC nodes had cache index capabilities natively~~. They don't. They execute EVM code and return the raw state slot. Lesson learned."
  },
  {
    id: "voting-gas-collapse",
    track: "Track 1 · Solidity Systems",
    module: "Module 4 · Evolutionary Voting",
    lesson: "How I broke my first voting system — a gas disaster",
    lessonUrl: "/learn/track-1/module-4/how-i-broke-my-first-voting-system",
    title: "A simple loop that bricked our hackathon at 714 votes",
    story: "I designed a naive Solidity voting engine using simple arrays and looped over all voter addresses on-chain to compute results. It worked perfectly in my local unit tests with 10 voters. But when voter count scaled to 714 in production, the transaction gas cost to run the tally loop exceeded the block gas limit, rendering the contract frozen forever.",
    lessonLearned: "Gas limit is the absolute cap of computation in a block. Never design smart contracts with loops that grow dynamically with the number of users (O(n) storage iteration). Use O(1) mappings or tally votes incrementally on-chain whenever a vote is cast.",
    severity: "Technical",
    simulatorId: "gas",
    simulatorName: "Gas Simulator",
    layoutType: "timeline",
    timelineSteps: [
      { label: "1. Hardhat Tests (Pass)", desc: "Testing with 5 voters runs in under 0.05ms, using negligible gas." },
      { label: "2. Loop Growth (O(N))", desc: "Each new vote appends an address, forcing the tally loop to traverse a larger list." },
      { label: "3. Gas Exhaustion (Revert)", desc: "714th vote exceeds the 30M EVM block gas limit. Function becomes permanently locked." }
    ]
  },
  {
    id: "metamask-ux-failure",
    track: "Track 4 · Why Web3 UX Failed",
    module: "Module 1 · Why Web3 UX Failed",
    lesson: "Why MetaMask UX fails at consumer scale",
    lessonUrl: "/learn/track-4/module-1/why-metamask-confusion",
    title: "Onboarding took 9 minutes out of a 10-minute demo",
    story: "I spent my entire college hackathon demo helping the judges install the MetaMask extension, configure the Polygon RPC network, write down 12-word seed phrases, and get MATIC faucet tokens. We ran out of time and couldn't show our core features because onboarding took 9 out of our 10 minutes.",
    lessonLearned: "Forcing mainstream users through standard EOA/MetaMask extension setups is conversion suicide. Modern consumer applications must utilize embedded wallets (like Privy) for social OAuth logins and sponsor all gas fees under the hood via Account Abstraction.",
    severity: "UX & Product",
    simulatorId: "signing",
    simulatorName: "Signing Simulator",
    layoutType: "quote"
  },
  {
    id: "smart-account-faucet",
    track: "Track 4 · Why Web3 UX Failed",
    module: "Module 1 · Why Web3 UX Failed",
    lesson: "Why Web3 mobile onboarding sucks — and the Privy solution",
    lessonUrl: "/learn/track-4/module-1/why-web3-mobile-onboarding-sucks",
    title: "Why sending gas to a smart account contract instantly reverts",
    story: "We implemented beautiful Google OAuth logins generating Privy Smart Accounts. But our native token faucet transactions kept reverting when sending MATIC directly to the Smart Account contract addresses. Faucets hardcode a 25,000 gas limit for transfers, but smart contract accounts require >25,000 gas to execute their delegation logic.",
    lessonLearned: "Native gas token transfers to contract wallets will fail if hardcoded with strict gas limits. Faucet payloads must either target the user's EOA signer address directly, or the application must bypass faucet distribution entirely by sponsoring user operations gaslessly via Pimlico Paymasters.",
    severity: "Conceptual",
    simulatorId: "architecture",
    simulatorName: "Architecture Explorer",
    layoutType: "code-diff",
    codeDiff: {
      before: `// Standard faucet transfer (Enforces strict 2300 gas limit)
payable(smartAccountAddress).transfer(amount);`,
      after: `// Sponsor user ops directly using Pimlico Paymaster
const txHash = await paymaster.sponsorUserOperation({
  userOp,
  entryPoint
});`
    },
    detailsAddendum: "Edit: Hardhat's default local EVM network does not enforce strict gas caps on address.transfer() like mainnet or public testnets do, which is why this vulnerability wasn't caught during early local integration testing."
  },
  {
    id: "version-mismatch",
    track: "Track 1 · Solidity Systems",
    module: "Module 3 · Deployment & Blockchain State",
    lesson: "What deployment actually means",
    lessonUrl: "/learn/track-1/module-3/what-deployment-actually-means",
    title: "The Version Mismatch Nightmare",
    story: "Mixing Hardhat 2.x with Solidity 0.8.31, or using the latest Hardhat with old tutorial configurations. This resulted in unsupported language version errors, wasting hours updating pragma statements.",
    lessonLearned: "Hardhat and Solidity compiler versions are tightly coupled. Always verify that your hardhat.config.js Solidity compiler version is supported by the specific version of Hardhat you have installed. Run npx hardhat compile to check compatibility early.",
    severity: "Technical",
    layoutType: "quote"
  },
  {
    id: "ganache-ghost",
    track: "Track 0 · Blockchain Foundations",
    module: "Module 3 · Networks & Storage",
    lesson: "RPC explained — your app's phone line to the blockchain",
    lessonUrl: "/learn/track-0/module-3/rpc-explained",
    title: "The Ganache Ghost Connection",
    story: "Starting the Ganache GUI, setting MetaMask network to localhost:8545, and wondering why nothing works. The connection is refused, and MetaMask gets stuck on 'Connecting to Unknown Private Network'.",
    lessonLearned: "Ganache GUI runs on port 7545 by default, whereas the Ganache CLI (and Hardhat Network) runs on 8545. Always verify the port exposed by your node's RPC server before pointing MetaMask to it.",
    severity: "Conceptual",
    layoutType: "quote"
  },
  {
    id: "pragma-panic",
    track: "Track 1 · Solidity Systems",
    module: "Module 1 · Solidity Fundamentals",
    lesson: "Solidity variables and contract state",
    lessonUrl: "/learn/track-1/module-1/variables-and-state",
    title: "The Pragma Panic Attack",
    story: "Copying a contract from a 2019 tutorial with pragma solidity ^0.5.0 and trying to compile it with a modern setup. It resulted in a cascade of syntax errors, deprecated function warnings, and complete confusion.",
    lessonLearned: "Pragma versions restrict compilation compatibility. Solidity has undergone major breaking changes. Always write or refactor contracts to use modern 0.8.x rules.",
    severity: "Technical",
    layoutType: "code-diff",
    codeDiff: {
      before: `pragma solidity ^0.5.0;

contract OldContract {
    function get() public {
        // Old rules
    }
}`,
      after: `pragma solidity ^0.8.24;

contract ModernContract {
    function get() public pure {
        // Modern rules
    }
}`
    }
  },
  {
    id: "private-key-paste",
    track: "Track 0 · Blockchain Foundations",
    module: "Module 4 · Wallets & Identity",
    lesson: "Private keys, public keys, and addresses",
    lessonUrl: "/learn/track-0/module-4/why-web3-needs-wallets",
    title: "The Private Key Copy-Paste Disaster",
    story: "Importing a Ganache/Hardhat private key directly into MetaMask and deploying a test contract to Mainnet by accident, losing real ETH trying to deploy test contracts to production.",
    lessonLearned: "Never mix test accounts/development private keys with wallets containing real funds. Keep separate browser profiles, hardware wallets for production, and use environment variables with dotenv to strictly separate network configs.",
    severity: "UX & Product",
    layoutType: "quote"
  },
  {
    id: "truffle-migration",
    track: "Track 1 · Solidity Systems",
    module: "Module 3 · Deployment & Blockchain State",
    lesson: "What deployment actually means",
    lessonUrl: "/learn/track-1/module-3/what-deployment-actually-means",
    title: "The Truffle Migration Confusion",
    story: "Running truffle migrate without understanding migration files, leading to deploying the same contract multiple times, not being able to find the 'real' address, and a general debugging nightmare.",
    lessonLearned: "Truffle migrations use an on-chain Migrations contract to record the last completed deployment step. To redeploy modified contracts, you must use truffle migrate --reset to run all migrations from scratch.",
    severity: "Technical",
    layoutType: "quote"
  },
  {
    id: "gas-black-hole",
    track: "Track 0 · Blockchain Foundations",
    module: "Module 5 · Gas & Transactions",
    lesson: "Why you pay gas even when the transaction fails",
    lessonUrl: "/learn/track-0/module-5/failed-transaction-gas",
    title: "The Gas Estimation Black Hole",
    story: "Sending a transaction without setting a gas limit and letting MetaMask 'estimate'. The transaction fails, you pay gas anyway, and have no idea what went wrong.",
    lessonLearned: "Always let library providers estimate gas dynamically rather than hardcoding limits, but verify that the contracts are not executing loops or code paths that exceed typical transaction sizes.",
    severity: "Conceptual",
    layoutType: "quote"
  },
  {
    id: "abi-import-hell",
    track: "Track 1 · Solidity Systems",
    module: "Module 3 · Deployment & Blockchain State",
    lesson: "ABI — the contract's API specification",
    lessonUrl: "/learn/track-1/module-3/abi-as-translator",
    title: "The ABI Import Hell",
    story: "Manually copying ABI JSON strings from Remix or Hardhat, pasting them directly into frontend files, and missing brackets/commas. This results in contract-not-found errors and hours of debugging JSON syntax instead of smart contract logic.",
    lessonLearned: "Never manually copy and paste raw ABI JSON strings. Instead, import the JSON file directly if your bundler supports it, or generate type-safe bindings using tools like wagmi-cli or viem.",
    severity: "Technical",
    layoutType: "quote"
  }
];

export default function MistakesPage() {
  const { mistakeViews, trackMistakeView } = useProgress();
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        <div className="relative mx-auto max-w-4xl">
          <div className="font-mono text-[10px] text-dim uppercase tracking-wider mb-4">
            {"// mistakes"}
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Mistakes Hub
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            The things nobody tells you. 13 real failures from shipped projects, organized by category.
          </p>
        </div>
      </section>

      {/* Main Panel */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border/60 pb-6">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-dim" />
            <input
              type="text"
              placeholder="Search post-mortems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg2/50 border border-border rounded-lg text-xs focus:outline-none focus:border-border2 placeholder:text-dim font-mono"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {["All", "Conceptual", "Technical", "Architectural", "UX & Product"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded px-3 py-1.5 text-[10px] font-mono transition-colors cursor-pointer border ${
                  selectedSeverity === sev
                    ? "border-text text-text bg-bg3"
                    : "border-border bg-bg/40 text-dim hover:text-text hover:border-border2"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredMistakes.map((m) => {
              const visits = mistakeViews[m.id] || 0;
              const isExpanded = expandedId === m.id;

              return (
                <motion.div
                  key={m.id}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden bg-bg2/40 shadow-sm ${
                    isExpanded ? "border-border2" : "border-border/80 hover:border-border2/80"
                  }`}
                >
                  {/* Card Header clickable */}
                  <div
                    onClick={() => handleToggleExpand(m.id)}
                    className="p-6 cursor-pointer select-none space-y-2"
                  >
                    {/* Eyebrow & Metadata */}
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-dim uppercase tracking-wider">
                      <span>{m.track}</span>
                      <span>·</span>
                      <span>{m.module}</span>
                      <span>·</span>
                      <span className="lowercase">[{m.severity}]</span>
                      {visits > 0 && (
                        <>
                          <span>·</span>
                          <span>{visits} {visits === 1 ? "view" : "views"}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight text-text">
                      {m.title}
                    </h3>
                  </div>

                  {/* Card Content body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="border-t border-border/40 bg-bg/20 overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          {/* Story / Prose */}
                          <p className="text-[14px] text-muted leading-relaxed">
                            {m.story}
                          </p>

                          {/* Code-Diff representation if applicable */}
                          {m.layoutType === "code-diff" && m.codeDiff && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                              {/* Before */}
                              <div className="rounded-lg border border-border bg-bg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg3 font-mono text-[9px] text-red-500 font-bold uppercase tracking-wider">
                                  <span>BEFORE (Vulnerable)</span>
                                </div>
                                <pre className="p-4 font-mono text-[10px] leading-relaxed text-text/80 bg-bg2/40 overflow-x-auto">
                                  <code>{m.codeDiff.before}</code>
                                </pre>
                              </div>
                              {/* After */}
                              <div className="rounded-lg border border-border bg-bg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg3 font-mono text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                                  <span>AFTER (Optimized)</span>
                                </div>
                                <pre className="p-4 font-mono text-[10px] leading-relaxed text-text/80 bg-bg2/40 overflow-x-auto">
                                  <code>{m.codeDiff.after}</code>
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* Timeline steps if timeline layout */}
                          {m.layoutType === "timeline" && m.timelineSteps && (
                            <div className="relative border-l border-border pl-4 ml-1 my-4 space-y-3">
                              {m.timelineSteps.map((step, idx) => (
                                <div key={idx} className="relative">
                                  <div className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-border border border-bg" />
                                  <div className="text-[10px] font-mono font-bold text-dim uppercase tracking-wider mb-0.5">
                                    {step.label}
                                  </div>
                                  <p className="text-[12px] text-muted leading-relaxed">{step.desc}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Terminal-style takeaway quote */}
                          <div className="font-mono text-[12px] text-text leading-relaxed pl-2 py-1 my-4 border-l border-border">
                            &gt; {m.lessonLearned}
                          </div>

                          {/* Optional addendum details */}
                          {m.detailsAddendum && (
                            <p className="text-[11px] font-mono text-dim leading-relaxed border-t border-border/20 pt-3 mt-2">
                              {m.detailsAddendum}
                            </p>
                          )}

                          {/* Actions line */}
                          <div className="pt-2 flex justify-start">
                            <Link
                              href={m.lessonUrl}
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-accent hover:underline"
                            >
                              Read the full lesson &rarr;
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
