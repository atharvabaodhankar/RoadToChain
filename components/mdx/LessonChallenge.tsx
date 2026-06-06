import React from "react";
import { ArrowRight } from "lucide-react";

interface LessonChallengeProps {
  children: React.ReactNode;
}

export default function LessonChallenge({ children }: LessonChallengeProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-emerald-300 dark:border-emerald-950/40 bg-emerald-50 dark:bg-emerald-950/10 p-4 text-emerald-900 dark:text-emerald-200">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span>Challenge</span>
      </div>
      <div className="text-sm leading-relaxed font-sans [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:!font-bold [&_strong]:!text-emerald-950 dark:[&_strong]:!text-emerald-100 [&_a]:!text-emerald-700 dark:[&_a]:!text-emerald-300 [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
