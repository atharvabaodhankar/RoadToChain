"use client";

import Link from "next/link";
import { Lesson } from "@/lib/curriculum";
import { Star } from "lucide-react";
import LessonStatusBadge from "@/components/layout/LessonStatusBadge";


interface LessonItemProps {
  lesson: Lesson;
  trackSlug: string;
  moduleSlug: string;
  lessonIndex: number;
  trackColor: string;
}

export default function LessonItem({
  lesson,
  trackSlug,
  moduleSlug,
  lessonIndex,
  trackColor,
}: LessonItemProps) {
  // Format lesson number as double digits (e.g. 01, 02)
  const lessonNumber = String(lessonIndex + 1).padStart(2, "0");

  return (
    <Link
      href={`/learn/${trackSlug}/${moduleSlug}/${lesson.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-border bg-bg2 p-4 transition-all duration-200 hover:border-border2 hover:bg-bg3 sm:flex-row sm:items-center sm:gap-6"
    >
      <div className="flex gap-4">
        {/* Lesson Number Indicator */}
        <span
          className="mt-0.5 font-mono text-sm font-semibold sm:mt-0"
          style={{ color: trackColor }}
        >
          {lessonNumber}
        </span>

        {/* Text details */}
        <div>
          <h4 className="font-sans text-sm font-semibold tracking-tight text-text transition-colors group-hover:text-text/90">
            {lesson.title}
          </h4>
          <p className="mt-1 text-xs text-muted max-w-2xl leading-normal">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Badges/Tags block */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-0 sm:justify-end">
        <LessonStatusBadge
          trackSlug={trackSlug}
          moduleSlug={moduleSlug}
          lessonSlug={lesson.slug}
          trackColor={trackColor}
        />
        {lesson.isRealProject && (
          <span className="inline-flex items-center gap-1 rounded bg-pink-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-pink-400 border border-pink-500/20">
            <Star className="h-2.5 w-2.5 fill-pink-400" /> REAL PROJECT
          </span>
        )}
        {lesson.hasDiagram && (
          <span className="rounded bg-bg4 px-1.5 py-0.5 font-mono text-[9px] text-muted border border-border flex items-center gap-1">
            diagram
          </span>
        )}
        {lesson.hasMistake && (
          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-400 border border-amber-500/20 flex items-center gap-1">
            mistake
          </span>
        )}
        {lesson.hasProject && (
          <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] text-accent border border-accent/20 flex items-center gap-1">
            project
          </span>
        )}
        <span className="rounded bg-bg4 px-1.5 py-0.5 font-mono text-[9px] text-dim border border-border">
          {lesson.estimatedMinutes} mins
        </span>
      </div>
    </Link>
  );
}
