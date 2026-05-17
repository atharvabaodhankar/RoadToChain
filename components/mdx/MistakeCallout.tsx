import React from "react";
import { AlertTriangle } from "lucide-react";

interface MistakeCalloutProps {
  children: React.ReactNode;
}

export default function MistakeCallout({ children }: MistakeCalloutProps) {
  return (
    <div className="my-6 rounded-lg border-l-[3px] border-orange-500 bg-orange-500/5 p-4 text-orange-200">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-orange-400" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
          ⚠ MISTAKE I MADE
        </span>
      </div>
      <div className="text-sm font-mono leading-relaxed pl-1 text-orange-300/90 italic">
        {children}
      </div>
    </div>
  );
}
