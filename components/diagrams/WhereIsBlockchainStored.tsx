"use client";

import { useState, useEffect, useRef } from "react";

const NODES = ["Node A", "Node B", "Node C", "Node D"];
const BLOCKS = ["Block 1", "Block 2", "Block 3"];

export default function WhereIsBlockchainStored() {
  const [replicating, setReplicating] = useState(false);
  const [replicated, setReplicated] = useState<number[]>([]);
  const [newBlock, setNewBlock] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startReplication = () => {
    if (replicating) return;
    setReplicating(true);
    setReplicated([]);
    setNewBlock(true);

    NODES.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setReplicated(prev => [...prev, i]);
        if (i === NODES.length - 1) {
          setTimeout(() => {
            setReplicating(false);
          }, 400);
        }
      }, 400 + i * 450);
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const reset = () => {
    setReplicating(false);
    setReplicated([]);
    setNewBlock(false);
  };

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.4 — Where Is Blockchain Stored?
        </span>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* LEFT: Misconception */}
        <div className="p-5">
          <div className="font-mono text-[9px] uppercase tracking-widest mb-4 text-center" style={{ color: "var(--dg-danger)" }}>
            ✗ Common Misconception
          </div>
          <div className="flex flex-col items-center gap-0">
            {[
              { label: "Laptop", sublabel: "your device", icon: "▭" },
              { label: "Server", sublabel: "one company", icon: "▬" },
              { label: "Database", sublabel: "single source", icon: "▤" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="rounded-md px-6 py-3 border text-center w-40" style={{ background: "var(--dg-card)", borderColor: "var(--dg-border)" }}>
                  <div className="font-mono text-base mb-0.5" style={{ color: "var(--dg-text-dim)" }}>{item.icon}</div>
                  <div className="font-mono text-[11px] font-semibold" style={{ color: "var(--dg-text)" }}>{item.label}</div>
                  <div className="font-mono text-[9px]" style={{ color: "var(--dg-text-faint)" }}>{item.sublabel}</div>
                </div>
                {i < 2 && (
                  <div className="flex flex-col items-center my-1">
                    <div className="w-px h-4" style={{ background: "var(--dg-border)" }} />
                    <div className="font-mono text-[10px]" style={{ color: "var(--dg-text-faint)" }}>↓</div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 font-mono text-[10px] italic text-center px-4 leading-relaxed" style={{ color: "var(--dg-text-faint)" }}>
              &ldquo;How I thought blockchain worked&rdquo;
            </div>
          </div>
        </div>

        {/* RIGHT: Reality */}
        <div className="p-5">
          <div className="font-mono text-[9px] uppercase tracking-widest mb-4 text-center" style={{ color: "var(--dg-success)" }}>
            ✓ Reality — Distributed Storage
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {NODES.map((node, i) => {
              const hasNewBlock = replicated.includes(i);
              return (
                <div
                  key={i}
                  className="rounded-md border p-2.5 transition-all duration-500"
                  style={{
                    background: hasNewBlock ? "rgba(22,163,74,0.06)" : "var(--dg-card)",
                    borderColor: hasNewBlock ? "var(--dg-success)" : "var(--dg-border)",
                  }}
                >
                  <div className="font-mono text-[10px] font-semibold mb-2" style={{ color: hasNewBlock ? "var(--dg-success)" : "var(--dg-text)" }}>
                    {node}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {BLOCKS.map((block, j) => (
                      <div
                        key={j}
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded transition-all"
                        style={{ background: "var(--dg-card2)", color: "var(--dg-text-dim)" }}
                      >
                        {block}
                      </div>
                    ))}
                    {/* New block */}
                    {newBlock && (
                      <div
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded transition-all duration-500"
                        style={{
                          background: hasNewBlock ? "rgba(22,163,74,0.15)" : "rgba(22,163,74,0.04)",
                          color: hasNewBlock ? "var(--dg-success)" : "var(--dg-text-faint)",
                          border: `1px solid ${hasNewBlock ? "var(--dg-success)" : "rgba(22,163,74,0.2)"}`,
                        }}
                      >
                        {hasNewBlock ? "✓ Block 4" : "⋯ Block 4"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={startReplication}
              disabled={replicating}
              className="flex-1 font-mono text-[10px] py-2 rounded border transition-all disabled:opacity-50"
              style={{
                background: "rgba(22,163,74,0.08)",
                borderColor: "var(--dg-success)",
                color: "var(--dg-success)",
              }}
            >
              {replicating ? "⋯ replicating..." : "▶ Add new block"}
            </button>
            {newBlock && !replicating && (
              <button
                onClick={reset}
                className="font-mono text-[10px] px-3 py-2 rounded border transition-all"
                style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}
              >
                reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t font-mono text-[10px] text-center" style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}>
        Every full node stores a complete copy. "The blockchain" is not a single place — it's thousands of identical copies.
      </div>
    </div>
  );
}
