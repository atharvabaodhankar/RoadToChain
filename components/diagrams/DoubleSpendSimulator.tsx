"use client";

import { useState } from "react";

type Mode = "centralized" | "decentralized";

interface Step {
  id: number;
  label: string;
  centralizedOutcome: string;
  decentralizedOutcome: string;
  color: string;
}

const STEPS: Step[] = [
  {
    id: 1, label: "Transaction Created",
    centralizedOutcome: "Alice creates two payment orders: ₹100 → Bob, ₹100 → Charlie.",
    decentralizedOutcome: "Alice broadcasts two conflicting transactions to the network simultaneously.",
    color: "var(--dg-blue)",
  },
  {
    id: 2, label: "Broadcast",
    centralizedOutcome: "Both orders reach the bank's server sequentially.",
    decentralizedOutcome: "Both transactions propagate to different nodes across the P2P network.",
    color: "var(--dg-accent)",
  },
  {
    id: 3, label: "Validation",
    centralizedOutcome: "Bank checks balance — sees ₹100 already debited from Tx 1. Tx 2 fails.",
    decentralizedOutcome: "Nodes check the mempool. Conflicting txs compete for inclusion in a block.",
    color: "var(--dg-warning)",
  },
  {
    id: 4, label: "Consensus",
    centralizedOutcome: "Single database write. No consensus needed — bank is the authority.",
    decentralizedOutcome: "Validators agree on one canonical chain. The later nonce tx is dropped.",
    color: "var(--dg-teal)",
  },
  {
    id: 5, label: "Block Finalized",
    centralizedOutcome: "Only Tx 1 was processed. Tx 2 was silently rejected.",
    decentralizedOutcome: "Only one transaction makes it on-chain. Double spend attempt fails.",
    color: "var(--dg-success)",
  },
];

export default function DoubleSpendSimulator() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>("centralized");

  const current = STEPS[step] ?? null;
  const outcome = current
    ? mode === "centralized"
      ? current.centralizedOutcome
      : current.decentralizedOutcome
    : null;

  const isFinalStep = step === STEPS.length - 1;

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.2 — Double Spend Simulator
        </span>
        {/* Mode toggle */}
        <div className="flex rounded-md overflow-hidden border text-[10px] font-mono" style={{ borderColor: "var(--dg-border)" }}>
          {(["centralized", "decentralized"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setStep(0); }}
              className="px-3 py-1.5 capitalize transition-all duration-200"
              style={{
                background: mode === m ? "var(--dg-accent)" : "transparent",
                color: mode === m ? "white" : "var(--dg-text-dim)",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario banner */}
      <div className="px-5 py-3 border-b font-mono text-[11px]" style={{ borderColor: "var(--dg-border)", background: "var(--dg-card)" }}>
        <span style={{ color: "var(--dg-text-dim)" }}>Scenario: </span>
        <span style={{ color: "var(--dg-text)" }}>Alice has </span>
        <span style={{ color: "var(--dg-warning)", fontWeight: 600 }}>₹100</span>
        <span style={{ color: "var(--dg-text)" }}>. She tries to send it to </span>
        <span style={{ color: "var(--dg-success)", fontWeight: 600 }}>Bob</span>
        <span style={{ color: "var(--dg-text)" }}> and </span>
        <span style={{ color: "var(--dg-danger)", fontWeight: 600 }}>Charlie</span>
        <span style={{ color: "var(--dg-text)" }}> simultaneously.</span>
      </div>

      {/* Step progress */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className="flex-shrink-0 flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-200 border"
                  style={{
                    background: active ? s.color : done ? "rgba(124,58,237,0.1)" : "var(--dg-card)",
                    borderColor: active ? s.color : done ? "var(--dg-accent)" : "var(--dg-border)",
                    color: active ? "white" : done ? "var(--dg-accent)" : "var(--dg-text-dim)",
                  }}
                >
                  {done ? "✓" : s.id}
                </div>
                <span className="font-mono text-[8px] text-center max-w-[60px] leading-tight" style={{ color: active ? "var(--dg-text)" : "var(--dg-text-faint)" }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step detail */}
      {current && (
        <div className="mx-5 mb-5 rounded-lg border p-4" style={{ borderColor: current.color, background: "var(--dg-card)" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: current.color }} />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: current.color }}>
              Step {current.id} — {current.label}
            </span>
            <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: mode === "centralized" ? "rgba(220,38,38,0.1)" : "rgba(124,58,237,0.1)", color: mode === "centralized" ? "var(--dg-danger)" : "var(--dg-accent)" }}>
              {mode}
            </span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--dg-text)" }}>
            {outcome}
          </p>

          {/* Visual — Tx flow for this step */}
          {step === 2 && mode === "centralized" && (
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-1 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "var(--dg-success)" }}>TX 1 → Bob ✓</span>
              <span>·</span>
              <span className="px-2 py-1 rounded" style={{ background: "rgba(220,38,38,0.1)", color: "var(--dg-danger)" }}>TX 2 → Charlie ✗ Rejected</span>
            </div>
          )}
          {step === 2 && mode === "decentralized" && (
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-1 rounded" style={{ background: "rgba(245,158,11,0.1)", color: "var(--dg-warning)" }}>TX 1 — mempool conflict</span>
              <span>·</span>
              <span className="px-2 py-1 rounded" style={{ background: "rgba(245,158,11,0.1)", color: "var(--dg-warning)" }}>TX 2 — same nonce</span>
            </div>
          )}
          {isFinalStep && (
            <div className="mt-3 px-3 py-2 rounded font-mono text-[11px]" style={{ background: "rgba(34,197,94,0.08)", color: "var(--dg-success)", border: "1px solid rgba(34,197,94,0.2)" }}>
              ✓ Double spend prevented — this is exactly why blockchain exists.
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between px-5 pb-5">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-[10px] px-3 py-1.5 rounded border transition-all disabled:opacity-30"
          style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}
        >
          ← prev
        </button>
        <span className="font-mono text-[10px]" style={{ color: "var(--dg-text-faint)" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="font-mono text-[10px] px-3 py-1.5 rounded border transition-all disabled:opacity-30"
          style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}
        >
          next →
        </button>
      </div>
    </div>
  );
}
