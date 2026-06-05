"use client";

import { useState } from "react";

type Scene = "panic" | "restore" | "reveal";

const SCENES: { id: Scene; label: string; icon: string }[] = [
  { id: "panic", label: "MetaMask Deleted", icon: "✗" },
  { id: "restore", label: "Seed Phrase Entered", icon: "⌨" },
  { id: "reveal", label: "Funds Return", icon: "✓" },
];

export default function WalletRealityCheck() {
  const [scene, setScene] = useState<Scene>("panic");

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.6 — Wallet Mental Model
        </span>
      </div>

      {/* Scene tabs */}
      <div className="flex border-b" style={{ borderColor: "var(--dg-border)" }}>
        {SCENES.map((s) => {
          const isActive = scene === s.id;
          const color = s.id === "panic" ? "var(--dg-danger)" : s.id === "restore" ? "var(--dg-warning)" : "var(--dg-success)";
          return (
            <button
              key={s.id}
              onClick={() => setScene(s.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-all border-b-2 font-mono"
              style={{
                borderBottomColor: isActive ? color : "transparent",
                background: isActive ? `color-mix(in srgb, ${color} 5%, transparent)` : "transparent",
              }}
            >
              <span className="text-sm" style={{ color: isActive ? color : "var(--dg-text-faint)" }}>{s.icon}</span>
              <span className="text-[9px] uppercase tracking-wider" style={{ color: isActive ? color : "var(--dg-text-faint)" }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scene content */}
      <div className="p-5 min-h-[220px] transition-all duration-300">
        {scene === "panic" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border-2 border-dashed w-32 h-24 flex flex-col items-center justify-center" style={{ borderColor: "var(--dg-danger)", background: "rgba(220,38,38,0.04)" }}>
              <span className="text-2xl opacity-30">⬛</span>
              <span className="font-mono text-[9px] mt-1" style={{ color: "var(--dg-danger)" }}>MetaMask</span>
              <span className="font-mono text-[8px]" style={{ color: "var(--dg-text-faint)" }}>deleted</span>
            </div>
            <div className="max-w-xs text-center">
              <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--dg-danger)" }}>
                ❌ &ldquo;My ETH is gone!&rdquo;
              </p>
              <p className="text-[11px] leading-relaxed mt-2" style={{ color: "var(--dg-text-dim)" }}>
                Most beginners think deleting MetaMask deletes their funds. This is wrong. MetaMask is just a key manager. Your coins were never inside it.
              </p>
            </div>
          </div>
        )}

        {scene === "restore" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border px-4 py-3 font-mono text-[10px] max-w-xs" style={{ background: "var(--dg-card)", borderColor: "var(--dg-border)" }}>
              <div className="mb-2" style={{ color: "var(--dg-text-dim)" }}>Enter seed phrase:</div>
              <div className="grid grid-cols-3 gap-1.5">
                {["correct", "horse", "battery", "staple", "blanket", "ocean", "fever", "ripple", "noble", "copper", "wolf", "piano"].map((word, i) => (
                  <div key={i} className="px-1.5 py-1 rounded text-center" style={{ background: "var(--dg-card2)", color: "var(--dg-accent)", fontSize: "9px" }}>
                    {i + 1}. {word}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-center max-w-xs" style={{ color: "var(--dg-text-dim)" }}>
              12 words → mathematical key derivation → same private key → same address → same access. Every time.
            </p>
          </div>
        )}

        {scene === "reveal" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border-2 w-32 h-24 flex flex-col items-center justify-center" style={{ borderColor: "var(--dg-success)", background: "rgba(22,163,74,0.06)" }}>
              <span className="text-2xl">⬛</span>
              <span className="font-mono text-[9px] mt-1" style={{ color: "var(--dg-success)" }}>MetaMask</span>
              <span className="font-mono text-[8px]" style={{ color: "var(--dg-success)" }}>restored ✓</span>
            </div>
            <p className="font-mono text-[11px] text-center" style={{ color: "var(--dg-success)" }}>
              ✓ Same balance. Nothing moved.
            </p>
          </div>
        )}
      </div>

      {/* The diagram — always visible */}
      <div className="mx-5 mb-5 pt-5 border-t" style={{ borderColor: "var(--dg-border)" }}>
        <div className="font-mono text-[9px] uppercase tracking-widest mb-4 text-center" style={{ color: "var(--dg-text-faint)" }}>
          The actual model
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          {[
            { label: "Wallet App", sublabel: "MetaMask, Privy, etc.", color: "var(--dg-text-dim)", note: "just a UI" },
            { label: "Private Key", sublabel: "derived from seed phrase", color: "var(--dg-accent)", note: "proves identity" },
            { label: "Ownership", sublabel: "mathematical claim", color: "var(--dg-warning)", note: "lives on-chain" },
            { label: "Blockchain", sublabel: "where coins live", color: "var(--dg-success)", note: "permanent ledger" },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="rounded-md border px-3 py-2 text-center w-28" style={{ background: "var(--dg-card)", borderColor: item.color }}>
                  <div className="font-mono text-[10px] font-semibold" style={{ color: item.color }}>{item.label}</div>
                  <div className="font-mono text-[8px]" style={{ color: "var(--dg-text-faint)" }}>{item.sublabel}</div>
                </div>
                <div className="font-mono text-[8px] mt-1" style={{ color: "var(--dg-text-faint)" }}>{item.note}</div>
              </div>
              {i < arr.length - 1 && (
                <span className="font-mono text-[14px] flex-shrink-0 hidden sm:block" style={{ color: "var(--dg-border)" }}>→</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 font-mono text-[10px] text-center" style={{ color: "var(--dg-text-faint)" }}>
          Coins never lived in MetaMask. They live on the blockchain. The wallet just holds the key.
        </div>
      </div>
    </div>
  );
}
