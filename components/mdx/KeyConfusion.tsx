import React from "react";
import { HelpCircle } from "lucide-react";

interface KeyConfusionProps {
  children: React.ReactNode;
}

export default function KeyConfusion({ children }: KeyConfusionProps) {
  return (
    <div className="my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-zinc-950 dark:text-zinc-200">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-300">
        <HelpCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <span>Key Confusion</span>
      </div>
      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans">
        {children}
      </div>
    </div>
  );
}
