import { NextResponse } from "next/server";
import {
  fetchRepoFile,
  getRepoMetadata,
  extractLines,
  guessLanguage,
} from "@/lib/github";

/**
 * GET /api/github/file?repo=ChainCure&path=contracts/ChainCure.sol&lines=156-180&owner=atharvabaodhankar
 *
 * Returns file content from a GitHub repo, with optional line range extraction.
 * All credentials stay server-side.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  const filePath = searchParams.get("path");
  const lines = searchParams.get("lines") || undefined;
  const owner =
    searchParams.get("owner") ||
    process.env.GITHUB_OWNER ||
    "atharvabaodhankar";

  const allowedOwner = (process.env.GITHUB_OWNER || "atharvabaodhankar").toLowerCase();
  if (owner.toLowerCase() !== allowedOwner) {
    return NextResponse.json(
      { error: "Access Denied: Unauthorized repository owner requested." },
      { status: 403 }
    );
  }

  if (!repo || !filePath) {
    return NextResponse.json(
      { error: "Missing required 'repo' and 'path' query parameters" },
      { status: 400 }
    );
  }

  // Block access to Socio3 files (private repo — no file-level API)
  if (repo.toLowerCase() === "socio3") {
    return NextResponse.json(
      {
        error: "Socio3 is a private repository. File-level access is not available.",
        hint: "Use /api/github/readme?repo=Socio3 for README content.",
      },
      { status: 403 }
    );
  }

  try {
    const [fileContent, meta] = await Promise.all([
      fetchRepoFile(owner, repo, filePath),
      getRepoMetadata(owner, repo),
    ]);

    let content = fileContent;
    let lineRange: { start: number; end: number } | null = null;

    // Extract line range if specified (e.g., "156-180")
    if (lines) {
      const [startStr, endStr] = lines.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        content = extractLines(fileContent, start, end);
        lineRange = { start, end };
      }
    }

    const filename = filePath.split("/").pop() || filePath;
    const language = guessLanguage(filename);

    return NextResponse.json({
      content,
      filename,
      language,
      lineRange,
      totalLines: fileContent.split("\n").length,
      repoUrl: meta.url,
      fileUrl: `${meta.url}/blob/${meta.defaultBranch}/${filePath}`,
      repo: meta.name,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[api/github/file] Error fetching ${repo}/${filePath}:`, err);
    return NextResponse.json(
      {
        error: `Failed to fetch ${filePath} from ${repo}`,
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
