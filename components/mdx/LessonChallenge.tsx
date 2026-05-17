import React from "react";
import { Award } from "lucide-react";

interface LessonChallengeProps {
  children: React.ReactNode;
}

export default function LessonChallenge({ children }: LessonChallengeProps) {
  return (
    <div className="my-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4 text-green-200">
      <div className="flex items-center gap-2 mb-2">
        <Award className="h-4 w-4 text-green-400" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-green-400">
          ⚡ MINI CHALLENGE
        </span>
      </div>
      <div className="text-sm leading-relaxed pl-1 text-green-300/90 font-medium">
        {children}
      </div>
    </div>
  );
}
