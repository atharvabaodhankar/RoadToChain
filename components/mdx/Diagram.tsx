"use client";

import React from "react";

interface DiagramProps {
  type: "trust-model" | "transaction-lifecycle" | "metamask-keys" | "gas-meter" | "aa-comparison" | "zk-constraints";
  caption?: string;
}

export default function Diagram({ type, caption }: DiagramProps) {
  // We render premium, custom inline SVGs matching the exact styles of Section 03 & 07 of the curriculum bible.
  const renderSVG = () => {
    switch (type) {
      case "trust-model":
        return (
          <svg viewBox="0 0 800 350" className="w-full h-auto bg-bg border border-border rounded-xl">
            {/* Background */}
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* Centralized Model (Left) */}
            <text x="200" y="40" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">CENTRALIZED BANK MODEL</text>
            <rect x="150" y="140" width="100" height="50" rx="8" fill="#111113" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <text x="200" y="170" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="13" fontWeight="bold">Central Bank</text>
            
            {/* Clients surrounding bank */}
            {[
              { x: 80, y: 80, name: "Alice" },
              { x: 320, y: 80, name: "Bob" },
              { x: 80, y: 260, name: "Charlie" },
              { x: 320, y: 260, name: "Dave" }
            ].map((node, i) => (
              <React.Fragment key={i}>
                <circle cx={node.x} cy={node.y} r="25" fill="#1c1c1f" stroke="rgba(255,255,255,0.08)" />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="11">{node.name}</text>
                {/* Arrow to Bank */}
                <line x1={node.x} y1={node.y} x2={node.x > 200 ? 250 : 150} y2={165} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3,3" />
              </React.Fragment>
            ))}

            {/* Divider */}
            <line x1="400" y1="20" x2="400" y2="330" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Decentralized Model (Right) */}
            <text x="600" y="40" textAnchor="middle" fill="#7c3aed" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">DECENTRALIZED P2P NETWORK</text>
            
            {/* Peer nodes */}
            {[
              { x: 500, y: 90, name: "Node A" },
              { x: 700, y: 90, name: "Node B" },
              { x: 500, y: 250, name: "Node C" },
              { x: 700, y: 250, name: "Node D" },
              { x: 600, y: 170, name: "Node E" }
            ].map((node, i) => (
              <React.Fragment key={i}>
                <rect x={node.x - 35} y={node.y - 20} width="70" height="40" rx="6" fill="#111113" stroke="#7c3aed" strokeWidth="1.5" />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="600">{node.name}</text>
              </React.Fragment>
            ))}
            
            {/* Interconnect Node Lines */}
            <path d="M 500 90 L 700 90 M 500 250 L 700 250 M 500 90 L 500 250 M 700 90 L 700 250 M 600 170 L 500 90 M 600 170 L 700 90 M 600 170 L 500 250 M 600 170 L 700 250" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          </svg>
        );

      case "transaction-lifecycle":
        return (
          <svg viewBox="0 0 900 200" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* Stages */}
            {[
              { id: "1", title: "Signed", desc: "User's Key", highlight: false },
              { id: "2", title: "Broadcast", desc: "Sent to RPC", highlight: false },
              { id: "3", title: "Mempool", desc: "Pending queue", highlight: true },
              { id: "4", title: "Validator", desc: "Block building", highlight: false },
              { id: "5", title: "In Block", desc: "On-chain", highlight: false },
              { id: "6", title: "Finalized", desc: "Immutable state", highlight: false }
            ].map((stage, i) => {
              const x = 50 + i * 140;
              const y = 60;
              return (
                <React.Fragment key={i}>
                  {/* Stage Rounded Rect */}
                  <rect
                    x={x}
                    y={y}
                    width="110"
                    height="65"
                    rx="8"
                    fill="#111113"
                    stroke={stage.highlight ? "#7c3aed" : "rgba(255,255,255,0.12)"}
                    strokeWidth="1"
                    className={stage.highlight ? "accent-glow-violet" : ""}
                  />
                  {/* Text labels */}
                  <text x={x + 55} y={y + 25} textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">
                    {stage.title}
                  </text>
                  <text x={x + 55} y={y + 45} textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="10">
                    {stage.desc}
                  </text>

                  {/* Connect arrow (except last stage) */}
                  {i < 5 && (
                    <g>
                      <line x1={x + 110} y1={y + 32.5} x2={x + 140} y2={y + 32.5} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <polygon points={`${x+140},${y+32.5} ${x+134},${y+29.5} ${x+134},${y+35.5}`} fill="rgba(255,255,255,0.2)" />
                    </g>
                  )}
                </React.Fragment>
              );
            })}
          </svg>
        );

      case "metamask-keys":
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* MetaMask Local Box (Left) */}
            <rect x="80" y="60" width="260" height="200" rx="10" fill="#111113" stroke="rgba(255,255,255,0.12)" />
            <text x="210" y="45" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">LOCAL CLIENT (BROWSER)</text>
            <text x="210" y="95" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="14" fontWeight="bold">MetaMask Extension</text>
            
            <rect x="110" y="130" width="200" height="40" rx="6" fill="#1c1c1f" stroke="rgba(255,255,255,0.08)" />
            <text x="210" y="154" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">🔑 Private Key (Encrypted)</text>
            <text x="210" y="210" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="10">Signs transactions locally</text>

            {/* Connecting line */}
            <line x1="340" y1="160" x2="460" y2="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
            <polygon points="460,160 452,156 452,164" fill="#f59e0b" />
            <text x="400" y="150" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="10">Sends Signatures</text>

            {/* On-Chain (Right) */}
            <rect x="460" y="60" width="260" height="200" rx="10" fill="#111113" stroke="#f59e0b" strokeWidth="1" />
            <text x="590" y="45" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">PUBLIC BLOCKCHAIN NETWORK</text>
            <text x="590" y="95" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="14" fontWeight="bold">Ethereum / Polygon State</text>

            <rect x="490" y="130" width="200" height="40" rx="6" fill="#1c1c1f" stroke="rgba(255,255,255,0.08)" />
            <text x="590" y="154" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">💰 Coins / Tokens / Data</text>
            <text x="590" y="210" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="11">Your assets exist on the ledger</text>
          </svg>
        );

      case "gas-meter":
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="400" y="40" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">EVM COMPUTATION METRIC</text>
            
            {/* EVM execution slot */}
            <rect x="100" y="80" width="600" height="160" rx="12" fill="#111113" stroke="rgba(255,255,255,0.07)" />
            
            {/* Opcodes */}
            {[
              { op: "ADD", gas: "3 Gas", desc: "Simple math", fill: "#1c1c1f", border: "rgba(255,255,255,0.08)" },
              { op: "SSTORE", gas: "20,000 Gas", desc: "Write to storage", fill: "#2e1065", border: "#7c3aed" },
              { op: "SLOAD", gas: "2,100 Gas", desc: "Read storage", fill: "#1e3a8a", border: "#3b82f6" },
              { op: "KECCAK256", gas: "30 Gas", desc: "Hash function", fill: "#1c1c1f", border: "rgba(255,255,255,0.08)" }
            ].map((opCode, i) => {
              const x = 130 + i * 140;
              return (
                <g key={i}>
                  <rect x={x} y={110} width="115" height="100" rx="8" fill={opCode.fill} stroke={opCode.border} strokeWidth="1" />
                  <text x={x + 57.5} y={135} textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">{opCode.op}</text>
                  <text x={x + 57.5} y={160} textAnchor="middle" fill={opCode.border === "rgba(255,255,255,0.08)" ? "#a1a1aa" : "#fafafa"} fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="600">{opCode.gas}</text>
                  <text x={x + 57.5} y={185} textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">{opCode.desc}</text>
                </g>
              );
            })}
          </svg>
        );

      case "aa-comparison":
        return (
          <svg viewBox="0 0 850 350" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* Headers */}
            <text x="212" y="45" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">❌ TRADITIONAL EOA (METAMASK)</text>
            <text x="637" y="45" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">✅ SMART ACCOUNT (ERC-4337)</text>

            <line x1="425" y1="20" x2="425" y2="330" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Traditional steps */}
            {[
              "1. User must install extension",
              "2. Backup 12-word seed phrase",
              "3. Buy native gas token (ETH/MATIC)",
              "4. Confused by raw hex approvals"
            ].map((step, i) => (
              <g key={i}>
                <rect x="50" y={80 + i * 60} width="325" height="40" rx="6" fill="#1a0a0a" stroke="rgba(239,68,68,0.1)" />
                <text x="70" y={104} fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">{step}</text>
              </g>
            ))}

            {/* Smart Account steps */}
            {[
              "1. Sign-in with Google silently",
              "2. Secret key stored in hardware enclave",
              "3. Gas sponsored by paymaster (0 gas)",
              "4. Batch transactions into one click"
            ].map((step, i) => (
              <g key={i}>
                <rect x="475" y={80 + i * 60} width="325" height="40" rx="6" fill="#0a1a0a" stroke="rgba(34,197,94,0.1)" />
                <text x="495" y={104} fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="12">{step}</text>
              </g>
            ))}
          </svg>
        );

      case "zk-constraints":
        return (
          <svg viewBox="0 0 850 350" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* Header Columns */}
            <text x="212" y="45" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">❌ SHA-256 HASH CIRCUIT</text>
            <text x="637" y="45" textAnchor="middle" fill="#ec4899" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">⚡ POSEIDON HASH CIRCUIT</text>

            <line x1="425" y1="20" x2="425" y2="330" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* SHA-256 Stats */}
            <g transform="translate(50, 70)">
              <rect width="325" height="230" rx="8" fill="#111113" stroke="rgba(255,255,255,0.08)" />
              <text x="162.5" y="40" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="20" fontWeight="bold">~30,000+</text>
              <text x="162.5" y="65" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">R1CS Constraints</text>
              
              <line x1="20" y1="100" x2="305" y2="100" stroke="rgba(255,255,255,0.08)" />
              
              <text x="30" y="140" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">Proof Time:</text>
              <text x="295" y="140" textAnchor="end" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="12">15.5 seconds</text>
              
              <text x="30" y="180" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">Client memory load:</text>
              <text x="295" y="180" textAnchor="end" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="12">High (~120MB)</text>
              
              <text x="30" y="210" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="10" fontStyle="italic">Not viable for mobile wallets</text>
            </g>

            {/* Poseidon Stats */}
            <g transform="translate(475, 70)">
              <rect width="325" height="230" rx="8" fill="#111113" stroke="#ec4899" strokeWidth="1.5" />
              <text x="162.5" y="40" textAnchor="middle" fill="#ec4899" fontFamily="var(--font-geist-mono)" fontSize="20" fontWeight="bold">904 Only</text>
              <text x="162.5" y="65" textAnchor="middle" fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="12">R1CS Constraints (30x Less)</text>
              
              <line x1="20" y1="100" x2="305" y2="100" stroke="rgba(255,255,255,0.08)" />
              
              <text x="30" y="140" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">Proof Time:</text>
              <text x="295" y="140" textAnchor="end" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">0.4 seconds</text>
              
              <text x="30" y="180" fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="12">Client memory load:</text>
              <text x="295" y="180" textAnchor="end" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">Minimal (~4MB)</text>

              <text x="30" y="210" fill="#86efac" fontFamily="var(--font-geist-sans)" fontSize="10" fontWeight="500">Perfect for browser-only verifications</text>
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-6">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[650px] md:min-w-0">
          {renderSVG()}
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-center text-xs tracking-tight text-dim font-mono">
          {"// "}{caption}
        </p>
      )}
    </div>
  );
}
