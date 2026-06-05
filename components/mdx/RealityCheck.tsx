import React from "react";
import { Info } from "lucide-react";

interface RealityCheckProps {
  children: React.ReactNode;
}

export default function RealityCheck({ children }: RealityCheckProps) {
  return (
    <div className="not-prose my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 text-blue-950 dark:text-blue-100">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>Reality Check</span>
      </div>
      <div className="text-sm leading-relaxed font-sans [&_p]:text-inherit [&_p]:my-1.5 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_a]:text-accent hover:[&_a]:underline [&_strong]:font-bold [&_strong]:text-blue-950 dark:[&_strong]:text-blue-50">
        {children}
      </div>
    </div>
  );
}
