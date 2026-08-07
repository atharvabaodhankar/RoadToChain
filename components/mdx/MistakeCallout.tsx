import React from "react";

interface MistakeCalloutProps {
  children: React.ReactNode;
}

export default function MistakeCallout({ children }: MistakeCalloutProps) {
  return (
    <div className="not-prose my-8 pl-6 border-l border-amber-500/90 space-y-3">
      <div className="font-sans text-[15px] font-normal leading-relaxed text-text/90 antialiased max-w-xl [&_strong]:!font-bold [&_strong]:!text-text [&_a]:text-accent hover:[&_a]:underline">
        {children}
      </div>
    </div>
  );
}
