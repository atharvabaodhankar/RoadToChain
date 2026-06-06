"use client";

import React from "react";

interface DiagramProps {
  type: "trust-model" | "transaction-lifecycle" | "metamask-keys" | "gas-meter" | "aa-comparison" | "zk-constraints" | "signing-flow" | "key-derivation" | "hybrid-architecture" | "abi-translator" | "rpc-pipeline" | "evm-execution" | "mobile-wallet-pain" | "value-mental-model" | "merkle-tree" | "byzantine-consensus" | "eip-1559-pricing";
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

      /* ═══════════════════════════════════════════════════════════════════════
         PHASE 3 — NEW ANIMATED DIAGRAMS
         ═══════════════════════════════════════════════════════════════════════ */

      case "signing-flow":
        return (
          <svg viewBox="0 0 900 300" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">HOW DIGITAL SIGNING WORKS — YOUR PRIVATE KEY NEVER LEAVES YOUR DEVICE</text>

            {/* Step 1: Message */}
            <g className="diagram-cascade-1">
              <rect x="30" y="70" width="140" height="80" rx="8" fill="#111113" stroke="rgba(255,255,255,0.12)" />
              <text x="100" y="100" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">📄 Message</text>
              <text x="100" y="120" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">{`"Send 0.1 ETH to Bob"`}</text>
              <text x="100" y="165" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">Raw transaction data</text>
            </g>

            {/* Arrow 1 */}
            <g className="diagram-flow-pulse">
              <line x1="170" y1="110" x2="210" y2="110" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="210,110 204,106 204,114" fill="#7c3aed" />
            </g>

            {/* Step 2: Hash */}
            <g className="diagram-cascade-2">
              <rect x="215" y="70" width="140" height="80" rx="8" fill="#111113" stroke="#7c3aed" strokeWidth="1" />
              <text x="285" y="100" textAnchor="middle" fill="#7c3aed" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🔢 Hash</text>
              <text x="285" y="120" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Keccak-256</text>
              <text x="285" y="165" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">32-byte digest</text>
            </g>

            {/* Arrow 2 */}
            <g className="diagram-flow-pulse">
              <line x1="355" y1="110" x2="395" y2="110" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="395,110 389,106 389,114" fill="#7c3aed" />
            </g>

            {/* Step 3: ECDSA Sign */}
            <g className="diagram-cascade-3">
              <rect x="400" y="55" width="160" height="110" rx="8" fill="#1a0a2e" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="480" y="82" textAnchor="middle" fill="#a78bfa" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🔐 ECDSA Sign</text>
              <text x="480" y="102" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="10">Private Key + Hash</text>
              <line x1="420" y1="115" x2="540" y2="115" stroke="rgba(255,255,255,0.08)" />
              <text x="480" y="135" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">secp256k1 curve math</text>
              <text x="480" y="155" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">Key NEVER transmitted</text>
            </g>

            {/* Arrow 3 */}
            <g className="diagram-flow-pulse">
              <line x1="560" y1="110" x2="600" y2="110" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="600,110 594,106 594,114" fill="#22c55e" />
            </g>

            {/* Step 4: Signature output */}
            <g className="diagram-cascade-4">
              <rect x="605" y="55" width="130" height="110" rx="8" fill="#111113" stroke="#22c55e" strokeWidth="1" />
              <text x="670" y="82" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">✅ Signature</text>
              <text x="670" y="105" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="10">{"{ r, s, v }"}</text>
              <line x1="625" y1="115" x2="715" y2="115" stroke="rgba(255,255,255,0.08)" />
              <text x="670" y="135" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">65 bytes total</text>
              <text x="670" y="155" textAnchor="middle" fill="#86efac" fontFamily="var(--font-geist-sans)" fontSize="9">Proves ownership</text>
            </g>

            {/* Arrow 4 */}
            <g className="diagram-flow-pulse">
              <line x1="735" y1="110" x2="775" y2="110" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="775,110 769,106 769,114" fill="#22c55e" />
            </g>

            {/* Step 5: Broadcast */}
            <g className="diagram-cascade-5">
              <rect x="780" y="70" width="95" height="80" rx="8" fill="#111113" stroke="rgba(255,255,255,0.12)" />
              <text x="827" y="100" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">📡</text>
              <text x="827" y="118" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Broadcast</text>
              <text x="827" y="165" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">To network</text>
            </g>

            {/* Bottom caption */}
            <rect x="200" y="210" width="500" height="55" rx="8" fill="#0a1a0a" stroke="rgba(34,197,94,0.15)" />
            <text x="450" y="232" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="600">KEY INSIGHT</text>
            <text x="450" y="252" textAnchor="middle" fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="11">Anyone can verify the signature — nobody can extract the private key from it.</text>
          </svg>
        );

