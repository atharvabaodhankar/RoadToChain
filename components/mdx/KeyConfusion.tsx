import React from "react";
import { HelpCircle } from "lucide-react";

interface KeyConfusionProps {
  children: React.ReactNode;
}

export default function KeyConfusion({ children }: KeyConfusionProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-zinc-950 dark:text-zinc-100">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-300">
        <HelpCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <span>Key Confusion</span>
      </div>
      <div className="text-sm leading-relaxed font-sans [&_p]:text-inherit [&_p]:my-1.5 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_a]:text-accent hover:[&_a]:underline [&_strong]:font-bold [&_strong]:text-zinc-950 dark:[&_strong]:text-zinc-50">
        {children}
      </div>
    </div>
  );
}
