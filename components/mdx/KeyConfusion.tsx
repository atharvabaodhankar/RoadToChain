import React from "react";
import { HelpCircle } from "lucide-react";

interface KeyConfusionProps {
  children: React.ReactNode;
}

export default function KeyConfusion({ children }: KeyConfusionProps) {
  return (
    <div className="my-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 text-yellow-200">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-4 w-4 text-yellow-400" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-yellow-400">
          ❓ KEY CONFUSION — BEGINNERS OFTEN ASK:
        </span>
      </div>
      <div className="text-sm leading-relaxed pl-1 text-yellow-300/90">
        {children}
      </div>
    </div>
  );
}
