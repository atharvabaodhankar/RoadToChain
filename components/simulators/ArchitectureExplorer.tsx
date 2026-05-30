"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, HelpCircle, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useProgress } from "@/app/context/ProgressContext";

type ComponentId = "auth" | "paymaster" | "index" | "storage" | "database" | "blockchain";

interface ExplorerComponent {
  id: ComponentId;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  problem: string;
  mistake: string;
  solution: string;
}

export default function ArchitectureExplorer() {
  const { trackSimulatorUsage } = useProgress();
  const [selected, setSelected] = useState<ComponentId | null>(null);

  useEffect(() => {
    trackSimulatorUsage("architecture");
  }, [trackSimulatorUsage]);

  const items: ExplorerComponent[] = [
    {
      id: "auth",
      label: "Privy SDK Auth",
      sub: "Google / Email / MetaMask",
      icon: <Cpu className="h-5 w-5" />,
      color: "#7c3aed",
      problem: "Traditional Web3 onboarding requires seed phrases, custom network setups, and installing extension wallets. 95% of normal users drop off before ever making a single transaction.",
      mistake: "Assuming your users are 'crypto-native' and expecting them to download MetaMask, add custom RPC settings, and safely store 12-word seed phrases on their first visit.",
      solution: "Privy SDK provisions an embedded EOA signer in the background using an HSM (Hardware Security Module) right after a standard Google or email social login. Mainstream UX with zero security compromise."
    },
    {
      id: "paymaster",
      label: "Pimlico Paymaster",
      sub: "ERC-4337 Gas Sponsorship",
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "#22c55e",
      problem: "Every social action (like, follow, post) costs gas on-chain. Users do not want to fund a wallet with testnet native tokens just to try a decentralized social app.",
      mistake: "Forcing users to request native faucet tokens immediately. Standard faucets also fail (revert) when sent directly to a deployed Smart Account contract because their gas limits are set to standard EOA values (~25k).",
      solution: "Pimlico ERC-4337 Verifying Paymaster completely sponsors gas fees for all social transactions. User operations are bundled gaslessly, while testnet native token faucets are routed only to their Privy EOA address to allow tipping."
    },
    {
      id: "index",
      label: "The Graph Protocol",
      sub: "GraphQL Indexed Event Cache",
      icon: <Database className="h-5 w-5" />,
      color: "#14b8a6",
      problem: "Direct RPC calls (like ethers.js contracts.getAllPosts()) hit network rate limits instantly and are extremely slow (O(n) latency), freezing feeds as the dataset grows.",
      mistake: "Querying blockchain RPC nodes directly to fetch and map dynamic social feeds, follower counts, or liked posts on every single page load.",
      solution: "The Graph indices all contract events (PostCreated, UserFollowed) in real time. The React client queries a GraphQL node instantly, achieving sub-second load times."
    },
    {
      id: "storage",
      label: "IPFS + Pinata",
      sub: "Immutability Vault",
      icon: <Cpu className="h-5 w-5" />,
      color: "#ec4899",
      problem: "Storing high-resolution image uploads or large text posts directly in Solidity contract storage is prohibitively expensive (hundreds of dollars per megabyte in gas).",
      mistake: "Trying to store raw social media uploads directly on-chain or relying on centralized storage servers (like AWS S3) which breaks decentralized ownership.",
      solution: "Compress files client-side, upload them permanently to IPFS via Pinata gateways, and store only the resulting 32-byte cryptographic CID hash reference on-chain."
    },
    {
      id: "database",
      label: "Firebase Firestore",
      sub: "Real-Time Metadata Engine",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "#f59e0b",
      problem: "Certain interactions (like real-time chat messages, notifications, or typing indicators) do not require blockchain consensus, and putting them on-chain is unscalably slow.",
      mistake: "Thinking a dApp must be 100% on-chain. Real decentralized social systems require hybrid storage to balance immutability with instant interactions.",
      solution: "Use Firebase Firestore to power real-time comments, direct chats, user search terms, and instant notifications, while keeping core state (posts, follows, profile identities) anchored to the blockchain."
    },
    {
      id: "blockchain",
      label: "Polygon Amoy",
      sub: "Smart Contracts Layer",
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "#3b82f6",
      problem: "A centralized backend can easily censor posts, alter usernames, delete account histories, or steal creator monetization revenues.",
      mistake: "Creating database schemas for user identities, post catalogs, or followers that can be manipulated by single platform administrators.",
      solution: "Anchor all identities (ProfileContract), social relations (SocialContract), and content catalogs (PostContract) on Polygon Amoy. Communities own their graphs forever; tips flow 100% peer-to-peer with zero platform cuts."
    }
  ];

  const currentItem = items.find(i => i.id === selected);

  return (
    <div className="my-10 w-full rounded-2xl border border-border bg-bg2 p-6 font-sans shadow-xl overflow-hidden relative">
      <div className="mb-6 flex flex-col gap-1 border-b border-border/60 pb-4">
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#a78bfa]">
          {"// DECENTRALIZED SYSTEMS PLAYGROUND"}
        </span>
        <h3 className="font-sans text-lg font-bold text-text">Socio3 V2 Distributed Architecture</h3>
        <p className="text-xs text-muted max-w-lg">
          Click any component node in the hybrid stack blueprint below to dissect its system design, failures, and production solutions.
        </p>
      </div>

      {/* Grid Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {items.map(item => {
          const isSelected = selected === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setSelected(item.id);
                trackSimulatorUsage("architecture");
              }}
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-start gap-4 p-4 rounded-xl border bg-bg/40 text-left transition-all duration-300 relative cursor-pointer group"
              style={{
                borderColor: isSelected ? item.color : "rgba(255, 255, 255, 0.08)",
                boxShadow: isSelected ? `0 0 15px ${item.color}25` : "none"
              }}
            >
              <div 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-text group-hover:scale-105 transition-transform"
                style={{ 
                  backgroundColor: `${item.color}15`, 
                  borderColor: `${item.color}30`,
                  color: item.color
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim block mb-0.5">
                  Node: {item.id.toUpperCase()}
                </span>
                <h4 className="font-sans text-xs font-bold text-text truncate group-hover:text-text2 transition-colors">
                  {item.label}
                </h4>
                <p className="text-[10px] text-muted truncate mt-0.5">
                  {item.sub}
                </p>
              </div>
              {/* Corner accent glow */}
              <div 
                className="absolute top-0 right-0 h-1.5 w-1.5 rounded-bl-lg transition-opacity duration-300 opacity-20 group-hover:opacity-100"
                style={{ backgroundColor: item.color }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Detail Overlay Drawer */}
      <AnimatePresence>
        {selected && currentItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div 
              className="rounded-xl border p-5 relative mt-4 bg-bg shadow-inner transition-all duration-300"
              style={{ borderColor: `${currentItem.color}40` }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 h-6 w-6 rounded-md border border-border flex items-center justify-center text-muted hover:text-text hover:bg-bg2 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span 
                  className="rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border"
                  style={{
                    color: currentItem.color,
                    borderColor: `${currentItem.color}30`,
                    backgroundColor: `${currentItem.color}10`
                  }}
                >
                  {currentItem.id.toUpperCase()} ANALYSIS
                </span>
                <h4 className="font-sans text-sm font-bold text-text">{currentItem.label}</h4>
              </div>

              {/* Autopsy Details */}
              <div className="space-y-4 text-xs">
                {/* Problem Section */}
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    <HelpCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      The Problem (Scaling Barrier)
                    </h5>
                    <p className="text-muted leading-relaxed">{currentItem.problem}</p>
                  </div>
                </div>

                {/* Mistake Section */}
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      The Naive Mistake
                    </h5>
                    <p className="text-muted leading-relaxed">{currentItem.mistake}</p>
                  </div>
                </div>

                {/* Solution Section */}
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] font-bold uppercase tracking-widest text-dim mb-1">
                      The Production Solution
                    </h5>
                    <p className="text-muted leading-relaxed">{currentItem.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
