"use client";

import { useProgress } from "@/app/context/ProgressContext";
import { Check } from "lucide-react";

interface LessonStatusBadgeProps {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export default function LessonStatusBadge({
  trackSlug,
  moduleSlug,
  lessonSlug,
}: LessonStatusBadgeProps) {
  const { isComplete } = useProgress();
  const completed = isComplete(trackSlug, moduleSlug, lessonSlug);

  if (!completed) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-bg shrink-0 shadow-sm border animate-fade-in"
      style={{
        backgroundColor: "#10b981",
        borderColor: "#10b98120",
        color: "#ffffff",
      }}
    >
      <Check className="h-2.5 w-2.5 stroke-[3]" />
      <span>COMPLETED</span>
    </span>
  );
}
