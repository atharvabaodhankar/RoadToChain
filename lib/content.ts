import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface LessonFrontmatter {
  title: string;
  description: string;
  track: number;
  trackName: string;
  trackColor: string;
  module: number;
  moduleName: string;
  lesson: number;
  difficulty: string;
  estimatedMinutes: number;
  tags: string[];
  hasDiagram: boolean;
  hasMistake: boolean;
  hasProject: boolean;
  realProjectSource?: string;
  heroProjectContribution?: string;
}

export interface LessonData {
  frontmatter: LessonFrontmatter;
  content: string;
  slug: string;
  trackSlug: string;
  moduleSlug: string;
}

function safeReadDir(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

export async function getLessonData(
  trackSlug: string,
  moduleSlug: string,
  slug: string
): Promise<LessonData | null> {
  const filePath = path.join(CONTENT_DIR, trackSlug, moduleSlug, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as LessonFrontmatter,
    content,
    slug,
    trackSlug,
    moduleSlug,
  };
}

export function getAllLessonPaths(): Array<{
  track: string;
  module: string;
  slug: string;
}> {
  const paths: Array<{ track: string; module: string; slug: string }> = [];

  const trackDirs = safeReadDir(CONTENT_DIR);
  for (const trackDir of trackDirs) {
    const trackPath = path.join(CONTENT_DIR, trackDir);
    const stat = fs.statSync(trackPath);
    if (!stat.isDirectory()) continue;

    const moduleDirs = safeReadDir(trackPath);
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(trackPath, moduleDir);
      const mStat = fs.statSync(modulePath);
      if (!mStat.isDirectory()) continue;

      const files = safeReadDir(modulePath);
      for (const file of files) {
        if (!file.endsWith(".mdx")) continue;
        paths.push({
          track: trackDir,
          module: moduleDir,
          slug: file.replace(/\.mdx$/, ""),
        });
      }
    }
  }

  return paths;
}
