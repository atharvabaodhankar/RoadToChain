"use client";

import { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink, ShieldCheck, Network } from "lucide-react";

interface RepoStats {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  category: string;
  contracts: string[];
  mainnet: boolean;
  networkName: string;
  primaryLang: string;
}

const PRESET_REPOS: Record<string, Partial<RepoStats>> = {
  ZeroLeak: {
    category: "Security & ZK",
    contracts: ["TBD (Deployable)"],
    mainnet: false,
    networkName: "Sepolia",
    primaryLang: "Solidity",
  },
  Zkredential: {
    category: "Zero-Knowledge",
    contracts: [
      "0x11688F2cB72403Afe18b98Fb11103fCC2a3A9A3e",
      "0xC75798D7e9d1366bE7E5EC7dc8c402d71dC57001",
      "0x2cb799d38bfb786df012d44fa8c30d073c493ef0",
    ],
    mainnet: false,
    networkName: "Polygon Amoy",
    primaryLang: "Solidity / Circom",
  },
  ChainNotesV2: {
    category: "Production Web3 / AA",
    contracts: ["0x1Daaa7e5FCaBdEf7e7299109bcF71E676Dd2C297"],
    mainnet: false,
    networkName: "Polygon Amoy",
    primaryLang: "Solidity / TS",
  },
  "erc4337-kit": {
    category: "Infrastructure",
    contracts: ["0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 (EntryPoint)"],
    mainnet: false,
    networkName: "Multi-Chain",
    primaryLang: "TypeScript",
  },
  Socio3: {
    category: "Social Media DApp",
    contracts: [
      "0x5d5C1d313f580027204e04E8D4E3162f37A661CF",
      "0x314FBc86715eD6a8f07C775e775CD4E61CF903Df",
    ],
    mainnet: false,
    networkName: "Sepolia",
    primaryLang: "Solidity",
  },
  ChainElect: {
    category: "Voting System",
    contracts: ["Localhost / Configured"],
    mainnet: false,
    networkName: "Ethereum Devnet",
    primaryLang: "JavaScript",
  },
};

export default function GithubMetrics() {
  const [repos, setRepos] = useState<RepoStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("https://api.github.com/users/atharvabaodhankar/repos?per_page=100");
        if (!response.ok) throw new Error("Rate limit or fetch error");
        const data = await response.json();
        
        const mapped: RepoStats[] = Object.keys(PRESET_REPOS).map(name => {
          const apiRepo = (data as Array<{ name: string; description?: string; stargazers_count?: number; forks_count?: number; html_url?: string; language?: string }>).find(r => r.name.toLowerCase() === name.toLowerCase());
          const preset = PRESET_REPOS[name];
          return {
            name,
            description: apiRepo?.description || preset.category + " Project Hub",
            stars: apiRepo?.stargazers_count ?? 0,
            forks: apiRepo?.forks_count ?? 0,
            url: apiRepo?.html_url || `https://github.com/atharvabaodhankar/${name}`,
            category: preset.category || "Web3",
            contracts: preset.contracts || [],
            mainnet: preset.mainnet || false,
            networkName: preset.networkName || "Testnet",
            primaryLang: preset.primaryLang || apiRepo?.language || "Solidity",
          };
        });
        
        setRepos(mapped);
      } catch {
        // Fallback to static values if offline or rate-limited
        const fallback: RepoStats[] = Object.keys(PRESET_REPOS).map(name => {
          const preset = PRESET_REPOS[name];
          return {
            name,
            description: `Decentralized system codebase for ${name}. Includes custom smart contracts and front-end interface integrations.`,
            stars: name === "ZeroLeak" ? 3 : 0,
            forks: 0,
            url: `https://github.com/atharvabaodhankar/${name}`,
            category: preset.category || "Web3",
            contracts: preset.contracts || [],
            mainnet: preset.mainnet || false,
            networkName: preset.networkName || "Testnet",
            primaryLang: preset.primaryLang || "Solidity",
          };
        });
        setRepos(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="font-mono text-xs text-muted animate-pulse">Loading live portfolio index...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-text font-bold">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Live Portfolio Authenticity Registry
        </div>
        <div className="font-mono text-[9px] text-muted">
          Dynamic GitHub API Sync &bull; Verified Shipped Code
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map(repo => (
          <div 
            key={repo.name} 
            className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-bg2/30 backdrop-blur-md p-4 transition-all duration-300 hover:border-accent/50 hover:bg-bg2/60 hover:shadow-[0_4px_20px_rgba(124,58,237,0.05)]"
          >
            <div className="space-y-2.5">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-accent bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10">
                  {repo.category}
                </span>
                
                <span className="font-mono text-[9px] text-muted flex items-center gap-1">
                  <Network className="h-3 w-3" />
                  {repo.networkName}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="font-sans text-sm font-bold tracking-tight text-text group-hover:text-accent transition-colors flex items-center gap-1">
                  {repo.name}
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <ExternalLink className="h-3 w-3 text-muted hover:text-text" />
                  </a>
                </h4>
                <p className="text-[11px] leading-relaxed text-muted line-clamp-3">
                  {repo.description}
                </p>
              </div>
            </div>

            {/* Deployments & Tech Info */}
            <div className="mt-4 pt-3 border-t border-border/30 space-y-2">
              {repo.contracts && repo.contracts.length > 0 && (
                <div className="space-y-1">
                  <div className="font-mono text-[8px] text-dim uppercase tracking-wider">Contracts:</div>
                  <div className="space-y-0.5">
                    {repo.contracts.map((c, i) => (
                      <div key={i} className="font-mono text-[8.5px] text-muted truncate select-all" title={c}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Footer */}
              <div className="flex items-center justify-between font-mono text-[9px] text-muted pt-1">
                <span>{repo.primaryLang}</span>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500/20" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <GitFork className="h-3 w-3" /> {repo.forks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
