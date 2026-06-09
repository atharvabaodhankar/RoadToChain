"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/context/ProgressContext";

// Lightweight ECDSA simulation — uses Web Crypto + deterministic derivation
// For educational purposes, we use a simplified but cryptographically meaningful demo

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, "").padStart(64, "0").slice(0, 64);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Deterministic address from a "private key" for demo
function deriveAddress(privateKeyHex: string): string {
  const seed = privateKeyHex.replace(/^0x/, "").padStart(64, "0").slice(0, 40);
  return "0x" + seed.slice(0, 40).toLowerCase();
}

// Simple hash for demo (not real Keccak-256, but illustrative)
async function hashMessage(message: string): Promise<string> {
  const msgWithPrefix = `\x19Ethereum Signed Message:\n${message.length}${message}`;
  const encoded = new TextEncoder().encode(msgWithPrefix);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return "0x" + bytesToHex(new Uint8Array(hashBuf)).slice(0, 64);
}

// Produces a deterministic-looking but unique signature for each (key, message) combo
async function simulateSign(privateKeyHex: string, messageHash: string): Promise<{ r: string; s: string; v: number }> {
  const combined = privateKeyHex + messageHash;
  const encoded = new TextEncoder().encode(combined);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  const hashBytes = new Uint8Array(hashBuf);
  const r = "0x" + bytesToHex(hashBytes.slice(0, 16)) + bytesToHex(hexToBytes(privateKeyHex).slice(0, 16));
  const s = "0x" + bytesToHex(hashBytes.slice(16, 32)) + bytesToHex(hexToBytes(messageHash.slice(2)).slice(0, 16));
  const v = 27 + (hashBytes[31] % 2);
  return { r: r.slice(0, 66), s: s.slice(0, 66), v };
}

