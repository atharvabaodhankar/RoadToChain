import fs from "fs";
import path from "path";
import type { RepoMetadata } from "./github";

/**
 * Static README fallback for Socio3 (private repo).
 * Reads from context/socio3/README.md at runtime on the server.
 * This way the content is always up-to-date with whatever is in the context folder,
 * and we never need to hit the GitHub API for this private repo.
 */

let cachedReadme: string | null = null;

export function getSocio3Readme(): string {
  if (cachedReadme) return cachedReadme;

  try {
    const readmePath = path.join(process.cwd(), "context", "socio3", "README.md");
    if (fs.existsSync(readmePath)) {
      cachedReadme = fs.readFileSync(readmePath, "utf-8");
      return cachedReadme;
    }
  } catch (err) {
    console.warn("[socio3] Failed to read local README:", err);
  }

  return "# Socio3\n\nREADME content unavailable. This is a private repository.";
}

/**
 * Static metadata for Socio3 — we know these details since it's our own project.
 */
export function getSocio3Metadata(): RepoMetadata {
  return {
    name: "Socio3",
    description:
      "Production-grade Web3 social media platform with ERC-4337 Account Abstraction, gasless interactions via Pimlico paymaster, and The Graph indexing. Built on Polygon Amoy.",
    stars: 0, // private repo
    forks: 0,
    lastPush: "2026-05-30T00:00:00Z",
    url: "https://github.com/atharvabaodhankar/socio3",
    language: "JavaScript",
    defaultBranch: "main",
  };
}
