import React from "react";

interface RealityCheckProps {
  children: React.ReactNode;
}

export default function RealityCheck({ children }: RealityCheckProps) {
  return (
    <div className="not-prose my-8 pl-6 border-l border-accent/80 space-y-3">
      <div className="font-sans text-[15px] font-normal leading-relaxed text-text/90 antialiased max-w-xl [&_strong]:!font-bold [&_strong]:!text-text [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
