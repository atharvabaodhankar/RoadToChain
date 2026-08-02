"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LessonNavigationShortcutsProps {
  prevUrl: string | null;
  nextUrl: string | null;
}

export default function LessonNavigationShortcuts({
  prevUrl,
  nextUrl,
}: LessonNavigationShortcutsProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger navigation if the user is typing inside an input, textarea, or editable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && prevUrl) {
        e.preventDefault();
        router.push(prevUrl);
      } else if (e.key === "ArrowRight" && nextUrl) {
        e.preventDefault();
        router.push(nextUrl);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevUrl, nextUrl, router]);

  return null;
}
