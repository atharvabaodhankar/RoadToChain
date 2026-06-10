"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonSidebarLayoutProps {
  sidebarContent: React.ReactNode;
  children: React.ReactNode;
}

export default function LessonSidebarLayout({ sidebarContent, children }: LessonSidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Retrieve collapse preference from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("lesson-sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("lesson-sidebar-collapsed", String(nextState));
  };

  return (
    <div className="flex w-full relative">
      {/* ── COLUMN 1: Left Navigation Sidebar ────────────────────────────── */}
      <aside
        className={`hidden lg:block shrink-0 bg-bg2 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? "w-0 border-r-0" : "w-68 border-r border-border"
        }`}
      >
        {/* Inner scrolling content container with fixed width to prevent text wrap during transition */}
        <div className="w-68 h-full overflow-y-auto p-6 scrollbar-thin select-none">
          {sidebarContent}
        </div>
      </aside>

      {/* Floating Toggle Button */}
      {isMounted && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed top-24 z-30 h-6 w-6 items-center justify-center rounded-full border border-border bg-bg2 text-muted hover:text-text hover:bg-bg3 hover:border-border2 hover:scale-105 shadow-sm cursor-pointer transition-all duration-300 ease-in-out focus:outline-none"
          style={{
            left: isCollapsed ? "12px" : "260px", // 272px (w-68) - 12px (half of button width) = 260px
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {/* ── COLUMN 2 & 3: Content Reader + Right TOC ────────────────────────── */}
      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}
