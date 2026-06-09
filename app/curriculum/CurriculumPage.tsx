"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Track } from "@/lib/curriculum";
import ModuleAccordion from "@/components/curriculum/ModuleAccordion";
import { Star, Cpu, ArrowUpRight } from "lucide-react";

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
          <div id="roadmap-blueprint" className="lg:col-span-6 relative bg-bg2/40 border border-border p-6 rounded-2xl backdrop-blur-md overflow-hidden">
            <div className="absolute top-3 left-4 font-mono text-[9px] text-dim uppercase tracking-widest">
              {"// PREREQUISITE NETWORK BLUEPRINT"}
            </div>
            
            <div className="mt-4 overflow-x-auto">
              <svg viewBox="0 0 540 240" className="w-full min-w-[420px]">
                {/* Arrowhead Marker */}
                <defs>
                  <marker id="glow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--border3)" />
                  </marker>
                </defs>

                {/* Connection Lines with interactive highlighting */}
                {/* T0 -> T1 */}
                <path 
                  d="M 65 120 L 125 120" 
                  stroke={activeTrackId >= 1 || hoveredTrackId === 1 ? "#3b82f6" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 1 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T1 -> T2 */}
                <path 
                  d="M 185 120 L 245 120" 
                  stroke={activeTrackId >= 2 || hoveredTrackId === 2 ? "#14b8a6" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 2 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                
                {/* T2 -> T3 (Top) */}
                <path 
                  d="M 305 110 L 365 60" 
                  stroke={activeTrackId >= 3 || hoveredTrackId === 3 ? "#22c55e" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 3 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T2 -> T4 (Middle) */}
                <path 
                  d="M 305 120 L 365 120" 
                  stroke={activeTrackId >= 4 || hoveredTrackId === 4 ? "#f59e0b" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 4 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                {/* T2 -> T5 (Bottom) */}
                <path 
                  d="M 305 130 L 365 180" 
                  stroke={activeTrackId >= 5 || hoveredTrackId === 5 ? "#ec4899" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 5 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />

                {/* T3/T4 -> T6 */}
                <path 
                  d="M 425 60 L 485 105" 
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 6 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                <path 
                  d="M 425 120 L 485 120" 
                  stroke={activeTrackId >= 6 || hoveredTrackId === 6 ? "#f97316" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 6 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />
                
                {/* T5 -> T7 */}
                <path 
                  d="M 425 180 L 485 135" 
                  stroke={activeTrackId >= 7 || hoveredTrackId === 7 ? "#06b6d4" : "var(--border2)"} 
                  strokeWidth={hoveredTrackId === 7 ? "2" : "1.2"} 
                  className="transition-all duration-300"
                  markerEnd="url(#glow-arrow)" 
                />

                {/* GRAPH NODES */}
                {[
                  { id: 0, x: 25, y: 98, label: "T0", color: "#7c3aed", sub: "Foundations" },
                  { id: 1, x: 125, y: 98, label: "T1", color: "#3b82f6", sub: "Solidity" },
                  { id: 2, x: 245, y: 98, label: "T2", color: "#14b8a6", sub: "Full Stack" },
                  { id: 3, x: 365, y: 38, label: "T3", color: "#22c55e", sub: "System Design" },
                  { id: 4, x: 365, y: 98, label: "T4 ★", color: "#f59e0b", sub: "Modern UX" },
                  { id: 5, x: 365, y: 158, label: "T5 ★", color: "#ec4899", sub: "ZK Privacy" },
                  { id: 6, x: 465, y: 98, label: "T6", color: "#f97316", sub: "Security" },
                  { id: 7, x: 465, y: 158, label: "T7", color: "#06b6d4", sub: "Real Systems" },
                ].map((node) => {
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
                      <rect 
                        x={node.x} 
                        y={node.y} 
                        width="60" 
                        height="44" 
                        rx="8" 
                        fill={isActive ? "#111" : "#0d0d0f"} 
                        stroke={isActive || isHovered ? node.color : "rgba(255, 255, 255, 0.08)"} 
                        strokeWidth={isActive || isHovered ? "1.8" : "1"} 
                        className="transition-all duration-300"
                      />
                      
                      {/* Glow effect on active/hover */}
                      {(isActive || isHovered) && (
                        <rect 
                          x={node.x - 2} 
                          y={node.y - 2} 
                          width="64" 
                          height="48" 
                          rx="10" 
                          fill="none" 
                          stroke={node.color} 
                          strokeWidth="0.8" 
                          opacity="0.5" 
                          className="transition-all duration-300"
                        />
                      )}

                      <text 
                        x={node.x + 30} 
                        y={node.y + 18} 
                        textAnchor="middle" 
                        fill={isActive || isHovered ? "#fafafa" : "#a1a1aa"} 
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="10" 
                        fontWeight="bold"
                        className="transition-colors duration-300"
                      >
                        {node.label}
                      </text>
                      
                      <text 
                        x={node.x + 30} 
                        y={node.y + 32} 
                        textAnchor="middle" 
                        fill="#52525b" 
                        fontFamily="var(--font-geist-mono)" 
                        fontSize="7" 
                        fontWeight="normal"
                      >
                        {node.sub}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="mt-3 text-[9px] font-mono text-dim text-center uppercase tracking-wider">
              {"// hover nodes to map pathways • click to warp"}
            </div>
          </div>

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
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12 border-t border-border/40 scroll-mt-24 transition-opacity duration-700"
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              
              {/* Left Column: Labeled details, descriptions, Accordions */}
              <div className="lg:col-span-7 space-y-6">
                
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

              {/* Right Column: Handcrafted Futuristic Animated Schematic */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="relative bg-bg2/30 border border-border/50 p-6 rounded-2xl backdrop-blur-md overflow-hidden aspect-square flex flex-col justify-between">
                  {/* Decorative Border Glow */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${trackColor}0a 0%, transparent 70%)`,
                    }}
                  />
                  
                  {/* Monospace HUD Eyebrow */}
                  <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-dim uppercase tracking-widest border-b border-border/20 pb-2">
                    <span>{"// SCHEMATIC_CORE_T" + track.id}</span>
                    <span style={{ color: trackColor }}>SIMULATOR_ACTIVE</span>
                  </div>

                  {/* Dynamic Graphic Renders */}
                  <div className="relative z-10 flex-1 flex items-center justify-center py-4">
                    <AnimatePresence mode="wait">
                      {track.id === 0 && <TrackZeroSchematic key="t0" color={trackColor} />}
                      {track.id === 1 && <TrackOneSchematic key="t1" color={trackColor} />}
                      {track.id === 2 && <TrackTwoSchematic key="t2" color={trackColor} />}
                      {track.id === 3 && <TrackThreeSchematic key="t3" color={trackColor} />}
                      {track.id === 4 && <TrackFourSchematic key="t4" color={trackColor} />}
                      {track.id === 5 && <TrackFiveSchematic key="t5" color={trackColor} />}
                      {track.id === 6 && <TrackSixSchematic key="t6" color={trackColor} />}
                      {track.id === 7 && <TrackSevenSchematic key="t7" color={trackColor} />}
                    </AnimatePresence>
                  </div>

                  {/* HUD Info Box */}
                  <div className="relative z-10 font-mono text-[9px] text-dim bg-bg/60 p-2.5 rounded-lg border border-border/30">
                    <div className="flex justify-between text-muted">
                      <span>WORLD ID:</span>
                      <span className="text-text font-bold" style={{ color: trackColor }}>T0{track.id}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>FOCUS ENGINE:</span>
                      <span className="text-text uppercase tracking-tight font-semibold">
                        {track.id === 0 && "Consensus & Data Layer"}
                        {track.id === 1 && "EVM Storage slots"}
                        {track.id === 2 && "Dapp pipelines"}
                        {track.id === 3 && "Boundaries & Actors"}
                        {track.id === 4 && "Embedded social logs"}
                        {track.id === 5 && "Circom SNARK sandbox"}
                        {track.id === 6 && "Symmetric cryptographic vault"}
                        {track.id === 7 && "ChainCure supply chains"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 0: TRUSTLESS NETWORK SIMULATION ─────────────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackZeroSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Network Grid Base */}
      <circle cx="140" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
      <circle cx="140" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.02)" />

      {/* Connection Links */}
      <line x1="50" y1="60" x2="140" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="50" y1="60" x2="90" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="90" y1="140" x2="190" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="190" y1="140" x2="230" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="230" y1="60" x2="140" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="140" y1="40" x2="90" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="140" y1="40" x2="190" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Labeled Nodes */}
      <g>
        <circle cx="50" cy="60" r="14" fill="#0d0d0f" stroke={color} strokeWidth="1" />
        <text x="50" y="63" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">Tx</text>
        <text x="50" y="80" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">USER</text>
      </g>

      <g>
        <circle cx="140" cy="40" r="16" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <text x="140" y="43" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="7">MEM</text>
        <text x="140" y="20" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">MEMPOOL</text>
      </g>

      <g>
        <circle cx="90" cy="140" r="14" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <text x="90" y="143" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="7">N1</text>
      </g>

      <g>
        <circle cx="190" cy="140" r="14" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <text x="190" y="143" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="7">N2</text>
      </g>

      <g className="diagram-glow-breathe">
        <circle cx="230" cy="60" r="18" fill="#0d0d0f" stroke={color} strokeWidth="1.5" />
        <text x="230" y="63" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8" fontWeight="bold">BLOCK</text>
        <text x="230" y="84" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">CHAIN</text>
      </g>

      {/* Pulsing Labeled Packets moving User -> Mem -> Block */}
      <circle cx="95" cy="50" r="2.5" fill={color} className="diagram-packet-move" />
      <circle cx="185" cy="50" r="2.5" fill={color} className="diagram-flow-pulse" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 1: SMART CONTRACT BYTECODE SANDBOX ──────────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackOneSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Schematic Layout: Left inputs flow into a center vault with bytecode falls */}
      
      {/* Code snippets on Left */}
      <rect x="10" y="30" width="80" height="32" rx="4" fill="#0d0d0f" stroke="rgba(255,255,255,0.06)" />
      <text x="16" y="44" fill={color} fontFamily="var(--font-geist-mono)" fontSize="7">mapping(addr =&gt; uint)</text>
      <text x="16" y="54" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">balances;</text>

      <rect x="10" y="74" width="80" height="32" rx="4" fill="#0d0d0f" stroke="rgba(255,255,255,0.06)" />
      <text x="16" y="88" fill={color} fontFamily="var(--font-geist-mono)" fontSize="7">function withdraw()</text>
      <text x="16" y="98" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">external nonReentrant</text>

      {/* Compiled Bytecode fall visual in background */}
      <g opacity="0.15">
        <text x="120" y="40" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">0x6080</text>
        <text x="120" y="60" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">0x3560</text>
        <text x="120" y="80" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">0x5556</text>
        <text x="120" y="100" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">0xfd5b</text>
        <text x="120" y="120" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">0x565b</text>
      </g>

      {/* Compiler Process Line */}
      <path d="M 90 85 L 140 85" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 140 85 L 175 85" stroke={color} strokeWidth="1.2" markerEnd="url(#glow-arrow)" className="diagram-flow-pulse" />

      {/* Contract Safe Node */}
      <g>
        <rect x="175" y="55" width="80" height="60" rx="8" fill="#0d0d0f" stroke={color} strokeWidth="1.5" className="diagram-glow-breathe" />
        {/* Labeled inner lock dial */}
        <circle cx="215" cy="85" r="14" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        <circle cx="215" cy="85" r="6" fill="none" stroke={color} strokeWidth="1.5" />
        <text x="215" y="128" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="7" fontWeight="bold">SECURE_EVM</text>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 2: DAPP REQUEST ROUTING PIPELINE ────────────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackTwoSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Visual routing flow: React Dapp -> JSON RPC -> EVM Node */}
      
      {/* React Frontend Node */}
      <g>
        <rect x="15" y="70" width="65" height="50" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        {/* Atom symbol */}
        <ellipse cx="47" cy="90" rx="14" ry="5" fill="none" stroke={color} opacity="0.3" transform="rotate(30, 47, 90)" />
        <ellipse cx="47" cy="90" rx="14" ry="5" fill="none" stroke={color} opacity="0.3" transform="rotate(-30, 47, 90)" />
        <circle cx="47" cy="90" r="3" fill={color} />
        <text x="47" y="132" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">FRONTEND</text>
      </g>

      {/* JSON-RPC Request Flow Line */}
      <path d="M 80 95 L 140 95" stroke={color} strokeWidth="1.2" className="diagram-flow-pulse" />
      <text x="110" y="88" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">eth_call</text>

      {/* RPC Node gateway */}
      <g>
        <circle cx="160" cy="95" r="20" fill="#0d0d0f" stroke={color} strokeWidth="1.5" className="diagram-glow-breathe" />
        <text x="160" y="98" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">RPC</text>
        <text x="160" y="125" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">GATEWAY</text>
      </g>

      {/* Blockchain endpoint */}
      <path d="M 180 95 L 225 95" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      
      <g>
        <rect x="225" y="75" width="40" height="40" rx="4" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        <text x="245" y="98" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">CHAIN</text>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 3: SYSTEM TRUST BOUNDARIES & ACTORS ────────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackThreeSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* 2x2 Grid representing modular Actor boxes with labeled trust boundaries */}
      <rect x="15" y="15" width="250" height="170" rx="10" fill="none" stroke="rgba(255,255,255,0.02)" strokeDasharray="5 5" />
      
      {/* Trust boundary line */}
      <line x1="140" y1="15" x2="140" y2="185" stroke="rgba(255,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="135" y="30" textAnchor="end" fill="rgba(255,0,0,0.5)" fontFamily="var(--font-geist-mono)" fontSize="6">TRUST BOUNDARY</text>

      {/* Actor Nodes */}
      {/* Actor 1: Supplier */}
      <g>
        <rect x="25" y="35" width="85" height="45" rx="6" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="67" y="55" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="9" fontWeight="bold">Supplier</text>
        <text x="67" y="68" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">ROLE_ADMIN</text>
      </g>

      {/* Actor 2: Manufacturer */}
      <g>
        <rect x="170" y="35" width="85" height="45" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="212" y="55" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="9">Manufacturer</text>
        <text x="212" y="68" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">ROLE_USER</text>
      </g>

      {/* Actor 3: Distributor */}
      <g>
        <rect x="25" y="115" width="85" height="45" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="67" y="135" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="9">Distributor</text>
        <text x="67" y="148" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">ROLE_USER</text>
      </g>

      {/* Actor 4: Pharmacy */}
      <g>
        <rect x="170" y="115" width="85" height="45" rx="6" fill="#0d0d0f" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="212" y="135" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="9">Pharmacy</text>
        <text x="212" y="148" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">ROLE_USER</text>
      </g>

      {/* Labeled arrows connecting actors across the boundary */}
      <path d="M 110 57 L 170 57" stroke="rgba(255,255,255,0.15)" strokeWidth="1" markerEnd="url(#glow-arrow)" />
      <path d="M 212 80 L 212 115" stroke="rgba(255,255,255,0.15)" strokeWidth="1" markerEnd="url(#glow-arrow)" />
      <path d="M 170 138 L 110 138" stroke={color} strokeWidth="1.2" strokeDasharray="3 1" markerEnd="url(#glow-arrow)" className="diagram-flow-pulse" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 4: EMBEDDED ACCOUNT ABSTRACTION PHONESHOT ───────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackFourSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Labeled phone mockup */}
      <g>
        {/* Phone Case */}
        <rect x="75" y="10" width="130" height="180" rx="16" fill="#0d0d0f" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        {/* Notch */}
        <rect x="125" y="10" width="30" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
        
        {/* App Content */}
        <text x="140" y="36" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="10" fontWeight="bold">Socio3 Evolution</text>
        
        {/* Glassmorphic Auth Box */}
        <rect x="87" y="52" width="106" height="34" rx="6" fill="rgba(255,255,255,0.03)" stroke={color} strokeWidth="0.8" />
        <circle cx="102" cy="69" r="6" fill={color} />
        <text x="115" y="72" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="7" fontWeight="bold">Social Onboard</text>
        <text x="100" y="80" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="4">GOOGLE CREDENTIAL</text>

        {/* Dynamic transaction badge */}
        <rect x="87" y="96" width="106" height="42" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
        <text x="95" y="110" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">SMART_ACCOUNT:</text>
        <text x="95" y="120" fill={color} fontFamily="var(--font-geist-mono)" fontSize="6" fontWeight="bold">0xPrivy_4337...</text>
        
        {/* Labeled Gas Sponsor tag */}
        <rect x="95" y="126" width="60" height="8" rx="2" fill={`${color}20`} stroke={`${color}40`} />
        <text x="125" y="132" textAnchor="middle" fill={color} fontFamily="var(--font-geist-mono)" fontSize="4" fontWeight="bold">GAS_SPONSORED_100%</text>

        {/* Action Button */}
        <rect x="92" y="152" width="96" height="24" rx="12" fill={color} className="diagram-glow-breathe" />
        <text x="140" y="166" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="8" fontWeight="bold">Gasless Ship</text>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 5: ZERO-KNOWLEDGE PROOF SANDBOX ────────────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackFiveSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Left Input Vault */}
      <g>
        <rect x="15" y="45" width="70" height="110" rx="8" fill="#0d0d0f" stroke="rgba(255,255,255,0.08)" />
        <text x="50" y="35" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">PRIVATE DATA</text>
        
        {/* Labeled secrets */}
        <rect x="23" y="60" width="54" height="20" rx="4" fill="#18181b" />
        <text x="28" y="72" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="7">CGPA: 3.9</text>
        
        <rect x="23" y="90" width="54" height="20" rx="4" fill="#18181b" />
        <text x="28" y="102" fill="#ef4444" fontFamily="var(--font-geist-mono)" fontSize="7">AGE: 21</text>
      </g>

      {/* Prover circuit path */}
      <path d="M 85 100 L 135 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="110" cy="100" r="3" fill={color} className="diagram-packet-move" />

      {/* ZK SNARK Prover sandbox */}
      <g>
        <circle cx="165" cy="100" r="26" fill="#0d0d0f" stroke={color} strokeWidth="1.5" className="diagram-glow-breathe" />
        <text x="165" y="102" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">Circom</text>
        <text x="165" y="140" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="6">ZK_PROVER</text>
      </g>

      {/* Proof output */}
      <path d="M 191 100 L 235 100" stroke={color} strokeWidth="1.2" markerEnd="url(#glow-arrow)" className="diagram-flow-pulse" />
      
      {/* Proof indicator */}
      <g>
        <rect x="235" y="70" width="35" height="60" rx="6" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="252" y="85" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="bold">✔</text>
        <text x="252" y="105" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="6" fontWeight="bold">PROOF</text>
        <text x="252" y="118" textAnchor="middle" fill="#52525b" fontFamily="var(--font-geist-mono)" fontSize="5">VALID</text>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 6: CRYPTOGRAPHIC SHAMIR SECRETS VAULT ───────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackSixSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Reconstructed vaults dial surrounding with 5 key nodes */}
      <circle cx="140" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.02)" />

      {/* Central Dial Vault */}
      <g className="diagram-glow-breathe">
        <circle cx="140" cy="100" r="30" fill="#0d0d0f" stroke={color} strokeWidth="2" />
        <circle cx="140" cy="100" r="22" fill="none" stroke="rgba(255,255,255,0.06)" />
        <line x1="140" y1="70" x2="140" y2="80" stroke={color} strokeWidth="2" />
        {/* Labeled timeline dial */}
        <text x="140" y="103" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8" fontWeight="bold">TIMELOCK</text>
      </g>

      {/* Labeled key nodes surrounding the dial */}
      {/* S1 */}
      <g>
        <circle cx="140" cy="20" r="12" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        <text x="140" y="23" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">S1</text>
        <path d="M 140 32 L 140 70" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      </g>

      {/* S2 */}
      <g>
        <circle cx="215" cy="65" r="12" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="215" y="68" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="6" fontWeight="bold">S2</text>
        <path d="M 205 73 L 166 90" stroke={color} strokeWidth="1.2" className="diagram-flow-pulse" />
      </g>

      {/* S3 */}
      <g>
        <circle cx="185" cy="155" r="12" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        <text x="185" y="158" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">S3</text>
        <path d="M 176 146 L 156 125" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
      </g>

      {/* S4 */}
      <g>
        <circle cx="95" cy="155" r="12" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="95" y="158" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="6" fontWeight="bold">S4</text>
        <path d="M 104 146 L 124 125" stroke={color} strokeWidth="1.2" className="diagram-flow-pulse" />
      </g>

      {/* S5 */}
      <g>
        <circle cx="65" cy="65" r="12" fill="#0d0d0f" stroke="rgba(255,255,255,0.12)" />
        <text x="65" y="68" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="6">S5</text>
        <path d="M 75 73 L 114 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* ─── TRACK GRAPHIC 7: CHAINCURE SUPPLY LOGISTICS BLUEPRINT ────────────── */
/* ──────────────────────────────────────────────────────────────────────── */
function TrackSevenSchematic({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full max-h-[220px]">
      {/* Logistics flow mapping a package from Manufacturer to Public */}
      <path d="M 40 100 L 240 100" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      
      {/* Pulsing colored track line */}
      <path d="M 40 100 L 240 100" stroke={color} strokeWidth="1.5" strokeDasharray="10 5" className="diagram-packet-move" />

      {/* Milestone Checkpoint 1 */}
      <g>
        <circle cx="40" cy="100" r="14" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="40" y="103" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">M</text>
        <text x="40" y="130" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="7" fontWeight="bold">Factory</text>
        <text x="40" y="80" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="8">✔</text>
      </g>

      {/* Milestone Checkpoint 2 */}
      <g>
        <circle cx="105" cy="100" r="14" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="105" y="103" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">D</text>
        <text x="105" y="130" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist)" fontSize="7">Distributor</text>
        <text x="105" y="80" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="8">✔</text>
      </g>

      {/* Milestone Checkpoint 3 */}
      <g>
        <circle cx="175" cy="100" r="14" fill="#0d0d0f" stroke={color} strokeWidth="1.2" />
        <text x="175" y="103" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="8">P</text>
        <text x="175" y="130" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist)" fontSize="7">Pharmacy</text>
        <text x="175" y="80" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="8">✔</text>
      </g>

      {/* Milestone Checkpoint 4 */}
      <g className="diagram-glow-breathe">
        <circle cx="240" cy="100" r="16" fill="#0d0d0f" stroke={color} strokeWidth="1.5" />
        <text x="240" y="103" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="9" fontWeight="bold">Rx</text>
        <text x="240" y="130" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist)" fontSize="7" fontWeight="bold">Public</text>
        <text x="240" y="80" textAnchor="middle" fill="#22c55e" fontFamily="var(--font-geist-mono)" fontSize="8">✔</text>
      </g>
    </svg>
  );
}
