import React from "react";
import { AlertTriangle } from "lucide-react";

interface MistakeCalloutProps {
  children: React.ReactNode;
}

export default function MistakeCallout({ children }: MistakeCalloutProps) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span>Common Mistake</span>
      </div>
      <div className="text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/90 font-sans">
        {children}
      </div>
    </div>
  );
}
