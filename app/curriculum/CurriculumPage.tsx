"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Track } from "@/lib/curriculum";
import ModuleAccordion from "@/components/curriculum/ModuleAccordion";
import { ArrowRight, Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

interface CurriculumPageProps {
  tracks: Track[];
}

export default function CurriculumPage({ tracks }: CurriculumPageProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          {...fadeUp}
          animate={fadeUp.animate}
          initial={fadeUp.initial}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
            {"// curriculum"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            8 Tracks. One Path.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Every track is built around a real shipped project. Every lesson feeds the capstone. You never wonder why you&apos;re learning something.
          </p>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "Tracks", value: "8" },
              { label: "Lessons", value: "40+" },
              { label: "Real Projects", value: "12" },
              { label: "Hype Level", value: "0" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl font-bold text-text">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-dim">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Dependency Graph ─────────────────────────────────── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
            {"// prerequisite graph"}
          </p>

          {/* SVG Dependency Graph */}
          <div className="overflow-x-auto rounded-xl border border-border bg-bg2 p-6">
            <svg viewBox="0 0 820 280" className="w-full min-w-[600px]">
              {/* Node definitions as groups */}
              {/* T0 */}
              <g>
                <rect x="20" y="110" width="90" height="44" rx="8" fill="#18181b" stroke="#7c3aed" strokeWidth="1.5" />
                <text x="65" y="128" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T0</text>
                <text x="65" y="143" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Foundations</text>
              </g>
              {/* Arrow T0→T1 */}
              <path d="M 110 132 L 155 132" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* T1 */}
              <g>
                <rect x="155" y="110" width="90" height="44" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="200" y="128" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T1</text>
                <text x="200" y="143" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Solidity</text>
              </g>
              {/* Arrow T1→T2 */}
              <path d="M 245 132 L 290 132" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* T2 */}
              <g>
                <rect x="290" y="110" width="90" height="44" rx="8" fill="#18181b" stroke="#14b8a6" strokeWidth="1.5" />
                <text x="335" y="128" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T2</text>
                <text x="335" y="143" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Full Stack</text>
              </g>
              {/* Arrow T2→T3 (top) */}
              <path d="M 380 118 L 430 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* Arrow T2→T4 (middle) */}
              <path d="M 380 132 L 430 132" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* Arrow T2→T5 (bottom, also T1→T5) */}
              <path d="M 380 146 L 430 194" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* T3 */}
              <g>
                <rect x="430" y="48" width="90" height="44" rx="8" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" />
                <text x="475" y="66" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T3</text>
                <text x="475" y="81" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Sys Design</text>
              </g>
              {/* T4 */}
              <g>
                <rect x="430" y="110" width="90" height="44" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
                <text x="475" y="128" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T4 ★</text>
                <text x="475" y="143" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Modern UX</text>
              </g>
              {/* T5 */}
              <g>
                <rect x="430" y="172" width="90" height="44" rx="8" fill="#18181b" stroke="#ec4899" strokeWidth="2" />
                <text x="475" y="190" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T5 ★</text>
                <text x="475" y="205" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">ZK & Privacy</text>
              </g>
              {/* Arrows to T6 */}
              <path d="M 520 70 L 600 132" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              <path d="M 520 132 L 600 132" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* Arrows to T7 */}
              <path d="M 520 194 L 600 200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />
              {/* T6 */}
              <g>
                <rect x="600" y="110" width="90" height="44" rx="8" fill="#18181b" stroke="#f97316" strokeWidth="1.5" />
                <text x="645" y="128" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T6</text>
                <text x="645" y="143" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Security</text>
              </g>
              {/* T7 */}
              <g>
                <rect x="600" y="182" width="90" height="44" rx="8" fill="#18181b" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="645" y="200" textAnchor="middle" fill="#fafafa" fontFamily="var(--font-geist-mono)" fontSize="11" fontWeight="bold">T7</text>
                <text x="645" y="215" textAnchor="middle" fill="#a1a1aa" fontFamily="var(--font-geist-mono)" fontSize="9">Real Systems</text>
              </g>
              {/* Arrow T6→T7 */}
              <path d="M 645 154 L 645 182" stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#arrow)" />

              {/* Arrowhead marker */}
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.2)" />
                </marker>
              </defs>
            </svg>
          </div>

          <p className="mt-3 font-mono text-[10px] text-dim text-center">
            {"// ★ = Signature Tracks. Arrows indicate prerequisites."}
          </p>
        </div>
      </section>

      {/* ── Full Track List ──────────────────────────────────────── */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {tracks.map((track, trackIdx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: trackIdx * 0.05 }}
              className="overflow-hidden rounded-xl border border-border"
            >
              {/* Track Header */}
              <div
                className="flex items-start justify-between gap-4 border-b border-border p-5"
                style={{ borderLeft: `3px solid ${track.color}` }}
              >
                <div className="flex-1 pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-dim">
                      {track.number}
                    </span>
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium capitalize border"
                      style={{
                        color: track.color,
                        backgroundColor: `${track.color}15`,
                        borderColor: `${track.color}30`,
                      }}
                    >
                      {track.difficulty}
                    </span>
                    {track.isSignature && (
                      <span className="inline-flex items-center gap-1 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent border border-accent/30">
                        <Star className="h-2.5 w-2.5 fill-accent" /> Signature
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-sans text-lg font-semibold tracking-tight text-text">
                    {track.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted">{track.description}</p>
                  <div className="mt-2 font-mono text-[11px] text-dim">
                    {track.moduleCount} modules · {track.lessonCount} lessons · ~{track.estimatedHours}h
                    {track.prerequisites.length > 0 && (
                      <span className="ml-3">
                        Prereq: {track.prerequisites.map((p) => `T${p}`).join(" + ")}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/learn/${track.slug}`}
                  className="hidden shrink-0 items-center gap-1 font-mono text-xs font-medium sm:flex"
                  style={{ color: track.color }}
                >
                  Begin Track <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Hero Project Callout */}
              <div className="border-b border-border bg-bg2 px-5 py-3">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-accent fill-accent/20" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                    Hero Project:
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {track.heroProject.name}
                  </span>
                </div>
              </div>

              {/* Modules Accordion */}
              <div className="divide-y divide-border/50">
                {track.modules.map((module, moduleIdx) => (
                  <ModuleAccordion
                    key={module.id}
                    module={module}
                    trackSlug={track.slug}
                    trackColor={track.color}
                    defaultOpen={moduleIdx === 0 && trackIdx === 0}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
