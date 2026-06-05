import React from "react";
import { HelpCircle } from "lucide-react";

interface KeyConfusionProps {
  children: React.ReactNode;
}

export default function KeyConfusion({ children }: KeyConfusionProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-300">
        <HelpCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <span>Key Confusion</span>
      </div>
      <div
        className="text-sm leading-relaxed font-sans [&_p]:!text-zinc-800 dark:[&_p]:!text-zinc-200 [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:!font-bold [&_strong]:!text-zinc-900 dark:[&_strong]:!text-zinc-100 [&_a]:!text-violet-600 dark:[&_a]:!text-violet-400 [&_a]:underline [&_ul]:!text-zinc-800 dark:[&_ul]:!text-zinc-200 [&_li]:!text-zinc-800 dark:[&_li]:!text-zinc-200"
        style={{ color: "inherit" }}
      >
        {children}
      </div>
    </div>
  );
}