      case "key-derivation":
        return (
          <svg viewBox="0 0 900 280" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">PRIVATE KEY → PUBLIC KEY → ADDRESS DERIVATION</text>

            {/* Stage 1: Random Entropy */}
            <g className="diagram-cascade-1">
              <rect x="20" y="70" width="150" height="90" rx="8" fill="#1a0a2e" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="95" y="95" textAnchor="middle" fill="#a78bfa" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🎲 Random Entropy</text>
              <text x="95" y="115" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="10">256 random bits</text>
              <text x="95" y="145" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">Cryptographically secure</text>
            </g>

            {/* Arrow */}
            <g className="diagram-flow-pulse">
              <line x1="170" y1="115" x2="200" y2="115" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="200,115 194,111 194,119" fill="#7c3aed" />
            </g>

            {/* Stage 2: Private Key */}
            <g className="diagram-cascade-2">
              <rect x="205" y="70" width="155" height="90" rx="8" fill="#111113" stroke="#ef4444" strokeWidth="1" />
              <text x="282" y="95" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🔑 Private Key</text>
              <text x="282" y="115" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="9">0x4c0883a69...</text>
              <text x="282" y="145" textAnchor="middle" fill="#fca5a5" fontFamily="var(--font-geist-sans)" fontSize="9">⚠️ NEVER share this</text>
            </g>

            {/* Arrow */}
            <g className="diagram-flow-pulse">
              <line x1="360" y1="115" x2="395" y2="115" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="395,115 389,111 389,119" fill="#f59e0b" />
              <text x="378" y="105" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="8">secp256k1</text>
            </g>

            {/* Stage 3: Public Key */}
            <g className="diagram-cascade-3">
              <rect x="400" y="70" width="155" height="90" rx="8" fill="#111113" stroke="#3b82f6" strokeWidth="1" />
              <text x="477" y="95" textAnchor="middle" fill="#3b82f6" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🔓 Public Key</text>
              <text x="477" y="115" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="9">04ab83c92f...</text>
              <text x="477" y="145" textAnchor="middle" fill="#93c5fd" fontFamily="var(--font-geist-sans)" fontSize="9">512-bit (uncompressed)</text>
            </g>

            {/* Arrow */}
            <g className="diagram-flow-pulse">
              <line x1="555" y1="115" x2="590" y2="115" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="590,115 584,111 584,119" fill="#f59e0b" />
              <text x="573" y="105" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="8">Keccak</text>
            </g>

            {/* Stage 4: Address */}
            <g className="diagram-cascade-4">
              <rect x="595" y="70" width="155" height="90" rx="8" fill="#111113" stroke="#22c55e" strokeWidth="1" />
              <text x="672" y="95" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">📬 Address</text>
              <text x="672" y="115" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="9">0x71C7656E...</text>
              <text x="672" y="145" textAnchor="middle" fill="#86efac" fontFamily="var(--font-geist-sans)" fontSize="9">Last 20 bytes of hash</text>
            </g>

            {/* Arrow */}
            <g className="diagram-flow-pulse">
              <line x1="750" y1="115" x2="785" y2="115" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="785,115 779,111 779,119" fill="#22c55e" />
            </g>

            {/* Stage 5: Blockchain */}
            <g className="diagram-cascade-5 diagram-glow-breathe">
              <rect x="790" y="70" width="90" height="90" rx="8" fill="#111113" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="835" y="105" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="20">⛓️</text>
              <text x="835" y="130" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">On-chain</text>
              <text x="835" y="145" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">identity</text>
            </g>

            {/* Bottom insight */}
            <rect x="100" y="200" width="700" height="55" rx="8" fill="#1a0a0a" stroke="rgba(239,68,68,0.15)" />
            <text x="450" y="222" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="600">ONE-WAY FUNCTIONS</text>
            <text x="450" y="242" textAnchor="middle" fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="11">Private Key → Public Key → Address. You cannot reverse the arrows. Ever.</text>
          </svg>
        );

