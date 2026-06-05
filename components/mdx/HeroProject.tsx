import React from "react";
import { Star } from "lucide-react";

interface HeroProjectProps {
  name: string;
  track?: string;
  children: React.ReactNode;
}

export default function HeroProject({ name, track = "0", children }: HeroProjectProps) {
  // Map track number to track color
  const getTrackColor = (t: string) => {
    switch (t) {
      case "0": return "border-track-0/30 bg-track-0/5 text-track-0";
      case "1": return "border-track-1/30 bg-track-1/5 text-track-1";
      case "2": return "border-track-2/30 bg-track-2/5 text-track-2";
      case "3": return "border-track-3/30 bg-track-3/5 text-track-3";
      case "4": return "border-track-4/30 bg-track-4/5 text-track-4";
      case "5": return "border-track-5/30 bg-track-5/5 text-track-5";
      case "6": return "border-track-6/30 bg-track-6/5 text-track-6";
      case "7": return "border-track-7/30 bg-track-7/5 text-track-7";
      default: return "border-accent/30 bg-accent/5 text-accent";
    }
  };

  const styleClass = getTrackColor(track);

  return (
    <div className={`not-prose my-8 rounded-xl border p-5 ${styleClass}`}>
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            HERO PROJECT CONNECTION
          </span>
        </div>
        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-text border border-white/5 uppercase">
          {name}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-text dark:text-zinc-200 font-sans [&_p]:text-inherit [&_p]:my-1.5 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_strong]:font-bold [&_strong]:text-text dark:[&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}