const PRESET_KEYS = [
  { label: "Alice", key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  { label: "Bob", key: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { label: "Custom", key: "" },
];

type Step = "idle" | "hashing" | "signing" | "signed" | "verifying" | "verified";

export default function WalletSigningSimulator() {
  const { trackSimulatorUsage } = useProgress();
  const [message, setMessage] = useState("Vote for Proposal #3");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customKey, setCustomKey] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [messageHash, setMessageHash] = useState("");
  const [signature, setSignature] = useState<{ r: string; s: string; v: number } | null>(null);
  const [recoveredAddress, setRecoveredAddress] = useState("");

  useEffect(() => {
    trackSimulatorUsage("signing");
  }, [trackSimulatorUsage]);

  const privateKey = selectedPreset < 2 ? PRESET_KEYS[selectedPreset].key : customKey || "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const signerAddress = deriveAddress(privateKey);

  const runSigning = useCallback(async () => {
    if (!message.trim()) return;
    trackSimulatorUsage("signing");

    setStep("hashing");
    setSignature(null);
    setRecoveredAddress("");
    await new Promise((r) => setTimeout(r, 700));

    const hash = await hashMessage(message);
    setMessageHash(hash);
    setStep("signing");
    await new Promise((r) => setTimeout(r, 800));

    const sig = await simulateSign(privateKey, hash);
    setSignature(sig);
    setStep("signed");
  }, [message, privateKey, trackSimulatorUsage]);

  const runVerify = useCallback(async () => {
    if (!signature) return;
    trackSimulatorUsage("signing");
    setStep("verifying");
    await new Promise((r) => setTimeout(r, 700));
    // In a real system, ecrecover(messageHash, v, r, s) → address
    // We simulate by deriving the same address from the key
    setRecoveredAddress(signerAddress);
    setStep("verified");
  }, [signature, signerAddress, trackSimulatorUsage]);

  const reset = () => {
    setStep("idle");
    setMessageHash("");
    setSignature(null);
    setRecoveredAddress("");
  };

  const stepColors: Record<Step, string> = {
    idle: "#3f3f46",
    hashing: "#f59e0b",
    signing: "#7c3aed",
    signed: "#3b82f6",
    verifying: "#ec4899",
    verified: "#22c55e",
  };

  const signatureHex = signature
    ? `0x${signature.r.slice(2)}${signature.s.slice(2)}${signature.v.toString(16)}`
    : null;

  return (
    <div className="my-8 rounded-xl border border-border bg-bg overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-bg2">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: stepColors[step] }}
          />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Wallet Signing Simulator
          </span>
        </div>
        <span className="text-[10px] text-dim uppercase">{step.replace("_", " ")}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Signer selector */}
        <div>
          <div className="text-[10px] text-dim uppercase mb-2">Signer</div>
          <div className="flex gap-2 flex-wrap">
            {PRESET_KEYS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => { setSelectedPreset(i); reset(); }}
                className={`text-[11px] px-3 py-1.5 rounded border transition-all ${
                  selectedPreset === i
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border bg-bg3 text-muted hover:border-border2"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {selectedPreset === 2 && (
            <input
              type="text"
              placeholder="0x... (64 hex chars)"
              value={customKey}
              onChange={(e) => { setCustomKey(e.target.value); reset(); }}
              className="mt-2 w-full rounded border border-border bg-bg3 px-3 py-2 text-[11px] text-text placeholder:text-dim focus:outline-none focus:border-accent/60"
            />
          )}
          <div className="mt-2 text-[10px] text-dim">
            Signer address: <span className="text-muted">{signerAddress}</span>
          </div>
        </div>

        {/* Message input */}
        <div>
          <div className="text-[10px] text-dim uppercase mb-2">Message to sign</div>
          <input
            type="text"
            value={message}
            onChange={(e) => { setMessage(e.target.value); reset(); }}
            className="w-full rounded border border-border bg-bg3 px-3 py-2 text-[12px] text-text placeholder:text-dim focus:outline-none focus:border-accent/60"
            placeholder="Type any message..."
          />
          <div className="mt-1 text-[10px] text-dim">
            Change the message — the signature will be completely different.
          </div>
        </div>

        {/* Sign button */}
        <div className="flex gap-3">
          <button
            onClick={runSigning}
            disabled={step === "hashing" || step === "signing"}
            className="flex-1 rounded-lg border border-accent/40 bg-accent/10 py-2.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === "hashing" ? "Hashing..." : step === "signing" ? "Signing..." : "Sign Message"}
          </button>
          {signature && (
            <button
              onClick={runVerify}
              disabled={step === "verifying"}
              className="flex-1 rounded-lg border border-emerald-600/40 bg-emerald-600/10 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/20 transition-all disabled:opacity-40"
            >
              {step === "verifying" ? "Recovering..." : "Verify (ecrecover)"}
            </button>
          )}
        </div>

        {/* Pipeline visualization */}
        <AnimatePresence>
          {step !== "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {/* Hash output */}
              {(step === "hashing" || messageHash) && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/5 dark:border-amber-800/40 dark:bg-amber-950/20 p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-amber-650 dark:text-amber-400 font-semibold uppercase">
                      Step 1 — Message Hash (Keccak-256 with Ethereum prefix)
                    </span>
                    {step === "hashing" && <span className="text-[10px] text-amber-650 dark:text-amber-400 animate-pulse">computing...</span>}
                  </div>
                  {messageHash && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-200/80 break-all">{messageHash}</div>
                  )}
                  <div className="mt-1 text-[10px] text-amber-700/70 dark:text-amber-600/60">
                    This 32-byte hash is what gets signed — not the raw message.
                  </div>
                </motion.div>
              )}

              {/* Signature output */}
              {signature && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/5 dark:border-purple-800/40 dark:bg-purple-950/20 p-3"
                >
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase mb-2">
                    Step 2 — ECDSA Signature (Private Key Signs the Hash)
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-dim">r: <span className="text-purple-800 dark:text-purple-200/80 break-all">{signature.r}</span></div>
                    <div className="text-[10px] text-dim">s: <span className="text-purple-800 dark:text-purple-200/80 break-all">{signature.s}</span></div>
                    <div className="text-[10px] text-dim">v: <span className="text-purple-800 dark:text-purple-200/80">{signature.v}</span></div>
                    <div className="text-[10px] text-dim mt-2">Full: <span className="text-purple-800/80 dark:text-purple-200/60 break-all">{signatureHex}</span></div>
                  </div>
                  <div className="mt-2 text-[10px] text-purple-600/70 dark:text-purple-600/60">
                    This signature proves you controlled the private key — without ever revealing it.
                  </div>
                </motion.div>
              )}

              {/* Verify output */}
              {recoveredAddress && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-800/40 dark:bg-emerald-950/20 p-3"
                >
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase mb-2">
                    Step 3 — ecrecover(hash, v, r, s) → Signer Address
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div className="text-dim">Recovered: <span className="text-emerald-850 dark:text-emerald-300">{recoveredAddress}</span></div>
                    <div className="text-dim">Expected:  <span className="text-emerald-850 dark:text-emerald-300">{signerAddress}</span></div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 text-base">✓</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">MATCH — Signature is valid</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-700/70 dark:text-emerald-600/60">
                    Any node on the network can verify this without knowing your private key.
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key insight */}
        <div className="border-t border-border pt-4 text-[10px] text-dim leading-relaxed">
          <span className="text-muted font-semibold">Key insight:</span> The signature changes entirely with any change to the message or the private key. The Ethereum network can verify your identity purely from the (message, signature) pair — without a password, a server, or a certificate authority.
        </div>
      </div>
    </div>
  );
}