      case "hybrid-architecture":
        return (
          <svg viewBox="0 0 900 420" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">WHERE IS PROCESSING ACTUALLY HAPPENING?</text>

            {/* Layer 1: Frontend */}
            <g className="diagram-cascade-1">
              <rect x="50" y="55" width="800" height="85" rx="10" fill="#111113" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="90" y="82" fill="#3b82f6" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">LAYER 1 — FRONTEND (React / Next.js)</text>
              {[
                { x: 90, label: "UI Components" },
                { x: 250, label: "Wallet Connection" },
                { x: 430, label: "Tx Signing" },
                { x: 580, label: "State Display" },
                { x: 730, label: "Event Listeners" }
              ].map((item, i) => (
                <g key={i}>
                  <rect x={item.x} y="100" width="120" height="26" rx="4" fill="#1e3a8a" stroke="rgba(59,130,246,0.2)" />
                  <text x={item.x + 60} y="117" textAnchor="middle" fill="#93c5fd" fontFamily="var(--font-geist-mono)" fontSize="9">{item.label}</text>
                </g>
              ))}
            </g>

            {/* Arrow down */}
            <g className="diagram-flow-pulse">
              <line x1="450" y1="140" x2="450" y2="165" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="450,165 446,159 454,159" fill="#f59e0b" />
              <text x="480" y="155" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="8">API calls, queries</text>
            </g>

            {/* Layer 2: Backend */}
            <g className="diagram-cascade-2">
              <rect x="50" y="170" width="800" height="85" rx="10" fill="#111113" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="90" y="197" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">LAYER 2 — BACKEND (Node.js / API Server)</text>
              {[
                { x: 90, label: "Business Logic" },
                { x: 250, label: "Database (Postgres)" },
                { x: 430, label: "The Graph Indexer" },
                { x: 600, label: "IPFS Pinning" },
                { x: 740, label: "Auth (JWT/OAuth)" }
              ].map((item, i) => (
                <g key={i}>
                  <rect x={item.x} y="215" width={i === 1 ? 140 : 120} height="26" rx="4" fill="#451a03" stroke="rgba(245,158,11,0.2)" />
                  <text x={item.x + (i === 1 ? 70 : 60)} y="232" textAnchor="middle" fill="#fcd34d" fontFamily="var(--font-geist-mono)" fontSize="9">{item.label}</text>
                </g>
              ))}
            </g>

            {/* Arrow down */}
            <g className="diagram-flow-pulse">
              <line x1="450" y1="255" x2="450" y2="280" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="450,280 446,274 454,274" fill="#7c3aed" />
              <text x="490" y="270" fill="#7c3aed" fontFamily="var(--font-geist-mono)" fontSize="8">Signed txs only</text>
            </g>

            {/* Layer 3: Blockchain */}
            <g className="diagram-cascade-3 diagram-glow-breathe">
              <rect x="50" y="285" width="800" height="85" rx="10" fill="#111113" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="90" y="312" fill="#7c3aed" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">LAYER 3 — BLOCKCHAIN (Ethereum / Polygon)</text>
              {[
                { x: 90, label: "Smart Contracts" },
                { x: 250, label: "Token Transfers" },
                { x: 410, label: "State Verification" },
                { x: 580, label: "Event Emission" },
                { x: 730, label: "Immutable Records" }
              ].map((item, i) => (
                <g key={i}>
                  <rect x={item.x} y="330" width="130" height="26" rx="4" fill="#2e1065" stroke="rgba(124,58,237,0.2)" />
                  <text x={item.x + 65} y="347" textAnchor="middle" fill="#c4b5fd" fontFamily="var(--font-geist-mono)" fontSize="9">{item.label}</text>
                </g>
              ))}
            </g>

            {/* Bottom insight */}
            <rect x="150" y="385" width="600" height="25" rx="6" fill="#0a1a0a" stroke="rgba(34,197,94,0.1)" />
            <text x="450" y="402" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-sans)" fontSize="10">99% of your app runs on Layers 1 + 2. The blockchain handles only the 1% needing trustless consensus.</text>
          </svg>
        );

      case "abi-translator":
        return (
          <svg viewBox="0 0 900 300" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">ABI — THE TRANSLATOR BETWEEN HUMAN CODE AND EVM BYTECODE</text>

            {/* Human Side */}
            <g className="diagram-cascade-1">
              <rect x="30" y="60" width="250" height="140" rx="10" fill="#111113" stroke="#3b82f6" strokeWidth="1" />
              <text x="155" y="85" textAnchor="middle" fill="#3b82f6" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">YOUR CODE (Human-readable)</text>
              <rect x="50" y="100" width="210" height="80" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.06)" />
              <text x="60" y="120" fill="#f472b6" fontFamily="var(--font-geist-mono)" fontSize="10">contract</text>
              <text x="113" y="120" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="10">.vote(</text>
              <text x="60" y="140" fill="#fcd34d" fontFamily="var(--font-geist-mono)" fontSize="10">  proposalId: 42</text>
              <text x="60" y="160" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="10">)</text>
            </g>

            {/* ABI Translation Box */}
            <g className="diagram-cascade-2">
              <line x1="280" y1="130" x2="330" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" className="diagram-flow-pulse" />
              <polygon points="330,130 324,126 324,134" fill="#f59e0b" />
              
              <rect x="335" y="55" width="230" height="150" rx="10" fill="#1a1300" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="450" y="80" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">📖 ABI (The Menu)</text>
              <rect x="355" y="95" width="190" height="90" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.06)" />
              <text x="365" y="115" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Function: vote(uint256)</text>
              <text x="365" y="135" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Selector: 0x0121b93f</text>
              <text x="365" y="155" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Encode: args → 32-byte</text>
              <text x="365" y="175" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9">ABI = function signatures</text>
            </g>

            {/* Output Side */}
            <g className="diagram-cascade-3">
              <line x1="565" y1="130" x2="615" y2="130" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,3" className="diagram-flow-pulse" />
              <polygon points="615,130 609,126 609,134" fill="#22c55e" />

              <rect x="620" y="60" width="250" height="140" rx="10" fill="#111113" stroke="#22c55e" strokeWidth="1" />
              <text x="745" y="85" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">EVM CALLDATA (Hex)</text>
              <rect x="640" y="100" width="210" height="80" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.06)" />
              <text x="650" y="118" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">0x0121b93f</text>
              <text x="650" y="136" fill="#86efac" fontFamily="var(--font-geist-mono)" fontSize="8">00000000000000000000</text>
              <text x="650" y="152" fill="#86efac" fontFamily="var(--font-geist-mono)" fontSize="8">00000000000000000000</text>
              <text x="650" y="168" fill="#86efac" fontFamily="var(--font-geist-mono)" fontSize="8">0000002a ← (42 in hex)</text>
            </g>

            {/* Bottom insight */}
            <rect x="150" y="225" width="600" height="50" rx="8" fill="#0a0a1a" stroke="rgba(59,130,246,0.1)" />
            <text x="450" y="245" textAnchor="middle" fill="#3b82f6" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="600">THINK OF IT AS</text>
            <text x="450" y="263" textAnchor="middle" fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="11">ABI = restaurant menu. It tells the EVM what functions exist and how arguments are formatted.</text>
          </svg>
        );

      case "rpc-pipeline":
        return (
          <svg viewBox="0 0 900 250" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="28" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">RPC — YOUR APP&apos;S PHONE LINE TO THE BLOCKCHAIN</text>

            {[
              { x: 25, w: 130, title: "🖥️ Your App", sub: "Frontend", color: "#3b82f6", bg: "#1e3a8a" },
              { x: 185, w: 130, title: "📡 RPC Call", sub: "JSON-RPC 2.0", color: "#f59e0b", bg: "#451a03" },
              { x: 345, w: 140, title: "☁️ Infura/Alchemy", sub: "Managed Node", color: "#7c3aed", bg: "#2e1065" },
              { x: 515, w: 130, title: "🔄 P2P Network", sub: "Gossip Protocol", color: "#14b8a6", bg: "#042f2e" },
              { x: 675, w: 130, title: "⛏️ Validator", sub: "Block Builder", color: "#22c55e", bg: "#052e16" },
            ].map((stage, i) => (
              <React.Fragment key={i}>
                <g className={`diagram-cascade-${i + 1 > 5 ? 5 : i + 1}`}>
                  <rect x={stage.x} y="55" width={stage.w} height="75" rx="8" fill={stage.bg} stroke={stage.color} strokeWidth="1" />
                  <text x={stage.x + stage.w / 2} y="82" textAnchor="middle" fill={stage.color} fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="bold">{stage.title}</text>
                  <text x={stage.x + stage.w / 2} y="102" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">{stage.sub}</text>
                </g>
                {i < 4 && (
                  <g className="diagram-flow-pulse">
                    <line x1={stage.x + stage.w} y1="92" x2={stage.x + stage.w + 30} y2="92" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
                    <polygon points={`${stage.x + stage.w + 30},92 ${stage.x + stage.w + 24},88 ${stage.x + stage.w + 24},96`} fill="rgba(255,255,255,0.3)" />
                  </g>
                )}
              </React.Fragment>
            ))}

            {/* Response Arrow */}
            <g className="diagram-packet-move">
              <rect x="835" y="55" width="50" height="75" rx="8" fill="#111113" stroke="#22c55e" strokeWidth="1" />
              <text x="860" y="85" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-sans)" fontSize="16">📦</text>
              <text x="860" y="105" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="8">Result</text>
            </g>

            {/* Method examples */}
            <rect x="50" y="155" width="800" height="70" rx="8" fill="#111113" stroke="rgba(255,255,255,0.06)" />
            <text x="80" y="178" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">COMMON RPC METHODS:</text>
            {[
              { method: "eth_call", desc: "Read data (free)", x: 80 },
              { method: "eth_sendTransaction", desc: "Write data (costs gas)", x: 300 },
              { method: "eth_getBalance", desc: "Check balance", x: 560 },
            ].map((m, i) => (
              <g key={i}>
                <text x={m.x} y="200" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="10">{m.method}</text>
                <text x={m.x} y="215" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">{m.desc}</text>
              </g>
            ))}
          </svg>
        );

      case "evm-execution":
        return (
          <svg viewBox="0 0 900 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">EVM — THE KITCHEN WHERE YOUR CODE ACTUALLY RUNS</text>

            {/* EVM Container */}
            <rect x="50" y="50" width="800" height="220" rx="12" fill="#111113" stroke="#7c3aed" strokeWidth="1" />
            <text x="80" y="75" fill="#7c3aed" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">ETHEREUM VIRTUAL MACHINE (EVM)</text>

            {/* Stack */}
            <g className="diagram-cascade-1">
              <rect x="80" y="95" width="180" height="155" rx="8" fill="#0d0d0f" stroke="rgba(255,255,255,0.08)" />
              <text x="170" y="115" textAnchor="middle" fill="#3b82f6" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">STACK (1024 deep)</text>
              {["0x002a (42)", "0x0003 (3)", "0x0001 (1)", "— empty —"].map((item, i) => (
                <g key={i}>
                  <rect x="95" y={125 + i * 28} width="150" height="22" rx="3" fill={i < 3 ? "#1e3a8a" : "#1c1c1f"} stroke={i < 3 ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)"} />
                  <text x="170" y={140 + i * 28} textAnchor="middle" fill={i < 3 ? "#93c5fd" : "#3f3f46"} fontFamily="var(--font-geist-mono)" fontSize="9">{item}</text>
                </g>
              ))}
            </g>

            {/* Memory */}
            <g className="diagram-cascade-2">
              <rect x="290" y="95" width="160" height="155" rx="8" fill="#0d0d0f" stroke="rgba(255,255,255,0.08)" />
              <text x="370" y="115" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">MEMORY (volatile)</text>
              <rect x="305" y="125" width="130" height="30" rx="3" fill="#451a03" stroke="rgba(245,158,11,0.2)" />
              <text x="370" y="144" textAnchor="middle" fill="#fcd34d" fontFamily="var(--font-geist-mono)" fontSize="9">Temporary bytes</text>
              <text x="370" y="180" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">Cleared after each</text>
              <text x="370" y="195" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">function call</text>
            </g>

            {/* Storage */}
            <g className="diagram-cascade-3 diagram-glow-breathe">
              <rect x="480" y="95" width="160" height="155" rx="8" fill="#0d0d0f" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="560" y="115" textAnchor="middle" fill="#7c3aed" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">STORAGE (permanent)</text>
              <rect x="495" y="125" width="130" height="30" rx="3" fill="#2e1065" stroke="rgba(124,58,237,0.2)" />
              <text x="560" y="144" textAnchor="middle" fill="#c4b5fd" fontFamily="var(--font-geist-mono)" fontSize="9">Key → Value mapping</text>
              <text x="560" y="180" textAnchor="middle" fill="#a78bfa" fontFamily="var(--font-geist-sans)" fontSize="9" fontWeight="600">20,000 gas per write!</text>
              <text x="560" y="195" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">Most expensive operation</text>
            </g>

            {/* Gas Meter */}
            <g className="diagram-cascade-4">
              <rect x="670" y="95" width="155" height="155" rx="8" fill="#0d0d0f" stroke="rgba(255,255,255,0.08)" />
              <text x="747" y="115" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">⛽ GAS METER</text>
              <text x="747" y="150" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="20" fontWeight="bold">142,831</text>
              <text x="747" y="170" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">gas remaining</text>
              <rect x="700" y="185" width="95" height="6" rx="3" fill="#1c1c1f" />
              <rect x="700" y="185" width="65" height="6" rx="3" fill="#22c55e" className="diagram-step-highlight" />
              <text x="747" y="210" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">Ticks down per opcode</text>
            </g>

            {/* Bottom context */}
            <text x="450" y="295" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="10">Every validator node runs the same code and must arrive at the same result — deterministic execution.</text>
          </svg>
        );

      case "mobile-wallet-pain":
        return (
          <svg viewBox="0 0 850 400" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            
            {/* Headers */}
            <text x="212" y="35" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">❌ METAMASK ON MOBILE (2024)</text>
            <text x="637" y="35" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">✅ MODERN EMBEDDED WALLET</text>

            <line x1="425" y1="15" x2="425" y2="380" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* MetaMask Mobile Steps */}
            {[
              { step: "1", text: "Download MetaMask app", time: "2 min" },
              { step: "2", text: "Create account + write 12 seed words", time: "5 min" },
              { step: "3", text: "Open in-app browser (not Safari!)", time: "30 sec" },
              { step: "4", text: "Manually type dApp URL", time: "30 sec" },
              { step: "5", text: "Approve wallet connection popup", time: "10 sec" },
              { step: "6", text: "Switch to correct network", time: "1 min" },
              { step: "7", text: "Need gas tokens → find faucet/exchange", time: "10+ min" },
              { step: "8", text: "Approve transaction popup", time: "15 sec" },
            ].map((item, i) => (
              <g key={i}>
                <rect x="30" y={55 + i * 40} width="365" height="32" rx="6" fill="#1a0a0a" stroke="rgba(239,68,68,0.08)" />
                <circle cx="52" cy={71 + i * 40} r="8" fill="#450a0a" stroke="#ef4444" strokeWidth="0.5" />
                <text x="52" y={75 + i * 40} textAnchor="middle" fill="#fca5a5" fontFamily="var(--font-geist-mono)" fontSize="8" fontWeight="bold">{item.step}</text>
                <text x="68" y={75 + i * 40} fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="10">{item.text}</text>
                <text x="375" y={75 + i * 40} textAnchor="end" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="8">{item.time}</text>
              </g>
            ))}

            {/* Total time */}
            <rect x="30" y="380" width="365" height="10" rx="3" fill="#450a0a" />
            <text x="212" y="370" textAnchor="middle" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">~20 MINUTES · 8 STEPS · 95% DROP-OFF</text>

            {/* Modern Wallet Steps */}
            {[
              { step: "1", text: "Tap 'Sign in with Google'", time: "5 sec" },
              { step: "2", text: "Tap 'Vote' button", time: "2 sec" },
            ].map((item, i) => (
              <g key={i} className={`diagram-cascade-${i + 1}`}>
                <rect x="455" y={55 + i * 40} width="365" height="32" rx="6" fill="#0a1a0a" stroke="rgba(34,197,94,0.08)" />
                <circle cx="477" cy={71 + i * 40} r="8" fill="#052e16" stroke="#22c55e" strokeWidth="0.5" />
                <text x="477" y={75 + i * 40} textAnchor="middle" fill="#86efac" fontFamily="var(--font-geist-mono)" fontSize="8" fontWeight="bold">{item.step}</text>
                <text x="493" y={75 + i * 40} fill="#d4d4d8" fontFamily="var(--font-geist-sans)" fontSize="10">{item.text}</text>
                <text x="800" y={75 + i * 40} textAnchor="end" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="8">{item.time}</text>
              </g>
            ))}

            {/* Behind the scenes */}
            <g className="diagram-cascade-3">
              <rect x="455" y="145" width="365" height="140" rx="8" fill="#111113" stroke="rgba(255,255,255,0.06)" />
              <text x="475" y="170" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">BEHIND THE SCENES (invisible to user):</text>
              {[
                "→ Privy creates embedded wallet via HSM",
                "→ Smart Account deployed (ERC-4337)",
                "→ Paymaster sponsors gas (user pays $0)",
                "→ UserOperation bundled + submitted",
                "→ Transaction confirmed on-chain",
              ].map((line, i) => (
                <text key={i} x="475" y={192 + i * 18} fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">{line}</text>
              ))}
            </g>

            {/* Total time modern */}
            <rect x="455" y="380" width="365" height="10" rx="3" fill="#052e16" />
            <text x="637" y="370" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">~7 SECONDS · 2 STEPS · 70%+ CONVERSION</text>
          </svg>
        );

      case "value-mental-model":
        return (
          <svg viewBox="0 0 900 380" className="w-full h-auto bg-bg border border-border rounded-xl">
            <rect width="100%" height="100%" fill="#09090b" />
            <text x="450" y="30" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">WHY MAINNET ETH HAS VALUE AND TESTNET ETH DOESN&apos;T</text>

            <line x1="450" y1="15" x2="450" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* Mainnet Side */}
            <text x="225" y="55" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">MAINNET (Chain ID: 1)</text>

            <g className="diagram-cascade-1">
              <rect x="40" y="75" width="370" height="260" rx="10" fill="#111113" stroke="#22c55e" strokeWidth="1" />

              {[
                { icon: "🏦", label: "Real economic stakes", desc: "Validators lock $50B+ in staked ETH", y: 105 },
                { icon: "⛽", label: "Scarce block space", desc: "Supply & demand sets gas price", y: 150 },
                { icon: "🔥", label: "Deflationary burns", desc: "EIP-1559 burns ETH every block", y: 195 },
                { icon: "💰", label: "Market consensus", desc: "Exchanges, DeFi = real liquidity", y: 240 },
                { icon: "🔒", label: "Security budget", desc: "Value funds validator incentives", y: 285 },
              ].map((item, i) => (
                <g key={i}>
                  <text x="65" y={item.y} fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="14">{item.icon}</text>
                  <text x="90" y={item.y} fill="#fafafa" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="600">{item.label}</text>
                  <text x="90" y={item.y + 15} fill="#52525b" fontFamily="var(--font-geist-sans)" fontSize="9">{item.desc}</text>
                </g>
              ))}

              <rect x="60" y="310" width="330" height="18" rx="4" fill="#052e16" stroke="rgba(34,197,94,0.2)" />
              <text x="225" y="323" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">1 ETH ≈ $3,000+ (real market value)</text>
            </g>

            {/* Testnet Side */}
            <text x="675" y="55" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="12" fontWeight="bold">TESTNET / SEPOLIA (Chain ID: 11155111)</text>

            <g className="diagram-cascade-2">
              <rect x="490" y="75" width="370" height="260" rx="10" fill="#111113" stroke="rgba(255,255,255,0.08)" />

              {[
                { icon: "🎭", label: "No real stakes", desc: "Anyone can validate, nothing to lose", y: 105 },
                { icon: "♾️", label: "Unlimited supply", desc: "Faucets mint tokens for free", y: 150 },
                { icon: "🚫", label: "No burn mechanism", desc: "Tokens created and destroyed freely", y: 195 },
                { icon: "🎪", label: "No market consensus", desc: "Not listed on exchanges", y: 240 },
                { icon: "⚠️", label: "No security budget", desc: "Network can be reset at will", y: 285 },
              ].map((item, i) => (
                <g key={i}>
                  <text x="515" y={item.y} fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="14">{item.icon}</text>
                  <text x="540" y={item.y} fill="#a1a1aa" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="600">{item.label}</text>
                  <text x="540" y={item.y + 15} fill="#3f3f46" fontFamily="var(--font-geist-sans)" fontSize="9">{item.desc}</text>
                </g>
              ))}

              <rect x="510" y="310" width="330" height="18" rx="4" fill="#1c1c1f" stroke="rgba(255,255,255,0.04)" />
              <text x="675" y="323" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">1 Sepolia ETH = $0.00 (zero value)</text>
            </g>

            {/* Bottom insight */}
            <rect x="150" y="350" width="600" height="22" rx="6" fill="#0a0a1a" stroke="rgba(124,58,237,0.1)" />
            <text x="450" y="365" textAnchor="middle" fill="#a78bfa" fontFamily="var(--font-geist-sans)" fontSize="10">Same code. Same tools. Same MetaMask UI. Completely different economic reality.</text>
          </svg>
        );

      case "merkle-tree":
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <text x="400" y="35" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">MERKLE TREE DATA STRUCT (TRANSACTION HASHING)</text>
            
            {/* Merkle Root */}
            <g>
              <rect x="330" y="60" width="140" height="40" rx="6" fill="var(--dg-card2)" stroke="var(--dg-accent)" strokeWidth="1.5" />
              <text x="400" y="78" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">Merkle Root</text>
              <text x="400" y="93" textAnchor="middle" fill="var(--dg-accent)" fontFamily="var(--font-geist-mono)" fontSize="9">Hash(H01 + H23)</text>
            </g>

            {/* Connecting lines Level 2 -> Level 1 */}
            <line x1="400" y1="100" x2="230" y2="135" stroke="var(--dg-border)" strokeWidth="1" />
            <line x1="400" y1="100" x2="570" y2="135" stroke="var(--dg-border)" strokeWidth="1" />

            {/* Parent Hashes */}
            <g>
              <rect x="160" y="135" width="140" height="40" rx="6" fill="var(--dg-card)" stroke="var(--dg-border)" strokeWidth="1" />
              <text x="230" y="153" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">Hash 01</text>
              <text x="230" y="167" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="8.5">Hash(H0 + H1)</text>
            </g>

            <g>
              <rect x="500" y="135" width="140" height="40" rx="6" fill="var(--dg-card)" stroke="var(--dg-border)" strokeWidth="1" />
              <text x="570" y="153" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">Hash 23</text>
              <text x="570" y="167" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="8.5">Hash(H2 + H3)</text>
            </g>

            {/* Connecting lines Level 1 -> Level 0 */}
            <line x1="230" y1="175" x2="110" y2="210" stroke="var(--dg-border)" strokeWidth="1" />
            <line x1="230" y1="175" x2="290" y2="210" stroke="var(--dg-border)" strokeWidth="1" />
            <line x1="570" y1="175" x2="480" y2="210" stroke="var(--dg-border)" strokeWidth="1" />
            <line x1="570" y1="175" x2="660" y2="210" stroke="var(--dg-border)" strokeWidth="1" />

            {/* Transaction Hashes */}
            {[
              { x: 50, label: "Hash 0", desc: "Hash(Tx 0)", active: false },
              { x: 230, label: "Hash 1", desc: "Hash(Tx 1)", active: false },
              { x: 410, label: "Hash 2", desc: "Hash(Tx 2)", active: true },
              { x: 590, label: "Hash 3", desc: "Hash(Tx 3)", active: false },
            ].map((node, i) => (
              <g key={i} transform={`translate(${node.x}, 210)`}>
                <rect width="120" height="35" rx="4" fill="var(--dg-card)" stroke={node.active ? "var(--dg-accent)" : "var(--dg-border)"} strokeWidth={node.active ? 1.5 : 1} />
                <text x="60" y="17" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="9.5" fontWeight="bold">{node.label}</text>
                <text x="60" y="28" textAnchor="middle" fill={node.active ? "var(--dg-accent)" : "var(--dg-text-faint)"} fontFamily="var(--font-geist-mono)" fontSize="8">{node.desc}</text>
                
                {/* Arrow to raw transaction */}
                <line x1="60" y1="35" x2="60" y2="55" stroke="var(--dg-border)" strokeWidth="1" strokeDasharray="2,2" />
                <text x="60" y="65" textAnchor="middle" fill="var(--dg-text-faint)" fontFamily="var(--font-geist-mono)" fontSize="8">Tx {i}</text>
              </g>
            ))}
          </svg>
        );

      case "byzantine-consensus":
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <text x="400" y="35" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">BYZANTINE GENERALS PROBLEM IN BLOCKCHAIN CONSENSUS</text>
            
            {/* Proposer / Commander Node */}
            <g transform="translate(330, 60)">
              <rect width="140" height="50" rx="8" fill="var(--dg-card)" stroke="var(--dg-accent)" strokeWidth="1.5" />
              <text x="70" y="22" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="bold">Leader Node</text>
              <text x="70" y="38" textAnchor="middle" fill="var(--dg-accent)" fontFamily="var(--font-geist-mono)" fontSize="9">Proposes Block 4</text>
            </g>

            {/* Broadcast Lines from Leader to Validators */}
            <line x1="350" y1="110" x2="160" y2="180" stroke="var(--dg-success)" strokeWidth="1.2" />
            <polygon points="160,180 168,178 164,173" fill="var(--dg-success)" />
            <text x="230" y="140" textAnchor="middle" fill="var(--dg-success)" fontFamily="var(--font-geist-mono)" fontSize="8.5">gossip block</text>

            <line x1="400" y1="110" x2="400" y2="175" stroke="var(--dg-success)" strokeWidth="1.2" />
            <polygon points="400,175 397,167 403,167" fill="var(--dg-success)" />

            <line x1="450" y1="110" x2="640" y2="180" stroke="var(--dg-danger)" strokeWidth="1.2" strokeDasharray="3,2" />
            <polygon points="640,180 636,173 632,178" fill="var(--dg-danger)" />
            <text x="570" y="140" textAnchor="middle" fill="var(--dg-danger)" fontFamily="var(--font-geist-mono)" fontSize="8.5">compromised link</text>

            {/* Validator Nodes */}
            {/* Honest Validator A */}
            <g transform="translate(80, 180)">
              <rect width="160" height="70" rx="8" fill="var(--dg-card)" stroke="var(--dg-success)" strokeWidth="1" />
              <text x="80" y="20" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="bold">Validator A (Honest)</text>
              <text x="80" y="40" textAnchor="middle" fill="var(--dg-success)" fontFamily="var(--font-geist-mono)" fontSize="9">✓ Verifies signatures</text>
              <text x="80" y="55" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="8">Adds to Local Ledger</text>
            </g>

            {/* Honest Validator B */}
            <g transform="translate(320, 180)">
              <rect width="160" height="70" rx="8" fill="var(--dg-card)" stroke="var(--dg-success)" strokeWidth="1" />
              <text x="80" y="20" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="bold">Validator B (Honest)</text>
              <text x="80" y="40" textAnchor="middle" fill="var(--dg-success)" fontFamily="var(--font-geist-mono)" fontSize="9">✓ Verifies hashes</text>
              <text x="80" y="55" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="8">Replicates State</text>
            </g>

            {/* Malicious/Offline Validator C */}
            <g transform="translate(560, 180)">
              <rect width="160" height="70" rx="8" fill="var(--dg-card)" stroke="var(--dg-danger)" strokeWidth="1" />
              <text x="80" y="20" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-sans)" fontSize="11" fontWeight="bold">Validator C (Cheater)</text>
              <text x="80" y="40" textAnchor="middle" fill="var(--dg-danger)" fontFamily="var(--font-geist-mono)" fontSize="9">✗ Tries to double spend</text>
              <text x="80" y="55" textAnchor="middle" fill="var(--dg-danger)" fontFamily="var(--font-geist-mono)" fontSize="8">Ignored by 2/3 majority</text>
            </g>
          </svg>
        );

      case "eip-1559-pricing":
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto bg-bg border border-border rounded-xl">
            <text x="400" y="35" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-mono)" fontSize="11" letterSpacing="0.05em">EIP-1559 TRANSACTION FEE DYNAMICS</text>
            
            {/* Core Box */}
            <rect x="60" y="70" width="680" height="180" rx="10" fill="var(--dg-card)" stroke="var(--dg-border)" strokeWidth="1" />

            {/* Fee Formula */}
            <text x="400" y="110" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="16" fontWeight="bold">
              Total Gas Fee = (Base Fee + Priority Fee) &times; Gas Used
            </text>

            <line x1="100" y1="135" x2="700" y2="135" stroke="var(--dg-border)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Base Fee (Left) */}
            <g transform="translate(100, 155)">
              <rect width="260" height="70" rx="6" fill="var(--dg-card2)" stroke="var(--dg-danger)" strokeWidth="1" />
              <text x="130" y="25" textAnchor="middle" fill="var(--dg-danger)" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">🔥 Base Fee</text>
              <text x="130" y="45" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="10">Set by protocol &bull; Automatically Burned</text>
              <text x="130" y="60" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-sans)" fontSize="9">Fluctuates based on block fullness</text>
            </g>

            {/* Priority Fee (Right) */}
            <g transform="translate(440, 155)">
              <rect width="260" height="70" rx="6" fill="var(--dg-card2)" stroke="var(--dg-success)" strokeWidth="1" />
              <text x="130" y="25" textAnchor="middle" fill="var(--dg-success)" fontFamily="var(--font-geist-sans)" fontSize="12" fontWeight="bold">💰 Priority Fee (Tip)</text>
              <text x="130" y="45" textAnchor="middle" fill="var(--dg-text)" fontFamily="var(--font-geist-mono)" fontSize="10">Set by user &bull; Paid to Validator</text>
              <text x="130" y="60" textAnchor="middle" fill="var(--dg-text-dim)" fontFamily="var(--font-geist-sans)" fontSize="9">Used to skip transaction queue</text>
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
