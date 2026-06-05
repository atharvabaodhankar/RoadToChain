"use client";

import { useState } from "react";

interface CompRow {
  label: string;
  mainnet: string;
  testnet: string;
  detail: string;
}

const ROWS: CompRow[] = [
  {
    label: "ETH Value",
    mainnet: "Real money — market price",
    testnet: "Worthless — free from faucet",
    detail: "Testnet ETH (Sepolia ETH, Holesky ETH) can be obtained for free from faucets. It has no monetary value and cannot be sold.",
  },
  {
    label: "Gas Fees",
    mainnet: "Real ETH — costs real money",
    testnet: "Fake ETH — free to use",
    detail: "On testnets you pay gas with fake ETH. This lets you deploy and test contracts without spending money, but it means gas estimation may differ slightly from mainnet.",
  },
  {
    label: "Consequences",
    mainnet: "Irreversible — no undo",
    testnet: "Reset periodically",
    detail: "Mainnet transactions are permanent. Testnet networks are occasionally reset (Sepolia was wiped in 2022). Never test permanent storage assumptions on testnet.",
  },
  {
    label: "Smart Contracts",
    mainnet: "Mainnet contract addresses",
    testnet: "Completely different addresses",
    detail: "A contract deployed to Sepolia has a different address than the same contract on mainnet. You need to deploy separately to each network.",
  },
  {
    label: "Usage",
    mainnet: "Production dApps, real users",
    testnet: "Development, debugging, CI/CD",
    detail: "Testnets exist specifically so you can break things safely. The entire point is that failures have no financial consequence.",
  },
];

export default function MainnetVsTestnetExplorer() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.5 — Mainnet vs Testnet Explorer
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 border-b text-center" style={{ borderColor: "var(--dg-border)" }}>
        <div className="px-4 py-3 border-r" style={{ borderColor: "var(--dg-border)" }}>
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--dg-text-faint)" }}>Property</span>
        </div>
        <div className="px-4 py-3 border-r" style={{ borderColor: "var(--dg-border)", background: "rgba(220,38,38,0.03)" }}>
          <span className="font-mono text-[10px] font-semibold" style={{ color: "var(--dg-danger)" }}>Mainnet</span>
          <div className="font-mono text-[8px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>Real consequences</div>
        </div>
        <div className="px-4 py-3" style={{ background: "rgba(22,163,74,0.03)" }}>
          <span className="font-mono text-[10px] font-semibold" style={{ color: "var(--dg-success)" }}>Testnet</span>
          <div className="font-mono text-[8px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>Safe playground</div>
        </div>
      </div>

      {/* Comparison rows */}
      {ROWS.map((row, i) => {
        const isExpanded = expanded === i;
        return (
          <div key={i}>
            <button
              className="w-full grid grid-cols-3 border-b text-left transition-all hover:opacity-90"
              style={{ borderColor: "var(--dg-border)", background: isExpanded ? "var(--dg-card)" : "transparent" }}
              onClick={() => setExpanded(isExpanded ? null : i)}
            >
              <div className="px-4 py-3 border-r flex items-center gap-1.5" style={{ borderColor: "var(--dg-border)" }}>
                <span className="font-mono text-[10px]" style={{ color: "var(--dg-text)" }}>{row.label}</span>
                <span className="font-mono text-[8px] ml-auto" style={{ color: "var(--dg-text-faint)" }}>{isExpanded ? "▲" : "▼"}</span>
              </div>
              <div className="px-4 py-3 border-r" style={{ borderColor: "var(--dg-border)" }}>
                <span className="font-mono text-[10px]" style={{ color: "var(--dg-danger)" }}>{row.mainnet}</span>
              </div>
              <div className="px-4 py-3">
                <span className="font-mono text-[10px]" style={{ color: "var(--dg-success)" }}>{row.testnet}</span>
              </div>
            </button>
            {isExpanded && (
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)", background: "var(--dg-card)" }}>
                <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--dg-text)" }}>
                  {row.detail}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Misconception callout */}
      <div className="m-5 rounded-md border-l-2 px-4 py-3" style={{ borderColor: "var(--dg-warning)", background: "rgba(217,119,6,0.05)" }}>
        <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--dg-warning)" }}>
          Common misconception
        </div>
        <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--dg-text)" }}>
          &ldquo;If testnet works, why not use it forever?&rdquo;
        </p>
        <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: "var(--dg-text-dim)" }}>
          Testnet ETH has no value, so nobody has economic incentive to attack it. Real attacks on real money only happen on mainnet. Security assumptions that hold on testnet can fail on mainnet under real economic pressure.
        </p>
      </div>
    </div>
  );
}
