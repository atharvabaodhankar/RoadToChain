import React from "react";
import { Info } from "lucide-react";

interface RealityCheckProps {
  children: React.ReactNode;
}

export default function RealityCheck({ children }: RealityCheckProps) {
  return (
    <div className="not-prose my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>Reality Check</span>
      </div>
      <div
        className="text-sm leading-relaxed font-sans [&_p]:!text-blue-900 dark:[&_p]:!text-blue-200 [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:!font-bold [&_strong]:!text-blue-950 dark:[&_strong]:!text-blue-100 [&_a]:!text-blue-700 dark:[&_a]:!text-blue-300 [&_a]:underline [&_ul]:!text-blue-900 dark:[&_ul]:!text-blue-200 [&_li]:!text-blue-900 dark:[&_li]:!text-blue-200"
        style={{ color: "inherit" }}
      >
        {children}
      </div>
    </div>
  );
}
