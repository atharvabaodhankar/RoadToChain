"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/context/ProgressContext";

type Phase = "write" | "compile" | "abi" | "bytecode" | "deploy" | "address";

interface PhaseData {
  id: Phase;
  label: string;
  icon: string;
  color: string;
  title: string;
  detail: string;
  artifact: {
    filename: string;
    content: string;
  };
}

const phases: PhaseData[] = [
  {
    id: "write",
    label: "Write",
    icon: "✏️",
    color: "#7c3aed",
    title: "Solidity source code",
    detail: "You write Solidity. This is human-readable. The EVM cannot execute this directly — it only understands bytecode. The compiler translates it.",
    artifact: {
      filename: "SimpleStorage.sol",
      content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueStored(
        address indexed setter,
        uint256 value
    );

    function store(uint256 _value) public {
        storedValue = _value;
        emit ValueStored(msg.sender, _value);
    }

    function retrieve() public view returns (uint256) {
        return storedValue;
    }
}`,
    },
  },
  {
    id: "compile",
    label: "Compile",
    icon: "⚙️",
    color: "#f59e0b",
    title: "Solc compiler runs",
    detail: "The Solidity compiler (solc) parses your code, checks types, optimizes, and produces two outputs: the ABI and the bytecode. This runs locally — nothing touches the blockchain yet.",
    artifact: {
      filename: "terminal",
      content: `$ npx hardhat compile

Compiling 1 file with Solc 0.8.20
Solc optimizer enabled: 200 runs

✓ SimpleStorage.sol

Artifacts written to: artifacts/
  ├── SimpleStorage.json      ← ABI + bytecode
  └── SimpleStorage.dbg.json  ← debug info

Compilation finished in 2.34s`,
    },
  },
  {
    id: "abi",
    label: "ABI",
    icon: "📋",
    color: "#3b82f6",
    title: "ABI — the translator",
    detail: "The Application Binary Interface defines every callable function and event. It's JSON. Your frontend, Hardhat scripts, and Etherscan all use it to encode function calls into hex payloads the EVM can read.",
    artifact: {
      filename: "SimpleStorage.abi.json",
      content: `[
  {
    "type": "function",
    "name": "store",
    "inputs": [{ "name": "_value", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "retrieve",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ValueStored",
    "inputs": [
      { "name": "setter", "type": "address", "indexed": true },
      { "name": "value", "type": "uint256", "indexed": false }
    ]
  }
]`,
    },
  },
  {
    id: "bytecode",
    label: "Bytecode",
    icon: "⬡",
    color: "#ec4899",
    title: "EVM bytecode — machine code",
    detail: "This is what the EVM actually executes. Every opcode is 1 byte. PUSH1 pushes 1 byte onto the stack. SSTORE writes to persistent storage. The constructor bytecode runs once on deployment, then is discarded.",
    artifact: {
      filename: "SimpleStorage.bytecode",
      content: `// Deployment bytecode (constructor + runtime)
0x608060405234801561001057600080fd5b506101a7806100206000396000f3fe
608060405234801561001057600080fd5b50600436106100365760003560e01c
80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075
57005b348015610065576000805160200…

// Decoded opcodes (first few):
PUSH1  0x80     // push 0x80 onto stack
PUSH1  0x40     // push 0x40 onto stack  
MSTORE          // memory[0x40] = 0x80 (free mem pointer)
CALLVALUE       // push msg.value
DUP1            // duplicate top of stack
ISZERO          // is it zero?
PUSH2  0x0010   // push jump destination
JUMPI           // conditional jump (revert if value > 0)
// ...

// Runtime bytecode size: 183 bytes
// Constructor bytecode: discarded after deployment`,
    },
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "🚀",
    color: "#f97316",
    title: "Deployment transaction",
    detail: "You send a transaction with NO 'to' address and the bytecode as 'data'. Every validator executes the constructor. Successful execution stores the runtime bytecode at a new address. This costs significant gas — the entire bytecode is processed.",
    artifact: {
      filename: "deploy.ts",
      content: `const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying from:", deployer.address);
  console.log("Balance:", await deployer.getBalance());

  const SimpleStorage = await hre.ethers.getContractFactory(
    "SimpleStorage"
  );

  // This sends a transaction with:
  // to:   null (creates a new contract)
  // data: bytecode + encoded constructor args
  const contract = await SimpleStorage.deploy();

  // Wait for 1 confirmation
  await contract.waitForDeployment();

  console.log(
    "Deployed to:",
    await contract.getAddress()
  );
}

main().catch(console.error);`,
    },
  },
  {
    id: "address",
    label: "Address",
    icon: "📍",
    color: "#22c55e",
    title: "Contract address — permanent",
    detail: "The address is deterministically derived from the deployer's address and their current nonce. It is permanent — the contract exists at this address on every node worldwide, forever. You can never change the bytecode at this address.",
    artifact: {
      filename: "terminal",
      content: `$ npx hardhat run scripts/deploy.ts --network sepolia

Deploying from: 0x1234...abcd
Balance: 0.85 ETH

Transaction hash:
  0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385

Block number: 5,921,047
Gas used: 147,391

✓ Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Verification:
  npx hardhat verify --network sepolia \\
    0x5FbDB2315678afecb367f032d93F642f64180aa3

Address derivation:
  keccak256(rlp([deployer, nonce]))[12:]
  = keccak256(rlp([0x1234...abcd, 47]))[12:]
  = 0x5FbDB2315678afecb367f032d93F642f64180aa3`,
    },
  },
];

export default function DeploymentSimulator() {
  const { trackSimulatorUsage } = useProgress();
  const [activePhase, setActivePhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    trackSimulatorUsage("deployment");
  }, [trackSimulatorUsage]);

  const current = phases[activePhase];

  const playThrough = () => {
    trackSimulatorUsage("deployment");
    setPlaying(true);
    setActivePhase(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= phases.length) {
        clearInterval(interval);
        setPlaying(false);
        return;
      }
      setActivePhase(i);
    }, 2200);
  };

  return (
    <div className="my-8 rounded-xl border border-border bg-[#0a0a0b] overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-bg2">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-500"
            style={{ backgroundColor: current.color }}
          />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Deployment Simulator
          </span>
        </div>
        <button
          onClick={playThrough}
          disabled={playing}
          className="text-[11px] border border-border rounded px-3 py-1 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-40"
        >
          {playing ? "Deploying..." : "▶ Auto deploy"}
        </button>
      </div>

      {/* Phase tabs */}
      <div className="flex items-stretch border-b border-border overflow-x-auto">
        {phases.map((phase, i) => (
          <button
            key={phase.id}
            onClick={() => { setActivePhase(i); setPlaying(false); }}
            className={`flex flex-col items-center gap-1 px-4 py-3 text-[10px] border-r border-border shrink-0 transition-all ${
              i === activePhase
                ? "text-text border-b-2"
                : i < activePhase
                ? "text-dim bg-bg2/30"
                : "text-dim hover:text-muted"
            }`}
            style={i === activePhase ? { borderBottomColor: phase.color } : {}}
          >
            <span className="text-base leading-none">{phase.icon}</span>
            <span className="font-semibold">{phase.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="p-5 space-y-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{current.icon}</span>
              <h3 className="text-sm font-bold text-text">{current.title}</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-xl">{current.detail}</p>
          </div>

          {/* Artifact */}
          <div className="rounded-lg bg-[#030304] border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] text-dim">{current.artifact.filename}</span>
              <span
                className="ml-auto text-[10px] px-2 py-0.5 rounded border font-semibold"
                style={{ color: current.color, borderColor: `${current.color}30`, backgroundColor: `${current.color}10` }}
              >
                {current.label.toUpperCase()}
              </span>
            </div>
            <pre className="p-4 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-72">
              <code>{current.artifact.content}</code>
            </pre>
          </div>

          {/* Progress + navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
              disabled={activePhase === 0}
              className="text-[11px] border border-border rounded px-3 py-1.5 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-30"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              {phases.map((p, i) => (
                <div
                  key={p.id}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === activePhase ? "20px" : "6px",
                    backgroundColor: i <= activePhase ? p.color : "#27272a",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setActivePhase(Math.min(phases.length - 1, activePhase + 1))}
              disabled={activePhase === phases.length - 1}
              className="text-[11px] border border-border rounded px-3 py-1.5 text-muted hover:text-text hover:border-border2 transition-all disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
