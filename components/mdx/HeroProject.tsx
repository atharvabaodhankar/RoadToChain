import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface HeroProjectProps {
  name: string;
  track?: string;
  children: React.ReactNode;
}

export default function HeroProject({ name, track = "0", children }: HeroProjectProps) {
  // Detailed skills mapping matching our curriculum tracks
  const skillsMap: Record<string, string[]> = {
    "0": ["Node propagation", "P2P communication", "Block formation", "Gas fee mechanics"],
    "1": ["Gas packing optimizations", "Ownership modifier logic", "O(1) storage mappings", "Preventing block gas limit bugs"],
    "2": ["RPC request routing", "Server proxy security", "Redis invalidation TTLs", "GraphQL subgraph indexers"],
    "3": ["Event indexing systems", "Contract interaction limits", "Abuse and rate-limiting", "Distributed Web3 routing"],
    "4": ["Account abstraction bundles", "Paymaster gas abstraction", "Signatures and wallets", "Privy embedded authentication"],
    "5": ["Circom constraint system", "Groth16 proving keys", "On-chain proof validators", "Witness calculation math"],
    "6": ["Smart contract security audits", "Reentrancy checks-effects", "Signature replay security", "tx.origin authorization exploits"],
    "7": ["Emerging L2 Rollups", "System upgrades logic", "Multisig admin timelocks", "Cross-chain event hooks"],
  };

  const skills = skillsMap[track] || ["Cryptographic proof verification", "State machine assertions", "Gas computation optimization"];

  // Thumbnail SVG graphics representing the dynamic theme of each project
  const getThumbnailSvg = (t: string) => {
    switch (t) {
      case "0":
        return (
          <svg className="w-full h-full text-accent/80 opacity-90" viewBox="0 0 100 100" fill="none">
            <circle cx="20" cy="50" r="5" fill="currentColor" className="animate-pulse" />
            <circle cx="50" cy="20" r="5" fill="currentColor" />
            <circle cx="50" cy="80" r="5" fill="currentColor" />
            <circle cx="80" cy="50" r="5" fill="currentColor" />
            <line x1="20" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="20" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="50" y1="20" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="50" y1="80" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
            <circle r="3" fill="#8b5cf6">
              <animateMotion path="M 20 50 L 50 20 L 80 50 L 50 80 Z" dur="5s" repeatCount="indefinite" />
            </circle>
          </svg>
        );
      case "1":
        return (
          <svg className="w-full h-full text-blue-500/80 opacity-90" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="15" width="70" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="24" x2="45" y2="24" stroke="currentColor" strokeWidth="3" />
            <rect x="15" y="41" width="70" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="3" />
            <rect x="15" y="67" width="70" height="18" rx="2" stroke="#3b82f6" strokeWidth="1.8" className="animate-pulse" />
            <line x1="20" y1="76" x2="55" y2="76" stroke="#3b82f6" strokeWidth="3.5" />
          </svg>
        );
      case "2":
      case "3":
        return (
          <svg className="w-full h-full text-emerald-500/80 opacity-90" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="30" width="20" height="40" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="20" cy="50" r="3" fill="currentColor" />
            <rect x="40" y="30" width="20" height="40" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="3" fill="currentColor" className="animate-ping" />
            <rect x="70" y="30" width="20" height="40" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="80" cy="50" r="3" fill="currentColor" />
            <path d="M 30 45 Q 35 40 40 45" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 60 55 Q 65 60 70 55" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        );
      case "5":
        return (
          <svg className="w-full h-full text-purple-500/80 opacity-90" viewBox="0 0 100 100" fill="none">
            <path d="M 50 15 L 85 35 L 85 75 L 50 95 L 15 75 L 15 35 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M 50 30 L 70 42 L 70 65 L 50 78 L 30 65 L 30 42 Z" stroke="#8b5cf6" strokeWidth="2" className="animate-pulse" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        );
      default:
        return (
          <svg className="w-full h-full text-accent/80 opacity-80" viewBox="0 0 100 100" fill="none">
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 15 15 L 30 30 M 85 15 L 70 30 M 15 85 L 30 70 M 85 85 L 70 70" stroke="currentColor" strokeWidth="1" />
          </svg>
        );
    }
  };

  const getTrackName = (t: string) => {
    switch (t) {
      case "0": return "Track 0 Foundations";
      case "1": return "Track 1 Solidity";
      case "2": return "Track 2 Full Stack";
      case "3": return "Track 3 Architecture";
      case "4": return "Track 4 Account Abstraction";
      case "5": return "Track 5 Zero Knowledge";
      case "6": return "Track 6 Smart Contract Security";
      case "7": return "Track 7 System Design";
      default: return `Track ${t}`;
    }
  };

  const getTrackLink = (t: string) => {
    return `/learn/track-${t}`;
  };

  const trackName = getTrackName(track);
  const trackLink = getTrackLink(track);

  return (
    <div className="not-prose my-12 border border-border/85 bg-bg2/40 dark:bg-bg3/5 rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/60">
      
      {/* Left: Metadata & Skill checklist */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-widest block mb-2 select-none">
            {"// Project Connection"}
          </span>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-text tracking-tight mb-3">
            {name}
          </h3>
          
          <div className="text-[13px] leading-relaxed text-muted mb-6">
            {children}
          </div>

          <div className="space-y-2 mb-6">
            <span className="font-mono text-[9px] font-bold text-dim uppercase tracking-wider block select-none">
              Skills you&apos;ll practice:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-start gap-1.5 text-[12px] text-text/90">
                  <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] font-bold text-dim uppercase tracking-wider block select-none">
              Related Course Track
            </span>
            <Link 
              href={trackLink}
              className="text-[11px] font-semibold text-accent hover:underline"
            >
              {trackName}
            </Link>
          </div>

          <Link
            href={trackLink}
            className="inline-flex items-center gap-1.5 rounded-lg bg-text text-bg px-3.5 py-1.5 font-mono text-[11px] uppercase font-bold hover:bg-muted transition-colors shadow-sm cursor-pointer"
          >
            <span>View Project</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Right: Graphic thumbnail */}
      <div className="w-full md:w-[240px] shrink-0 bg-bg3/60 dark:bg-[#070709] border-t md:border-t-0 flex items-center justify-center p-6 sm:p-8 select-none">
        <div className="w-36 h-36 border border-border/40 bg-bg dark:bg-bg2/40 rounded-xl overflow-hidden flex items-center justify-center shadow-inner relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent pointer-events-none" />
          {getThumbnailSvg(track)}
        </div>
      </div>

    </div>
  );
}
