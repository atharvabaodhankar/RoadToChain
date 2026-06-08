import React from "react";

interface RealityCheckProps {
  children: React.ReactNode;
}

export default function RealityCheck({ children }: RealityCheckProps) {
  return (
    <div className="not-prose my-8 pl-6 border-l-[3px] border-accent/80 space-y-3">
      <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent/90 select-none">
        // Reality Check
      </div>
      <div className="font-serif font-light italic text-[16px] leading-relaxed text-text/90 antialiased max-w-xl [&_strong]:!font-bold [&_strong]:!text-text [&_a]:underline">
        {children}
      </div>
      <div className="font-mono text-[9px] text-dim uppercase tracking-wider select-none">
        — Production Engineering Principle
      </div>
    </div>
  );
}
