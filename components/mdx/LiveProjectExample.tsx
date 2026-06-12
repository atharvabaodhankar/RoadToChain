"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Star, GitFork, RefreshCw, AlertCircle, BookOpen, Zap } from "lucide-react";

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

// Markdown → HTML using plain tags so .lpe-content-body CSS classes apply
function renderMarkdown(md: string): string {
  return md
    .replace(/^#### (.*$)/gm, "<h6>$1</h6>")
    .replace(/^### (.*$)/gm, "<h5>$1</h5>")
    .replace(/^## (.*$)/gm, "<h4>$1</h4>")
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^[-*] (.*$)/gm, "<li>$1</li>")
    .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
    .replace(/\|(.+)\|/gm, (match) => {
      const cells = match.split("|").filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return "";
      const isHeader = cells.some(c => c.includes("**"));
      const tag = isHeader ? "th" : "td";
      return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join("")}</tr>`;
    })
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/^(?!<[hlutdpb]|<li|<code|<pre|<tr|<a|<strong|<em|<blockquote)(.+)$/gm, "<p>$1</p>")
    .replace(/<p[^>]*>\s*<\/p>/g, "");
}

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
        setData(await res.json());
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
      <div className="lpe-root">
        <div className="lpe-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="lpe-skeleton" style={{ height: "1rem", width: "1rem", borderRadius: "9999px" }} />
            <div className="lpe-skeleton" style={{ height: "0.625rem", width: "8rem" }} />
          </div>
          <div className="lpe-skeleton" style={{ height: "0.625rem", width: "5rem" }} />
        </div>
        <div className="lpe-content-body">
          {[80, 100, 65, 90, 55].map((w, i) => (
            <div key={i} className="lpe-skeleton" style={{ width: `${w}%`, height: "0.625rem", marginBottom: "0.5rem", animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="lpe-root" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem 1.25rem" }}>
          <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#ef4444", flexShrink: 0, marginTop: "0.125rem" }} />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Failed to load live content from <strong>{repo}</strong>
            </p>
            <p style={{ fontFamily: "ui-monospace,Consolas,monospace", fontSize: "0.65rem", color: "#ef4444", opacity: 0.65 }}>
              {error || "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const repoPath = data.repoUrl.replace("https://github.com/", "");

  return (
    <div className="lpe-root">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="lpe-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
          <GithubIcon className="h-4 w-4 shrink-0" />
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" className="lpe-repo-link">
            {repoPath}
          </a>
          {section && data.sectionFound && (
            <span className="lpe-section-badge">§ {section}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
          {showMetadata && (
            <>
              <span className="lpe-stat">
                <Star style={{ height: "0.7rem", width: "0.7rem", color: "#f59e0b" }} />
                {data.stars.toLocaleString()}
              </span>
              <span className="lpe-stat">
                <GitFork style={{ height: "0.7rem", width: "0.7rem" }} />
                {data.forks.toLocaleString()}
              </span>
            </>
          )}
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "var(--text-dim)" }} title="Open on GitHub">
            <ExternalLink style={{ height: "0.875rem", width: "0.875rem" }} />
          </a>
        </div>
      </div>

      {/* ── Live indicator ─────────────────────────────────────────── */}
      <div className="lpe-live-bar">
        <span style={{ position: "relative", display: "flex", height: "0.5rem", width: "0.5rem", flexShrink: 0 }}>
          <span className="lcb-live-ping" />
          <span style={{ position: "relative", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", background: "#22c55e" }} />
        </span>
        <span className="lpe-live-label">Live from production repository</span>
        <span className="lpe-live-updated">
          <RefreshCw style={{ height: "0.625rem", width: "0.625rem" }} />
          Updated {data.lastUpdatedHuman}
        </span>
      </div>

      {/* ── Language / description bar ──────────────────────────────── */}
      <div className="lpe-lang-bar">
        <span style={{ height: "0.5rem", width: "0.5rem", borderRadius: "9999px", background: "var(--accent)", flexShrink: 0, opacity: 0.7 }} />
        <span className="lpe-lang-text">{data.language}</span>
        {data.description && (
          <span className="lpe-lang-text" style={{ marginLeft: "auto", maxWidth: "22rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {data.description.length > 70 ? data.description.slice(0, 70) + "…" : data.description}
          </span>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div
        className="lpe-content-body"
        style={{ maxHeight: expanded ? "none" : "480px" }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }}
      />

      {/* ── Expand / Collapse ──────────────────────────────────────── */}
      <div className="lpe-expand-bar">
        <button onClick={() => setExpanded(!expanded)} className="lpe-expand-btn">
          <BookOpen style={{ height: "0.7rem", width: "0.7rem" }} />
          {expanded ? "Collapse content" : "Show full content"}
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="lpe-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap style={{ height: "0.75rem", width: "0.75rem" }} />
          <span>Fetched from GitHub API · cached 6h</span>
        </div>
        <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" className="lpe-view-link">
          View full repository <ExternalLink style={{ height: "0.7rem", width: "0.7rem" }} />
        </a>
      </div>
    </div>
  );
}
