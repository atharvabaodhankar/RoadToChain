"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Copy, Check, AlertCircle, FileCode2, Terminal } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

interface LiveCodeBlockProps {
  repo: string;
  file: string;
  lines?: string;
  language?: string;
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

const LANG_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f7df1e",
  solidity: "#7c3aed",
  python: "#3572a5",
  rust: "#dea584",
  go: "#00add8",
};

// Light-mode-friendly syntax highlighting — uses CSS classes rather than hardcoded colors
function colorizeCode(line: string, lang: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (!["typescript", "javascript", "solidity", "ts", "js", "sol"].includes(lang.toLowerCase())) {
    return `<span class="lcb-tok-plain">${escape(line)}</span>`;
  }

  let result = escape(line);
  // strings
  result = result.replace(/(["'`])(.*?)\1/g, '<span class="lcb-tok-str">$1$2$1</span>');
  // comments
  result = result.replace(/(\/\/.*$)/g, '<span class="lcb-tok-comment">$1</span>');
  // keywords
  result = result.replace(
    /\b(function|const|let|var|return|if|else|for|while|import|export|from|default|class|interface|type|enum|new|this|async|await|try|catch|finally|public|private|protected|override|pragma|contract|mapping|address|uint|bytes|bool|memory|storage|calldata|emit|event|modifier|require|payable|external|internal|pure|view|virtual|struct|constructor)\b/g,
    '<span class="lcb-tok-kw">$1</span>'
  );
  // numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="lcb-tok-num">$1</span>');
  // function calls
  result = result.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="lcb-tok-fn">$1</span>');
  // PascalCase (types/classes)
  result = result.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b/g, '<span class="lcb-tok-type">$1</span>');

  return result;
}

export default function LiveCodeBlock({ repo, file, lines, language: langOverride, owner }: LiveCodeBlockProps) {
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
        setData(await res.json());
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
  const langColor = LANG_COLORS[displayLang.toLowerCase()] || "#7c3aed";

  // ── Loading skeleton ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="lcb-root">
        <div className="lcb-titlebar">
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <span key={c} style={{ display: "block", height: "0.625rem", width: "0.625rem", borderRadius: "9999px", background: c, opacity: 0.85 }} />
            ))}
          </div>
          <div className="lcb-skeleton" style={{ flex: 1, height: "0.6rem" }} />
          <div className="lcb-skeleton" style={{ width: "3rem", height: "0.6rem" }} />
        </div>
        <div className="lcb-accent-bar" />
        <div className="lcb-code-wrap" style={{ padding: "0.875rem 0", minHeight: "8rem" }}>
          <div style={{ display: "flex" }}>
            <div className="lcb-lineno-cell" style={{ width: "3rem", padding: "0 1rem" }} />
            <div style={{ flex: 1, padding: "0 1.25rem" }}>
              {[75, 55, 90, 40, 70, 85, 50].map((w, i) => (
                <div key={i} className="lcb-skeleton" style={{ width: `${w}%`, height: "0.625rem", marginBottom: "0.5rem", animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="lcb-root" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1.25rem 1.5rem" }}>
          <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#ef4444", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Failed to load <code style={{ fontFamily: "ui-monospace,Consolas,monospace" }}>{file}</code> from <strong>{repo}</strong>
            </p>
            <p style={{ fontSize: "0.65rem", color: "#ef4444", opacity: 0.65, fontFamily: "ui-monospace,Consolas,monospace" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const codeLines = data.content.split("\n");
  const startLine = data.lineRange?.start || 1;
  const repoPath = data.repoUrl.replace("https://github.com/", "");

  return (
    <div className="lcb-root">
      {/* ── Titlebar ─────────────────────────────────────────────────── */}
      <div className="lcb-titlebar">
        {/* macOS traffic lights */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => (
            <span key={c} style={{ display: "block", height: "0.625rem", width: "0.625rem", borderRadius: "9999px", background: c, opacity: 0.85 }} />
          ))}
        </div>

        {/* Filename area */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flex: 1, minWidth: 0 }}>
          <FileCode2 style={{ height: "0.8rem", width: "0.8rem", color: langColor, flexShrink: 0 }} />
          <span className="lcb-filename-text">{data.filename}</span>
          {data.lineRange && (
            <span style={{ fontSize: "0.58rem", color: langColor, background: `${langColor}18`, padding: "0.1rem 0.45rem", borderRadius: "999px", border: `1px solid ${langColor}33`, flexShrink: 0 }}>
              L{data.lineRange.start}–{data.lineRange.end}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.45rem", borderRadius: "999px", border: `1px solid ${langColor}44`, color: langColor, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: "ui-monospace,Consolas,monospace" }}>
            {displayLang}
          </span>
          <button onClick={handleCopy} className={`lcb-copy-button${copied ? " copied" : ""}`} title="Copy code">
            {copied
              ? <><Check style={{ height: "0.65rem", width: "0.65rem" }} /> Copied!</>
              : <><Copy style={{ height: "0.65rem", width: "0.65rem" }} /> Copy</>}
          </button>
          <a href={data.fileUrl} target="_blank" rel="noopener noreferrer" className="lcb-open-btn" title="View on GitHub">
            <ExternalLink style={{ height: "0.75rem", width: "0.75rem" }} />
          </a>
        </div>
      </div>

      {/* ── Accent separator ─────────────────────────────────────────── */}
      <div className="lcb-accent-bar" />

      {/* ── Code table ───────────────────────────────────────────────── */}
      <div className="lcb-code-wrap">
        <table className="lcb-table">
          <tbody>
            {codeLines.map((line, idx) => (
              <tr key={idx} className="lcb-row">
                <td className="lcb-lineno-cell">{startLine + idx}</td>
                <td
                  className="lcb-code-cell"
                  dangerouslySetInnerHTML={{ __html: colorizeCode(line || " ", displayLang) }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Statusbar ────────────────────────────────────────────────── */}
      <div className="lcb-statusbar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <GithubIcon className="h-2.5 w-2.5" />
          <span>{repoPath}/{file}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <Terminal style={{ height: "0.65rem", width: "0.65rem" }} />
          <span>
            {data.lineRange
              ? `Lines ${data.lineRange.start}–${data.lineRange.end} of ${data.totalLines}`
              : `${data.totalLines} lines`}
          </span>
        </div>
        {/* Live ping dot */}
        <span style={{ position: "relative", display: "flex", height: "0.5rem", width: "0.5rem" }}>
          <span className="lcb-live-ping" />
          <span style={{ position: "relative", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", background: "#22c55e" }} />
        </span>
      </div>
    </div>
  );
}
