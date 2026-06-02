import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonData } from "@/lib/content";
import { tracks } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag, Hammer, Compass, AlertCircle } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

// Import custom MDX components
import Diagram from "@/components/mdx/Diagram";
import RealityCheck from "@/components/mdx/RealityCheck";
import MistakeCallout from "@/components/mdx/MistakeCallout";
import HeroProject from "@/components/mdx/HeroProject";
import LessonChallenge from "@/components/mdx/LessonChallenge";
import KeyConfusion from "@/components/mdx/KeyConfusion";
import CodeBlock from "@/components/mdx/CodeBlock";
import ReadingProgressBar from "@/components/layout/ReadingProgressBar";
import LessonCompleteButton from "@/components/layout/LessonCompleteButton";
// Import interactive simulator components
import GasSimulator from "@/components/simulators/GasSimulator";
import TransactionVisualizer from "@/components/simulators/TransactionVisualizer";
import WalletSigningSimulator from "@/components/simulators/WalletSigningSimulator";
import DeploymentSimulator from "@/components/simulators/DeploymentSimulator";
import ArchitectureExplorer from "@/components/simulators/ArchitectureExplorer";


interface Props {
  params: Promise<{
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
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
  // Interactive simulators
  GasSimulator,
  TransactionVisualizer,
  WalletSigningSimulator,
  DeploymentSimulator,
  ArchitectureExplorer,
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

export async function generateStaticParams() {
  const paths: Array<{ trackSlug: string; moduleSlug: string; lessonSlug: string }> = [];
  for (const track of tracks) {
    for (const mod of track.modules) {
      const moduleSlug = `module-${mod.number.split(".")[1]}`;
      for (const les of mod.lessons) {
        paths.push({
          trackSlug: track.slug,
          moduleSlug: moduleSlug,
          lessonSlug: les.slug,
        });
      }
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackSlug, moduleSlug, lessonSlug } = await params;
  const currentTrack = tracks.find((t) => t.slug === trackSlug);
  if (!currentTrack) {
    return { title: "Track Not Found" };
  }

  const moduleNum = parseInt(moduleSlug.split("-")[1], 10);
  const currentModule = currentTrack.modules.find(
    (m) => parseInt(m.number.split(".")[1], 10) === moduleNum
  );
  if (!currentModule) {
    return { title: "Module Not Found" };
  }

  const currentLesson = currentModule.lessons.find((l) => l.slug === lessonSlug);
  if (!currentLesson) {
    return { title: "Lesson Not Found" };
  }

  return {
    title: `${currentLesson.title} — LearnBlockchain`,
    description: currentLesson.description,
  };
}

export default async function LessonPage({ params }: Props) {
  const { trackSlug, moduleSlug, lessonSlug } = await params;
  
  // Find current track and lesson info from static curriculum
  const currentTrack = tracks.find((t) => t.slug === trackSlug);
  if (!currentTrack) {
    notFound();
  }

  const moduleNum = parseInt(moduleSlug.split("-")[1], 10);
  const currentModule = currentTrack.modules.find(
    (m) => parseInt(m.number.split(".")[1], 10) === moduleNum
  );
  if (!currentModule) {
    notFound();
  }

  const currentLesson = currentModule.lessons.find((l) => l.slug === lessonSlug);
  if (!currentLesson) {
    notFound();
  }

  // Load implementation data if it exists on disk
  const data = await getLessonData(trackSlug, moduleSlug, lessonSlug);
  const isImplemented = !!data;

  // Collect ALL curriculum lessons in order across the track to determine next/prev
  const allTrackLessons: Array<{
    title: string;
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }> = [];

  for (const mod of currentTrack.modules) {
    const mSlug = `module-${mod.number.split(".")[1]}`;
    for (const les of mod.lessons) {
      allTrackLessons.push({
        title: les.title,
        trackSlug: currentTrack.slug,
        moduleSlug: mSlug,
        lessonSlug: les.slug,
      });
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
            Track {currentTrack.number} · {currentModule?.number} · Lesson {currentLesson.slug === lessonSlug ? currentModule.lessons.indexOf(currentLesson) + 1 : 1}
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
              {currentTrack.difficulty}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
              <Clock className="h-3.5 w-3.5" /> {currentLesson.estimatedMinutes}m read
            </span>
            {!isImplemented && (
              <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-amber-400 border border-amber-500/20 uppercase shrink-0">
                Preview Mode
              </span>
            )}
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            {currentLesson.title}
          </h1>
          <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
            {currentLesson.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {currentLesson.tags.map((tag) => (
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
        {isImplemented && data ? (
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
        ) : (
          /* ── Premium Placeholder / Upcoming Page ──────────────── */
          <div className="space-y-8 animate-fade-in">
            <div className="relative rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  background: `radial-gradient(circle at 70% 30%, ${currentTrack.color} 0%, transparent 60%)`,
                }}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
                  <Hammer className="h-6 w-6 stroke-[1.8] animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-sans text-lg font-bold text-text tracking-tight flex items-center gap-2">
                    Lesson Under Construction
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    This lesson details have been defined in the curriculum blueprint, but the full interactive content and simulators are currently being engineered.
                  </p>
                  <p className="text-xs text-dim leading-relaxed">
                    You can read the lesson summary below, or mark this lesson as complete to advance through the track overview and continue your walkaround.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-sans text-base font-bold text-text flex items-center gap-2 border-b border-border/40 pb-2">
                <Compass className="h-4 w-4 text-accent" /> Lesson Learning Path
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-bg2 border border-border/60 rounded-xl p-5 space-y-2">
                  <div className="font-mono text-[10px] uppercase font-bold text-accent">Core Concept</div>
                  <h4 className="font-sans text-xs font-semibold text-text">{currentLesson.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{currentLesson.description}</p>
                </div>

                <div className="bg-bg2 border border-border/60 rounded-xl p-5 space-y-3">
                  <div className="font-mono text-[10px] uppercase font-bold text-dim">Features Included</div>
                  <div className="space-y-2 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${currentLesson.hasDiagram ? "bg-emerald-500" : "bg-zinc-700"}`} />
                      <span>{currentLesson.hasDiagram ? "Visual Architecture Diagrams" : "Conceptual Layout"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${currentLesson.hasMistake ? "bg-amber-500" : "bg-zinc-700"}`} />
                      <span>{currentLesson.hasMistake ? "Top Production Mistakes Autopsy" : "Standard Pitfalls List"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${currentLesson.hasProject ? "bg-purple-500" : "bg-zinc-700"}`} />
                      <span>{currentLesson.hasProject ? "Hands-on Capstone Code Integration" : "Practical Reference Code"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-bg3/40 p-5 space-y-3">
                <h4 className="font-sans text-xs font-semibold text-text flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-accent" /> Developer Walkaround Tips
                </h4>
                <p className="text-[11px] leading-relaxed text-muted">
                  Use the navigation below to skip to subsequent lessons, or check other tracks in the sidebar list. You can toggle **Walkaround Mode** in the navigation bar to bypass completion prerequisites.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <LessonCompleteButton
          trackSlug={trackSlug}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
          trackColor={currentTrack.color}
        />
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
