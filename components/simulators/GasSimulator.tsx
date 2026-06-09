"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/context/ProgressContext";

// Real gas numbers from the voting disaster
const BLOCK_GAS_LIMIT = 30_000_000;

const scenarios = [
  {
    label: "5 voters",
    voters: 5,
    gasPerVoter: 42_000,
    description: "Stores name (string), address, vote choice on-chain.",
  },
  {
    label: "50 voters",
    voters: 50,
    gasPerVoter: 42_000,
    description: "Loop to tally all votes iterates 50 times.",
  },
  {
    label: "200 voters",
    voters: 200,
    gasPerVoter: 42_000,
    description: "Loop cost is now significant. UI starts freezing.",
  },
  {
    label: "500 voters",
    voters: 500,
    gasPerVoter: 42_000,
    description: "Approaching dangerous territory for tally function.",
  },
  {
    label: "714 voters",
    voters: 714,
    gasPerVoter: 42_000,
    description: "This is where my contract reverted. Every time.",
  },
];

function formatGas(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function formatEth(gas: number, gwei = 30): string {
  const eth = (gas * gwei * 1e-9);
  if (eth < 0.001) return `$${(eth * 3000).toFixed(4)}`;
  return `$${(eth * 3000).toFixed(2)}`;
}

export default function GasSimulator() {
  const { trackSimulatorUsage } = useProgress();
  const [voterCount, setVoterCount] = useState(5);
  const [reverted, setReverted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const prevVoters = useRef(voterCount);

  useEffect(() => {
    trackSimulatorUsage("gas");
  }, [trackSimulatorUsage]);

  const gasUsed = voterCount * 42_000 + 21_000; // base tx cost
  const tallyGas = voterCount * 5_800; // SLOAD loop cost
  const totalGas = gasUsed + tallyGas;
  const fillPct = Math.min((totalGas / BLOCK_GAS_LIMIT) * 100, 100);
  const isReverted = totalGas > BLOCK_GAS_LIMIT;
  const isDanger = fillPct > 70;
  const isWarning = fillPct > 40 && !isDanger;

  useEffect(() => {
    if (isReverted && !reverted) {
      setAnimating(true);
      setTimeout(() => {
        setReverted(true);
        setAnimating(false);
      }, 600);
    } else if (!isReverted && reverted) {
      setReverted(false);
    }
    prevVoters.current = voterCount;
  }, [isReverted, reverted, voterCount]);

  const barColor = reverted
    ? "#ef4444"
    : isDanger
    ? "#f97316"
    : isWarning
    ? "#f59e0b"
    : "#22c55e";

  const activeScenario = scenarios.reduce((prev, curr) =>
    Math.abs(curr.voters - voterCount) < Math.abs(prev.voters - voterCount) ? curr : prev
  );

  return (
    <div className="my-8 rounded-xl border border-border bg-bg overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-bg2">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${reverted ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Gas Simulator — Voting Contract Disaster
          </span>
        </div>
        <span className="text-[10px] text-dim uppercase">
          {reverted ? "REVERTED" : "BLOCK_SPACE_AVAILABLE"}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted">Number of voters stored on-chain</label>
            <span className="text-sm font-bold text-text">{voterCount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={voterCount}
            onChange={(e) => setVoterCount(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${barColor} 0%, ${barColor} ${voterCount / 10}%, var(--border) ${voterCount / 10}%, var(--border) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-dim mt-1">
            <span>1</span>
            <span className="text-amber-500">~714 → revert</span>
            <span>1,000</span>
          </div>
        </div>

        {/* Gas meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Block gas limit usage</span>
            <span className="text-xs font-bold" style={{ color: barColor }}>
              {fillPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-5 w-full rounded-full bg-bg3 border border-border overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: barColor }}
              animate={{ width: `${Math.min(fillPct, 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {animating && (
              <motion.div
                className="absolute inset-0 bg-red-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0] }}
                transition={{ duration: 0.6 }}
              />
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Storage gas", value: formatGas(gasUsed), sub: "SSTORE × voters" },
            { label: "Tally loop gas", value: formatGas(tallyGas), sub: "SLOAD × voters" },
            { label: "Total gas", value: formatGas(totalGas), sub: `of ${formatGas(BLOCK_GAS_LIMIT)} limit` },
            { label: "Approx cost", value: formatEth(totalGas), sub: "@ 30 gwei" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-bg3 p-3">
              <div className="text-[10px] text-dim uppercase mb-1">{stat.label}</div>
              <div className="text-base font-bold text-text">{stat.value}</div>
              <div className="text-[10px] text-dim">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Revert / Status banner */}
        <AnimatePresence mode="wait">
          {reverted ? (
            <motion.div
              key="reverted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 dark:border-red-800/60 dark:bg-red-950/40 p-4"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-red-650 dark:text-red-400 text-lg leading-none mt-0.5">✖</span>
                <div>
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                    TRANSACTION REVERTED — OUT OF GAS
                  </div>
                  <div className="text-[11px] text-red-700 dark:text-red-300/80 leading-relaxed">
                    The tally function looped over {voterCount} voters. Each SLOAD opcode cost 2,100 gas.
                    Total gas ({formatGas(totalGas)}) exceeded the 30M block gas limit.
                    The transaction failed. <span className="text-red-600 dark:text-red-400 font-bold">You still paid the gas.</span>
                  </div>
                  <div className="mt-2 text-[10px] text-red-700/60 dark:text-red-400/60 italic">
                    This is exactly what happened with my voting system at 714 voters.
                  </div>
                </div>
              </div>
            </motion.div>
          ) : isDanger ? (
            <motion.div
              key="danger"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-orange-500/20 bg-orange-500/5 dark:border-orange-800/60 dark:bg-orange-950/30 p-4"
            >
              <div className="text-[11px] text-orange-700 dark:text-orange-300/80 leading-relaxed">
                <span className="text-orange-600 dark:text-orange-400 font-bold">⚠ Danger zone.</span> At {voterCount} voters you are using {fillPct.toFixed(0)}% of the block gas limit just for this one contract interaction. Any additional gas usage — another function call, more SLOAD ops — will push you over.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-800/40 dark:bg-emerald-950/20 p-3"
            >
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
                ✓ Transaction succeeds at {voterCount} voters. {activeScenario.description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scenario quick-jump pills */}
        <div>
          <div className="text-[10px] text-dim uppercase mb-2">Quick scenarios</div>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.voters}
                onClick={() => {
                  setVoterCount(s.voters);
                  trackSimulatorUsage("gas");
                }}
                className={`rounded px-3 py-1.5 text-[11px] border transition-all ${
                  voterCount === s.voters
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border bg-bg3 text-muted hover:border-border2 hover:text-text"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fix note */}
        <div className="border-t border-border pt-4">
          <div className="text-[10px] text-dim uppercase mb-2">The fix</div>
          <div className="text-[11px] text-muted leading-relaxed">
            Store only a <span className="text-emerald-400">mapping(address =&gt; bool)</span> on-chain. Move vote tallying off-chain via event indexing. The vote registration gas drops to ~22K regardless of how many voters exist. The tally query runs in milliseconds in The Graph.
          </div>
        </div>
      </div>
    </div>
  );
}
