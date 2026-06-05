import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonData } from "@/lib/content";
import { tracks } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag, Hammer, Compass, AlertCircle, ChevronRight } from "lucide-react";
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
import TableOfContents from "@/components/layout/TableOfContents";

// Import interactive simulator components
import GasSimulator from "@/components/simulators/GasSimulator";
import TransactionVisualizer from "@/components/simulators/TransactionVisualizer";
import WalletSigningSimulator from "@/components/simulators/WalletSigningSimulator";
import DeploymentSimulator from "@/components/simulators/DeploymentSimulator";
import ArchitectureExplorer from "@/components/simulators/ArchitectureExplorer";
import React from "react";

interface Props {
  params: Promise<{
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

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

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*|__/g, "")
    .replace(/\*|_/g, "")
    .replace(/`([^`]+)`/g, "$1");
};

// Custom header wrappers to automatically generate matching IDs for scrollspy
const Heading2 = ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => {
  const text = extractTextContent(children);
  const id = slugify(text);
  return <h2 id={id} className="scroll-mt-20" {...props}>{children}</h2>;
};

const Heading3 = ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => {
  const text = extractTextContent(children);
  const id = slugify(text);
  return <h3 id={id} className="scroll-mt-20" {...props}>{children}</h3>;
};

// Map custom components for the MDX compiler
const mdxComponents = {
  Diagram,
  RealityCheck,
  MistakeCallout,
  HeroProject,
  LessonChallenge,
  KeyConfusion,
  h2: Heading2,
  h3: Heading3,
  // Interactive simulators
  GasSimulator,
  TransactionVisualizer,
  WalletSigningSimulator,
  DeploymentSimulator,
  ArchitectureExplorer,
  // Custom code block renderer to replace standard markdown pre blocks
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
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
      const rawCode = extractTextContent(codeProps.children);

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

  const data = await getLessonData(trackSlug, moduleSlug, lessonSlug);
  const isImplemented = !!data;

  // Build headings list for Table of Contents
  const headings: Array<{ text: string; id: string; level: number }> = [];
  if (isImplemented && data?.content) {
    const headingRegex = /^\s*(##|###)\s+(.*)$/gm;
    let match;
    while ((match = headingRegex.exec(data.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const cleanText = cleanMarkdown(text);
      headings.push({
        text: cleanText,
        id: slugify(cleanText),
        level,
      });
    }
  }

  // Collect ALL track lessons in sequential order for navigation
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
    <div className="min-h-screen bg-bg text-text selection:bg-accent/20">
      <ReadingProgressBar />
      
      <div className="flex w-full">
        {/* ── COLUMN 1: Left Navigation Sidebar ────────────────────────────── */}
        <aside className="w-68 border-r border-border bg-bg2 hidden lg:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-6 scrollbar-thin select-none">
          <div className="space-y-6">
            <div>
              <Link 
                href={`/learn/${trackSlug}`}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted hover:text-text uppercase tracking-widest transition-colors mb-2"
              >
                <ArrowLeft className="h-3 w-3" /> Track Overview
              </Link>
              <h4 className="text-sm font-bold tracking-tight text-text font-sans mt-1">
                {currentTrack.number}: {currentTrack.name}
              </h4>
            </div>

            <hr className="border-border/60" />

            <nav className="space-y-4">
              {currentTrack.modules.map((mod) => {
                const mSlug = `module-${mod.number.split(".")[1]}`;
                return (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-dim uppercase tracking-wider">
                      <span>{mod.number}</span>
                      <ChevronRight className="h-2.5 w-2.5" />
                      <span className="truncate max-w-[130px]">{mod.name}</span>
                    </div>
                    
                    <ul className="space-y-1 pl-2 border-l border-border/40">
                      {mod.lessons.map((les) => {
                        const isCurrent = les.slug === lessonSlug;
                        const lessonUrl = `/learn/${trackSlug}/${mSlug}/${les.slug}`;
                        
                        return (
                          <li key={les.slug}>
                            <Link
                              href={lessonUrl}
                              className={`block py-1 px-2.5 rounded text-[12px] leading-relaxed transition-colors duration-150 break-words ${
                                isCurrent
                                  ? "text-accent bg-accent/5 font-semibold"
                                  : "text-muted hover:text-text hover:bg-bg3"
                              }`}
                            >
                              {les.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── COLUMN 2 & 3: Content Reader + Right TOC ────────────────────────── */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="w-full max-w-[980px] px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
            
            {/* COLUMN 2: Center Reading Content (Optimal 720px max reading width) */}
            <article className="flex-1 max-w-[720px] min-w-0">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-dim mb-4 select-none">
                <span>{currentTrack.number}</span>
                <span>/</span>
                <span>{currentModule.number}</span>
                <span>/</span>
                <span className="text-muted truncate max-w-[150px]">{currentLesson.title}</span>
              </div>

              {/* Title Header */}
              <header className="border-b border-border/40 pb-6 mb-8">
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

                <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl leading-tight font-sans">
                  {currentLesson.title}
                </h1>
                
                <p className="mt-3 text-sm leading-relaxed text-muted max-w-xl">
                  {currentLesson.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {currentLesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded bg-bg3 px-2 py-0.5 font-mono text-[10px] text-muted border border-border"
                    >
                      <Tag className="h-2.5 w-2.5" /> #{tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* MDX Content or Placeholder */}
              <div className="min-h-[400px]">
                {isImplemented && data ? (
                  <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-text/90 prose-code:font-mono prose-code:text-accent prose-code:bg-bg2 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border/60">
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
                  /* Gated preview / Placeholder */
                  <div className="space-y-8 animate-fade-in font-sans">
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
                          <h3 className="text-lg font-bold text-text tracking-tight flex items-center gap-2">
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
                      <h3 className="text-base font-bold text-text flex items-center gap-2 border-b border-border/40 pb-2">
                        <Compass className="h-4 w-4 text-accent" /> Lesson Learning Path
                      </h3>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-bg2 border border-border/60 rounded-xl p-5 space-y-2">
                          <div className="font-mono text-[9px] uppercase font-bold text-accent">Core Concept</div>
                          <h4 className="text-xs font-semibold text-text">{currentLesson.title}</h4>
                          <p className="text-xs text-muted leading-relaxed">{currentLesson.description}</p>
                        </div>

                        <div className="bg-bg2 border border-border/60 rounded-xl p-5 space-y-3">
                          <div className="font-mono text-[9px] uppercase font-bold text-dim">Features Included</div>
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
                        <h4 className="text-xs font-semibold text-text flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-accent" /> Developer Walkaround Tips
                        </h4>
                        <p className="text-[11px] leading-relaxed text-muted">
                          Use the navigation below to skip to subsequent lessons, or check other tracks in the sidebar list. You can toggle **Walkaround Mode** in the navigation bar to bypass completion prerequisites.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Action Button */}
              <div className="mt-12 border-t border-border/40 pt-8">
                <LessonCompleteButton
                  trackSlug={trackSlug}
                  moduleSlug={moduleSlug}
                  lessonSlug={lessonSlug}
                  trackColor={currentTrack.color}
                />
              </div>

              {/* Bottom Lesson Navigation */}
              <footer className="mt-16 border-t border-border/60 pt-8">
                <div className="flex items-center justify-between select-none">
                  {prevLesson ? (
                    <Link
                      href={`/learn/${prevLesson.trackSlug}/${prevLesson.moduleSlug}/${prevLesson.lessonSlug}`}
                      className="group flex flex-col items-start gap-1"
                    >
                      <span className="font-mono text-[9px] text-dim uppercase">Previous Lesson</span>
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
                      <span className="font-mono text-[9px] text-dim uppercase">Next Lesson</span>
                      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-accent group-hover:text-accent2 transition-colors">
                        {nextLesson.title} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </footer>
            </article>

            {/* COLUMN 3: Right Sidebar (Sticky Table of Contents) */}
            <aside className="w-56 shrink-0 hidden xl:block sticky top-22 h-[calc(100vh-6rem)] overflow-y-auto select-none">
              <TableOfContents headings={headings} />
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
