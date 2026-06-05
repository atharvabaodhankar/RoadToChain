"use client";

import { useState } from "react";

interface TxStep {
  id: number;
  label: string;
  icon: string;
  what: string;
  confusion: string;
  analogy: string;
  color: string;
}

const STEPS: TxStep[] = [
  {
    id: 1, label: "Your Wallet", icon: "◈",
    what: "You initiate the transaction in your wallet app (MetaMask, Privy, etc.). You specify the recipient address, amount, and optionally gas settings.",
    confusion: "Many beginners think the wallet \"processes\" the transaction. It doesn't — it only prepares and signs it.",
    analogy: "Writing a cheque: you fill in the amount and recipient, then sign it. The bank hasn't seen it yet.",
    color: "var(--dg-accent)",
  },
  {
    id: 2, label: "Private Key Signs", icon: "⌗",
    what: "Your private key generates a cryptographic signature (r, s, v values using ECDSA). This signature mathematically proves you authorized the transaction without revealing your key.",
    confusion: "\"The private key is sent to the network.\" — No. The signature is sent. The key stays on your device, always.",
    analogy: "Sealing a letter with your personal wax seal. Anyone can verify it's yours by looking at the seal, but nobody can copy the seal without the original.",
    color: "var(--dg-blue)",
  },
  {
    id: 3, label: "RPC Request", icon: "⟳",
    what: "Your wallet sends the signed transaction as a JSON-RPC request to an RPC endpoint (Alchemy, Infura, or your own node). This is just an HTTPS POST request.",
    confusion: "\"RPC is the blockchain.\" — No. RPC is a communication layer. Like calling a phone number to reach the post office.",
    analogy: "Dropping the sealed letter at a post office counter. The courier (RPC) doesn't open or change it — they just forward it.",
    color: "var(--dg-teal)",
  },
  {
    id: 4, label: "Mempool", icon: "▤",
    what: "The transaction enters the mempool (memory pool) — a waiting room of unconfirmed transactions. All nodes maintain their own mempool. Transactions with higher gas fees get priority.",
    confusion: "\"Once I send a tx, it's confirmed.\" — No. The mempool is volatile. A tx can stay pending for hours or get dropped if gas is too low.",
    analogy: "Your letter sits in a sorting facility with thousands of other letters. Letters with higher postage get sorted first.",
    color: "var(--dg-warning)",
  },
  {
    id: 5, label: "Validator", icon: "◎",
    what: "A validator node selects profitable transactions from the mempool, orders them, and builds a candidate block. On Ethereum (post-merge), validators are chosen pseudo-randomly proportional to staked ETH.",
    confusion: "\"The validator is a server owned by Ethereum.\" — No. Validators are independent computers run by anyone who has staked 32 ETH. There are ~700,000 of them.",
    analogy: "A postal sorter who picks up letters from the sorting facility, arranges them by delivery route, and loads them on a van.",
    color: "var(--dg-accent)",
  },
  {
    id: 6, label: "Block", icon: "▣",
    what: "The validator proposes a block containing your transaction. Other validators attest (vote) that the block is valid. Once 2/3 of stake attests, the block is included in the chain.",
    confusion: "\"My transaction is in a block = it's permanent.\" — Not yet. You need multiple blocks on top for true finality.",
    analogy: "Your letter is officially dispatched in a postman's route. It's in the system — but not delivered until finality.",
    color: "var(--dg-success)",
  },
  {
    id: 7, label: "Confirmation", icon: "✓",
    what: "After ~2 epochs (~12.8 minutes on Ethereum), the block reaches finality. The transaction is now cryptographically irreversible. The state change (balance update, contract storage write) is permanent.",
    confusion: "\"I need to wait 12 minutes every time.\" — No. Transactions are visible and usable after ~12 seconds (1 block). Finality is about when it becomes truly irreversible.",
    analogy: "The letter is delivered and signed for. The postal service has a permanent record that it was delivered on this date at this time.",
    color: "var(--dg-success)",
  },
];

export default function TransactionJourneyVisualizer() {
  const [selected, setSelected] = useState<number>(0);
  const step = STEPS[selected];

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.3 — Transaction Journey · click any step
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: step rail */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r" style={{ borderColor: "var(--dg-border)" }}>
          {STEPS.map((s, i) => {
            const isSelected = i === selected;
            const isDone = i < selected;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(i)}
                className="flex-shrink-0 lg:flex-shrink flex items-center gap-2.5 px-4 py-3 text-left transition-all duration-200 hover:opacity-100"
                style={{
                  background: isSelected ? `color-mix(in srgb, ${s.color} 8%, transparent)` : "transparent",
                  borderLeft: `3px solid ${isSelected ? s.color : "transparent"}`,
                  opacity: isSelected ? 1 : 0.65,
                }}
              >
                <span className="font-mono text-base w-5 flex-shrink-0" style={{ color: isSelected ? s.color : isDone ? "var(--dg-success)" : "var(--dg-text-dim)" }}>
                  {isDone ? "✓" : s.icon}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: isSelected ? "var(--dg-text)" : "var(--dg-text-dim)" }}>
                    {s.label}
                  </span>
                  <span className="font-mono text-[8px]" style={{ color: "var(--dg-text-faint)" }}>
                    step {s.id} / 7
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 p-5 min-h-[300px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xl" style={{ color: step.color }}>{step.icon}</span>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase" style={{ color: step.color }}>
                Step {step.id} — {step.label}
              </div>
            </div>
          </div>

          {/* What happens */}
          <div className="mb-3">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "var(--dg-text-faint)" }}>What happens</div>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--dg-text)" }}>{step.what}</p>
          </div>

          {/* Common confusion */}
          <div className="rounded-md px-3 py-2.5 mb-3 border-l-2" style={{ background: "rgba(220,38,38,0.05)", borderColor: "var(--dg-danger)" }}>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--dg-danger)" }}>Common confusion</div>
            <p className="text-[11.5px] leading-relaxed italic" style={{ color: "var(--dg-text)" }}>{step.confusion}</p>
          </div>

          {/* Analogy */}
          <div className="rounded-md px-3 py-2.5 border-l-2" style={{ background: "rgba(124,58,237,0.05)", borderColor: "var(--dg-accent)" }}>
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--dg-accent)" }}>Real-world analogy</div>
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--dg-text)" }}>{step.analogy}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setSelected(s => Math.max(0, s - 1))}
              disabled={selected === 0}
              className="font-mono text-[10px] px-3 py-1.5 rounded border transition-all disabled:opacity-25"
              style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}
            >
              ← prev
            </button>
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i === selected ? step.color : "var(--dg-border)" }} />
              ))}
            </div>
            <button
              onClick={() => setSelected(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={selected === STEPS.length - 1}
              className="font-mono text-[10px] px-3 py-1.5 rounded border transition-all disabled:opacity-25"
              style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}
            >
              next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
