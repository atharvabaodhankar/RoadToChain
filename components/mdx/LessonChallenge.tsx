import React from "react";
import { ArrowRight } from "lucide-react";

interface LessonChallengeProps {
  children: React.ReactNode;
}

export default function LessonChallenge({ children }: LessonChallengeProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-emerald-200 dark:border-emerald-950/40 bg-emerald-50 dark:bg-emerald-950/10 p-4 text-emerald-950 dark:text-emerald-100">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-emerald-900 dark:text-emerald-300">
        <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span>Challenge</span>
      </div>
      <div className="text-sm leading-relaxed font-sans [&_p]:text-inherit [&_p]:my-1.5 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_a]:text-accent hover:[&_a]:underline [&_strong]:font-bold [&_strong]:text-emerald-950 dark:[&_strong]:text-emerald-50">
        {children}
      </div>
    </div>
  );
}
