import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonData, getAllLessonPaths } from "@/lib/content";
import { tracks } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import fs from "fs";
import path from "path";

// Import custom MDX components
import Diagram from "@/components/mdx/Diagram";
import RealityCheck from "@/components/mdx/RealityCheck";
import MistakeCallout from "@/components/mdx/MistakeCallout";
import HeroProject from "@/components/mdx/HeroProject";
import LessonChallenge from "@/components/mdx/LessonChallenge";
import KeyConfusion from "@/components/mdx/KeyConfusion";
import CodeBlock from "@/components/mdx/CodeBlock";
import ReadingProgressBar from "@/components/layout/ReadingProgressBar";

interface Props {
  params: Promise<{
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllLessonPaths();
  return paths.map((p) => ({
    trackSlug: p.track,
    moduleSlug: p.module,
    lessonSlug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackSlug, moduleSlug, lessonSlug } = await params;
  const data = await getLessonData(trackSlug, moduleSlug, lessonSlug);

  if (!data) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `${data.frontmatter.title} — LearnBlockchain`,
    description: data.frontmatter.description,
  };
}

import React from "react";

// Helper to recursively extract text content from nested React nodes (spans, arrays)
const extractTextContent = (node: React.ReactNode): string => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props && "children" in props) {
      return extractTextContent(props.children);
    }
  }
  return "";
};

// Map custom components for the MDX compiler
const mdxComponents = {
  Diagram,
  RealityCheck,
  MistakeCallout,
  HeroProject,
  LessonChallenge,
  KeyConfusion,
  // Custom code block renderer to replace standard markdown pre blocks
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
    // MDX v2 wraps code blocks in <pre><code className="language-xyz">...</code></pre>
    const codeEl = props.children;
    if (React.isValidElement(codeEl) && codeEl.type === "code") {
      const codeProps = codeEl.props as {
        className?: string;
        children?: React.ReactNode;
        "data-language"?: string;
      };
      const className = codeProps.className || "";
      const matches = className.match(/language-(.*)/);
      const language = matches ? matches[1] : (codeProps["data-language"] || "");

      // Extract raw code string recursively
      const rawCode = extractTextContent(codeProps.children);

      // Language-aware default filenames
      let defaultFilename = "SmartAccount.sol";
      if (language === "typescript" || language === "ts" || language === "tsx") {
        defaultFilename = "types.ts";
      } else if (language === "javascript" || language === "js") {
        defaultFilename = "index.js";
      } else if (language === "circom") {
        defaultFilename = "circuit.circom";
      } else if (language === "bash" || language === "sh" || language === "shell") {
        defaultFilename = "terminal";
      }

      let filename = defaultFilename;
      if (rawCode) {
        const fileMatch = rawCode.match(/\/\/\s*([a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]+)/);
        if (fileMatch) {
          filename = fileMatch[1];
        }
      }

      return (
        <CodeBlock
          filename={filename}
          language={language}
          code={rawCode}
        >
          {codeProps.children}
        </CodeBlock>
      );
    }
    return <pre {...props} />;
  },
};

export default async function LessonPage({ params }: Props) {
  const { trackSlug, moduleSlug, lessonSlug } = await params;
  const data = await getLessonData(trackSlug, moduleSlug, lessonSlug);

  if (!data) {
    notFound();
  }

  // Find current track and lesson info for navigation
  const currentTrack = tracks.find((t) => t.slug === trackSlug);
  if (!currentTrack) {
    notFound();
  }

  const moduleNum = parseInt(moduleSlug.split("-")[1], 10);
  const currentModule = currentTrack.modules.find(
    (m) => parseInt(m.number.split(".")[1], 10) === moduleNum
  );

  // Collect all implemented lessons in order across the track to determine next/prev
  const allTrackLessons: Array<{
    title: string;
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }> = [];

  for (const mod of currentTrack.modules) {
    const mSlug = `module-${mod.number.split(".")[1]}`;
    for (const les of mod.lessons) {
      // Dynamic filesystem check to see if the lesson is implemented
      const filePath = path.join(process.cwd(), "content", currentTrack.slug, mSlug, `${les.slug}.mdx`);
      const isImplemented = fs.existsSync(filePath);

      if (isImplemented) {
        allTrackLessons.push({
          title: les.title,
          trackSlug: currentTrack.slug,
          moduleSlug: mSlug,
          lessonSlug: les.slug,
        });
      }
    }
  }

  const currentIndex = allTrackLessons.findIndex((l) => l.lessonSlug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allTrackLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allTrackLessons.length - 1 ? allTrackLessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-bg text-text pb-24">
      <ReadingProgressBar />
      {/* ── Sub-navigation Header ─────────────────────────────── */}
      <div className="border-b border-border bg-bg2 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href={`/learn/${trackSlug}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {currentTrack.number}
          </Link>
          <div className="font-mono text-xs text-dim">
            Track {currentTrack.number} · {currentModule?.number} · Lesson {data.frontmatter.lesson}
          </div>
        </div>
      </div>

      {/* ── Title Hero ────────────────────────────────────────── */}
      <header className="border-b border-border bg-bg2/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider border"
              style={{
                color: currentTrack.color,
                borderColor: `${currentTrack.color}30`,
                backgroundColor: `${currentTrack.color}10`,
              }}
            >
              {data.frontmatter.difficulty}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
              <Clock className="h-3.5 w-3.5" /> {data.frontmatter.estimatedMinutes}m read
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            {data.frontmatter.title}
          </h1>
          <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
            {data.frontmatter.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {data.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded bg-bg3 px-2 py-0.5 font-mono text-[10px] text-muted border border-border"
              >
                <Tag className="h-2.5 w-2.5" /> #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-text2 prose-a:text-[#a78bfa] prose-strong:text-text prose-code:font-mono prose-code:text-[#f472b6] prose-code:bg-bg2 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border/60">
          <MDXRemote
            source={data.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [rehypePrettyCode, { theme: "github-dark", keepBackground: true }]
                ]
              }
            }}
          />
        </div>
      </main>

      {/* ── Bottom Lesson Navigation ────────────────────────────── */}
      <section className="mt-16 border-t border-border px-4 py-12 sm:px-6 lg:px-8 bg-bg2">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/learn/${prevLesson.trackSlug}/${prevLesson.moduleSlug}/${prevLesson.lessonSlug}`}
              className="group flex flex-col items-start gap-1"
            >
              <span className="font-mono text-[10px] text-dim uppercase">Previous Lesson</span>
              <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-muted group-hover:text-text transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> {prevLesson.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${nextLesson.trackSlug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`}
              className="group flex flex-col items-end gap-1"
            >
              <span className="font-mono text-[10px] text-dim uppercase">Next Lesson</span>
              <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-accent group-hover:text-accent2 transition-colors">
                {nextLesson.title} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
