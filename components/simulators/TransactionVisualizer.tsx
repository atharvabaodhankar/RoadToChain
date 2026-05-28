"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: "wallet",
    label: "Wallet",
    icon: "🔑",
    color: "#7c3aed",
    title: "You sign the transaction",
    detail:
      "Your private key signs the transaction payload: to address, value, data, nonce, gas limit, max fee per gas. The signature proves you authorized it — without revealing your private key.",
    code: `{
  from:     "0xYourWallet",
  to:       "0xContract",
  value:    "0",
  data:     "0xa9059cbb...",  // encoded function call
  nonce:    42,               // prevents replay
  gasLimit: 65000,
  maxFeePerGas: "30 gwei",
  signature: "0x1b9f..."     // your ECDSA signature
}`,
    cost: null,
  },
  {
    id: "mempool",
    label: "Mempool",
    icon: "🌊",
    color: "#3b82f6",
    title: "Transaction enters the mempool",
    detail:
      "Your signed transaction is broadcast to the P2P network. Every node receives it and adds it to their local mempool — a waiting room of unconfirmed transactions. Validators pick from here.",
    code: `// Your tx is now visible to everyone
// Anyone can see it before it's confirmed

ethers.provider.on("pending", (txHash) => {
  // This fires for EVERY pending tx on the network
  // MEV bots watch this to front-run your trades
});

// Current mempool size varies:
// Low activity:  ~50K pending txs
// High activity: ~200K+ pending txs`,
    cost: "0 gas (not yet mined)",
  },
  {
    id: "validator",
    label: "Validator",
    icon: "⚡",
    color: "#f59e0b",
    title: "Validator selects and executes",
    detail:
      "A validator picks your transaction (typically highest-fee-first). They execute the EVM bytecode in their local state. Every opcode costs gas. If execution succeeds, the state change is applied locally.",
    code: `// Validator's EVM runs your bytecode
// opcode by opcode, gas meter ticking

PUSH1 0x60    // 3 gas
MSTORE        // 3 gas
CALLDATALOAD  // 3 gas
SLOAD         // 2,100 gas ← expensive
SSTORE        // 20,000 gas ← very expensive
...

// If gas runs out before completion:
// → state reverts
// → gas consumed is NOT refunded
// → you paid for nothing`,
    cost: "Gas consumed here",
  },
  {
    id: "block",
    label: "Block",
    icon: "🧱",
    color: "#22c55e",
    title: "Transaction included in a block",
    detail:
      "The validator proposes a new block containing your transaction. 2/3 of all validators must attest to the block validity before it's added to the chain. This process takes ~12 seconds on Ethereum.",
    code: `Block #21,847,339 {
  slot:         21847339,
  proposer:     "0xValidator...",
  transactions: [
    "0xYourTxHash",  // ← you're in here
    "0xOtherTx1",
    "0xOtherTx2",
    // ... up to ~300 more txs
  ],
  gasUsed:      14_382_001,
  gasLimit:     30_000_000,
  baseFee:      "28.4 gwei",   // burned
  timestamp:    1716124800
}`,
    cost: "~12 seconds elapsed",
  },
  {
    id: "confirmation",
    label: "Confirmed",
    icon: "✓",
    color: "#06b6d4",
    title: "Final confirmation — state is permanent",
    detail:
      "After 64 slots (~13 minutes), your block achieves finality. It can never be reorganized out of the chain. Your state change is now permanent across all ~7,000 Ethereum nodes worldwide. No takebacks.",
    code: `// Your receipt is now available
const receipt = await tx.wait(1); // 1 confirmation

receipt = {
  status:          1,           // 1 = success, 0 = revert
  blockNumber:     21847339,
  gasUsed:         45821,       // actual gas used
  effectiveGasPrice: "28.4 gwei",
  logs: [
    { event: "Transfer", args: [...] }
  ]
}

// State change is now:
// ✓ Applied on all ~7,000 nodes
// ✓ Ordered by consensus
// ✓ Immutable`,
    cost: "Finalized after ~13 min",
  },
];

export default function TransactionVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const goTo = (i: number) => {
    setActiveStep(i);
    setPlaying(false);
  };

  const playThrough = () => {
    setPlaying(true);
    setActiveStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setPlaying(false);
        return;
      }
      setActiveStep(i);
    }, 2000);
  };

  const current = steps[activeStep];

  return (
    <div className="my-8 rounded-xl border border-border bg-[#0a0a0b] overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-bg2">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Transaction Visualizer
          </span>
        </div>
        <button
          onClick={playThrough}
          disabled={playing}
          className="text-[11px] border border-border rounded px-3 py-1 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {playing ? "Playing..." : "▶ Play through"}
        </button>
      </div>

      {/* Step pipeline */}
      <div className="flex items-center gap-0 px-5 py-4 border-b border-border overflow-x-auto">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center shrink-0">
            <button
              onClick={() => goTo(i)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border transition-all ${
                i === activeStep
                  ? "border-[--c] bg-[--c]/10 text-text"
                  : i < activeStep
                  ? "border-border bg-bg3 text-dim"
                  : "border-border bg-transparent text-dim hover:border-border2"
              }`}
              style={{ "--c": step.color } as React.CSSProperties}
            >
              <span className="text-lg leading-none">{step.icon}</span>
              <span className="text-[10px] font-semibold">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div
                className="h-px w-6 mx-1 transition-all duration-500"
                style={{ backgroundColor: i < activeStep ? steps[i].color : "#2a2a2e" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-5 space-y-4"
        >
          <div className="flex items-start gap-3">
            <span
              className="text-2xl leading-none p-2 rounded-lg border"
              style={{
                borderColor: `${current.color}30`,
                backgroundColor: `${current.color}10`,
              }}
            >
              {current.icon}
            </span>
            <div>
              <div className="text-[10px] text-dim uppercase mb-1">
                Step {activeStep + 1} of {steps.length}
              </div>
              <h3 className="text-sm font-bold text-text">{current.title}</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">{current.detail}</p>
            </div>
          </div>

          {/* Code view */}
          <div className="rounded-lg bg-[#030304] border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] text-dim">{current.label.toLowerCase()}.ts</span>
              {current.cost && (
                <span
                  className="ml-auto text-[10px] px-2 py-0.5 rounded border font-semibold"
                  style={{ color: current.color, borderColor: `${current.color}30`, backgroundColor: `${current.color}10` }}
                >
                  {current.cost}
                </span>
              )}
            </div>
            <pre className="p-4 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto">
              <code>{current.code}</code>
            </pre>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => goTo(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="text-[11px] border border-border rounded px-3 py-1.5 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === activeStep ? "20px" : "6px",
                    backgroundColor: i === activeStep ? current.color : i < activeStep ? "#3f3f46" : "#27272a",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="text-[11px] border border-border rounded px-3 py-1.5 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
