import React from "react";
import { AlertTriangle } from "lucide-react";

interface MistakeCalloutProps {
  children: React.ReactNode;
}

export default function MistakeCallout({ children }: MistakeCalloutProps) {
  return (
    <div className="not-prose my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span>Common Mistake</span>
      </div>
      <div className="text-sm leading-relaxed font-sans [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:!font-bold [&_strong]:!text-amber-950 dark:[&_strong]:!text-amber-100 [&_a]:!text-amber-700 dark:[&_a]:!text-amber-300 [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
