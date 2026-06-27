/* eslint-disable */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonData } from "@/lib/content";
import { tracks } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag, Compass, AlertCircle, ChevronRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import fs from "fs";
import path from "path";
import JsonLd from "@/components/seo/JsonLd";
import { lessonSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

// Import custom MDX components
import Diagram from "@/components/mdx/Diagram";
import RealityCheck from "@/components/mdx/RealityCheck";
import MistakeCallout from "@/components/mdx/MistakeCallout";
import HeroProject from "@/components/mdx/HeroProject";
import LessonChallenge from "@/components/mdx/LessonChallenge";
import KeyConfusion from "@/components/mdx/KeyConfusion";
import CodeBlock from "@/components/mdx/CodeBlock";
import LessonImage from "@/components/mdx/LessonImage";
import LiveProjectExample from "@/components/mdx/LiveProjectExample";
import LiveCodeBlock from "@/components/mdx/LiveCodeBlock";
import ReadingProgressBar from "@/components/layout/ReadingProgressBar";
import LessonCompleteButton from "@/components/layout/LessonCompleteButton";
import TableOfContents from "@/components/layout/TableOfContents";
import LessonSidebarLayout from "@/components/layout/LessonSidebarLayout";
import LessonFeedback from "@/components/layout/LessonFeedback";

// Import interactive simulator components
import GasSimulator from "@/components/simulators/GasSimulator";
import TransactionVisualizer from "@/components/simulators/TransactionVisualizer";
import WalletSigningSimulator from "@/components/simulators/WalletSigningSimulator";
import DeploymentSimulator from "@/components/simulators/DeploymentSimulator";
import ArchitectureExplorer from "@/components/simulators/ArchitectureExplorer";
import VisualBlockchainSimulator from "@/components/simulators/VisualBlockchainSimulator";
// Track 0 interactive diagram system
import TrustProblemDiagram from "@/components/diagrams/TrustProblemDiagram";
import DoubleSpendSimulator from "@/components/diagrams/DoubleSpendSimulator";
import TransactionJourneyVisualizer from "@/components/diagrams/TransactionJourneyVisualizer";
import WhereIsBlockchainStored from "@/components/diagrams/WhereIsBlockchainStored";
import MainnetVsTestnetExplorer from "@/components/diagrams/MainnetVsTestnetExplorer";
import WalletRealityCheck from "@/components/diagrams/WalletRealityCheck";
import RPCPhoneLineDiagram from "@/components/diagrams/RPCPhoneLineDiagram";
import GasCostVisualizer from "@/components/diagrams/GasCostVisualizer";
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
  h1: () => null,
  h2: Heading2,
  h3: Heading3,
  // Interactive simulators
  GasSimulator,
  TransactionVisualizer,
  WalletSigningSimulator,
  DeploymentSimulator,
  ArchitectureExplorer,
  VisualBlockchainSimulator,
  // Track 0 diagram system
  TrustProblemDiagram,
  DoubleSpendSimulator,
  TransactionJourneyVisualizer,
  WhereIsBlockchainStored,
  MainnetVsTestnetExplorer,
  WalletRealityCheck,
  RPCPhoneLineDiagram,
  GasCostVisualizer,
  LessonImage,
  // Live GitHub integration components
  LiveProjectExample,
  LiveCodeBlock,
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
      const langLower = (language || "").toLowerCase();
      if (langLower === "typescript" || langLower === "ts" || langLower === "tsx") {
        defaultFilename = "types.ts";
      } else if (langLower === "javascript" || langLower === "js" || langLower === "jsx") {
        defaultFilename = "index.js";
      } else if (langLower === "circom") {
        defaultFilename = "circuit.circom";
      } else if (langLower === "bash" || langLower === "sh" || langLower === "shell" || langLower === "terminal") {
        defaultFilename = "terminal";
      } else if (langLower === "yaml" || langLower === "yml") {
        defaultFilename = "subgraph.yaml";
      } else if (langLower === "json") {
        defaultFilename = "package.json";
      } else if (langLower === "python" || langLower === "py") {
        defaultFilename = "script.py";
      } else if (langLower === "html") {
        defaultFilename = "index.html";
      } else if (langLower === "css") {
        defaultFilename = "styles.css";
      } else if (langLower === "solidity" || langLower === "sol") {
        defaultFilename = "SmartAccount.sol";
      }

      let filename = defaultFilename;
      if (rawCode) {
        // Match // filename.ext, # filename.ext, or <!-- filename.ext -->
        const fileMatch = rawCode.match(/(?:\/\/\/|#|\/\/|<!--)\s*([a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]+)/);
        if (fileMatch) {
          filename = fileMatch[1];
        }
      }

      const { children: _unusedChildren, ...preRest } = props;

      return (
        <CodeBlock
          filename={filename}
          language={language}
          code={rawCode}
          {...(preRest as Record<string, unknown>)}
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roadtochain.tech";
  const canonicalUrl = `${siteUrl}/learn/${trackSlug}/${moduleSlug}/${lessonSlug}`;

  return {
    title: currentLesson.title,
    description: currentLesson.description,
    keywords: currentLesson.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: currentLesson.title,
      description: currentLesson.description,
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/api/og?title=${encodeURIComponent(currentLesson.title)}&track=${encodeURIComponent(currentTrack.name)}`,
          width: 1200,
          height: 630,
        }
      ],
      authors: ["Atharva Baodhankar"],
      section: currentTrack.name,
      tags: currentLesson.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: currentLesson.title,
      description: currentLesson.description,
    },
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

  // File metadata dates for SEO schema
  let datePublished = "2026-06-04T00:00:00.000Z";
  let dateModified = "2026-06-04T00:00:00.000Z";
  let normalizedModuleSlug = moduleSlug;
  if (moduleSlug.startsWith("m") && moduleSlug.includes("-")) {
    const parts = moduleSlug.split("-");
    if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
      normalizedModuleSlug = `module-${parts[1]}`;
    }
  }
  try {
    const filePath = path.join(process.cwd(), "content", trackSlug, normalizedModuleSlug, `${lessonSlug}.mdx`);
    if (fs.existsSync(filePath)) {
      const fileStat = fs.statSync(filePath);
      datePublished = fileStat.birthtime.toISOString();
      dateModified = fileStat.mtime.toISOString();
    }
  } catch {
    // fallback
  }

  // Dynamically extract KeyConfusion callouts from content to build FAQ Schema
  const faqs: Array<{ question: string; answer: string }> = [];
  if (isImplemented && data?.content) {
    try {
      const matches = data.content.matchAll(/<KeyConfusion\s+([^>]*)\/>/g);
      for (const m of matches) {
        const attrsStr = m[1];
        const qMatch = attrsStr.match(/question=["']([^"']+)["']/);
        const aMatch = attrsStr.match(/answer=["']([^"']+)["']/);
        if (qMatch && aMatch) {
          faqs.push({
            question: qMatch[1].trim(),
            answer: aMatch[1].trim(),
          });
        }
      }
    } catch {
      // fail silently
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roadtochain.tech";
  const canonicalUrl = `${siteUrl}/learn/${trackSlug}/${moduleSlug}/${lessonSlug}`;

  const schemas: unknown[] = [
    lessonSchema(currentLesson, currentTrack.name, currentTrack.slug, canonicalUrl, datePublished, dateModified),
    breadcrumbSchema([
      { name: "Learn", url: `${siteUrl}/learn` },
      { name: currentTrack.name, url: `${siteUrl}/learn/${currentTrack.slug}` },
      { name: currentModule.name, url: `${siteUrl}/learn/${currentTrack.slug}#module-${currentModule.number.split(".")[1]}` },
      { name: currentLesson.title, url: canonicalUrl },
    ])
  ];

  if (faqs.length > 0) {
    schemas.push(faqSchema(faqs));
  }

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
      <JsonLd schema={schemas} />
      <ReadingProgressBar />
      
      <LessonSidebarLayout
        sidebarContent={
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
        }
      >
        {/* ── COLUMN 2 & 3: Content Reader + Right TOC ────────────────────────── */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="w-full max-w-[980px] px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
            
            {/* COLUMN 2: Center Reading Content (Optimal 720px max reading width) */}
            <article className="flex-1 max-w-[720px] min-w-0">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-dim mb-4 select-none">
                <Link
                  href={`/learn/${trackSlug}`}
                  className="hover:text-text hover:underline transition-colors cursor-pointer"
                >
                  {currentTrack.number}
                </Link>
                <span>/</span>
                <Link
                  href={`/learn/${trackSlug}#module-${currentModule.number.split(".")[1]}`}
                  className="hover:text-text hover:underline transition-colors cursor-pointer"
                >
                  {currentModule.number}
                </Link>
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
                            [
                              rehypePrettyCode,
                              {
                                theme: {
                                  dark: "github-dark",
                                  light: "github-light",
                                },
                                keepBackground: false,
                              },
                            ],
                          ]
                        }
                      }}
                    />
                  </div>
                ) : (
                  /* Gated preview / Placeholder */
                  <div className="space-y-8 animate-fade-in font-sans">
                    <div className="relative rounded-2xl border border-border bg-bg2/40 p-1 overflow-hidden backdrop-blur-sm shadow-sm">
                      {/* Technical Grid Overlay */}
                      <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15] pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                        backgroundPosition: 'center'
                      }} />

                      {/* CAD corner framing brackets */}
                      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-border3/40" />
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-border3/40" />
                      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-border3/40" />
                      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-border3/40" />

                      {/* Left Track Color Accent Spine */}
                      <div 
                        className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r"
                        style={{ backgroundColor: currentTrack.color }}
                      />

                      <div className="relative z-10 border border-border/80 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span 
                              className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                              style={{
                                color: currentTrack.color,
                                borderColor: `${currentTrack.color}30`,
                                backgroundColor: `${currentTrack.color}08`
                              }}
                            >
                              Draft Stage: Active Assembly
                            </span>
                            <span className="font-mono text-[9px] text-dim">
                              SYSTEM INDEX: T0{currentTrack.id}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-text tracking-tight font-sans">
                            Curriculum Workbench: <span className="font-serif italic text-accent font-normal">{currentLesson.title}</span>
                          </h3>

                          <p className="text-xs text-muted leading-relaxed max-w-xl">
                            The technical specifications and prerequisite maps for this module have been verified. Our engineering team is currently assembling the live interactive simulators, textbook-grade schemas, and production post-mortems for this workbench.
                          </p>

                          <div className="flex items-center gap-1.5 font-mono text-[9px] text-dim">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500/80 animate-pulse-dot" />
                            <span>Calibrating custom lesson simulators & textbook content</span>
                          </div>

                          {/* CAD Title Block */}
                          <div className="mt-6 border border-border bg-bg/85 backdrop-blur-sm rounded-lg overflow-hidden max-w-xs shadow-sm">
                            <div className="grid grid-cols-2 border-b border-border/50 font-mono text-[9px]">
                              <div className="p-2 border-r border-border/50">
                                <span className="block text-[8px] text-dim/80 uppercase">Doc Index</span>
                                <span className="font-semibold text-text">T0{currentTrack.id}-M{currentModule.number.split(".")[1]}-L{currentModule.lessons.findIndex((l) => l.slug === lessonSlug) + 1}</span>
                              </div>
                              <div className="p-2">
                                <span className="block text-[8px] text-dim/80 uppercase">Workbench Stage</span>
                                <span className="font-semibold text-accent uppercase">Calibrating</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 font-mono text-[9px]">
                              <div className="p-2 border-r border-border/50">
                                <span className="block text-[8px] text-dim/80 uppercase">System Revision</span>
                                <span className="font-semibold text-text">REV 0.9.5</span>
                              </div>
                              <div className="p-2">
                                <span className="block text-[8px] text-dim/80 uppercase">Calibrated For</span>
                                <span className="font-semibold text-text truncate block">{currentTrack.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Technical CAD Blueprint Schematic */}
                        <div className="shrink-0 flex items-center justify-center self-center lg:self-start border border-border/60 bg-bg/50 rounded-xl p-2 shadow-inner select-none pointer-events-none">
                          <svg className="w-32 h-32 md:w-36 md:h-36 text-accent/50 dark:text-accent/35" viewBox="0 0 100 100" fill="none">
                            <pattern id="cadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                              <circle cx="5" cy="5" r="0.5" fill="currentColor" opacity="0.25" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#cadGrid)" />

                            {/* Centered crosshairs */}
                            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 3" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 3" />

                            {/* Geometric drafting circles */}
                            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.35" strokeDasharray="2 2" />
                            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="3" fill="currentColor" />

                            {/* Outer Dimension lines */}
                            <path d="M 12 8 L 12 4 M 88 8 L 88 4 M 12 6 L 88 6" stroke="currentColor" strokeWidth="0.35" />
                            <polygon points="12,6 15,4.5 15,7.5" fill="currentColor" />
                            <polygon points="88,6 85,4.5 85,7.5" fill="currentColor" />
                            <text x="50" y="11" className="font-mono text-[4px] fill-current text-center font-bold" textAnchor="middle">Ø 76.00 mm</text>

                            {/* Structural schematic lines & nodes */}
                            <rect x="44" y="44" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="0.75" fill="var(--bg)" />
                            <path d="M 50 22 L 50 44 M 50 56 L 50 78 M 22 50 L 44 50 M 56 50 L 78 50" stroke="currentColor" strokeWidth="0.35" />
                            <circle cx="50" cy="22" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="var(--bg)" />
                            <circle cx="50" cy="78" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="var(--bg)" />
                            <circle cx="22" cy="50" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="var(--bg)" />
                            <circle cx="78" cy="50" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="var(--bg)" />

                            {/* Caliper measurement lines */}
                            <path d="M 78 50 A 28 28 0 0 0 69.8 30.2" stroke="currentColor" strokeWidth="0.5" />
                            <text x="73" y="36" className="font-mono text-[3.5px] fill-current italic font-bold">r=28.00</text>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-base font-bold text-text flex items-center gap-2 border-b border-border/40 pb-2">
                        <Compass className="h-4 w-4 text-accent" /> Module Spec Sheet & Calibration
                      </h3>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-bg/40 border border-border/65 rounded-xl p-5 space-y-2 relative overflow-hidden">
                          <div className="absolute top-2 right-3 font-mono text-[8px] text-dim">ITEM 01</div>
                          <div className="font-mono text-[9px] uppercase font-bold text-accent">Core Concept</div>
                          <h4 className="text-xs font-semibold text-text">{currentLesson.title}</h4>
                          <p className="text-xs text-muted leading-relaxed">{currentLesson.description}</p>
                        </div>

                        <div className="bg-bg/40 border border-border/65 rounded-xl p-5 space-y-3 relative overflow-hidden">
                          <div className="absolute top-2 right-3 font-mono text-[8px] text-dim">ITEM 02</div>
                          <div className="font-mono text-[9px] uppercase font-bold text-dim">Calibration Specs</div>
                          <div className="space-y-2.5 text-xs text-muted">
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                              <span className="text-text font-medium">Visual Architecture Diagram</span>
                              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${currentLesson.hasDiagram ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"}`}>
                                {currentLesson.hasDiagram ? "SCHEMATIC STAGED" : "TEXTUAL ONLY"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                              <span className="text-text font-medium">Production Autopsy Logs</span>
                              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${currentLesson.hasMistake ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"}`}>
                                {currentLesson.hasMistake ? "CASES DOCUMENTED" : "SUMMARY GUIDE"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-text font-medium">Capstone Code Integration</span>
                              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${currentLesson.hasProject ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"}`}>
                                {currentLesson.hasProject ? "LAB CODE COMPILED" : "CODE SNIPPETS"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-bg3/40 p-5 space-y-2 relative">
                        <div className="absolute top-2 right-3 font-mono text-[8px] text-dim">ADVISORY</div>
                        <h4 className="text-xs font-semibold text-text flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-accent" /> Lesson Progress Tip
                        </h4>
                        <p className="text-[11px] leading-relaxed text-muted">
                          You can navigate freely to any track or module using the sidebar or curriculum overview. Make sure to mark this lesson as complete to save your progress.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Form */}
              <LessonFeedback
                trackSlug={trackSlug}
                moduleSlug={moduleSlug}
                lessonSlug={lessonSlug}
              />

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
      </LessonSidebarLayout>
    </div>
  );
}
