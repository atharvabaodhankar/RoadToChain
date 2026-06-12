"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Star, GitFork, RefreshCw, AlertCircle, BookOpen, Zap } from "lucide-react";

// GitHub logo as inline SVG
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

interface LiveProjectExampleProps {
  repo: string;
  owner?: string;
  section?: string;
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

// ── Inline-style constants (avoids <style> injection that breaks RSC bundling) ──
const S = {
  root: {
    margin: "1.5rem 0",
    borderRadius: "0.875rem",
    border: "1px solid rgba(99,102,241,0.2)",
    background: "linear-gradient(135deg, rgba(15,15,25,0.98) 0%, rgba(20,20,38,0.98) 100%)",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: "border-color 0.3s, box-shadow 0.3s",
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "linear-gradient(90deg, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.05) 100%)",
  } as React.CSSProperties,
  headerLeft: { display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 } as React.CSSProperties,
  githubIcon: { height: "1rem", width: "1rem", color: "#e2e8f0", flexShrink: 0 } as React.CSSProperties,
  repoLink: {
    fontFamily: "ui-monospace,'SF Mono',Consolas,monospace",
    fontSize: "0.7rem",
    color: "#a5b4fc",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "14rem",
    transition: "color 0.2s",
  } as React.CSSProperties,
  sectionBadge: {
    fontFamily: "ui-monospace,'SF Mono',Consolas,monospace",
    fontSize: "0.6rem",
    color: "#a5b4fc",
    background: "rgba(99,102,241,0.12)",
    padding: "0.2rem 0.5rem",
    borderRadius: "999px",
    border: "1px solid rgba(99,102,241,0.25)",
    flexShrink: 0,
  } as React.CSSProperties,
  headerRight: { display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 } as React.CSSProperties,
  stat: { display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.65rem", color: "#94a3b8" } as React.CSSProperties,
  gradBar: { height: "2px", background: "linear-gradient(90deg, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent)" } as React.CSSProperties,
  liveBar: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(16,185,129,0.04)" } as React.CSSProperties,
  pingWrap: { position: "relative", display: "flex", height: "0.5rem", width: "0.5rem", flexShrink: 0 } as React.CSSProperties,
  pingPulse: { position: "absolute", inset: 0, borderRadius: "9999px", background: "#34d399", opacity: 0.4, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" } as React.CSSProperties,
  pingCore: { position: "relative", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", background: "#10b981" } as React.CSSProperties,
  liveLabel: { fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.6rem", color: "#34d399", letterSpacing: "0.05em", textTransform: "uppercase" as const, fontWeight: 600 },
  liveUpdated: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.6rem", color: "#64748b" } as React.CSSProperties,
  langBar: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" } as React.CSSProperties,
  langDot: { height: "0.5rem", width: "0.5rem", borderRadius: "9999px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 } as React.CSSProperties,
  langText: { fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.6rem", color: "#475569" } as React.CSSProperties,
  expandBar: { display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "linear-gradient(to bottom,rgba(20,20,35,0),rgba(99,102,241,0.04))" } as React.CSSProperties,
  expandBtn: { fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.65rem", color: "#6366f1", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" } as React.CSSProperties,
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" } as React.CSSProperties,
  footerLeft: { display: "flex", alignItems: "center", gap: "0.5rem" } as React.CSSProperties,
  footerText: { fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.6rem", color: "#475569" } as React.CSSProperties,
  viewLink: { fontFamily: "ui-monospace,'SF Mono',Consolas,monospace", fontSize: "0.65rem", color: "#6366f1", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" } as React.CSSProperties,
};

function renderMarkdown(md: string): string {
  return md
    .replace(/^#### (.*$)/gm, '<h6 style="font-size:0.7rem;font-weight:600;color:#94a3b8;margin:1rem 0 0.375rem;text-transform:uppercase;letter-spacing:0.05em">$1</h6>')
    .replace(/^### (.*$)/gm, '<h5 style="font-size:0.8rem;font-weight:600;color:#cbd5e1;margin:1.25rem 0 0.5rem">$1</h5>')
    .replace(/^## (.*$)/gm, '<h4 style="font-size:0.9rem;font-weight:700;color:#e2e8f0;margin:1.5rem 0 0.625rem;padding-bottom:0.375rem;border-bottom:1px solid rgba(99,102,241,0.15)">$1</h4>')
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code style="font-family:ui-monospace,Consolas,monospace;font-size:0.7rem;color:#a5b4fc;background:rgba(99,102,241,0.1);padding:0.1rem 0.4rem;border-radius:0.25rem;border:1px solid rgba(99,102,241,0.2)">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px">$1</a>')
    .replace(/^[-*] (.*$)/gm, '<li style="font-size:0.8rem;color:rgba(203,213,225,0.85);line-height:1.65;margin-left:1.25rem;list-style:disc">$1</li>')
    .replace(/^> (.*$)/gm, '<blockquote style="border-left:3px solid rgba(99,102,241,0.4);margin:0.75rem 0;padding:0.5rem 1rem;background:rgba(99,102,241,0.05);border-radius:0 0.375rem 0.375rem 0;font-size:0.78rem;color:#94a3b8;font-style:italic">$1</blockquote>')
    .replace(/\|(.+)\|/gm, (match) => {
      const cells = match.split("|").filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return "";
      const isHeader = cells.some(c => c.includes("**"));
      const tag = isHeader ? "th" : "td";
      const cellStyle = isHeader
        ? 'style="padding:0.4rem 0.875rem;font-size:0.65rem;font-weight:700;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.05em;background:rgba(99,102,241,0.08);border:1px solid rgba(255,255,255,0.06)"'
        : 'style="padding:0.375rem 0.875rem;font-size:0.7rem;color:rgba(203,213,225,0.8);border:1px solid rgba(255,255,255,0.06);font-family:ui-monospace,Consolas,monospace"';
      const row = cells.map(c => `<${tag} ${cellStyle}>${c.trim()}</${tag}>`).join("");
      return `<tr>${row}</tr>`;
    })
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="margin:0.875rem 0;padding:1rem 1.25rem;border-radius:0.5rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.06);overflow-x:auto;font-family:ui-monospace,Consolas,monospace;font-size:0.7rem;color:#94a3b8;line-height:1.6"><code>$2</code></pre>')
    .replace(/^(?!<[hlutdpb]|<li|<code|<pre|<tr|<a|<strong|<em|<blockquote)(.+)$/gm, '<p style="font-size:0.8rem;color:rgba(203,213,225,0.85);line-height:1.7;margin:0.5rem 0">$1</p>')
    .replace(/<p[^>]*>\s*<\/p>/g, "");
}

import React from "react";

export default function LiveProjectExample({
  repo,
  owner,
  section,
  showMetadata = true,
}: LiveProjectExampleProps) {
  const [data, setData] = useState<ReadmeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

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

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={S.root}>
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={{ height: "1rem", width: "1rem", borderRadius: "9999px", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ width: "8rem", height: "0.625rem", borderRadius: "0.25rem", background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div style={{ width: "5rem", height: "0.625rem", borderRadius: "0.25rem", background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ height: "2px", background: "rgba(99,102,241,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,transparent,#6366f1,#8b5cf6,transparent)", backgroundSize: "300% 100%", animation: "slide 1.8s ease-in-out infinite" }} />
        </div>
        <div style={{ padding: "1.25rem 1.5rem" }}>
          {[80,100,65,90,55].map((w, i) => (
            <div key={i} style={{ width: `${w}%`, height: "0.625rem", borderRadius: "0.25rem", background: "rgba(255,255,255,0.05)", marginBottom: "0.5rem", animationDelay: `${i*100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div style={{ ...S.root, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem 1.25rem" }}>
          <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#f87171", flexShrink: 0, marginTop: "0.125rem" }} />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f87171", marginBottom: "0.25rem" }}>
              Failed to load live content from <strong>{repo}</strong>
            </p>
            <p style={{ fontFamily: "ui-monospace,Consolas,monospace", fontSize: "0.65rem", color: "rgba(248,113,113,0.65)" }}>
              {error || "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const htmlContent = renderMarkdown(data.content);
  const repoPath = data.repoUrl.replace("https://github.com/", "");

  return (
    <div style={S.root}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <GithubIcon className="h-4 w-4 text-slate-200 shrink-0" />
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" style={S.repoLink}>
            {repoPath}
          </a>
          {section && data.sectionFound && (
            <span style={S.sectionBadge}>§ {section}</span>
          )}
        </div>
        <div style={S.headerRight}>
          {showMetadata && (
            <>
              <span style={S.stat}>
                <Star style={{ height: "0.7rem", width: "0.7rem", color: "#fbbf24" }} />
                {data.stars.toLocaleString()}
              </span>
              <span style={S.stat}>
                <GitFork style={{ height: "0.7rem", width: "0.7rem" }} />
                {data.forks.toLocaleString()}
              </span>
            </>
          )}
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", display: "flex", alignItems: "center", textDecoration: "none" }} title="Open on GitHub">
            <ExternalLink style={{ height: "0.875rem", width: "0.875rem" }} />
          </a>
        </div>
      </div>

      {/* ── Gradient bar ───────────────────────────────────────────── */}
      <div style={S.gradBar} />

      {/* ── Live indicator ─────────────────────────────────────────── */}
      <div style={S.liveBar}>
        <span style={S.pingWrap}>
          <span style={S.pingPulse} />
          <span style={S.pingCore} />
        </span>
        <span style={S.liveLabel}>Live from production repository</span>
        <span style={S.liveUpdated}>
          <RefreshCw style={{ height: "0.625rem", width: "0.625rem" }} />
          Updated {data.lastUpdatedHuman}
        </span>
      </div>

      {/* ── Language bar ───────────────────────────────────────────── */}
      <div style={S.langBar}>
        <span style={S.langDot} />
        <span style={S.langText}>{data.language}</span>
        {data.description && (
          <span style={{ ...S.langText, marginLeft: "auto", maxWidth: "22rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {data.description.length > 70 ? data.description.slice(0, 70) + "…" : data.description}
          </span>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div
        style={{ padding: "1.25rem 1.5rem", overflowY: "auto", maxHeight: expanded ? "none" : "480px" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* ── Expand button ──────────────────────────────────────────── */}
      <div style={S.expandBar}>
        <button onClick={() => setExpanded(!expanded)} style={S.expandBtn}>
          <BookOpen style={{ height: "0.7rem", width: "0.7rem" }} />
          {expanded ? "Collapse content" : "Show full content"}
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={S.footer}>
        <div style={S.footerLeft}>
          <Zap style={{ height: "0.75rem", width: "0.75rem", color: "#475569" }} />
          <span style={S.footerText}>Fetched from GitHub API · cached 6h</span>
        </div>
        <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" style={S.viewLink}>
          View full repository <ExternalLink style={{ height: "0.7rem", width: "0.7rem" }} />
        </a>
      </div>
    </div>
  );
}
