"use client";

import { useProgress } from "@/app/context/ProgressContext";
import Link from "next/link";
import { Lock, ArrowLeft, Unlock, Compass } from "lucide-react";

interface ContentGatingProps {
  trackId: number;
  trackNumber: string;
  trackName: string;
  prerequisiteTrackNumber?: string;
  prerequisiteTrackName?: string;
  
  // Optional module level gating
  moduleNumber?: string;
  moduleName?: string;
  prerequisiteModuleNumber?: string;
  prerequisiteModuleName?: string;
  trackSlug?: string;
  
  children: React.ReactNode;
}

export default function ContentGating({
  trackId,
  trackNumber,
  trackName,
  prerequisiteTrackNumber,
  prerequisiteTrackName,
  moduleNumber,
  moduleName,
  prerequisiteModuleNumber,
  prerequisiteModuleName,
  trackSlug,
  children
}: ContentGatingProps) {
  const { isTrackUnlocked, isModuleUnlocked, toggleWalkaroundMode } = useProgress();

  const trackUnlocked = isTrackUnlocked(trackId);
  const moduleUnlocked = moduleNumber && trackSlug 
    ? isModuleUnlocked(trackSlug, moduleNumber) 
    : true;

  if (!trackUnlocked) {
    return (
      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center border border-border bg-bg2/40 rounded-2xl backdrop-blur-sm animate-fade-in my-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-text sm:text-2xl">
          Track {trackNumber}: {trackName} is Locked
        </h2>
        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted">
          You need to complete the prerequisite track{" "}
          <span className="font-semibold text-text">
            {prerequisiteTrackNumber}: {prerequisiteTrackName}
          </span>{" "}
          to unlock this track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={toggleWalkaroundMode}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold text-text shadow-lg shadow-accent/20 hover:bg-accent2 hover:shadow-accent2/35 transition-all cursor-pointer"
          >
            <Unlock className="h-3.5 w-3.5" /> Enable Walkaround Mode
          </button>
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-1 border border-border bg-bg3 px-4 py-2 font-mono text-xs font-semibold text-muted hover:text-text hover:bg-bg4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  if (!moduleUnlocked && moduleNumber) {
    return (
      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center border border-border bg-bg2/40 rounded-2xl backdrop-blur-sm animate-fade-in my-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-text sm:text-2xl">
          Module {moduleNumber}: {moduleName} is Locked
        </h2>
        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted">
          You must complete the previous module{" "}
          <span className="font-semibold text-text">
            {prerequisiteModuleNumber}: {prerequisiteModuleName}
          </span>{" "}
          before entering this module.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={toggleWalkaroundMode}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold text-text shadow-lg shadow-accent/20 hover:bg-accent2 hover:shadow-accent2/35 transition-all cursor-pointer"
          >
            <Unlock className="h-3.5 w-3.5" /> Enable Walkaround Mode
          </button>
          {trackSlug ? (
            <Link
              href={`/learn/${trackSlug}`}
              className="inline-flex items-center gap-1 border border-border bg-bg3 px-4 py-2 font-mono text-xs font-semibold text-muted hover:text-text hover:bg-bg4 transition-colors"
            >
              <Compass className="h-3.5 w-3.5" /> Track Overview
            </Link>
          ) : (
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-1 border border-border bg-bg3 px-4 py-2 font-mono text-xs font-semibold text-muted hover:text-text hover:bg-bg4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum
            </Link>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
