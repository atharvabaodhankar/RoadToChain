"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Copy, Check, AlertCircle, FileCode2, Terminal } from "lucide-react";

// GitHub logo as inline SVG
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
  solidity: "#363636",
  python: "#3572a5",
  rust: "#dea584",
  go: "#00add8",
};

// Very basic token colorizer
function colorizeCode(line: string, lang: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (!["typescript", "javascript", "solidity", "ts", "js", "sol"].includes(lang.toLowerCase())) {
    return `<span style="color:#c9d1d9">${escape(line)}</span>`;
  }

  let result = escape(line);
  // strings first (before keywords)
  result = result.replace(/(["'`])(.*?)\1/g, '<span style="color:#a5d6ff">$1$2$1</span>');
  // comments
  result = result.replace(/(\/\/.*$)/g, '<span style="color:#8b949e;font-style:italic">$1</span>');
  // keywords
  result = result.replace(
    /\b(function|const|let|var|return|if|else|for|while|import|export|from|default|class|interface|type|enum|new|this|async|await|try|catch|finally|public|private|protected|override|pragma|contract|mapping|address|uint|bytes|bool|memory|storage|calldata|emit|event|modifier|require|payable|external|internal|pure|view|virtual|struct|constructor)\b/g,
    '<span style="color:#ff7b72">$1</span>'
  );
  // numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#79c0ff">$1</span>');
  // function calls
  result = result.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color:#d2a8ff">$1</span>');
  // PascalCase identifiers (types/classes)
  result = result.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b/g, '<span style="color:#ffa657">$1</span>');

  return result;
}

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
  const langColor = LANG_COLORS[displayLang.toLowerCase()] || "#6366f1";

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        margin: "1.75rem 0",
        borderRadius: "0.75rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0d1117",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
      }}>
        {/* titlebar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 1rem", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <span key={c} style={{ display: "block", height: "0.625rem", width: "0.625rem", borderRadius: "9999px", background: c, opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ flex: 1, height: "0.6rem", borderRadius: "0.25rem", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        {/* shimmer bar */}
        <div style={{ height: "2px", background: "rgba(99,102,241,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,transparent,#6366f1,#8b5cf6,transparent)", backgroundSize: "300% 100%", animation: "slide 1.8s ease-in-out infinite" }} />
        </div>
        {/* skeleton lines */}
        <div style={{ display: "flex", padding: "0.875rem 0" }}>
          <div style={{ width: "3rem", flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.04)" }} />
          <div style={{ flex: 1, padding: "0 1.25rem" }}>
            {[75,55,90,40,70,85,50].map((w,i) => (
              <div key={i} style={{ width: `${w}%`, height: "0.625rem", borderRadius: "0.25rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.5rem", animationDelay: `${i*80}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div style={{ margin: "1.75rem 0", borderRadius: "0.75rem", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(10,5,5,0.95)", overflow: "hidden", fontFamily: "system-ui,sans-serif" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1.25rem 1.5rem" }}>
          <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#f85149", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#f85149", marginBottom: "0.25rem" }}>
              Failed to load <code style={{ fontFamily: "ui-monospace,Consolas,monospace" }}>{file}</code> from <strong>{repo}</strong>
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(248,81,73,0.6)", fontFamily: "ui-monospace,Consolas,monospace" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const codeLines = data.content.split("\n");
  const startLine = data.lineRange?.start || 1;
  const repoPath = data.repoUrl.replace("https://github.com/", "");

  return (
    <div style={{
      margin: "1.75rem 0",
      borderRadius: "0.75rem",
      border: "1px solid rgba(255,255,255,0.08)",
      background: "#0d1117",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
      transition: "border-color 0.3s, box-shadow 0.3s",
      fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace",
    }}>

      {/* ── Titlebar (macOS style) ──────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 1rem", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => (
            <span key={c} style={{ display: "block", height: "0.625rem", width: "0.625rem", borderRadius: "9999px", background: c, opacity: 0.85 }} />
          ))}
        </div>

        {/* Filename */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flex: 1, minWidth: 0 }}>
          <FileCode2 style={{ height: "0.8rem", width: "0.8rem", color: "#6366f1", flexShrink: 0 }} />
          <span style={{ fontSize: "0.72rem", color: "#c9d1d9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.filename}</span>
          {data.lineRange && (
            <span style={{ fontSize: "0.58rem", color: "#a5b4fc", background: "rgba(99,102,241,0.12)", padding: "0.1rem 0.45rem", borderRadius: "999px", border: "1px solid rgba(99,102,241,0.2)", flexShrink: 0 }}>
              L{data.lineRange.start}–{data.lineRange.end}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.45rem", borderRadius: "999px", border: `1px solid ${langColor}40`, color: langColor, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            {displayLang}
          </span>
          <button
            onClick={handleCopy}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6rem", color: copied ? "#3fb950" : "#8b949e", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.3rem", padding: "0.2rem 0.5rem", cursor: "pointer" }}
            title="Copy code"
          >
            {copied ? <><Check style={{ height: "0.65rem", width: "0.65rem" }} /> Copied!</> : <><Copy style={{ height: "0.65rem", width: "0.65rem" }} /> Copy</>}
          </button>
          <a
            href={data.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", color: "#8b949e", padding: "0.25rem", borderRadius: "0.25rem", textDecoration: "none" }}
            title="View on GitHub"
          >
            <ExternalLink style={{ height: "0.75rem", width: "0.75rem" }} />
          </a>
        </div>
      </div>

      {/* ── Gradient accent separator ───────────────────────────────── */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)" }} />

      {/* ── Code table ─────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", maxHeight: "520px", overflowY: "auto", background: "#0d1117" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {codeLines.map((line, idx) => (
              <tr key={idx} style={{ transition: "background 0.1s" }}>
                <td style={{
                  padding: "0.05rem 1rem 0.05rem 1.25rem",
                  textAlign: "right",
                  fontSize: "0.65rem",
                  color: "rgba(139,148,158,0.4)",
                  userSelect: "none",
                  width: "1%",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                  background: "rgba(0,0,0,0.15)",
                }}>
                  {startLine + idx}
                </td>
                <td
                  style={{ padding: "0.05rem 1.25rem 0.05rem 1rem", whiteSpace: "pre", fontSize: "0.72rem", lineHeight: "1.7", verticalAlign: "top" }}
                  dangerouslySetInnerHTML={{ __html: colorizeCode(line || " ", displayLang) }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Statusbar ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.375rem 1rem", background: "#161b22", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <GithubIcon className="h-2.5 w-2.5 text-gray-500" />
          <span style={{ fontSize: "0.58rem", color: "#8b949e" }}>{repoPath}/{file}</span>
          <span style={{ color: "rgba(139,148,158,0.3)", fontSize: "0.6rem" }}>·</span>
          <Terminal style={{ height: "0.65rem", width: "0.65rem", color: "#8b949e" }} />
          <span style={{ fontSize: "0.58rem", color: "#8b949e" }}>
            {data.lineRange
              ? `Lines ${data.lineRange.start}–${data.lineRange.end} of ${data.totalLines}`
              : `${data.totalLines} lines`}
          </span>
        </div>
        {/* Live ping dot */}
        <span style={{ position: "relative", display: "flex", height: "0.5rem", width: "0.5rem" }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "9999px", background: "#3fb950", opacity: 0.35, animation: "ping 2s ease-in-out infinite" }} />
          <span style={{ position: "relative", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", background: "#3fb950" }} />
        </span>
      </div>
    </div>
  );
}
