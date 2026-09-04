"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  X,
  Loader2,
  BookOpen,
  ShieldCheck,
  Zap,
  CornerDownLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Source {
  title: string;
  url: string;
  section: string;
  score: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const STARTER_PROMPTS = [
  "Where are my coins actually stored?",
  "Why use Poseidon instead of SHA-256 in circuits?",
  "What goes wrong without nonces in signatures?",
  "Why does a failed transaction still cost gas?",
];

// Helper to render inline markdown: **bold**, *italic*, `code`, and [link](url)
function renderInline(text: string, onNavigate?: () => void, keyPrefix = "") {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (!part) return null;

    // Link: [Title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, title, rawUrl] = linkMatch;
      // Strip any host/port like http://localhost:3000 to get a clean internal relative URL
      const cleanPath = rawUrl.replace(/^https?:\/\/(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|[^/]+)/, "");
      const isInternal = cleanPath.startsWith("/") || !rawUrl.startsWith("http");
      const targetUrl = isInternal
        ? cleanPath.startsWith("/")
          ? cleanPath
          : `/${cleanPath}`
        : rawUrl;

      if (isInternal) {
        return (
          <Link
            key={key}
            href={targetUrl}
            onClick={() => onNavigate?.()}
            className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-colors my-0.5 font-medium cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{title}</span>
            <ChevronRight className="w-3 h-3 text-purple-500/60 dark:text-purple-400/60" />
          </Link>
        );
      }
      return (
        <a
          key={key}
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 underline underline-offset-4 hover:text-purple-500 dark:hover:text-purple-300"
        >
          {title}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong
          key={key}
          className="font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={key}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 border border-zinc-200 dark:border-zinc-700/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={key} className="italic text-zinc-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

// Helper to render structured markdown with clickable Next.js links
function MarkdownContent({
  content,
  onNavigate,
}: {
  content: string;
  onNavigate?: () => void;
}) {
  // Split by fenced code blocks: ```lang\ncode\n```
  const sections = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-[13.5px] text-zinc-800 dark:text-zinc-200">
      {sections.map((section, secIdx) => {
        if (!section) return null;

        // Fenced code block
        if (section.startsWith("```") && section.endsWith("```")) {
          const lines = section.slice(3, -3).trim().split("\n");
          const firstLine = lines[0].trim();
          const hasLang = !firstLine.includes(" ") && firstLine.length < 15;
          const code = (hasLang ? lines.slice(1) : lines).join("\n");
          return (
            <div
              key={secIdx}
              className="my-2 rounded-lg bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-3 overflow-x-auto"
            >
              <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-300">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Standard text: split into paragraphs
        const paragraphs = section.split(/\n\n+/);
        return (
          <React.Fragment key={secIdx}>
            {paragraphs.map((para, paraIdx) => {
              if (!para.trim()) return null;

              const lines = para.split("\n");
              return (
                <div key={paraIdx} className="space-y-1.5">
                  {lines.map((line, lineIdx) => {
                    const trimmed = line.trim();
                    if (trimmed === "---" || trimmed === "***") {
                      return (
                        <hr
                          key={lineIdx}
                          className="my-2 border-zinc-200 dark:border-zinc-800"
                        />
                      );
                    }

                    const isH1 = /^#\s+/.test(trimmed);
                    const isH2 = /^##\s+/.test(trimmed);
                    const isH3 = /^###\s+/.test(trimmed);

                    if (isH1 || isH2 || isH3) {
                      const headingText = trimmed.replace(/^#+\s+/, "");
                      return (
                        <div
                          key={lineIdx}
                          className={`font-semibold text-zinc-900 dark:text-zinc-100 ${
                            isH1
                              ? "text-base pt-2.5 pb-1 font-bold"
                              : isH2
                              ? "text-sm pt-2 pb-0.5 font-bold"
                              : "text-[13px] pt-1.5 font-semibold text-zinc-900 dark:text-zinc-200"
                          }`}
                        >
                          {renderInline(
                            headingText,
                            onNavigate,
                            `${secIdx}-${paraIdx}-${lineIdx}`
                          )}
                        </div>
                      );
                    }

                    const isBullet = /^[*-]\s+/.test(trimmed);
                    if (isBullet) {
                      const bulletText = trimmed.replace(/^[*-]\s+/, "");
                      return (
                        <div
                          key={lineIdx}
                          className="flex items-start gap-2 pl-1.5 py-0.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 mt-2 shrink-0" />
                          <div className="flex-1 leading-relaxed">
                            {renderInline(
                              bulletText,
                              onNavigate,
                              `${secIdx}-${paraIdx}-${lineIdx}`
                            )}
                          </div>
                        </div>
                      );
                    }

                    const isNumbered = /^\d+\.\s+/.test(trimmed);
                    if (isNumbered) {
                      const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
                      if (match) {
                        return (
                          <div
                            key={lineIdx}
                            className="flex items-start gap-2 pl-1 py-0.5"
                          >
                            <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                              {match[1]}
                            </span>
                            <div className="flex-1 leading-relaxed">
                              {renderInline(
                                match[2],
                                onNavigate,
                                `${secIdx}-${paraIdx}-${lineIdx}`
                              )}
                            </div>
                          </div>
                        );
                      }
                    }

                    return (
                      <div key={lineIdx}>
                        {renderInline(
                          line,
                          onNavigate,
                          `${secIdx}-${paraIdx}-${lineIdx}`
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function RoadToChainAssistant() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pathname = usePathname();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Keyboard shortcut listener (CMD+/ or Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async (userPrompt?: string) => {
    const query = (userPrompt || input).trim();
    if (!query || isLoading) return;

    if (query.length > 500) {
      setErrorMessage("Question is too long (maximum 500 characters).");
      return;
    }

    setErrorMessage(null);
    setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        sources: [],
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate answer.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable.");

      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let retrievedSources: Source[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "meta") {
                retrievedSources = data.sources || [];
                if (typeof data.remainingToday === "number") {
                  setRemainingQueries(data.remainingToday);
                }
              } else if (data.type === "token") {
                accumulatedContent += data.token;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          content: accumulatedContent,
                          sources: retrievedSources,
                        }
                      : msg
                  )
                );
              } else if (data.type === "error") {
                throw new Error(data.message || "Stream failed.");
              }
            } catch {
              // Ignore partial JSON lines
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to reach AI Navigator.";
      setErrorMessage(errMsg);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `⚠️ **Error**: ${errMsg}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* ─── FLOATING TRIGGER BUTTON ─── */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        aria-label="Open AI Curriculum Navigator"
        className="fixed bottom-5 right-5 z-[9999] pointer-events-auto cursor-pointer flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900/95 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-purple-500/40 hover:border-purple-500/80 shadow-2xl shadow-purple-950/20 dark:shadow-purple-950/40 backdrop-blur-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
       
        <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
          <div className="relative w-4 h-4 rounded overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
            <Image
              src="/logo.png?v=4"
              alt="RoadToChain Logo"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span>RTC Navigator</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
          Ctrl + /
        </span>
      </button>

      {/* ─── MODAL DIALOG ─── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-[85vh] sm:h-[620px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo.png?v=4"
                    alt="RoadToChain Logo"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      RoadToChain Navigator
                    </h3>
                   
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Grounded in 40+ MDX lessons & real production autopsies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {remainingQueries !== null && (
                  <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
                    <Zap className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span>{remainingQueries}/20 left today</span>
                  </div>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h4 className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
                      Ask about any Web3 concept or autopsy
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Every answer is backed by code, real mistakes, and deep links directly to RoadToChain lessons.
                    </p>
                  </div>

                  {/* Starter Chips */}
                  <div className="w-full max-w-lg pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {STARTER_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-purple-500/40 text-left text-xs text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-all duration-150 flex items-start gap-2 group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-purple-500/60 dark:text-purple-400/60 group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 mt-0.5" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono pt-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Rate-limited & protected against accidental billing</span>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-600 px-4 py-2.5 text-xs sm:text-sm text-white font-medium shadow-md">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full space-y-2">
                        {/* Sources Pill Row */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pb-1">
                            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                              Sources:
                            </span>
                            {msg.sources.slice(0, 3).map((s, idx) => (
                              <Link
                                key={idx}
                                href={s.url}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-400/90 hover:text-purple-900 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/30 px-2 py-0.5 rounded transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[160px]">
                                  {s.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Assistant message content */}
                        <div className="rounded-2xl rounded-tl-sm bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 p-4 shadow-sm w-full">
                          {msg.content ? (
                            <MarkdownContent
                              content={msg.content}
                              onNavigate={() => setIsOpen(false)}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs py-1">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 dark:text-purple-400" />
                              <span>Searching curriculum & synthesizing...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="px-4 py-2 bg-rose-100 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-800/40 text-[11px] text-rose-700 dark:text-rose-300 flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={500}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask any Web3 question (e.g., 'How does EVM storage packing work?')"
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all disabled:opacity-50"
                />

                <div className="absolute right-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    {input.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:hover:bg-purple-600 transition-colors focus:outline-none"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
