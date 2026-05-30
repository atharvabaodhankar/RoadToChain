"use client";

import { useEffect } from "react";
import { useProgress } from "@/app/context/ProgressContext";
import { Check, CheckCircle2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface LessonCompleteButtonProps {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  trackColor?: string;
}

export default function LessonCompleteButton({
  trackSlug,
  moduleSlug,
  lessonSlug,
  trackColor = "#7c3aed",
}: LessonCompleteButtonProps) {
  const { isComplete, markComplete, markIncomplete, trackLessonView } = useProgress();
  const completed = isComplete(trackSlug, moduleSlug, lessonSlug);

  useEffect(() => {
    trackLessonView(trackSlug, moduleSlug, lessonSlug);
  }, [trackSlug, moduleSlug, lessonSlug, trackLessonView]);

  return (
    <div className="mt-12 flex flex-col items-center justify-center border-t border-border/40 pt-10">
      <div className="relative group max-w-sm w-full">
        {!completed ? (
          <motion.button
            whileHover={{ scale: 1.02, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => markComplete(trackSlug, moduleSlug, lessonSlug)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-text bg-gradient-to-r from-bg2 to-bg3 border transition-all duration-300 shadow-lg cursor-pointer"
            style={{
              borderColor: `${trackColor}30`,
              boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px ${trackColor}15`,
            }}
          >
            <motion.div
              className="flex h-5 w-5 items-center justify-center rounded-full bg-bg border"
              style={{ borderColor: `${trackColor}40` }}
              whileHover={{ scale: 1.1 }}
            >
              <Check className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </motion.div>
            <span>Mark Lesson as Complete</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full flex flex-col items-center gap-4"
          >
            {/* Main Success Button */}
            <div
              className="w-full flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-bg bg-gradient-to-r from-[#10b981] to-[#059669] border border-[#10b981]/30 shadow-xl"
              style={{
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.15)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-5 w-5 fill-bg stroke-[#10b981]" />
              </motion.div>
              <span>Lesson Completed</span>
            </div>

            {/* Undo Action */}
            <button
              onClick={() => markIncomplete(trackSlug, moduleSlug, lessonSlug)}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-dim hover:text-muted transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Mark incomplete</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
