import React from "react";
import { HelpCircle, Clock } from "lucide-react";

interface LessonChallengeProps {
  children: React.ReactNode;
}

export default function LessonChallenge({ children }: LessonChallengeProps) {
  return (
    <div className="not-prose my-8 rounded-xl border border-dashed border-border/80 bg-bg2/30 dark:bg-bg3/5 p-6 relative overflow-hidden backdrop-blur-[2px]">
      {/* Background Subtle Grid Pattern to emulate paper/notepad texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 select-none relative z-10">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-muted uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5 text-accent" />
          <span>System Design Challenge</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[9px] text-dim bg-bg3/60 dark:bg-bg2/40 px-2 py-0.5 rounded border border-border/50 uppercase">
          <Clock className="h-2.5 w-2.5" />
          <span>Think Active</span>
        </div>
      </div>
      
      <div className="text-[14px] leading-relaxed font-sans text-text relative z-10 [&_p]:my-2 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:!font-semibold [&_strong]:!text-text [&_a]:underline">
        {children}
      </div>

      <div className="mt-5 pt-4 border-t border-border/30 flex justify-center relative z-10 select-none">
        <span className="font-mono text-[10px] font-semibold text-muted bg-bg3/80 dark:bg-bg2/80 px-4 py-1.5 rounded-full border border-border shadow-sm tracking-wide">
          [ Think Before Continuing ]
        </span>
      </div>
    </div>
  );
}
