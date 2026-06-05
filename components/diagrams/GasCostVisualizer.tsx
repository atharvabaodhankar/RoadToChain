"use client";

import { useState } from "react";

interface TxType {
  label: string;
  baseGas: number;
  storageMultiplier: number;
  color: string;
  desc: string;
}

const TX_TYPES: TxType[] = [
  { label: "ETH Transfer", baseGas: 21000, storageMultiplier: 0, color: "var(--dg-success)", desc: "Simple ETH transfer — fixed gas, no storage writes." },
  { label: "ERC-20 Transfer", baseGas: 45000, storageMultiplier: 1.2, color: "var(--dg-blue)", desc: "Token transfer — reads balances, writes two storage slots." },
  { label: "Contract Deploy", baseGas: 120000, storageMultiplier: 8, color: "var(--dg-accent)", desc: "Contract deployment — writes all bytecode to state." },
];

const FAQ_ITEMS = [
  { q: "Who receives gas?", a: "The validator who includes your transaction in a block gets the priority fee. The base fee is burned (destroyed). Nobody gets the base fee — it's permanently removed from supply." },
  { q: "Why do failed txs cost gas?", a: "Every opcode executed costs gas — even if the transaction reverts. The EVM ran your code, checked conditions, and determined it should fail. That computation already happened and validators paid for it." },
  { q: "Why is Ethereum expensive?", a: "Block space is scarce. Each block has a gas limit (~30M gas). When demand exceeds supply, the base fee (EIP-1559) automatically increases until demand drops. More users = higher base fee." },
  { q: "Why is Polygon cheaper?", a: "Polygon's PoS chain has lower demand per block space and lower security requirements. Cheaper hardware to run a node, less demand, lower gas prices. There's always a tradeoff: cheaper = less decentralized." },
];

function formatGas(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function gasToUSD(gas: number, gasPriceGwei: number, ethUSD: number): string {
  const eth = (gas * gasPriceGwei * 1e9) / 1e18;
  return `$${(eth * ethUSD).toFixed(4)}`;
}

export default function GasCostVisualizer() {
  const [storage, setStorage] = useState(0);
  const [gasPriceGwei, setGasPriceGwei] = useState(20);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ETH_USD = 3400;

  const getGas = (tx: TxType) => {
    return Math.round(tx.baseGas + storage * tx.storageMultiplier * 2000);
  };

  const maxGas = Math.max(...TX_TYPES.map(getGas));

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.8 — Gas Cost Visualizer
        </span>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-b grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ borderColor: "var(--dg-border)", background: "var(--dg-card)" }}>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[10px]" style={{ color: "var(--dg-text-dim)" }}>Storage Operations</label>
            <span className="font-mono text-[10px]" style={{ color: "var(--dg-accent)" }}>{storage} writes</span>
          </div>
          <input
            type="range" min={0} max={50} value={storage}
            onChange={e => setStorage(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between font-mono text-[8px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>
            <span>0</span><span>25</span><span>50</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[10px]" style={{ color: "var(--dg-text-dim)" }}>Gas Price</label>
            <span className="font-mono text-[10px]" style={{ color: "var(--dg-warning)" }}>{gasPriceGwei} Gwei</span>
          </div>
          <input
            type="range" min={1} max={200} value={gasPriceGwei}
            onChange={e => setGasPriceGwei(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between font-mono text-[8px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>
            <span>1 (cheap)</span><span>100</span><span>200 (busy)</span>
          </div>
        </div>
      </div>

      {/* Gas bars */}
      <div className="p-5 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <div className="flex flex-col gap-3">
          {TX_TYPES.map((tx, i) => {
            const gas = getGas(tx);
            const usd = gasToUSD(gas, gasPriceGwei, ETH_USD);
            const pct = maxGas > 0 ? (gas / maxGas) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px]" style={{ color: "var(--dg-text)" }}>{tx.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px]" style={{ color: tx.color }}>{formatGas(gas)} gas</span>
                    <span className="font-mono text-[10px]" style={{ color: "var(--dg-text-dim)" }}>{usd}</span>
                  </div>
                </div>
                <div className="h-6 rounded overflow-hidden" style={{ background: "var(--dg-card2)" }}>
                  <div
                    className="h-full rounded flex items-center px-2 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 4)}%`, background: tx.color, opacity: 0.7 }}
                  />
                </div>
                <div className="font-mono text-[9px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>{tx.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 px-3 py-2 rounded font-mono text-[10px]" style={{ background: "var(--dg-card)", border: "1px solid var(--dg-border)" }}>
          <span style={{ color: "var(--dg-text-dim)" }}>At {gasPriceGwei} Gwei · ETH ≈ ${ETH_USD.toLocaleString()} · </span>
          <span style={{ color: "var(--dg-text)" }}>
            Simple transfer costs {gasToUSD(21000, gasPriceGwei, ETH_USD)}
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div className="p-5">
        <div className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: "var(--dg-text-faint)" }}>
          Gas questions — click to expand
        </div>
        <div className="flex flex-col gap-1.5">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-md border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                style={{ background: openFaq === i ? "var(--dg-card)" : "transparent" }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-mono text-[10px]" style={{ color: "var(--dg-text)" }}>{item.q}</span>
                <span className="font-mono text-[10px] ml-2 flex-shrink-0" style={{ color: "var(--dg-text-faint)" }}>
                  {openFaq === i ? "▲" : "▼"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--dg-border)" }}>
                  <p className="text-[11px] leading-relaxed mt-2" style={{ color: "var(--dg-text-dim)" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
