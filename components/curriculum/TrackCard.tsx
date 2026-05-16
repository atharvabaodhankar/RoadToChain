"use client";

import Link from "next/link";
import { Track } from "@/lib/curriculum";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TrackCardProps {
  track: Track;
  index: number;
}

export default function TrackCard({ track, index }: TrackCardProps) {
  // Topics compiled from lesson tags (unique values, showing first 5)
  const allTags = Array.from(
    new Set(track.modules.flatMap((m) => m.lessons.flatMap((l) => l.tags)))
  ).slice(0, 5);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "intermediate":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "advanced":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "expert":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-muted bg-muted/10 border-border";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between rounded-xl border border-border bg-bg2 p-6 transition-all duration-200 hover:border-border2 hover:bg-bg3"
    >
      {/* Accent Bar */}
      <div
        className="absolute bottom-6 top-6 left-0 w-[3px] rounded-r"
        style={{ backgroundColor: track.color }}
      />

      <div className="pl-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-dim">
            {track.number}
          </span>
          <div className="flex items-center gap-1.5">
            {track.isSignature && (
              <span className="inline-flex items-center gap-1 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent border border-accent/30">
                <Star className="h-2.5 w-2.5 fill-accent" /> SIGNATURE
              </span>
            )}
            <span className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium capitalize tracking-tight ${getDifficultyColor(track.difficulty)}`}>
              {track.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="mt-3 font-sans text-lg font-semibold tracking-tight text-text transition-colors group-hover:text-accent">
          {track.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted font-medium">
          {track.tagline}
        </p>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-dim">
          {track.description}
        </p>

        {/* Tag pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-bg4 px-1.5 py-0.5 font-mono text-[10px] text-muted border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / CTA block */}
      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 pl-3">
        <span className="font-mono text-[11px] text-dim">
          {track.moduleCount} modules · {track.lessonCount} lessons · {track.estimatedHours}h
        </span>
        <Link
          href={`/learn/${track.slug}`}
          className="inline-flex items-center gap-1 font-mono text-xs font-medium transition-all group-hover:gap-1.5"
          style={{ color: track.color }}
        >
          Begin Track <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
