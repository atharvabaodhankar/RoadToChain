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
          <div id="roadmap-blueprint" className="lg:col-span-6 relative border border-border p-6 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between" style={{
            background: "var(--bg2)",
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "center"
          }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4 font-mono text-[10px] relative z-10">
              <div className="flex items-center gap-1.5 uppercase text-text font-bold tracking-wider">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                SYSTEM ARCHITECTURE DESIGN BOARD
              </div>
              <div className="text-dim">
                Hand-sketched blueprint &bull; Live interactive
              </div>
            </div>

            {/* Sketch SVG Map with Hand-drawn Aesthetic */}
            <div className="mt-2 overflow-x-auto relative z-10 bg-bg/90 p-4 rounded-xl border border-border/80 shadow-sm">
              <svg viewBox="0 0 540 180" className="w-full min-w-[420px]">
                <defs>
                  {/* Rough sketch arrow head */}
                  <marker id="sketch-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 1 L 6 3 L 0 5 Z" fill="none" stroke="var(--text-secondary)" strokeWidth="1.2" />
                  </marker>
                </defs>

                {/* Hand-drawn connection curves */}
                {/* T0 -> T1 */}
                <path 
                  d="M 70 90 Q 95 87, 120 90" 
                  fill="none"
                  stroke={activeTrackId >= 1 || hoveredTrackId === 1 ? "#3b82f6" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2 2 2"
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T1 -> T2 */}
                <path 
                  d="M 175 90 Q 200 93, 220 90" 
                  fill="none"
                  stroke={activeTrackId >= 2 || hoveredTrackId === 2 ? "#14b8a6" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2 2 2"
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                
                {/* T2 -> T3 */}
                <path 
                  d="M 275 80 Q 295 50, 320 40" 
                  fill="none"
                  stroke={activeTrackId >= 3 || hoveredTrackId === 3 ? "#22c55e" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T2 -> T4 */}
                <path 
                  d="M 275 90 Q 295 90, 320 90" 
                  fill="none"
                  stroke={activeTrackId >= 4 || hoveredTrackId === 4 ? "#f59e0b" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T2 -> T5 */}
                <path 
                  d="M 275 100 Q 295 130, 320 140" 
                  fill="none"
                  stroke={activeTrackId >= 5 || hoveredTrackId === 5 ? "#ec4899" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />

                {/* T3 -> T6 */}
                <path 
                  d="M 375 40 Q 395 40, 420 40" 
                  fill="none"
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T4 -> T6 */}
                <path 
                  d="M 375 80 Q 395 60, 420 50" 
                  fill="none"
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T4 -> T7 */}
                <path 
                  d="M 375 100 Q 395 120, 420 130" 
                  fill="none"
                  stroke={activeTrackId >= 7 || hoveredTrackId === 7 ? "#06b6d4" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />
                {/* T5 -> T7 */}
                <path 
                  d="M 375 140 Q 395 140, 420 140" 
                  fill="none"
                  stroke={activeTrackId >= 7 || hoveredTrackId === 7 ? "#06b6d4" : "var(--border3)"} 
                  strokeWidth="1.5" 
                  className="transition-all duration-300"
                  markerEnd="url(#sketch-arrow)" 
                />

                {/* Level indicators */}
                <g opacity="0.4" className="font-mono text-[7px]">
                  <text x="40" y="170" textAnchor="middle" fill="var(--text-secondary)">[T0 FOUNDATIONS]</text>
                  <text x="145" y="170" textAnchor="middle" fill="var(--text-secondary)">[T1 CONTRACTS]</text>
                  <text x="245" y="170" textAnchor="middle" fill="var(--text-secondary)">[T2 FULL-STACK]</text>
                  <text x="390" y="170" textAnchor="middle" fill="var(--text-secondary)">[SPECIALISATIONS]</text>
                </g>

                {/* Hand-sketched T0 Node */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredTrackId(0)}
                  onMouseLeave={() => setHoveredTrackId(null)}
                  onClick={() => scrollToTrack(0)}
                >
                  <circle cx="40" cy="90" r="22" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="30 5 10 5" />
                  <circle cx="40" cy="90" r="16" fill="var(--accent)" opacity="0.1" />
                  <text x="40" y="87" textAnchor="middle" fill="var(--text)" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">T0</text>
                  <text x="40" y="97" textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-geist-mono)" fontSize="7">Start</text>
                </g>

                {/* Sketch Nodes T1 - T7 */}
                {[
                  { id: 1, x: 120, y: 68, label: "T1", sub: "Solidity" },
                  { id: 2, x: 220, y: 68, label: "T2", sub: "Full-Stack" },
                  { id: 3, x: 320, y: 18, label: "T3", sub: "Sys Design" },
                  { id: 4, x: 320, y: 68, label: "T4", sub: "Modern UX" },
                  { id: 5, x: 320, y: 118, label: "T5", sub: "ZK Privacy" },
                  { id: 6, x: 420, y: 18, label: "T6", sub: "Security" },
                  { id: 7, x: 420, y: 118, label: "T7", sub: "Real Sys" },
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
                      {/* Slightly rotated card backdrops to simulate raw hand-drawn whiteboard notes */}
                      <rect 
                        x={node.x} 
                        y={node.y} 
                        width="55" 
                        height="44" 
                        rx="4" 
                        fill={isActive ? "var(--bg3)" : "var(--bg)"} 
                        stroke={isActive || isHovered ? nodeColor : "var(--border3)"} 
                        strokeWidth="1.5" 
                        strokeDasharray={isActive || isHovered ? "none" : "30 2 10 2"}
                        style={{
                          transform: isHovered ? "rotate(-1deg)" : "none",
                          transformOrigin: `${node.x + 27}px ${node.y + 22}px`,
                          transition: "all 0.2s ease"
                        }}
                      />
                      
                      <text 
                        x={node.x + 27} 
                        y={node.y + 18} 
                        textAnchor="middle" 
                        fill="var(--text)" 
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="9.5" 
                        fontWeight="bold"
                      >
                        {node.label}
                      </text>
                      
                      <text 
                        x={node.x + 27} 
                        y={node.y + 32} 
                        textAnchor="middle" 
                        fill="var(--text-secondary)" 
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="7" 
                      >
                        {node.sub}
                      </text>
                    </g>
                  );
                })}
              </svg>
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
