"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/context/ProgressContext";

const steps = [
  {
    id: "wallet",
    label: "Wallet",
    title: "SIGN_TRANSACTION",
    detail:
      "Your private key signs the transaction payload (target address, value, call data, account nonce, gas limit, gas fee). The ECDSA signature cryptographically proves authorization without disclosing the key.",
    code: `{
  "from":     "0xYourWalletAddress",
  "to":       "0xContractTarget",
  "value":    "0",
  "data":     "0xa9059cbb...",  // encoded function call
  "nonce":    42,               // replay protection
  "gasLimit": 65000,
  "maxFeePerGas": "30 gwei",
  "signature": "0x1b9f..."     // ECDSA signature parameters
}`,
    cost: "INITIATING",
  },
  {
    id: "mempool",
    label: "Mempool",
    title: "BROADCAST_TO_MEMPOOL",
    detail:
      "The signed transaction is broadcast to the P2P network. Mining/validating nodes receive the payload and insert it into their local mempool (transaction waiting queue) to await block inclusion.",
    code: `// Subscribing to pending transaction stream...
ethers.provider.on("pending", (txHash) => {
  // Triggers for every unconfirmed tx broadcast to network
  // MEV searchers analyze this queue for front-run options
});

// MEMPOOL METRICS:
// Average queue size: ~75,000 pending_txs
// Priority strategy: sorted by Gas Fee (gasPrice desc)`,
    cost: "0 GAS (PENDING)",
  },
  {
    id: "validator",
    label: "Validator",
    title: "EVM_BYTECODE_EXECUTION",
    detail:
      "A validator picks the transaction (preferring higher fees) and executes the EVM bytecode in their local workspace. Opcode executions deduct gas. Successful execution triggers state changes.",
    code: `// VM executes contract bytecode:
PUSH1 0x60    // 3 gas
MSTORE        // 3 gas
CALLDATALOAD  // 3 gas
SLOAD         // 2,100 gas  <- read state (high cost)
SSTORE        // 20,000 gas <- write state (very high cost)

// OUT_OF_GAS EXCEPTION SAFETY:
// If gas Limit is reached before execution ends:
// - All transaction state changes revert
// - Used gas is still paid to proposer`,
    cost: "GAS_METER_TICKING",
  },
  {
    id: "block",
    label: "Block",
    title: "BLOCK_INCLUSION",
    detail:
      "The validator packages the executed transaction into a proposed block. The block is broadcast, and 2/3 of validators must verify and attest to its validity before it joins the ledger.",
    code: `Block #21,847,339 {
  slot:         21847339,
  proposer:     "0xValidatorProposerAddress...",
  transactions: [
    "0xYourTxHash",  // <- included
    "0xOtherTxHash_1",
    "0xOtherTxHash_2"
  ],
  gasUsed:      14382001,
  gasLimit:     30000000,
  baseFee:      "28.4 gwei",   // burned fee
  timestamp:    1716124800
}`,
    cost: "~12 SEC ELAPSED",
  },
  {
    id: "confirmation",
    label: "Confirmed",
    title: "LEDGER_FINALIZATION",
    detail:
      "After 64 slots (~13 minutes), the block containing your transaction achieves finality. Reorganization is mathematically impossible, and the state changes are permanent across all nodes.",
    code: `// Fetching transaction receipt...
const receipt = await tx.wait(1);

receipt = {
  status:            1,           // 1 = SUCCESS, 0 = REVERT
  blockNumber:       21847339,
  gasUsed:           45821,       // actual gas consumed
  effectiveGasPrice: "28.4 gwei",
  logs: [
    { event: "Transfer", args: [...] }
  ]
}

// LEDGER STATUS:
// - Immutable state confirmed
// - Reorg protection active`,
    cost: "FINALIZED",
  },
];

export default function TransactionVisualizer() {
  const { trackSimulatorUsage } = useProgress();
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    trackSimulatorUsage("transaction");
  }, [trackSimulatorUsage]);

  const goTo = (i: number) => {
    trackSimulatorUsage("transaction");
    setActiveStep(i);
    setPlaying(false);
  };

  const playThrough = () => {
    trackSimulatorUsage("transaction");
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
    <div className="not-prose my-8 w-full bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
          </div>
          <span className="text-[10px] text-neutral-500 font-semibold tracking-wider">TX_PIPELINE_MONITOR // CORED_v0.1.1</span>
        </div>
        <button
          onClick={playThrough}
          disabled={playing}
          className="text-[9px] border border-neutral-800 hover:border-neutral-700 bg-neutral-950 px-3 py-0.5 rounded text-neutral-400 hover:text-emerald-400 transition-colors disabled:opacity-40"
        >
          {playing ? "EXECUTING_FLOW..." : "RUN PIPELINE"}
        </button>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="flex items-center gap-0 px-4 py-3 bg-black/60 border-b border-neutral-800 overflow-x-auto scrollbar-thin">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center shrink-0">
            <button
              onClick={() => goTo(i)}
              className={`px-3 py-1.5 border transition-all ${
                i === activeStep
                  ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                  : i < activeStep
                  ? "border-neutral-900 bg-neutral-950/50 text-neutral-500"
                  : "border-neutral-900/50 bg-transparent text-neutral-600 hover:border-neutral-800"
              }`}
            >
              {step.label.toUpperCase()}
            </button>
            {i < steps.length - 1 && (
              <span className="mx-2 text-neutral-700">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 bg-neutral-950"
        >
          {/* Explanation Text */}
          <div className="lg:col-span-5 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[9px] text-neutral-500 uppercase">
                STAGE_ID_0{activeStep + 1} // TOTAL_STAGES_0{steps.length}
              </div>
              <h3 className="text-xs font-bold text-neutral-200 mt-1 uppercase tracking-wide">
                {current.title}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                {current.detail}
              </p>
            </div>

            {current.cost && (
              <div className="pt-3 border-t border-neutral-900 flex justify-between items-center text-[10px]">
                <span className="text-neutral-500 uppercase">Stage cost:</span>
                <span className="text-emerald-400 font-semibold">{current.cost}</span>
              </div>
            )}
          </div>

          {/* Code View */}
          <div className="lg:col-span-7 bg-black p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5 mb-2.5">
                <span className="text-[10px] text-neutral-500 font-semibold uppercase">{current.label.toLowerCase()}_payload.json</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
              </div>
              <pre className="text-[10px] leading-relaxed text-neutral-400 overflow-x-auto max-h-56 scrollbar-thin">
                <code>{current.code}</code>
              </pre>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-900 mt-4">
              <button
                onClick={() => goTo(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="text-[9px] border border-neutral-800 hover:border-neutral-700 bg-neutral-950 px-2.5 py-1 text-neutral-400 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                PREV_STAGE
              </button>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: i === activeStep ? "16px" : "4px",
                      backgroundColor: i === activeStep ? "rgb(16, 185, 129)" : i < activeStep ? "rgb(38, 38, 38)" : "rgb(23, 23, 23)",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                className="text-[9px] border border-neutral-800 hover:border-neutral-700 bg-neutral-950 px-2.5 py-1 text-neutral-400 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                NEXT_STAGE
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
