"use client";

import { useState } from "react";

interface RpcMethod {
  name: string;
  type: "read" | "write" | "subscribe";
  desc: string;
  cost: string;
}

const METHODS: RpcMethod[] = [
  { name: "eth_getBalance", type: "read", desc: "Returns the ETH balance of an address at a given block number.", cost: "Free" },
  { name: "eth_call", type: "read", desc: "Executes a message call locally on the node — reads contract state without creating a transaction.", cost: "Free" },
  { name: "eth_sendRawTransaction", type: "write", desc: "Submits a pre-signed transaction to the mempool for inclusion in a future block.", cost: "Gas fees" },
  { name: "eth_getLogs", type: "read", desc: "Returns event logs matching a filter. Used to track contract events and build indexers.", cost: "Free" },
  { name: "eth_subscribe", type: "subscribe", desc: "Opens a WebSocket subscription to receive real-time updates (new blocks, pending txs, log events).", cost: "Free" },
];

const LAYERS = [
  { label: "React App", sublabel: "your dApp frontend", color: "var(--dg-blue)" },
  { label: "RPC Provider", sublabel: "Alchemy / Infura / self-hosted", color: "var(--dg-accent)" },
  { label: "Full Node", sublabel: "stores full chain state", color: "var(--dg-teal)" },
  { label: "Blockchain", sublabel: "Ethereum / Polygon / Base", color: "var(--dg-success)" },
];

export default function RPCPhoneLineDiagram() {
  const [activeMethod, setActiveMethod] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [packetPos, setPacketPos] = useState(0);

  const sendPacket = (i: number) => {
    setActiveMethod(i);
    setAnimating(true);
    setPacketPos(0);

    const forward = [0, 1, 2, 3];
    forward.forEach((pos, idx) => {
      setTimeout(() => {
        setPacketPos(pos);
        if (idx === forward.length - 1) {
          setTimeout(() => {
            setAnimating(false);
          }, 400);
        }
      }, idx * 350);
    });
  };

  const typeColor = (t: RpcMethod["type"]) =>
    t === "read" ? "var(--dg-success)" : t === "write" ? "var(--dg-danger)" : "var(--dg-accent)";

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.7 — RPC: Your App's Phone Line to the Blockchain
        </span>
      </div>

      {/* The pipeline — horizontal */}
      <div className="p-5 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {LAYERS.map((layer, i) => {
            const isActive = animating && packetPos >= i;
            return (
              <div key={i} className="flex items-center flex-shrink-0">
                <div
                  className="rounded-md border px-3 py-2.5 text-center transition-all duration-300"
                  style={{
                    background: isActive ? `color-mix(in srgb, ${layer.color} 10%, var(--dg-card))` : "var(--dg-card)",
                    borderColor: isActive ? layer.color : "var(--dg-border)",
                    minWidth: "110px",
                  }}
                >
                  <div className="font-mono text-[10px] font-semibold" style={{ color: isActive ? layer.color : "var(--dg-text)" }}>
                    {layer.label}
                  </div>
                  <div className="font-mono text-[8px] mt-0.5" style={{ color: "var(--dg-text-faint)" }}>
                    {layer.sublabel}
                  </div>
                </div>
                {i < LAYERS.length - 1 && (
                  <div className="flex items-center mx-1 flex-shrink-0">
                    <div className="w-6 h-px" style={{ background: animating && packetPos > i ? "var(--dg-accent)" : "var(--dg-border)", transition: "all 0.3s" }} />
                    <div className="font-mono text-[10px]" style={{ color: animating && packetPos > i ? "var(--dg-accent)" : "var(--dg-border)" }}>▶</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 font-mono text-[10px] text-center" style={{ color: "var(--dg-text-faint)" }}>
          RPC = communication layer only. Click a method below to simulate a request.
        </div>
      </div>

      {/* Misconception */}
      <div className="mx-5 mt-4 mb-3 rounded-md border-l-2 px-3 py-2" style={{ borderColor: "var(--dg-danger)", background: "rgba(220,38,38,0.04)" }}>
        <span className="font-mono text-[9px] uppercase tracking-widest mr-2" style={{ color: "var(--dg-danger)" }}>myth:</span>
        <span className="font-mono text-[10px]" style={{ color: "var(--dg-text)" }}>
          &ldquo;RPC is the blockchain.&rdquo; — No. RPC is a courier. The blockchain is the destination. Alchemy going down doesn't affect the blockchain itself.
        </span>
      </div>

      {/* Method list */}
      <div className="px-5 pb-5">
        <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "var(--dg-text-faint)" }}>
          Common RPC Methods — click to simulate
        </div>
        <div className="flex flex-col gap-1.5">
          {METHODS.map((m, i) => {
            const isActive = activeMethod === i;
            const c = typeColor(m.type);
            return (
              <button
                key={i}
                onClick={() => sendPacket(i)}
                className="flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-all hover:opacity-90"
                style={{
                  background: isActive ? `color-mix(in srgb, ${c} 5%, var(--dg-card))` : "var(--dg-card)",
                  borderColor: isActive ? c : "var(--dg-border)",
                }}
              >
                <code className="font-mono text-[10px] font-semibold mt-0.5 flex-shrink-0" style={{ color: c }}>
                  {m.name}
                </code>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] leading-snug" style={{ color: "var(--dg-text)" }}>{m.desc}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ background: `color-mix(in srgb, ${c} 10%, transparent)`, color: c }}>
                      {m.type}
                    </span>
                    <span className="font-mono text-[8px]" style={{ color: "var(--dg-text-faint)" }}>cost: {m.cost}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] flex-shrink-0" style={{ color: "var(--dg-text-faint)" }}>
                  {isActive && animating ? "⋯" : "▶"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
