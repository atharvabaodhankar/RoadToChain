"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Star, GitFork, RefreshCw, AlertCircle } from "lucide-react";

// GitHub logo as inline SVG — lucide-react doesn't export "Github" reliably
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

interface LiveProjectExampleProps {
  /** Repository name (e.g., "ZKredential", "ChainCure") */
  repo: string;
  /** GitHub owner — defaults to atharvabaodhankar */
  owner?: string;
  /** Specific README section to extract (e.g., "Architecture", "System Architecture") */
  section?: string;
  /** Show stars, forks, last updated metadata */
  showMetadata?: boolean;
}

interface ReadmeData {
  content: string;
  section: string | null;
  sectionFound: boolean | null;
  repo: string;
  description: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  lastUpdatedHuman: string;
  repoUrl: string;
  language: string;
  fetchedAt: string;
}

/**
 * LiveProjectExample — Renders live README content from Atharva's actual repos.
 * 
 * Usage in MDX:
 *   <LiveProjectExample repo="ZKredential" section="Architecture" />
 *   <LiveProjectExample repo="Socio3" section="System Architecture" showMetadata />
 */
export default function LiveProjectExample({
  repo,
  owner,
  section,
  showMetadata = true,
}: LiveProjectExampleProps) {
  const [data, setData] = useState<ReadmeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadme() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ repo });
        if (owner) params.set("owner", owner);
        if (section) params.set("section", section);

        const res = await fetch(`/api/github/readme?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const json: ReadmeData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
  }, [repo, owner, section]);

  // ── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="my-6 rounded-xl border border-border/60 bg-bg2/30 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-bg2/50">
          <div className="h-4 w-4 rounded-full bg-border/40 animate-pulse" />
          <div className="h-3 w-32 rounded bg-border/30 animate-pulse" />
          <div className="ml-auto h-3 w-20 rounded bg-border/30 animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          <div className="h-3 w-3/4 rounded bg-border/20 animate-pulse" />
          <div className="h-3 w-full rounded bg-border/20 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-border/20 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-border/20 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="my-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-400">
            Failed to load live content from {repo}
          </p>
          <p className="font-mono text-[11px] text-red-400/70">
            {error || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // ── Simple markdown renderer ───────────────────────────────────────────
  // Converts basic markdown to HTML for inline rendering
  function renderMarkdown(md: string): string {
    return md
      // Headers (reduce to smaller sizes since we're nested)
      .replace(/^#### (.*$)/gm, '<h6 class="text-xs font-bold text-text mt-4 mb-1.5 font-sans">$1</h6>')
      .replace(/^### (.*$)/gm, '<h5 class="text-sm font-bold text-text mt-5 mb-2 font-sans">$1</h5>')
      .replace(/^## (.*$)/gm, '<h4 class="text-base font-bold text-text mt-6 mb-2 font-sans">$1</h4>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="font-mono text-[11px] text-accent bg-bg2 px-1.5 py-0.5 rounded border border-border/60">$1</code>'
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-accent2 underline underline-offset-2 transition-colors">$1</a>'
      )
      // Bullet lists
      .replace(
        /^[-*] (.*$)/gm,
        '<li class="text-xs text-text/85 leading-relaxed ml-4 list-disc">$1</li>'
      )
      // Tables — basic support
      .replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split("|").filter((c) => c.trim());
        if (cells.every((c) => /^[\s-:]+$/.test(c))) return ""; // separator row
        const isHeader = cells.some((c) => c.includes("**"));
        const tag = isHeader ? "th" : "td";
        const cellClass = isHeader
          ? 'class="px-3 py-1.5 text-[10px] font-bold text-text uppercase tracking-wider bg-bg2/50 border border-border/30"'
          : 'class="px-3 py-1.5 text-[11px] text-text/80 border border-border/30 font-mono"';
        const row = cells
          .map((c) => `<${tag} ${cellClass}>${c.trim()}</${tag}>`)
          .join("");
        return `<tr>${row}</tr>`;
      })
      // Code blocks (simplified — wrap in pre)
      .replace(
        /```(\w*)\n([\s\S]*?)```/g,
        '<pre class="my-3 p-3 rounded-lg bg-bg/80 border border-border/40 overflow-x-auto font-mono text-[11px] text-text/80 leading-relaxed"><code>$2</code></pre>'
      )
      // Paragraphs (wrap remaining bare lines)
      .replace(
        /^(?!<[hlutdp]|<li|<code|<pre|<tr|<a|<strong|<em)(.+)$/gm,
        '<p class="text-xs text-text/85 leading-relaxed my-1.5">$1</p>'
      )
      // Clean empty paragraphs
      .replace(/<p[^>]*>\s*<\/p>/g, "");
  }

  return (
    <div className="my-6 rounded-xl border border-border/60 bg-bg2/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent/30 group">
      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-bg2/40">
        <div className="flex items-center gap-2 min-w-0">
          <GithubIcon className="h-4 w-4 text-muted shrink-0" />
          <a
            href={data.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-muted hover:text-accent transition-colors truncate"
          >
            {data.repoUrl.replace("https://github.com/", "")}
          </a>
          {section && data.sectionFound && (
            <span className="font-mono text-[9px] text-accent bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10 shrink-0">
              § {section}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {showMetadata && (
            <>
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted">
                <Star className="h-3 w-3 text-amber-500/80" />
                {data.stars}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted">
                <GitFork className="h-3 w-3" />
                {data.forks}
              </span>
            </>
          )}
          <a
            href={data.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* ── Live Indicator ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border/20 bg-emerald-500/[0.03]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400">
          Live from production repository
        </span>
        <span className="font-mono text-[9px] text-muted ml-auto flex items-center gap-1">
          <RefreshCw className="h-2.5 w-2.5" />
          Updated {data.lastUpdatedHuman}
        </span>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 max-h-[500px] overflow-y-auto custom-scrollbar"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }}
      />

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 bg-bg2/30">
        <span className="font-mono text-[9px] text-dim">
          {data.language} • {data.description?.slice(0, 60)}
          {(data.description?.length || 0) > 60 ? "…" : ""}
        </span>
        <a
          href={data.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[9px] text-accent hover:text-accent2 transition-colors"
        >
          View full repository →
        </a>
      </div>
    </div>
  );
}
