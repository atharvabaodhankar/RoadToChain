import React from "react";
import { Zap } from "lucide-react";

interface RealityCheckProps {
  children: React.ReactNode;
}

export default function RealityCheck({ children }: RealityCheckProps) {
  return (
    <div className="my-6 rounded-lg border-l-[3px] border-blue-500 bg-blue-500/5 p-4 text-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-blue-400 fill-blue-400/20" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
          ⚡ REALITY CHECK
        </span>
      </div>
      <div className="text-sm leading-relaxed pl-1 text-blue-300/95 font-medium">
        {children}
      </div>
    </div>
  );
}
