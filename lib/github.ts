import { cachedFetch, CACHE_TTL } from "./redis";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RepoMetadata {
  name: string;
  description: string;
  stars: number;
  forks: number;
  lastPush: string;
  url: string;
  language: string;
  defaultBranch: string;
}

export interface ReadmeResult {
  content: string;
  repoMeta: RepoMetadata;
  section?: string;
  fetchedAt: string;
}

export interface FileResult {
  content: string;
  filename: string;
  language: string;
  repoUrl: string;
  lineRange?: { start: number; end: number };
  fetchedAt: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const GITHUB_TOKEN = () => process.env.GITHUB_TOKEN || "";

function githubHeaders(): Record<string, string> {
  const token = GITHUB_TOKEN();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RoadToChain/1.0",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// ─── Core Fetchers ──────────────────────────────────────────────────────────

/**
 * Fetch repo metadata (stars, forks, description, etc.)
 */
export async function getRepoMetadata(
  owner: string,
  repo: string
): Promise<RepoMetadata> {
  const cacheKey = `github:meta:${owner}/${repo}`;

  const { data } = await cachedFetch<RepoMetadata>(
    cacheKey,
    async () => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: githubHeaders(),
      });

      if (!res.ok) {
        throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      return {
        name: json.name,
        description: json.description || "",
        stars: json.stargazers_count || 0,
        forks: json.forks_count || 0,
        lastPush: json.pushed_at || json.updated_at || "",
        url: json.html_url || `https://github.com/${owner}/${repo}`,
        language: json.language || "Unknown",
        defaultBranch: json.default_branch || "main",
      };
    },
    CACHE_TTL
  );

  return data;
}

/**
 * Fetch a repo's README.md content (raw markdown)
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string
): Promise<string> {
  const cacheKey = `github:readme:${owner}/${repo}`;

  const { data } = await cachedFetch<string>(
    cacheKey,
    async () => {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            ...githubHeaders(),
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          `GitHub API error fetching README for ${repo}: ${res.status}`
        );
      }

      return res.text();
    },
    CACHE_TTL
  );

  return data;
}

/**
 * Fetch a specific file from a repo
 */
export async function fetchRepoFile(
  owner: string,
  repo: string,
  filePath: string
): Promise<string> {
  const cacheKey = `github:file:${owner}/${repo}/${filePath}`;

  const { data } = await cachedFetch<string>(
    cacheKey,
    async () => {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          headers: {
            ...githubHeaders(),
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          `GitHub API error fetching ${filePath} from ${repo}: ${res.status}`
        );
      }

      return res.text();
    },
    CACHE_TTL
  );

  return data;
}

// ─── Parsing Utilities ──────────────────────────────────────────────────────

/**
 * Extract a specific section from a markdown README by heading title.
 * Supports ## and ### headings. Returns content between the matched heading
 * and the next heading of equal or higher level.
 */
export function parseReadmeSection(
  markdown: string,
  sectionTitle: string
): string | null {
  // Normalize line endings (Windows \r\n → \n)
  const normalized = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  let capturing = false;
  let capturedLevel = 0;
  const captured: string[] = [];

  const normalizedTarget = sectionTitle.toLowerCase().trim();

  for (const line of lines) {
    // Check if this line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      // Strip emoji (Unicode ranges), special chars, and parenthetical suffixes
      const title = headingMatch[2]
        .replace(/[\u{1F000}-\u{1FFFF}]/gu, "") // emoticons
        .replace(/[\u{2600}-\u{27BF}]/gu, "")   // misc symbols
        .replace(/[\u{FE00}-\u{FE0F}]/gu, "")   // variation selectors
        .replace(/[\u{200D}]/gu, "")             // zero-width joiner
        .replace(/[^\w\s-]/g, "")                // remaining non-word chars
        .replace(/\s+/g, " ")                    // collapse whitespace
        .trim()
        .toLowerCase();

      if (capturing) {
        // Stop if we hit a heading at same or higher level
        if (level <= capturedLevel) {
          break;
        }
      }

      if (!capturing && title.includes(normalizedTarget)) {
        capturing = true;
        capturedLevel = level;
        continue; // skip the heading line itself
      }
    }

    if (capturing) {
      captured.push(line);
    }
  }

  if (captured.length === 0) return null;

  // Trim leading/trailing blank lines
  const result = captured.join("\n").trim();
  return result || null;
}

/**
 * Extract specific line range from file content.
 * Lines are 1-indexed (matching what devs expect).
 */
export function extractLines(
  content: string,
  start: number,
  end: number
): string {
  const lines = content.split("\n");
  // Clamp to valid range
  const s = Math.max(1, start) - 1;
  const e = Math.min(lines.length, end);
  return lines.slice(s, e).join("\n");
}

/**
 * Guess the language of a file from its extension
 */
export function guessLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    sol: "solidity",
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    rs: "rust",
    py: "python",
    go: "go",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    toml: "toml",
    css: "css",
    html: "html",
    graphql: "graphql",
    circom: "circom",
    move: "move",
  };
  return map[ext] || ext;
}

/**
 * Relative time string from ISO date — "3 hours ago", "2 days ago", etc.
 */
export function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}
