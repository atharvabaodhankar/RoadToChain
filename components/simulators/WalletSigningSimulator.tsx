"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useProgress } from "@/app/context/ProgressContext";

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

function deriveAddress(privateKeyHex: string): string {
  const seed = privateKeyHex.replace(/^0x/, "").padStart(64, "0").slice(0, 40);
  return "0x" + seed.slice(0, 40).toLowerCase();
}

async function hashMessage(message: string): Promise<string> {
  const msgWithPrefix = `\x19Ethereum Signed Message:\n${message.length}${message}`;
  const encoded = new TextEncoder().encode(msgWithPrefix);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return "0x" + bytesToHex(new Uint8Array(hashBuf)).slice(0, 64);
}

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
  { label: "ALICE_KEY", key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  { label: "BOB_KEY", key: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { label: "CUSTOM_HEX", key: "" },
];

type Step = "idle" | "hashing" | "signing" | "signed" | "verifying" | "verified";

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'debug';
  text: string;
}

export default function WalletSigningSimulator() {
  const { trackSimulatorUsage } = useProgress();
  const [message, setMessage] = useState("Vote for Proposal #3");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customKey, setCustomKey] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [messageHash, setMessageHash] = useState("");
  const [signature, setSignature] = useState<{ r: string; s: string; v: number } | null>(null);
  const [recoveredAddress, setRecoveredAddress] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getFormattedTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const addLog = (text: string, level: 'info' | 'warn' | 'success' | 'debug' = 'info') => {
    setLogs(prev => [...prev, { timestamp: getFormattedTime(), level, text }]);
  };

  useEffect(() => {
    trackSimulatorUsage("signing");
    setLogs([
      { timestamp: getFormattedTime(), level: 'info', text: 'SYSTEM: keypair module loaded' },
      { timestamp: getFormattedTime(), level: 'debug', text: 'ALGORITHM: secp256k1 ecdsa engine ready' }
    ]);
  }, [trackSimulatorUsage]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const privateKey = selectedPreset < 2 ? PRESET_KEYS[selectedPreset].key : customKey || "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const signerAddress = deriveAddress(privateKey);

  const runSigning = useCallback(async () => {
    if (!message.trim()) return;
    trackSimulatorUsage("signing");

    setStep("hashing");
    setSignature(null);
    setRecoveredAddress("");
    addLog(`HASH_INIT: prepending Eth signed message prefix to payload`, 'info');
    
    await new Promise((r) => setTimeout(r, 600));
    const hash = await hashMessage(message);
    setMessageHash(hash);
    addLog(`HASH_COMPLETE: SHA-256 hash calculated: ${hash}`, 'success');
    
    setStep("signing");
    addLog(`ECDSA_SIGN: injecting private key and payload digest into curve engine`, 'info');
    
    await new Promise((r) => setTimeout(r, 800));
    const sig = await simulateSign(privateKey, hash);
    setSignature(sig);
    setStep("signed");
    addLog(`SIGN_SUCCESS: signature parameters derived. v=${sig.v}`, 'success');
  }, [message, privateKey, trackSimulatorUsage]);

  const runVerify = useCallback(async () => {
    if (!signature) return;
    trackSimulatorUsage("signing");
    setStep("verifying");
    addLog(`RECOVER_INIT: parsing parameters v=${signature.v}, r=${signature.r.slice(0, 10)}..., s=${signature.s.slice(0, 10)}...`, 'info');
    
    await new Promise((r) => setTimeout(r, 600));
    setRecoveredAddress(signerAddress);
    setStep("verified");
    addLog(`RECOVER_COMPLETE: public key address resolved -> ${signerAddress}`, 'success');
    addLog(`CONSENSUS_VERIFY: reconstructed address matches signer address. integrity validated`, 'success');
  }, [signature, signerAddress, trackSimulatorUsage]);

  const reset = () => {
    setStep("idle");
    setMessageHash("");
    setSignature(null);
    setRecoveredAddress("");
    setLogs(prev => [
      ...prev,
      { timestamp: getFormattedTime(), level: 'warn', text: 'STATE_RESET: current signing pipeline cleared' }
    ]);
  };

  const signatureHex = signature
    ? `0x${signature.r.slice(2)}${signature.s.slice(2)}${signature.v.toString(16)}`
    : null;

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
          <span className="text-[10px] text-neutral-500 font-semibold tracking-wider">CRYPTOGRAPHIC_SIGNER_CLI // CORED_v0.2.1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${step === 'verified' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
          <span className={`text-[10px] uppercase font-bold ${step === 'verified' ? 'text-emerald-500' : 'text-neutral-500'}`}>
            PIPELINE: {step.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-5 p-4 space-y-4 bg-neutral-950">
          
          {/* Signer Key Selector */}
          <div className="space-y-1.5">
            <label className="block text-neutral-500 text-[9px] uppercase">Signer Entity / Key preset</label>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_KEYS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => { setSelectedPreset(i); reset(); }}
                  className={`text-[10px] px-2.5 py-1 border transition-all ${
                    selectedPreset === i
                      ? "border-emerald-500/60 bg-emerald-950/20 text-emerald-400"
                      : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPreset === 2 && (
              <input
                type="text"
                placeholder="0x... (64 hex characters)"
                value={customKey}
                onChange={(e) => { setCustomKey(e.target.value); reset(); }}
                className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-emerald-400 font-mono px-2 py-1.5 rounded outline-none text-[11px] placeholder:text-neutral-700"
              />
            )}
            <div className="text-[9px] text-neutral-500 pt-0.5 truncate">
              DERIVED_ADDR: <span className="text-neutral-300">{signerAddress}</span>
            </div>
          </div>

          {/* Plaintext Payload Input */}
          <div className="space-y-1.5">
            <label className="block text-neutral-500 text-[9px] uppercase">Plaintext Payload message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => { setMessage(e.target.value); reset(); }}
              className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-emerald-400 font-mono px-2 py-1.5 rounded outline-none text-[11px] placeholder:text-neutral-700"
              placeholder="Type raw message here..."
            />
          </div>

          {/* Trigger Pipeline Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={runSigning}
              disabled={step === "hashing" || step === "signing"}
              className="flex-1 bg-emerald-950/60 hover:bg-emerald-900/80 disabled:opacity-30 border border-emerald-500 text-emerald-400 py-1.5 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed text-center"
            >
              {step === "hashing" ? "HASHING..." : step === "signing" ? "SIGNING..." : "SIGN_PAYLOAD"}
            </button>
            {signature && (
              <button
                onClick={runVerify}
                disabled={step === "verifying"}
                className="flex-1 bg-neutral-900 hover:bg-neutral-850 disabled:opacity-30 border border-neutral-800 hover:border-neutral-700 text-neutral-300 py-1.5 font-semibold transition-all active:scale-[0.98] text-center"
              >
                {step === "verifying" ? "RESOLVING..." : "ECRECOVER_VERIFY"}
              </button>
            )}
          </div>

          <div className="border-t border-neutral-850/60 pt-3 text-[9px] text-neutral-500 leading-relaxed">
            <span className="text-neutral-400 font-semibold uppercase">Insight:</span> The signature changes completely on any message or key modification. Anyone on-chain can reconstruct the address using the signature parameters to confirm signature authenticity.
          </div>
        </div>

        {/* Right Console Output Panel */}
        <div className="lg:col-span-7 bg-black flex flex-col min-h-[300px]">
          
          {/* Internal Console Log Area */}
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Active Pipeline Terminal Outputs */}
              <div className="space-y-2">
                {messageHash && (
                  <div className="bg-neutral-900/40 border border-neutral-850 p-2.5">
                    <span className="text-neutral-500 text-[9px] block mb-1">ETH_SIGNED_MESSAGE_HASH:</span>
                    <span className="text-amber-500 font-mono text-[10px] break-all">{messageHash}</span>
                  </div>
                )}

                {signature && (
                  <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 space-y-1.5">
                    <span className="text-neutral-500 text-[9px] block">DERIVED_ECDSA_SIGNATURE:</span>
                    <div className="grid grid-cols-3 gap-1.5 text-[9px] text-neutral-400">
                      <div>r: <span className="text-emerald-500 truncate block">{signature.r.slice(0, 12)}...</span></div>
                      <div>s: <span className="text-emerald-500 truncate block">{signature.s.slice(0, 12)}...</span></div>
                      <div>v: <span className="text-emerald-500 font-bold block">{signature.v}</span></div>
                    </div>
                    <div className="text-[9px] pt-1.5 border-t border-neutral-850/40">
                      <span className="text-neutral-500">HEX:</span>{" "}
                      <span className="text-emerald-400/80 font-mono break-all">{signatureHex}</span>
                    </div>
                  </div>
                )}

                {recoveredAddress && (
                  <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 space-y-1">
                    <span className="text-neutral-500 text-[9px] block">RECOVERED_PUBLIC_ADDRESS:</span>
                    <div className="text-[10px] text-neutral-300 flex justify-between">
                      <span>RECOVERED:</span>
                      <span className="text-emerald-400 font-mono font-semibold">{recoveredAddress}</span>
                    </div>
                    <div className="text-[10px] text-neutral-300 flex justify-between">
                      <span>EXPECTED:</span>
                      <span className="text-emerald-400 font-mono font-semibold">{signerAddress}</span>
                    </div>
                    <div className="text-[9px] pt-1.5 border-t border-neutral-850/40 text-emerald-500 font-semibold flex items-center gap-1.5">
                      <span>✓ INTEGRITY_OK: SIGNER MATCH VALIDATED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Logs */}
              <div className="border-t border-neutral-900 pt-3">
                <span className="text-neutral-500 text-[9px] uppercase block mb-1.5">Debugger Trace:</span>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[9px]">
                  {logs.map((log, index) => {
                    let levelColor = 'text-neutral-400';
                    if (log.level === 'warn') levelColor = 'text-amber-500';
                    if (log.level === 'error') levelColor = 'text-red-500';
                    if (log.level === 'success') levelColor = 'text-emerald-500';
                    if (log.level === 'debug') levelColor = 'text-neutral-600';
                    return (
                      <div key={index} className="leading-normal">
                        <span className="text-neutral-700">[{log.timestamp}]</span>{" "}
                        <span className={levelColor}>{log.text}</span>
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              </div>

            </div>

            <div className="border-t border-neutral-900 pt-2.5 mt-3 flex items-center gap-1.5 text-neutral-600 text-[10px]">
              <span>guest@keypair-module:~$</span>
              <span className="w-1.5 h-3.5 bg-emerald-500 animate-pulse inline-block align-middle" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

