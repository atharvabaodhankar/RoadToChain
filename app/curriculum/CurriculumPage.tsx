"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Track } from "@/lib/curriculum";
import ModuleAccordion from "@/components/curriculum/ModuleAccordion";
import { Star, Cpu, ArrowUpRight } from "lucide-react";
import GithubMetrics from "@/components/portfolio/GithubMetrics";

interface CurriculumPageProps {
  tracks: Track[];
}

export default function CurriculumPage({ tracks }: CurriculumPageProps) {
  const [activeTrackId, setActiveTrackId] = useState<number>(0);
  const [hoveredTrackId, setHoveredTrackId] = useState<number | null>(null);
  
  // Track colors for background morphing
  const trackColors = [
    "#7c3aed", // T0 Violet
    "#3b82f6", // T1 Blue
    "#14b8a6", // T2 Teal
    "#22c55e", // T3 Green
    "#f59e0b", // T4 Amber (Signature)
    "#ec4899", // T5 Pink (Signature)
    "#f97316", // T6 Orange
    "#06b6d4", // T7 Cyan
  ];

  const trackNames = [
    "Blockchain Foundations",
    "Smart Contract Engineering",
    "Full Stack Web3",
    "Blockchain System Design",
    "Modern UX & AA",
    "ZK & Privacy Engineering",
    "Security & Production",
    "Real-World Systems"
  ];

  // Set up intersection observer to track active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.15,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const trackId = parseInt(entry.target.id.replace("track-", ""), 10);
          if (!isNaN(trackId)) {
            setActiveTrackId(trackId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    tracks.forEach((track) => {
      const el = document.getElementById(`track-${track.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [tracks]);

  // Smooth scroll helper
  const scrollToTrack = (trackId: number) => {
    const el = document.getElementById(`track-${trackId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-text selection:bg-accent/30 overflow-x-hidden font-sans">

      {/* ── HERO HEADER SECTION ────────────────────────────────────────── */}
      <section className="relative z-10 border-b border-border px-4 pt-32 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg2/80 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted">
              <span 
                className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" 
                style={{ 
                  boxShadow: "0 0 8px var(--color-accent)",
                  animationDuration: "3s"
                }} 
              />
              8 Tracks &middot; One System
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-text font-sans">
              8 Tracks.<br />
              <span className="font-serif italic text-accent font-normal">
                One System.
              </span>
            </h1>
            
            <p className="max-w-md text-sm text-muted leading-relaxed font-sans">
              The evolution from a confused beginner to a production-grade systems engineer. <strong className="text-text font-semibold">Every track centres around a shipped, deployed product</strong> &mdash; not a toy demo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToTrack(0)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 font-mono text-xs font-semibold text-white transition-all hover:bg-accent-hover cursor-pointer"
              >
                Begin from Track 0 &rarr;
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("roadmap-blueprint");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else {
                    scrollToTrack(0);
                  }
                }}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-bg px-5 py-2.5 font-mono text-xs font-semibold text-muted hover:text-text hover:border-border2 transition-all cursor-pointer"
              >
                See the roadmap
              </button>
            </div>

            {/* Premium Interactive Stat Row */}
            <div className="pt-6 grid grid-cols-4 gap-4 border-t border-border">
              {[
                { label: "FOUNDATIONS", value: "T0" },
                { label: "SHIPPED PROJECTS", value: "12" },
                { label: "HOURS CONTENT", value: "~70h" },
                { label: "EXPERT SYSTEMS", value: "T7" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-mono text-base font-bold text-text tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[9px] text-dim tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rebuilt Interactive SVG Dependency Graph */}
          <div id="roadmap-blueprint" className="lg:col-span-6 relative bg-bg2/40 border border-border p-6 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 uppercase text-muted tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Prerequisite Map
              </div>
              <div className="text-dim">
                8 tracks &middot; 3 parallel paths
              </div>
            </div>

            {/* SVG graph */}
            <div className="mt-2 overflow-x-auto">
              <svg viewBox="0 0 540 260" className="w-full min-w-[420px]">
                {/* Arrowhead Marker */}
                <defs>
                  <marker id="glow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--border3)" />
                  </marker>
                </defs>

                {/* Connection Lines with interactive highlighting */}
                {/* T0 -> T1 */}
                <path 
                  d="M 88 110 L 120 110" 
                  stroke={activeTrackId >= 1 || hoveredTrackId === 1 ? "#3b82f6" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 1 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T1 -> T2 */}
                <path 
                  d="M 191 110 L 220 110" 
                  stroke={activeTrackId >= 2 || hoveredTrackId === 2 ? "#14b8a6" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 2 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                
                {/* T2 -> T3 (Top) */}
                <path 
                  d="M 291 102 L 320 58" 
                  stroke={activeTrackId >= 3 || hoveredTrackId === 3 ? "#22c55e" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 3 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T2 -> T4 (Middle) */}
                <path 
                  d="M 291 110 L 320 110" 
                  stroke={activeTrackId >= 4 || hoveredTrackId === 4 ? "#f59e0b" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 4 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T2 -> T5 (Bottom) */}
                <path 
                  d="M 291 118 L 320 162" 
                  stroke={activeTrackId >= 5 || hoveredTrackId === 5 ? "#ec4899" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 5 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />

                {/* T3 -> T6 */}
                <path 
                  d="M 391 50 L 420 50" 
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 6 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T4 -> T6 */}
                <path 
                  d="M 391 102 L 420 68" 
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 6 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T4 -> T7 */}
                <path 
                  d="M 391 118 L 420 152" 
                  stroke={activeTrackId >= 7 || hoveredTrackId === 7 ? "#06b6d4" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 7 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T5 -> T7 */}
                <path 
                  d="M 391 170 L 420 170" 
                  stroke={activeTrackId >= 7 || hoveredTrackId === 7 ? "#06b6d4" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 7 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />

                {/* Vertical dashed line between T6 and T7 */}
                <path 
                  d="M 456 80 L 456 140" 
                  stroke="var(--border)" 
                  strokeWidth="1.2" 
                  strokeDasharray="3 3" 
                  className="transition-all duration-300"
                />

                {/* Level indicators at the bottom */}
                <g opacity="0.6">
                  {/* Level 0 under T0 */}
                  <line x1="30" y1="225" x2="80" y2="225" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="55" y="240" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="8">Level 0</text>

                  {/* Level 1 under T1 */}
                  <line x1="131" y1="225" x2="181" y2="225" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="156" y="240" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="8">Level 1</text>

                  {/* Level 2 under T2 */}
                  <line x1="231" y1="225" x2="281" y2="225" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="256" y="240" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="8">Level 2</text>

                  {/* Specialisations under T3-T7 */}
                  <line x1="331" y1="225" x2="481" y2="225" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="406" y="240" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="8">Specialisations</text>
                </g>

                {/* T0 CIRCLE NODE */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredTrackId(0)}
                  onMouseLeave={() => setHoveredTrackId(null)}
                  onClick={() => scrollToTrack(0)}
                >
                  {/* Outer concentric rings */}
                  <circle cx="55" cy="110" r="30" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity={(activeTrackId === 0 || hoveredTrackId === 0) ? "0.2" : "0.08"} className="transition-all duration-300" />
                  <circle cx="55" cy="110" r="24" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity={(activeTrackId === 0 || hoveredTrackId === 0) ? "0.5" : "0.25"} className="transition-all duration-300" />
                  <circle cx="55" cy="110" r="18" fill="var(--accent)" />
                  <text x="55" y="108" textAnchor="middle" fill="white" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">T0</text>
                  <text x="55" y="117" textAnchor="middle" fill="white" opacity="0.8" fontFamily="var(--font-geist-mono)" fontSize="6">Start</text>
                  <text x="55" y="152" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="8">Foundation</text>
                </g>

                {/* GRAPH CARDS T1 - T7 */}
                {[
                  { id: 1, x: 125, y: 85, label: "T1", sub: "Solidity" },
                  { id: 2, x: 225, y: 85, label: "T2", sub: "Full Stack" },
                  { id: 3, x: 325, y: 25, label: "T3", sub: "Sys Design" },
                  { id: 4, x: 325, y: 85, label: "T4 ★", sub: "Modern UX", isSignature: true },
                  { id: 5, x: 325, y: 145, label: "T5 ★", sub: "ZK Privacy", isSignature: true },
                  { id: 6, x: 425, y: 25, label: "T6", sub: "Security" },
                  { id: 7, x: 425, y: 145, label: "T7", sub: "Real Systems" },
                ].map((node) => {
                  const nodeColor = trackColors[node.id];
                  const isActive = activeTrackId === node.id;
                  const isHovered = hoveredTrackId === node.id;
                  
                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredTrackId(node.id)}
                      onMouseLeave={() => setHoveredTrackId(null)}
                      onClick={() => scrollToTrack(node.id)}
                    >
                      {/* Signature glow box backdrops */}
                      {node.isSignature && (
                        <rect 
                          x={node.x - 2} 
                          y={node.y - 2} 
                          width="66" 
                          height="54" 
                          rx="8" 
                          fill={`${nodeColor}03`} 
                          stroke="none" 
                        />
                      )}

                      {/* Main Node Card */}
                      <rect 
                        x={node.x} 
                        y={node.y} 
                        width="62" 
                        height="50" 
                        rx="6" 
                        fill={isActive ? "var(--bg3)" : node.isSignature ? `${nodeColor}06` : "var(--bg)"} 
                        stroke={isActive || isHovered ? nodeColor : node.isSignature ? `${nodeColor}30` : "var(--border)"} 
                        strokeWidth={isActive || isHovered ? "1.5" : "1"} 
                        className="transition-all duration-300"
                      />
                      
                      {/* Left color bar accent */}
                      <path 
                        d={`M ${node.x} ${node.y + 6} L ${node.x} ${node.y + 44}`} 
                        stroke={nodeColor} 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />

                      <text 
                        x={node.x + 31} 
                        y={node.y + 20} 
                        textAnchor="middle" 
                        fill="var(--text)" 
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="10" 
                        fontWeight="bold"
                        className="transition-colors duration-300"
                      >
                        {node.label}
                      </text>
                      
                      <text 
                        x={node.x + 31} 
                        y={node.y + 36} 
                        textAnchor="middle" 
                        fill="var(--text-secondary)" 
                        opacity="0.8"
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="7.5" 
                        fontWeight="normal"
                      >
                        {node.sub}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Footer and Legend */}
            <div className="mt-4 border-t border-border/40 pt-4 flex flex-col gap-3 font-mono text-[9px]">
              <div className="text-center text-dim uppercase tracking-wider">
                Hover any track to preview &bull; T4 and T5 are parallel specialisations after T2
              </div>
              <div className="h-px bg-border/40 w-full" />
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-dim">
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-accent" />
                  <span>Track 0 (origin)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Signature track</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-xs leading-none">&rarr;</span>
                  <span>Prerequisite</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0 w-4 border-t border-dashed border-accent" />
                  <span>Active path</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Github Portfolio Integration */}
        <div className="mt-16 pt-12 border-t border-border/40">
          <GithubMetrics />
        </div>
      </section>

      {/* ── VERTICAL TRACK NAVIGATOR (Right Side Dots) ───────────────────── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3.5 bg-bg2/80 dark:bg-bg2/40 hover:bg-bg2/95 dark:hover:bg-bg2/70 border border-border/80 dark:border-border px-2 py-4.5 rounded-full backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => scrollToTrack(track.id)}
            className="group relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer focus:outline-none"
            aria-label={`Scroll to Track ${track.id}`}
          >
            {/* The Dot */}
            <div 
              className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-[1.4]"
              style={{
                backgroundColor: activeTrackId === track.id ? trackColors[track.id] : "var(--border3)",
                boxShadow: activeTrackId === track.id ? `0 0 8px ${trackColors[track.id]}` : "none",
                transform: activeTrackId === track.id ? "scale(1.3)" : "scale(1)"
              }}
            />
            
            {/* Tooltip on Hover */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-bg border border-border text-[9px] font-mono text-text whitespace-nowrap opacity-0 translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-xl backdrop-blur-md">
              <span className="font-bold" style={{ color: trackColors[track.id] }}>T{track.id}</span>
              <span className="text-dim"> &middot; </span>
              <span className="text-muted">{trackNames[track.id]}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── TRACKS SCROLL STORYTELLING SECTIONS ───────────────────────────── */}
      <section className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-36 pb-32">
        {tracks.map((track) => {
          const isActive = activeTrackId === track.id;
          const trackColor = trackColors[track.id];
          
          return (
            <div 
              key={track.id}
              id={`track-${track.id}`}
              className="pt-12 border-t border-border/40 scroll-mt-24 transition-opacity duration-700 flex justify-center"
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              
              {/* Central Column: Labeled details, descriptions, Accordions */}
              <div className="max-w-3xl w-full space-y-6">
                
                {/* Track Eyebrow */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-dim">
                    {"// TRACK " + track.number}
                  </span>
                  
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase border"
                    style={{
                      color: trackColor,
                      backgroundColor: `${trackColor}10`,
                      borderColor: `${trackColor}30`,
                    }}
                  >
                    {track.difficulty}
                  </span>
                  
                  {track.isSignature && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-accent border border-accent/30 animate-pulse-dot">
                      <Star className="h-2.5 w-2.5 fill-accent text-accent" /> Signature
                    </span>
                  )}
                </div>

                {/* Track Name */}
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text relative">
                  {track.name}
                  {/* Visual accent bar */}
                  <span 
                    className="absolute -left-4 top-1 bottom-1 w-[3px] rounded-full transition-all duration-500"
                    style={{ backgroundColor: trackColor }}
                  />
                </h2>

                {/* Track Tagline & Description */}
                <div className="space-y-3">
                  <p 
                    className="font-mono text-xs uppercase tracking-wider font-semibold"
                    style={{ color: trackColor }}
                  >
                    {track.tagline}
                  </p>
                  <p className="text-xs text-muted max-w-xl leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-4 py-2 border-y border-border/30 font-mono text-[10px] text-dim">
                  <div>MODULES: <span className="text-text">{track.moduleCount}</span></div>
                  <div>LESSONS: <span className="text-text">{track.lessonCount}</span></div>
                  <div>DURATION: <span className="text-text">~{track.estimatedHours}h</span></div>
                  {track.prerequisites.length > 0 && (
                    <div>PREREQUISITES: <span className="text-text">{track.prerequisites.map(p => `T${p}`).join(" + ")}</span></div>
                  )}
                </div>

                {/* Hero Project Spotlight Box */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-bg2/40 backdrop-blur p-5 space-y-2">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Cpu className="w-16 h-16" style={{ color: trackColor }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-accent/20" style={{ color: trackColor }} />
                    <span 
                      className="font-mono text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: trackColor }}
                    >
                      Hero Project Blueprint
                    </span>
                  </div>
                  <h4 className="font-sans text-sm font-semibold tracking-tight text-text">
                    {track.heroProject.name}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted max-w-xl">
                    {track.heroProject.description}
                  </p>
                </div>

                {/* Accordion List for Modules */}
                <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/40">
                  {track.modules.map((module, moduleIdx) => (
                    <ModuleAccordion
                      key={module.id}
                      module={module}
                      trackSlug={track.slug}
                      trackColor={trackColor}
                      defaultOpen={moduleIdx === 0 && track.id === 0}
                    />
                  ))}
                </div>

                {/* Action Link */}
                <div className="pt-2">
                  <Link
                    href={`/learn/${track.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-transform hover:translate-x-1"
                    style={{ color: trackColor }}
                  >
                    Enter this World <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          );
        })}
      </section>
    </div>
  );
}
