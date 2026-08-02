"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, BookOpen, CornerDownLeft } from "lucide-react";
import { tracks } from "@/lib/curriculum";

interface SearchResult {
  trackSlug: string;
  trackName: string;
  trackNumber: string;
  trackColor: string;
  moduleNumber: string;
  moduleName: string;
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  description: string;
  tags: string[];
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Flatten curriculum dataset for fast searching
  const allLessons: SearchResult[] = React.useMemo(() => {
    const list: SearchResult[] = [];
    for (const track of tracks) {
      for (const mod of track.modules) {
        const mSlug = `module-${mod.number.split(".")[1]}`;
        for (const les of mod.lessons) {
          list.push({
            trackSlug: track.slug,
            trackName: track.name,
            trackNumber: track.number,
            trackColor: track.color,
            moduleNumber: mod.number,
            moduleName: mod.name,
            moduleSlug: mSlug,
            lessonSlug: les.slug,
            title: les.title,
            description: les.description,
            tags: les.tags || [],
          });
        }
      }
    }
    return list;
  }, []);

  // Filter lessons based on search query
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return allLessons.slice(0, 8); // Default recommendations
    const q = query.toLowerCase().trim();
    return allLessons.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.trackName.toLowerCase().includes(q) ||
        item.moduleName.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [query, allLessons]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Keyboard navigation within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
      } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
        e.preventDefault();
        const target = filteredResults[selectedIndex];
        window.location.href = `/learn/${target.trackSlug}/${target.moduleSlug}/${target.lessonSlug}`;
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  // Auto scroll selected item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-bg border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-bg2/50">
          <Search className="h-5 w-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, tracks, topics (e.g. reentrancy, ERC-4337, gas)..."
            className="flex-1 bg-transparent text-text placeholder:text-muted/60 text-sm font-sans outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-dim hover:text-text rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] text-muted border border-border rounded bg-bg3">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div 
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-border/20"
        >
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <BookOpen className="h-8 w-8 text-dim mx-auto" />
              <p className="text-sm font-semibold text-text">No matching lessons found</p>
              <p className="text-xs text-muted">Try searching for terms like &quot;solidity&quot;, &quot;redis&quot;, or &quot;zk proof&quot;</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const lessonUrl = `/learn/${item.trackSlug}/${item.moduleSlug}/${item.lessonSlug}`;

              return (
                <Link
                  key={`${item.trackSlug}-${item.moduleSlug}-${item.lessonSlug}`}
                  href={lessonUrl}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`block p-3 rounded-xl transition-colors text-left ${
                    isSelected
                      ? "bg-accent/10 border-accent/30"
                      : "hover:bg-bg3/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
                      <span
                        className="font-bold px-1.5 py-0.2 rounded"
                        style={{
                          color: item.trackColor,
                          backgroundColor: `${item.trackColor}15`,
                        }}
                      >
                        {item.trackNumber}
                      </span>
                      <span className="text-dim">/</span>
                      <span className="text-muted">{item.moduleNumber}</span>
                    </div>

                    {isSelected && (
                      <span className="hidden sm:flex items-center gap-1 font-mono text-[9px] text-accent font-semibold">
                        <span>Select</span>
                        <CornerDownLeft className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-text tracking-tight mb-1">
                    {item.title}
                  </h5>

                  <p className="text-xs text-muted line-clamp-1 mb-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] text-dim bg-bg3 px-1.5 py-0.5 rounded border border-border/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-border bg-bg2/40 flex items-center justify-between text-[11px] font-mono text-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 border border-border rounded bg-bg3">↑</kbd> <kbd className="px-1.5 py-0.5 border border-border rounded bg-bg3">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 border border-border rounded bg-bg3">↵</kbd> Open</span>
          </div>
          <span>{filteredResults.length} lessons</span>
        </div>

      </div>
    </div>
  );
}
