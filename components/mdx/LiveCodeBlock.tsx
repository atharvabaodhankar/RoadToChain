"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Copy, Check, AlertCircle, FileCode2 } from "lucide-react";

// GitHub logo as inline SVG — lucide-react barrel optimization doesn't export "Github"
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

interface LiveCodeBlockProps {
  /** Repository name (e.g., "ChainCure") */
  repo: string;
  /** File path within the repo (e.g., "contracts/ChainCure.sol") */
  file: string;
  /** Optional line range — e.g., "45-67" */
  lines?: string;
  /** Override language detection */
  language?: string;
  /** GitHub owner — defaults to atharvabaodhankar */
  owner?: string;
}

interface FileData {
  content: string;
  filename: string;
  language: string;
  lineRange: { start: number; end: number } | null;
  totalLines: number;
  repoUrl: string;
  fileUrl: string;
  repo: string;
  fetchedAt: string;
}

/**
 * LiveCodeBlock — Fetches and displays a specific file (or line range)
 * from a real GitHub repository.
 *
 * Usage in MDX:
 *   <LiveCodeBlock repo="ChainCure" file="contracts/ChainCure.sol" lines="156-180" />
 *   <LiveCodeBlock repo="erc4337-kit" file="src/index.ts" language="typescript" />
 */
export default function LiveCodeBlock({
  repo,
  file,
  lines,
  language: langOverride,
  owner,
}: LiveCodeBlockProps) {
  const [data, setData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ repo, path: file });
        if (owner) params.set("owner", owner);
        if (lines) params.set("lines", lines);

        const res = await fetch(`/api/github/file?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const json: FileData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchFile();
  }, [repo, file, lines, owner]);

  const handleCopy = useCallback(() => {
    if (!data) return;
    navigator.clipboard.writeText(data.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  const displayLang = langOverride || data?.language || "text";

  // ── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="my-6 rounded-xl border border-border/60 bg-bg2/30 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-bg2/50">
          <div className="h-3.5 w-3.5 rounded bg-border/40 animate-pulse" />
          <div className="h-3 w-40 rounded bg-border/30 animate-pulse" />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-3 rounded bg-border/15 animate-pulse"
              style={{ width: `${60 + Math.random() * 35}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
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
            Failed to load {file} from {repo}
          </p>
          <p className="font-mono text-[11px] text-red-400/70">{error}</p>
        </div>
      </div>
    );
  }

  // Build line numbers
  const codeLines = data.content.split("\n");
  const startLine = data.lineRange?.start || 1;

  return (
    <div className="my-6 rounded-xl border border-border/60 bg-[#0d1117] overflow-hidden transition-all duration-300 hover:border-accent/30 group">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-[#161b22]">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="h-3.5 w-3.5 text-muted shrink-0" />
          <span className="font-mono text-[11px] text-text/80 truncate">
            {data.filename}
          </span>
          {data.lineRange && (
            <span className="font-mono text-[9px] text-accent/70 bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10 shrink-0">
              L{data.lineRange.start}–{data.lineRange.end}
            </span>
          )}
          <span className="font-mono text-[9px] text-dim px-1.5 py-0.5 rounded bg-bg3/30 border border-border/20 shrink-0 uppercase">
            {displayLang}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 font-mono text-[10px] text-muted hover:text-text transition-colors px-2 py-1 rounded hover:bg-white/5"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </button>
          <a
            href={data.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            title="View on GitHub"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* ── Code Content ──────────────────────────────────────────── */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line, idx) => (
              <tr
                key={idx}
                className="hover:bg-white/[0.03] transition-colors"
              >
                <td className="sticky left-0 bg-[#0d1117] px-3 py-0 text-right font-mono text-[10px] text-dim/50 select-none w-[1%] whitespace-nowrap border-r border-border/10">
                  {startLine + idx}
                </td>
                <td className="px-4 py-0 whitespace-pre font-mono text-[12px] leading-[1.6] text-[#c9d1d9]">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-border/20 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <GithubIcon className="h-3 w-3 text-muted" />
          <span className="font-mono text-[9px] text-dim">
            {data.repo}/{file}
            {data.lineRange
              ? ` • Lines ${data.lineRange.start}–${data.lineRange.end} of ${data.totalLines}`
              : ` • ${data.totalLines} lines`}
          </span>
        </div>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      </div>
    </div>
  );
}
