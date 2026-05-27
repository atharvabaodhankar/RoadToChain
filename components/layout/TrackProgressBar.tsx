"use client";

import { useProgress } from "@/app/context/ProgressContext";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface TrackProgressBarProps {
  trackSlug: string;
  totalLessons: number;
  trackColor?: string;
}

export default function TrackProgressBar({
  trackSlug,
  totalLessons,
  trackColor = "#7c3aed",
}: TrackProgressBarProps) {
  const { getCompletedCountForTrack, getTrackProgress } = useProgress();
  const completedCount = getCompletedCountForTrack(trackSlug);
  const progress = getTrackProgress(trackSlug, totalLessons);

  if (totalLessons === 0) return null;

  return (
    <div className="mt-6 border-t border-border/30 pt-6 max-w-xl">
      <div className="flex items-center justify-between font-mono text-xs text-dim mb-2.5">
        <span className="flex items-center gap-1.5 font-semibold text-muted">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: completedCount > 0 ? trackColor : "var(--color-dim)" }} />
          TRACK PROGRESS
        </span>
        <span className="text-text font-bold">{progress}% <span className="text-dim font-normal">({completedCount}/{totalLessons} lessons)</span></span>
      </div>
      
      {/* Progress Track */}
      <div className="relative h-2 w-full rounded-full bg-bg3 overflow-hidden border border-border/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            backgroundColor: trackColor,
            boxShadow: `0 0 10px ${trackColor}40`,
          }}
        />
      </div>
    </div>
  );
}
