"use client";

import React from "react";

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
  children
}: ContentGatingProps) {
  // All tracks and modules are unlocked and viewable by default
  return <>{children}</>;
}
