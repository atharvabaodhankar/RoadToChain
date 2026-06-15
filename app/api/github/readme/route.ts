import { NextResponse } from "next/server";
import {
  fetchRepoReadme,
  getRepoMetadata,
  parseReadmeSection,
  timeAgo,
} from "@/lib/github";
import { getSocio3Readme, getSocio3Metadata } from "@/lib/socio3-readme";

/**
 * GET /api/github/readme?repo=ZKredential&section=Architecture&owner=atharvabaodhankar
 *
 * Returns parsed README content with repo metadata.
 * All GitHub/Upstash credentials stay server-side — this route acts as a secure proxy.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  const section = searchParams.get("section") || undefined;
  const owner = searchParams.get("owner") || process.env.GITHUB_OWNER || "atharvabaodhankar";

  const allowedOwner = (process.env.GITHUB_OWNER || "atharvabaodhankar").toLowerCase();
  if (owner.toLowerCase() !== allowedOwner) {
    return NextResponse.json(
      { error: "Access Denied: Unauthorized repository owner requested." },
      { status: 403 }
    );
  }

  if (!repo) {
    return NextResponse.json(
      { error: "Missing required 'repo' query parameter" },
      { status: 400 }
    );
  }

  try {
    let readme: string;
    let meta;

    // Socio3 is a private repo — use local static content
    if (repo.toLowerCase() === "socio3") {
      readme = getSocio3Readme();
      meta = getSocio3Metadata();
    } else {
      // Fetch from GitHub (with Upstash cache layer)
      const [readmeContent, repoMeta] = await Promise.all([
        fetchRepoReadme(owner, repo),
        getRepoMetadata(owner, repo),
      ]);
      readme = readmeContent;
      meta = repoMeta;
    }

    // Optionally extract a specific section
    let content = readme;
    if (section) {
      const extracted = parseReadmeSection(readme, section);
      if (extracted) {
        content = extracted;
      }
      // If section not found, return full README with a note
    }

    return NextResponse.json({
      content,
      section: section || null,
      sectionFound: section ? content !== readme : null,
      repo: meta.name,
      description: meta.description,
      stars: meta.stars,
      forks: meta.forks,
      lastUpdated: meta.lastPush,
      lastUpdatedHuman: timeAgo(meta.lastPush),
      repoUrl: meta.url,
      language: meta.language,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[api/github/readme] Error fetching ${repo}:`, err);
    return NextResponse.json(
      {
        error: `Failed to fetch README for ${repo}`,
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
